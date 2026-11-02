import React, { useState } from 'react';
import { Icon } from '../../shared/components/Icon';
import './ExcelImportModule.css';

interface ExcelImportModuleProps {
  onShowToast?: (msg: string, type?: 'ok' | 'warn' | 'err') => void;
}

type EntityType = 'pacientes' | 'tratamientos' | 'insumos' | 'pagos';

interface ColumnMapping {
  excelCol: string;
  sampleVal: string;
  detectedType: string;
  dbField: string;
  status: 'mapped' | 'optional' | 'ignored';
}

const DEFAULT_MAPPINGS: Record<EntityType, ColumnMapping[]> = {
  pacientes: [
    { excelCol: 'NOMBRES_APELLIDOS', sampleVal: 'García Pérez, Lucía', detectedType: 'VARCHAR(150)', dbField: 'pacientes.nom', status: 'mapped' },
    { excelCol: 'NUMERO_DOCUMENTO', sampleVal: '71234567', detectedType: 'VARCHAR(20)', dbField: 'pacientes.doc', status: 'mapped' },
    { excelCol: 'EDAD', sampleVal: '34', detectedType: 'INTEGER', dbField: 'pacientes.edad', status: 'mapped' },
    { excelCol: 'TELEFONO_MOVIL', sampleVal: '987654321', detectedType: 'VARCHAR(15)', dbField: 'pacientes.tel', status: 'mapped' },
    { excelCol: 'CORREO_ELECTRONICO', sampleVal: 'lucia.garcia@gmail.com', detectedType: 'VARCHAR(120)', dbField: 'pacientes.mail', status: 'mapped' },
    { excelCol: 'DIRECCION_DOMICILIO', sampleVal: 'Av. Brasil 1240, Dpto 502', detectedType: 'TEXT', dbField: 'pacientes.dir', status: 'mapped' },
    { excelCol: 'ALERGIAS_MEDICAS', sampleVal: 'Alergia a la Penicilina', detectedType: 'TEXT', dbField: 'historias.alergias', status: 'optional' },
    { excelCol: 'OBSERVACIONES_NOTAS', sampleVal: 'Paciente remitido por Dr. Silva', detectedType: 'TEXT', dbField: 'pacientes.obs', status: 'optional' },
  ],
  tratamientos: [
    { excelCol: 'CODIGO_PROCEDIMIENTO', sampleVal: 'TRAT-0042', detectedType: 'VARCHAR(50)', dbField: 'catalogo.id', status: 'mapped' },
    { excelCol: 'NOMBRE_TRATAMIENTO', sampleVal: 'Endodoncia Molar Uniradicular', detectedType: 'VARCHAR(200)', dbField: 'catalogo.nombre', status: 'mapped' },
    { excelCol: 'CATEGORIA_ESPECIALIDAD', sampleVal: 'Endodoncia', detectedType: 'VARCHAR(80)', dbField: 'catalogo.categoria', status: 'mapped' },
    { excelCol: 'DURACION_MINUTOS', sampleVal: '60', detectedType: 'INTEGER', dbField: 'catalogo.duracion', status: 'mapped' },
    { excelCol: 'PRECIO_ARANCEL_PEN', sampleVal: '280.00', detectedType: 'NUMERIC(10,2)', dbField: 'catalogo.precio', status: 'mapped' },
  ],
  insumos: [
    { excelCol: 'COD_SKU', sampleVal: 'RES-3M-A2', detectedType: 'VARCHAR(50)', dbField: 'insumos.sku', status: 'mapped' },
    { excelCol: 'DESCRIPCION_INSUMO', sampleVal: 'Resina Compuesta Filtek Z350', detectedType: 'VARCHAR(150)', dbField: 'insumos.nombre', status: 'mapped' },
    { excelCol: 'CANTIDAD_STOCK', sampleVal: '24', detectedType: 'INTEGER', dbField: 'insumos.stock', status: 'mapped' },
    { excelCol: 'STOCK_MINIMO', sampleVal: '5', detectedType: 'INTEGER', dbField: 'insumos.minimo', status: 'mapped' },
    { excelCol: 'PROVEEDOR_HABITUAL', sampleVal: 'Dental Perú Medical', detectedType: 'VARCHAR(100)', dbField: 'insumos.proveedor', status: 'optional' },
  ],
  pagos: [
    { excelCol: 'NUMERO_RECIBO', sampleVal: 'REC-2026-0089', detectedType: 'VARCHAR(50)', dbField: 'reportes.nro', status: 'mapped' },
    { excelCol: 'DNI_PACIENTE', sampleVal: '71234567', detectedType: 'VARCHAR(20)', dbField: 'reportes.dni', status: 'mapped' },
    { excelCol: 'FECHA_OPERACION', sampleVal: '2026-08-14', detectedType: 'DATE', dbField: 'reportes.f', status: 'mapped' },
    { excelCol: 'MONTO_ABONADO', sampleVal: '150.00', detectedType: 'NUMERIC(10,2)', dbField: 'reportes.m', status: 'mapped' },
    { excelCol: 'METODO_PAGO', sampleVal: 'Yape', detectedType: 'VARCHAR(50)', dbField: 'reportes.met', status: 'mapped' },
  ],
};

const HISTORIAL_IMPORTACIONES = [
  { id: 'IMP-104', fecha: '24 Oct 2026, 11:20 hrs', archivo: 'pacientes_historicos_lima.xlsx', entidad: 'Pacientes', filas: 450, estado: 'Completado', usuario: 'Admin Maestro' },
  { id: 'IMP-103', fecha: '19 Oct 2026, 16:45 hrs', archivo: 'catalogo_aranceles_2026.xlsx', entidad: 'Tratamientos', filas: 88, estado: 'Completado', usuario: 'Admin Maestro' },
  { id: 'IMP-102', fecha: '12 Oct 2026, 09:15 hrs', archivo: 'inventario_apertura_central.xlsx', entidad: 'Insumos', filas: 124, estado: 'Completado', usuario: 'Dra. Patricia Lima' },
  { id: 'IMP-101', fecha: '01 Oct 2026, 14:30 hrs', archivo: 'abonos_caja_setiembre.xlsx', entidad: 'Pagos', filas: 310, estado: 'Completado', usuario: 'Admin Maestro' },
];

export const ExcelImportModule: React.FC<ExcelImportModuleProps> = ({ onShowToast }) => {
  const [selectedEntity, setSelectedEntity] = useState<EntityType>('pacientes');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; rows: number } | null>({
    name: 'pacientes_migracion_clinica_2026.xlsx',
    size: '1.42 MB',
    rows: 450,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Opciones de configuración de importación
  const [validateDni, setValidateDni] = useState(true);
  const [overwriteDuplicates, setOverwriteDuplicates] = useState(false);
  const [sanitizePhones, setSanitizePhones] = useState(true);
  const [atomicTransaction, setAtomicTransaction] = useState(true);

  const handleSimulateImport = () => {
    setIsProcessing(true);
    setProgress(15);

    const t1 = setTimeout(() => setProgress(45), 400);
    const t2 = setTimeout(() => setProgress(80), 800);
    const t3 = setTimeout(() => {
      setProgress(100);
      setIsProcessing(false);
      if (onShowToast) {
        onShowToast(
          `Simulación de portado completada: ${uploadedFile?.rows || 450} registros listos para insertar en la BD cuando el backend esté activo.`,
          'ok'
        );
      }
    }, 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  const handleDownloadTemplate = () => {
    if (onShowToast) {
      onShowToast(`Plantilla oficial en formato XLSX generada para '${selectedEntity}'. Descarga simulada lista.`, 'ok');
    }
  };

  const handleFileUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        rows: Math.floor(Math.random() * 300) + 120,
      });
      if (onShowToast) {
        onShowToast(`Archivo '${file.name}' cargado con éxito en la memoria del módulo de portado.`, 'ok');
      }
    }
  };

  return (
    <section className="excel-import-module">
      {/* Hero Corporativo */}
      <div className="corp-hero">
        <div className="corp-hero-content">
          <div className="corp-hero-tag">
            <span className="dot-ok" />
            <span>Migración & ETL Relacional PostgreSQL / MySQL</span>
          </div>
          <h1 className="corp-hero-title">
            Portear Excel a Base de Datos — <span>Dental FC</span>
          </h1>
          <p className="corp-hero-subtitle">
            Herramienta maestra de aprovisionamiento masivo para migrar registros históricos de hojas de cálculo hacia las tablas estructuradas de la clínica.
          </p>
          <div className="corp-hero-meta">
            <span className="corp-meta-chip">
              <Icon name="database" size="sm" style={{ color: 'var(--primary-2)' }} />
              Driver Base de Datos Listo
            </span>
            <span className="corp-meta-chip">
              <Icon name="shield" size="sm" style={{ color: 'var(--ok)' }} />
              Transacciones Atómicas ACID
            </span>
            <span className="corp-meta-chip">
              <Icon name="check" size="sm" />
              Soporte .xlsx, .xls y .csv
            </span>
          </div>
        </div>
        <div className="corp-hero-actions">
          <button className="btn btn-secondary" onClick={handleDownloadTemplate}>
            <Icon name="download" size="sm" />
            <span>Descargar Plantilla .XLSX</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSimulateImport}
            disabled={isProcessing || !uploadedFile}
          >
            <Icon name="database" size="sm" />
            <span>{isProcessing ? `Portando (${progress}%)` : 'Ejecutar Portado a BD'}</span>
          </button>
        </div>
      </div>

      {/* Selector de Entidad Destino */}
      <div className="card card-pad">
        <div className="entity-selector-head">
          <span className="entity-selector-label">Seleccionar Tabla o Entidad de Destino en BD:</span>
          <span className="entity-selector-sub">La estructura y el mapeo de columnas se adaptan automáticamente a la entidad escogida</span>
        </div>
        <div className="entity-pills-grid">
          <button
            type="button"
            className={`entity-pill ${selectedEntity === 'pacientes' ? 'active' : ''}`}
            onClick={() => setSelectedEntity('pacientes')}
          >
            <Icon name="users" size="sm" />
            <span>Pacientes & Historias Clínicas</span>
          </button>
          <button
            type="button"
            className={`entity-pill ${selectedEntity === 'tratamientos' ? 'active' : ''}`}
            onClick={() => setSelectedEntity('tratamientos')}
          >
            <Icon name="tooth" size="sm" />
            <span>Tarifario & Procedimientos</span>
          </button>
          <button
            type="button"
            className={`entity-pill ${selectedEntity === 'insumos' ? 'active' : ''}`}
            onClick={() => setSelectedEntity('insumos')}
          >
            <Icon name="layers" size="sm" />
            <span>Inventario & Insumos Dentales</span>
          </button>
          <button
            type="button"
            className={`entity-pill ${selectedEntity === 'pagos' ? 'active' : ''}`}
            onClick={() => setSelectedEntity('pagos')}
          >
            <Icon name="card" size="sm" />
            <span>Cuentas & Saldos Iniciales</span>
          </button>
        </div>
      </div>

      {/* Grid Principal: Dropzone de Carga + Parámetros de Ingesta */}
      <div className="excel-main-grid">
        {/* Dropzone de Carga */}
        <div className="card excel-upload-card">
          <div className="card-head">
            <h3>
              <Icon name="upload" size="sm" />
              <span>Cargar Archivo Excel de Datos</span>
            </h3>
            <span className="sub">Formatos admitidos: .xlsx, .xls, .csv</span>
          </div>

          <label className="excel-dropzone" htmlFor="excel-file-input">
            <input
              id="excel-file-input"
              type="file"
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
              onChange={handleFileUploadSimulated}
            />
            <div className="dropzone-icon-box">
              <Icon name="upload" size="lg" />
            </div>
            <h4 className="dropzone-title">Arrastra tu archivo Excel aquí o haz clic para examinar</h4>
            <p className="dropzone-sub">
              El archivo será procesado en el búfer de migración con mapeo automático de columnas antes de la inserción en base de datos.
            </p>
            <span className="btn btn-secondary btn-sm dropzone-btn">
              <Icon name="folder" size="sm" />
              <span>Seleccionar Archivo Local</span>
            </span>
          </label>

          {uploadedFile && (
            <div className="file-preview-card">
              <div className="file-preview-info">
                <div className="file-preview-icon">
                  <Icon name="file" size="md" />
                </div>
                <div>
                  <b className="file-name">{uploadedFile.name}</b>
                  <div className="file-meta">
                    <span>Tamaño: {uploadedFile.size}</span>
                    <span>•</span>
                    <span className="text-ok font-bold">{uploadedFile.rows} filas detectadas</span>
                    <span>•</span>
                    <span className="text-ok">Encabezados válidos</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="icon-btn danger-hover"
                onClick={() => setUploadedFile(null)}
                title="Quitar archivo"
              >
                <Icon name="trash" size="sm" />
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="import-progress-box">
              <div className="progress-info-row">
                <span>Migrando registros a tablas PostgreSQL...</span>
                <span className="font-mono font-bold">{progress}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Parámetros y Reglas de Integridad */}
        <div className="card excel-params-card">
          <div className="card-head">
            <h3>
              <Icon name="shield" size="sm" />
              <span>Reglas de Integridad & Inserción</span>
            </h3>
            <span className="sub">Control de consistencia</span>
          </div>

          <div className="params-list">
            <label className="param-item">
              <input
                type="checkbox"
                checked={validateDni}
                onChange={(e) => setValidateDni(e.target.checked)}
              />
              <div className="param-text">
                <b>Validar duplicados por DNI / RUC</b>
                <span>Omite la inserción si el documento de identidad ya existe en la base de datos de la clínica.</span>
              </div>
            </label>

            <label className="param-item">
              <input
                type="checkbox"
                checked={overwriteDuplicates}
                onChange={(e) => setOverwriteDuplicates(e.target.checked)}
              />
              <div className="param-text">
                <b>Actualizar datos si el registro ya existe</b>
                <span>Sobrescribe teléfonos, correos y domicilios existentes con los datos del archivo importado.</span>
              </div>
            </label>

            <label className="param-item">
              <input
                type="checkbox"
                checked={sanitizePhones}
                onChange={(e) => setSanitizePhones(e.target.checked)}
              />
              <div className="param-text">
                <b>Normalizar teléfonos móviles (+51)</b>
                <span>Limpia guiones y espacios garantizando 9 dígitos numéricos para integraciones con WhatsApp API.</span>
              </div>
            </label>

            <label className="param-item">
              <input
                type="checkbox"
                checked={atomicTransaction}
                onChange={(e) => setAtomicTransaction(e.target.checked)}
              />
              <div className="param-text">
                <b>Transacción Atómica (Rollback de Seguridad)</b>
                <span>Revierte completamente la operación en caso de detectar incongruencias críticas en alguna fila.</span>
              </div>
            </label>
          </div>

          <div className="backend-readiness-notice">
            <Icon name="database" size="sm" style={{ color: 'var(--primary-2)' }} />
            <div>
              <b>Módulo preparado para conexión de Backend</b>
              <p>
                Este módulo expone la interfaz para el endpoint REST <code>POST /api/v1/import/excel</code> con parseo <code>multipart/form-data</code>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Previsualización del Mapeo de Columnas */}
      <div className="card">
        <div className="card-head">
          <h3>
            <Icon name="list" size="sm" />
            <span>Mapeo de Columnas: Hoja Excel → Campos Relacionales en Base de Datos</span>
          </h3>
          <span className="sub">{DEFAULT_MAPPINGS[selectedEntity].length} columnas mapeadas</span>
        </div>

        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Columna en Archivo Excel</th>
                <th>Dato de Muestra</th>
                <th>Tipo SQL Detectado</th>
                <th>Campo Destino en BD</th>
                <th>Estado de Validación</th>
              </tr>
            </thead>
            <tbody>
              {DEFAULT_MAPPINGS[selectedEntity].map((m, idx) => (
                <tr key={idx}>
                  <td>
                    <span className="col-excel-badge">{m.excelCol}</span>
                  </td>
                  <td>
                    <span className="col-sample-val">{m.sampleVal}</span>
                  </td>
                  <td>
                    <span className="col-sql-badge">{m.detectedType}</span>
                  </td>
                  <td>
                    <code className="col-db-field">{m.dbField}</code>
                  </td>
                  <td>
                    {m.status === 'mapped' ? (
                      <span className="badge ok">
                        <Icon name="check" size="sm" />
                        <span>Mapeado Requerido</span>
                      </span>
                    ) : (
                      <span className="badge">
                        <span>Opcional</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historial de Importaciones Previas */}
      <div className="card">
        <div className="card-head">
          <h3>
            <Icon name="clock" size="sm" />
            <span>Historial de Archivos Porteados a Base de Datos</span>
          </h3>
          <span className="sub">{HISTORIAL_IMPORTACIONES.length} operaciones registradas</span>
        </div>

        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>ID Operación</th>
                <th>Fecha y Hora</th>
                <th>Nombre del Archivo</th>
                <th>Entidad Afectada</th>
                <th>Filas Procesadas</th>
                <th>Operador Responsable</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {HISTORIAL_IMPORTACIONES.map((imp) => (
                <tr key={imp.id}>
                  <td>
                    <b className="font-mono">{imp.id}</b>
                  </td>
                  <td>{imp.fecha}</td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{imp.archivo}</span>
                  </td>
                  <td>
                    <span className="badge">{imp.entidad}</span>
                  </td>
                  <td>
                    <b>{imp.filas} filas</b>
                  </td>
                  <td>{imp.usuario}</td>
                  <td>
                    <span className="badge ok">{imp.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
