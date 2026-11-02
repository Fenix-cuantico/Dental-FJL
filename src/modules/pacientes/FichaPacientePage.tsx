import React, { useState, useRef } from 'react';
import { Icon } from '../../shared/components/Icon';
import { Paciente, formatMoney } from '../../shared/types/dental.types';
import './PacientesModule.css';

interface FichaPacientePageProps {
  paciente: Paciente;
  onBack: () => void;
  onOpenHistoria?: (pacienteId: number) => void;
  onOpenOdontograma?: (pacienteId: number) => void;
  onEditPaciente?: (paciente: Paciente) => void;
  onScheduleCita?: (pacienteNom: string) => void;
  onShowToast?: (msg: string) => void;
}

interface ArchivoExpediente {
  id: string;
  nombre: string;
  categoria: 'Radiografía' | 'Fotografía Clínica' | 'Consentimiento & Legal' | 'Laboratorio Dental' | 'Otros';
  tipo: 'image' | 'pdf' | 'doc';
  peso: string;
  fecha: string;
  doctor: string;
}

const INITIAL_ARCHIVOS: ArchivoExpediente[] = [
  {
    id: 'arch-1',
    nombre: 'Radiografía Panorámica Digital (Pre-Tratamiento).jpg',
    categoria: 'Radiografía',
    tipo: 'image',
    peso: '3.4 MB',
    fecha: '15/08/2026',
    doctor: 'Dr. Diego Mendoza',
  },
  {
    id: 'arch-2',
    nombre: 'Consentimiento Informado - Ortodoncia Fija y Retracción.pdf',
    categoria: 'Consentimiento & Legal',
    tipo: 'pdf',
    peso: '820 KB',
    fecha: '15/08/2026',
    doctor: 'Dra. Valeria Ríos',
  },
  {
    id: 'arch-3',
    nombre: 'Fotografía Intraoral - Oclusión y Arcada Superior.png',
    categoria: 'Fotografía Clínica',
    tipo: 'image',
    peso: '4.2 MB',
    fecha: '18/09/2026',
    doctor: 'Dra. Valeria Ríos',
  },
  {
    id: 'arch-4',
    nombre: 'Estudio Cefalométrico Digital Ricketts y Steiner.pdf',
    categoria: 'Radiografía',
    tipo: 'pdf',
    peso: '2.1 MB',
    fecha: '15/08/2026',
    doctor: 'Dra. Valeria Ríos',
  },
  {
    id: 'arch-5',
    nombre: 'Orden de Laboratorio Dental - Férula de Contención.pdf',
    categoria: 'Laboratorio Dental',
    tipo: 'pdf',
    peso: '640 KB',
    fecha: '24/10/2026',
    doctor: 'Dr. Diego Mendoza',
  },
];

const AVATAR_COLORS = ['avatar-blue', 'avatar-emerald', 'avatar-purple', 'avatar-teal', 'avatar-amber'];
const getAvatarClass = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

export const FichaPacientePage: React.FC<FichaPacientePageProps> = ({
  paciente,
  onBack,
  onOpenHistoria,
  onOpenOdontograma,
  onEditPaciente,
  onScheduleCita,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'citas' | 'trat' | 'pagos' | 'datos' | 'odonto' | 'archivos'>('citas');
  const [archivos, setArchivos] = useState<ArchivoExpediente[]>(INITIAL_ARCHIVOS);
  const [categoriaFilter, setCategoriaFilter] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarColorClass = getAvatarClass(paciente.id);
  const initials = paciente.nom
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  const isMoroso = paciente.est === 'Moroso';
  const cleanPhone = paciente.tel.replace(/\D/g, '');
  const waUrl = `https://wa.me/51${cleanPhone}?text=Hola%20${encodeURIComponent(paciente.nom)},%20te%20saludamos%20de%20la%20cl%C3%ADnica%20Dental%20FC.`;

  const handlePrint = () => {
    window.print();
  };

  const handleGoToHistoria = () => {
    if (onOpenHistoria) {
      onOpenHistoria(paciente.id);
    } else if (onOpenOdontograma) {
      onOpenOdontograma(paciente.id);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const isImg = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    const extension = isImg ? 'image' : isPdf ? 'pdf' : 'doc';

    let cat: ArchivoExpediente['categoria'] = 'Otros';
    if (isImg) cat = 'Fotografía Clínica';
    if (isPdf && file.name.toLowerCase().includes('consent')) cat = 'Consentimiento & Legal';
    else if (isPdf && file.name.toLowerCase().includes('lab')) cat = 'Laboratorio Dental';
    else if (isImg && file.name.toLowerCase().includes('radio')) cat = 'Radiografía';

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const sizeKb = Math.round(file.size / 1024);
    const formattedSize = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`;

    const newArchivo: ArchivoExpediente = {
      id: `arch-${Date.now()}`,
      nombre: file.name,
      categoria: cat,
      tipo: extension,
      peso: formattedSize,
      fecha: new Date().toLocaleDateString('es-PE'),
      doctor: 'Dr. Diego Mendoza',
    };

    setArchivos((prev) => [newArchivo, ...prev]);
    onShowToast?.(`Archivo "${file.name}" anexado con éxito al expediente`);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteArchivo = (id: string, nombre: string) => {
    setArchivos((prev) => prev.filter((a) => a.id !== id));
    onShowToast?.(`Archivo "${nombre}" removido del expediente`);
  };

  const filteredArchivos = archivos.filter((a) => {
    if (categoriaFilter === 'all') return true;
    return a.categoria === categoriaFilter;
  });

  return (
    <div className="ficha-paciente-page" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* =========================================================
          1. BARRA DE RETORNO Y ACCIONES PRINCIPALES
          ========================================================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '12px 18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onBack}
            title="Volver al Directorio de Pacientes"
          >
            <Icon name="arrow-left" size="sm" />
            <span>Volver al Directorio</span>
          </button>
          <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
              Directorio de Pacientes &gt; Expediente Clínico
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{paciente.nom}</span>
              <span className="pf-hc-badge">HC-{paciente.id.toString().padStart(5, '0')}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {onEditPaciente && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onEditPaciente(paciente)}
              title="Editar datos de contacto y filiación"
            >
              <Icon name="edit" size="sm" />
              <span>Editar Datos</span>
            </button>
          )}
          <button
            className="btn btn-secondary btn-sm"
            onClick={handlePrint}
            title="Imprimir resumen del expediente"
          >
            <Icon name="printer" size="sm" />
            <span>Imprimir Ficha</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleGoToHistoria}
            title="Abrir la Historia Clínica oficial con Odontograma 3D y notas SOAP"
          >
            <Icon name="tooth" size="sm" />
            <span>Abrir Historia Clínica</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          2. CABECERA HERO DEL PACIENTE (SIN SOBRESATURACIÓN)
          ========================================================= */}
      <div className="pf-hero-card">
        <div className="pf-hero-left">
          <div className={`pf-avatar ${avatarColorClass}`}>
            <span>{initials}</span>
            <span className={`pf-avatar-dot ${paciente.est === 'Activo' ? 'ok' : isMoroso ? 'warn' : 'muted'}`} />
          </div>

          <div className="pf-hero-details">
            <div className="pf-hero-title-row">
              <h2 className="pf-patient-title">{paciente.nom}</h2>
              <span className="pf-doc-pill">
                {paciente.tipo}: <b>{paciente.doc}</b>
              </span>
              <span
                className={`paciente-status-chip ${
                  paciente.est === 'Activo' ? 'activo' : isMoroso ? 'moroso' : 'inactivo'
                }`}
              >
                <span className="dot" />
                <span>{paciente.est}</span>
              </span>
            </div>

            <div className="pf-hero-meta-row">
              <span className="pf-meta-item">
                <Icon name={paciente.sex === 'F' ? 'venus' : 'mars'} size="sm" style={{ color: paciente.sex === 'F' ? '#ec4899' : '#0284c7' }} />
                <span>{paciente.sex === 'F' ? 'Femenino' : 'Masculino'}, {paciente.edad} años</span>
              </span>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="pf-meta-item pf-link-wa"
                title="Abrir chat directo de WhatsApp"
              >
                <Icon name="phone" size="sm" style={{ color: '#10b981' }} />
                <span>{paciente.tel}</span>
              </a>
              <a
                href={`mailto:${paciente.mail}`}
                className="pf-meta-item pf-link-mail"
                title="Enviar correo institucional"
              >
                <Icon name="mail" size="sm" style={{ color: 'var(--primary)' }} />
                <span>{paciente.mail}</span>
              </a>
              <span className="pf-meta-item" title={paciente.dir}>
                <Icon name="pin" size="sm" style={{ color: 'var(--text-muted)' }} />
                <span className="pf-dir-text">{paciente.dir}</span>
              </span>
            </div>

            <div className="pf-hero-tags-row">
              {paciente.tags.map((t, idx) => (
                <span key={idx} className="paciente-tag-pill">
                  #{t}
                </span>
              ))}
              {paciente.fav && (
                <span className="pf-fav-chip">
                  <Icon name="star" size="sm" /> Paciente Frecuente
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pf-hero-stats">
          <div className="pf-stat-box">
            <span className="stat-label">Citas Registradas</span>
            <b className="stat-value">12</b>
            <span className="stat-sub">3 este año</span>
          </div>
          <div className={`pf-stat-box ${isMoroso ? 'is-warning' : 'is-ok'}`}>
            <span className="stat-label">Saldo Pendiente</span>
            <b className="stat-value">{isMoroso ? 'S/ 480.00' : 'S/ 0.00'}</b>
            <span className="stat-sub">{isMoroso ? 'Requiere cobranza' : 'Cuenta al día'}</span>
          </div>
          <div className="pf-stat-box">
            <span className="stat-label">Último Control</span>
            <b className="stat-value" style={{ fontSize: '14px' }}>24/10/2026</b>
            <span className="stat-sub">Dra. Valeria Ríos</span>
          </div>
        </div>
      </div>

      {/* Banner Informativo Directo */}
      <div className="pf-clinical-banner">
        <div className="pf-clinical-banner-text">
          <Icon name="shield" size="sm" style={{ color: 'var(--primary)' }} />
          <span>
            Expediente digital auditado conforme a la <b>Ley General de Salud N° 26842</b> y estándares <b>MINSA</b>.
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('odonto')}
            title="Ir a la pestaña de odontograma"
          >
            <Icon name="tooth" size="sm" />
            <span>Ficha Odontograma</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('archivos')}
            title="Ir al repositorio de archivos"
          >
            <Icon name="folder" size="sm" />
            <span>Archivos &amp; Fotos</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          3. PESTAÑAS DEL EXPEDIENTE (CON ODONTOGRAMA Y ARCHIVOS)
          ========================================================= */}
      <div className="tabs pf-tabs-bar" style={{ flexWrap: 'wrap' }}>
        <button
          className={`tab ${activeTab === 'citas' ? 'on' : ''}`}
          onClick={() => setActiveTab('citas')}
        >
          <Icon name="calendar" size="sm" />
          <span>Citas &amp; Controles</span>
          <span className="n">3</span>
        </button>
        <button
          className={`tab ${activeTab === 'trat' ? 'on' : ''}`}
          onClick={() => setActiveTab('trat')}
        >
          <Icon name="clipboard" size="sm" />
          <span>Tratamientos &amp; Presupuesto</span>
          <span className="n">4</span>
        </button>
        <button
          className={`tab ${activeTab === 'pagos' ? 'on' : ''}`}
          onClick={() => setActiveTab('pagos')}
        >
          <Icon name="card" size="sm" />
          <span>Estado de Cuenta &amp; Pagos</span>
          <span className="n">4</span>
        </button>
        <button
          className={`tab ${activeTab === 'datos' ? 'on' : ''}`}
          onClick={() => setActiveTab('datos')}
        >
          <Icon name="user" size="sm" />
          <span>Filiación &amp; Facturación</span>
        </button>
        <button
          className={`tab ${activeTab === 'odonto' ? 'on' : ''}`}
          onClick={() => setActiveTab('odonto')}
        >
          <Icon name="tooth" size="sm" />
          <span>Odontograma</span>
          <span className="n">FDI</span>
        </button>
        <button
          className={`tab ${activeTab === 'archivos' ? 'on' : ''}`}
          onClick={() => setActiveTab('archivos')}
        >
          <Icon name="folder" size="sm" />
          <span>Archivos</span>
          <span className="n">{archivos.length}</span>
        </button>
      </div>

      {/* =========================================================
          4. CONTENIDO DE LAS PESTAÑAS
          ========================================================= */}

      {/* TAB 1: CITAS & CONTROLES */}
      {activeTab === 'citas' && (
        <div className="card" style={{ padding: '20px' }}>
          <div className="pf-section-intro">
            <div>
              <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text)' }}>
                Historial de Citas y Sesiones del Paciente
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                Registro cronológico de asistencias, box odontológico y profesional asignado.
              </p>
            </div>
            {onScheduleCita && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onScheduleCita(paciente.nom)}
              >
                <Icon name="plus" size="sm" />
                <span>Agendar Nueva Cita</span>
              </button>
            )}
          </div>

          <div className="table-wrap" style={{ marginTop: '14px' }}>
            <table className="data pf-table">
              <thead>
                <tr>
                  <th>Fecha / Hora</th>
                  <th>Motivo de Consulta</th>
                  <th>Profesional Asignado</th>
                  <th>Costo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>24/10/2026</b> <span style={{ color: 'var(--text-muted)' }}>09:00 AM</span>
                  </td>
                  <td>
                    <b>Control mensual de ortodoncia</b>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Box 04 · Sillón Ortodoncia</div>
                  </td>
                  <td>Dra. Valeria Ríos</td>
                  <td style={{ fontWeight: 600 }}>S/ 120.00</td>
                  <td>
                    <span className="badge ok">Confirmada</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>18/09/2026</b> <span style={{ color: 'var(--text-muted)' }}>16:30 PM</span>
                  </td>
                  <td>
                    <b>Ajuste de arco y cambio de elásticos</b>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Box 04 · Sillón Ortodoncia</div>
                  </td>
                  <td>Dra. Valeria Ríos</td>
                  <td style={{ fontWeight: 600 }}>S/ 120.00</td>
                  <td>
                    <span className="badge info">Atendida</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>15/08/2026</b> <span style={{ color: 'var(--text-muted)' }}>11:00 AM</span>
                  </td>
                  <td>
                    <b>Instalación de brackets metálicos</b>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Box 04 · Sillón Ortodoncia</div>
                  </td>
                  <td>Dra. Valeria Ríos</td>
                  <td style={{ fontWeight: 600 }}>S/ 1,800.00</td>
                  <td>
                    <span className="badge info">Atendida</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TRATAMIENTOS & PRESUPUESTO */}
      {activeTab === 'trat' && (
        <div className="card" style={{ padding: '20px' }}>
          <div className="pf-section-intro">
            <div>
              <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text)' }}>
                Plan de Tratamiento y Presupuesto Valorizado
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                Detalle de procedimientos estomatológicos realizados y sesiones pendientes.
              </p>
            </div>
          </div>

          <div className="table-wrap" style={{ marginTop: '14px' }}>
            <table className="data pf-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Tratamiento</th>
                  <th>Categoría</th>
                  <th>Piezas / Zona</th>
                  <th>Precio Plan</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="pf-code-pill">T-016</span></td>
                  <td>
                    <b>Brackets metálicos Roth (Instalación)</b>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Arcada superior e inferior</div>
                  </td>
                  <td>Ortodoncia</td>
                  <td>18-48</td>
                  <td style={{ fontWeight: 700 }}>S/ 1,800.00</td>
                  <td><span className="badge ok">Completado</span></td>
                </tr>
                <tr>
                  <td><span className="pf-code-pill">T-017</span></td>
                  <td>
                    <b>Control mensual de ortodoncia</b>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sesión 2/18</div>
                  </td>
                  <td>Ortodoncia</td>
                  <td>General</td>
                  <td style={{ fontWeight: 700 }}>S/ 120.00</td>
                  <td><span className="badge info">En Curso</span></td>
                </tr>
                <tr>
                  <td><span className="pf-code-pill">T-002</span></td>
                  <td>
                    <b>Profilaxis y destartraje ultrasónico</b>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Remoción de cálculo supragingival</div>
                  </td>
                  <td>Preventiva</td>
                  <td>Completo</td>
                  <td style={{ fontWeight: 700 }}>S/ 120.00</td>
                  <td><span className="badge ok">Completado</span></td>
                </tr>
                <tr>
                  <td><span className="pf-code-pill">T-005</span></td>
                  <td>
                    <b>Obturación con resina compuesta (A2)</b>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pieza 26 (Caries oclusomesial)</div>
                  </td>
                  <td>Restauradora</td>
                  <td>Pieza 26</td>
                  <td style={{ fontWeight: 700 }}>S/ 150.00</td>
                  <td><span className="badge">Pendiente</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ESTADO DE CUENTA & PAGOS */}
      {activeTab === 'pagos' && (
        <div className="card" style={{ padding: '20px' }}>
          <div className="pf-balance-card" style={{ marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                Total Facturado a la Fecha
              </span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginTop: '2px' }}>
                S/ 2,160.00
              </div>
              <span style={{ fontSize: '12px', color: 'var(--ok)', fontWeight: 600 }}>
                S/ 1,680.00 cancelados
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                Saldo Pendiente de Cobro
              </span>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: isMoroso ? 'var(--danger)' : 'var(--ok)',
                  marginTop: '2px',
                }}
              >
                {isMoroso ? 'S/ 480.00' : 'S/ 0.00'}
              </div>
              <span style={{ fontSize: '11px', color: isMoroso ? 'var(--danger)' : 'var(--text-muted)' }}>
                {isMoroso ? '1 cuota en mora · Notificar' : 'Cuentas al día'}
              </span>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data pf-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Concepto de Cobro</th>
                  <th>Comprobante</th>
                  <th>Método de Pago</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'right' }}>Monto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>24/10/2026 09:12</td>
                  <td>Control mensual de ortodoncia</td>
                  <td><span className="badge">Boleta B001-000425</span></td>
                  <td>Efectivo</td>
                  <td><span className="badge ok">Pagado</span></td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>S/ 120.00</td>
                </tr>
                <tr>
                  <td>23/10/2026 17:20</td>
                  <td>Obturación en pieza 26 con resina A2</td>
                  <td><span className="badge">Boleta B001-000420</span></td>
                  <td>Tarjeta Visa</td>
                  <td><span className="badge ok">Pagado</span></td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>S/ 280.00</td>
                </tr>
                <tr>
                  <td>18/09/2026 17:00</td>
                  <td>Control mensual de ortodoncia</td>
                  <td><span className="badge">Boleta B001-000380</span></td>
                  <td>Yape / Plin</td>
                  <td><span className="badge ok">Pagado</span></td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>S/ 120.00</td>
                </tr>
                <tr>
                  <td>15/08/2026 12:30</td>
                  <td>Instalación de brackets metálicos</td>
                  <td><span className="badge">Factura F001-000035</span></td>
                  <td>Transferencia BCP</td>
                  <td><span className="badge ok">Pagado</span></td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>S/ 1,800.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: FILIACIÓN & FACTURACIÓN */}
      {activeTab === 'datos' && (
        <div className="grid g2">
          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="user" size="sm" style={{ color: 'var(--primary)' }} />
              <span>Datos Personales de Filiación</span>
            </h4>
            <div className="pf-meta-item">
              <span style={{ width: '140px', color: 'var(--text-muted)', fontSize: '12.5px' }}>Nombre completo:</span>
              <b style={{ color: 'var(--text)' }}>{paciente.nom}</b>
            </div>
            <div className="pf-meta-item">
              <span style={{ width: '140px', color: 'var(--text-muted)', fontSize: '12.5px' }}>Documento ({paciente.tipo}):</span>
              <b>{paciente.doc}</b>
            </div>
            <div className="pf-meta-item">
              <span style={{ width: '140px', color: 'var(--text-muted)', fontSize: '12.5px' }}>Edad / Sexo:</span>
              <span>{paciente.edad} años ({paciente.sex === 'F' ? 'Femenino' : 'Masculino'})</span>
            </div>
            <div className="pf-meta-item">
              <span style={{ width: '140px', color: 'var(--text-muted)', fontSize: '12.5px' }}>Estado en el sistema:</span>
              <span className={`badge ${paciente.est === 'Activo' ? 'ok' : isMoroso ? 'warn' : ''}`}>
                {paciente.est}
              </span>
            </div>
            <div className="pf-meta-item">
              <span style={{ width: '140px', color: 'var(--text-muted)', fontSize: '12.5px' }}>Historia Clínica:</span>
              <span className="pf-hc-badge">HC-{paciente.id.toString().padStart(5, '0')}</span>
            </div>
          </div>

          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="phone" size="sm" style={{ color: 'var(--ok)' }} />
              <span>Canales de Comunicación &amp; Envío</span>
            </h4>
            <div className="pf-meta-item">
              <span style={{ width: '140px', color: 'var(--text-muted)', fontSize: '12.5px' }}>WhatsApp / Móvil:</span>
              <a href={waUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--ok)', fontWeight: 700 }}>
                {paciente.tel} (Directo)
              </a>
            </div>
            <div className="pf-meta-item">
              <span style={{ width: '140px', color: 'var(--text-muted)', fontSize: '12.5px' }}>Correo Electrónico:</span>
              <a href={`mailto:${paciente.mail}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                {paciente.mail}
              </a>
            </div>
            <div className="pf-meta-item">
              <span style={{ width: '140px', color: 'var(--text-muted)', fontSize: '12.5px' }}>Dirección fiscal:</span>
              <span style={{ color: 'var(--text)' }}>{paciente.dir}</span>
            </div>
            <div className="pf-meta-item">
              <span style={{ width: '140px', color: 'var(--text-muted)', fontSize: '12.5px' }}>Etiquetas / Tags:</span>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {paciente.tags.map((t, i) => (
                  <span key={i} className="paciente-tag-pill">#{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ODONTOGRAMA (REDIRECCIÓN Y ACCESO DIRECTO) */}
      {activeTab === 'odonto' && (
        <div className="card" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ maxWidth: '640px' }}>
              <div className="corp-hero-tag" style={{ marginBottom: '8px' }}>
                <Icon name="tooth" size="sm" />
                <span>Odontograma Digital FDI &amp; Ficha Odontoestomatológica</span>
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text)', fontWeight: 800 }}>
                Odontograma Clínico Oficial del Paciente
              </h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                El odontograma interactivo, el registro gráfico de las 32 piezas dentales, evoluciones SOAP, recetario médico y diagnósticos CIE-10 forman parte del expediente clínico oficial.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleGoToHistoria}
              style={{ padding: '10px 20px', fontSize: '13.5px' }}
            >
              <Icon name="tooth" size="sm" />
              <span>Abrir Odontograma en Historia Clínica</span>
              <Icon name="chevron-r" size="sm" />
            </button>
          </div>

          <div
            style={{
              marginTop: '22px',
              padding: '18px 20px',
              borderRadius: '10px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
            }}
          >
            <h4 style={{ margin: '0 0 12px 0', fontSize: '13.5px', color: 'var(--text)', fontWeight: 700 }}>
              Hallazgos y Procedimientos Registrados en el Odontograma de {paciente.nom}:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'var(--surface)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <b style={{ color: 'var(--text)', fontSize: '13px' }}>Pieza 16</b>
                  <span className="badge danger">Caries O/D</span>
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Superficie Oclusodistal · Requiere resina
                </div>
              </div>

              <div style={{ background: 'var(--surface)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <b style={{ color: 'var(--text)', fontSize: '13px' }}>Pieza 26</b>
                  <span className="badge info">Obturación M/O</span>
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Resina compuesta A2 · Buen estado
                </div>
              </div>

              <div style={{ background: 'var(--surface)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <b style={{ color: 'var(--text)', fontSize: '13px' }}>Pieza 36</b>
                  <span className="badge purple">Endodoncia</span>
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Conductometría completada · Dra. Valeria Ríos
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleGoToHistoria}
              >
                <span>Ver Odontograma Completo (32 Piezas FDI)</span>
                <Icon name="chevron-r" size="sm" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ARCHIVOS & FOTOGRAFÍAS CLÍNICAS */}
      {activeTab === 'archivos' && (
        <div className="card" style={{ padding: '24px' }}>
          {/* Cabecera y Selector de Carga */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text)', fontWeight: 700 }}>
                Repositorio de Archivos y Documentación Clínica
              </h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Carga y consulta de radiografías, fotografías intraorales, consentimientos informados y estudios diagnósticos.
              </p>
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                accept="image/*,application/pdf,.doc,.docx"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon name="upload" size="sm" />
                <span>Subir Archivo o Imagen</span>
              </button>
            </div>
          </div>

          {/* Área Drag & Drop Estilizada */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              marginTop: '16px',
              border: '2px dashed var(--border)',
              borderRadius: '12px',
              padding: '24px 20px',
              textAlign: 'center',
              background: 'var(--surface-2)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', marginBottom: '8px' }}>
              <Icon name="upload" size="lg" />
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text)' }}>
              Haz clic o arrastra fotos, radiografías o documentos PDF aquí
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Formatos aceptados: JPG, PNG, PDF, DICOM, DOCX (Máximo 50 MB por archivo)
            </div>
          </div>

          {/* Filtros por Categoría */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '18px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Filtrar:</span>
            {[
              { id: 'all', label: 'Todos los Archivos', count: archivos.length },
              { id: 'Radiografía', label: 'Radiografías', count: archivos.filter((a) => a.categoria === 'Radiografía').length },
              { id: 'Fotografía Clínica', label: 'Fotos Clínicas', count: archivos.filter((a) => a.categoria === 'Fotografía Clínica').length },
              { id: 'Consentimiento & Legal', label: 'Consentimientos', count: archivos.filter((a) => a.categoria === 'Consentimiento & Legal').length },
              { id: 'Laboratorio Dental', label: 'Laboratorio', count: archivos.filter((a) => a.categoria === 'Laboratorio Dental').length },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                className={`pacientes-chip-btn ${categoriaFilter === f.id ? 'active' : ''}`}
                onClick={() => setCategoriaFilter(f.id)}
              >
                <span>{f.label}</span>
                <span className="doc-chip-badge">{f.count}</span>
              </button>
            ))}
          </div>

          {/* Listado de Archivos */}
          <div className="table-wrap" style={{ marginTop: '14px' }}>
            <table className="data pf-table">
              <thead>
                <tr>
                  <th>Nombre del Archivo</th>
                  <th>Categoría</th>
                  <th>Fecha de Carga</th>
                  <th>Registrado Por</th>
                  <th>Peso</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredArchivos.length > 0 ? (
                  filteredArchivos.map((arch) => (
                    <tr key={arch.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              display: 'grid',
                              placeItems: 'center',
                              background:
                                arch.tipo === 'image'
                                  ? 'rgba(16, 185, 129, 0.12)'
                                  : 'rgba(37, 99, 235, 0.12)',
                              color:
                                arch.tipo === 'image' ? '#059669' : '#2563eb',
                            }}
                          >
                            <Icon name={arch.tipo === 'image' ? 'image' : 'file'} size="sm" />
                          </div>
                          <div>
                            <b style={{ color: 'var(--text)', fontSize: '13px' }}>{arch.nombre}</b>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              Formato: {arch.tipo.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${arch.categoria === 'Radiografía' ? 'purple' : arch.categoria === 'Consentimiento & Legal' ? 'ok' : 'info'}`}>
                          {arch.categoria}
                        </span>
                      </td>
                      <td>{arch.fecha}</td>
                      <td>{arch.doctor}</td>
                      <td>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                          {arch.peso}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => onShowToast?.(`Abriendo visor de: ${arch.nombre}`)}
                            title="Previsualizar o descargar archivo"
                          >
                            <Icon name="download" size="sm" />
                            <span>Descargar</span>
                          </button>
                          <button
                            type="button"
                            className="btn-table-action danger"
                            onClick={() => handleDeleteArchivo(arch.id, arch.nombre)}
                            title="Eliminar archivo del expediente"
                          >
                            <Icon name="trash" size="sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No se encontraron archivos en la categoría seleccionada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pie Institucional de la Ficha */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11.5px',
          color: 'var(--text-muted)',
          padding: '8px 4px',
        }}
      >
        <span>
          Expediente Clínico Digital · Conforme a Ley de Protección de Datos Personales N° 29733
        </span>
        <span>
          Última actualización: Hoy a las 09:12 AM por Dra. Valeria Ríos
        </span>
      </div>
    </div>
  );
};
