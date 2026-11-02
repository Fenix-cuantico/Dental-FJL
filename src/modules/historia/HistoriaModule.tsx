import React, { useState, useEffect } from 'react';
import { Icon } from '../../shared/components/Icon';
import { Doctor, Paciente, OdontogramaData } from '../../shared/types/dental.types';
import { OdontogramaModule } from '../odontograma/OdontogramaModule';
import './HistoriaModule.css';

interface EvolucionClinica {
  id: string;
  pacienteId: number;
  fecha: string;
  hora: string;
  doctor: string;
  cop: string;
  motivo: string;
  subjetivo: string;
  objetivo: string;
  apreciacion: string;
  plan: string;
}

interface RecetaMedica {
  id: string;
  pacienteId: number;
  fecha: string;
  doctor: string;
  cop: string;
  items: Array<{
    nombre: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
    indicacion: string;
  }>;
}

interface DiagnosticoDental {
  id: string;
  pacienteId: number;
  codigoCie: string;
  descripcion: string;
  pieza: string;
  fecha: string;
  estado: 'En Tratamiento' | 'Resuelto' | 'En Observación';
}

interface HistoriaModuleProps {
  pacientes: Paciente[];
  doctors: Doctor[];
  initialTab?: 'odontograma' | 'evoluciones' | 'recetas' | 'diagnosticos' | 'antecedentes';
  selectedPacienteIdProp?: number;
  initialOdontoData?: OdontogramaData;
  onSaveOdontograma?: (data: OdontogramaData) => void;
  onOpenOdontograma?: (pacienteId: number) => void;
  onShowToast?: (msg: string) => void;
}

const INITIAL_EVOLUCIONES: EvolucionClinica[] = [
  {
    id: 'EVO-101',
    pacienteId: 1, // Ana María Quispe
    fecha: '2026-10-24',
    hora: '09:30',
    doctor: 'Dra. Valeria Ríos',
    cop: 'COP 33620',
    motivo: 'Control mensual de aparatología fija (brackets)',
    subjetivo: 'Paciente refiere ligera molestia los primeros 2 días tras colocación de elásticos intermaxilares. Niega dolor agudo o aftas.',
    objetivo: 'Arcadas superior e inferior alineadas, arcos 0.016x0.022 NiTi activados. Buena higiene gingival, sin sangrado al sondaje.',
    apreciacion: 'Maloclusión Clase I en fase de consolidación y cierre de espacios (K07.2). Evolución favorable.',
    plan: 'Cambio de módulos elásticos en sector posterior. Próximo control en 4 semanas para iniciar fase de finalización.',
  },
  {
    id: 'EVO-102',
    pacienteId: 1,
    fecha: '2026-09-18',
    hora: '16:45',
    doctor: 'Dra. Valeria Ríos',
    cop: 'COP 33620',
    motivo: 'Recementado de bracket desprendido en pieza 14',
    subjetivo: 'Paciente refiere desprendimiento accidental de bracket durante la ingesta de alimentos duros.',
    objetivo: 'Pieza 14 íntegra, sin daño adamantino. Se realiza profilaxis previa y grabado ácido con ácido ortofosfórico al 37%.',
    apreciacion: 'Mantenimiento de aparatología fija.',
    plan: 'Recementado de bracket metálico Roth con resina fotopolimerizable. Se refuerzan pautas de dieta blanda.',
  },
  {
    id: 'EVO-103',
    pacienteId: 2, // Rosa Huamán
    fecha: '2026-10-23',
    hora: '11:15',
    doctor: 'Dr. Diego Mendoza',
    cop: 'COP 24510',
    motivo: 'Obturación estética en molar superior izquierdo',
    subjetivo: 'Paciente refiere sensibilidad al frío y empaquetamiento de alimentos en cuadrante superior izquierdo.',
    objetivo: 'Pieza 26 con cavidad oclusomesial profunda. Pruebas de vitalidad pulpar positivas con respuesta normal no persistente.',
    apreciacion: 'Caries de la dentina (CIE-10: K02.1). Pulpa clínicamente sana.',
    plan: 'Aislamiento absoluto, remoción de caries con fresa carburo, liner ionómero de vidrio y restauración con resina nanoparticulada Filtek A2. Oclusión controlada.',
  },
  {
    id: 'EVO-104',
    pacienteId: 3, // Carlos Ruiz
    fecha: '2026-10-20',
    hora: '10:00',
    doctor: 'Dr. Mateo Paredes',
    cop: 'COP 22941',
    motivo: 'Control postoperatorio de implante oseointegrado pieza 36',
    subjetivo: 'Paciente refiere evolución asintomática, sin inflamación ni dolor a la palpación.',
    objetivo: 'Mucosa periimplantaria queratinizada y rosada. Suturas retiradas a los 10 días sin complicaciones.',
    apreciacion: 'Fase de oseointegración en curso (3 meses postquirúrgico).',
    plan: 'Control radiográfico periapical para evaluar nivel óseo marginal. Cita en 60 días para toma de impresión definitiva.',
  },
];

const INITIAL_RECETAS: RecetaMedica[] = [
  {
    id: 'REC-001',
    pacienteId: 1,
    fecha: '2026-10-24',
    doctor: 'Dra. Valeria Ríos',
    cop: 'COP 33620',
    items: [
      {
        nombre: 'Ketorolaco Trometamina 10mg',
        dosis: '1 tableta sublingual',
        frecuencia: 'Cada 8 horas (en caso de dolor post-ajuste)',
        duracion: 'Por 2 días',
        indicacion: 'Tomar únicamente si hay dolor moderado a la masticación.',
      },
      {
        nombre: 'Cera para ortodoncia dental',
        dosis: 'Aplicación tópica',
        frecuencia: 'Según necesidad sobre brackets que rocen',
        duracion: 'Uso continuo',
        indicacion: 'Colocar una bolita sobre el bracket que cause molestia.',
      },
    ],
  },
  {
    id: 'REC-002',
    pacienteId: 2,
    fecha: '2026-10-23',
    doctor: 'Dr. Diego Mendoza',
    cop: 'COP 24510',
    items: [
      {
        nombre: 'Ibuprofeno 400mg',
        dosis: '1 tableta oral',
        frecuencia: 'Cada 8 horas',
        duracion: 'Por 3 días',
        indicacion: 'Tomar después de los alimentos.',
      },
      {
        nombre: 'Clorhexidina 0.12% enjuagatorio bucal',
        dosis: '15 ml sin diluir',
        frecuencia: '2 veces al día (mañana y noche tras el cepillado)',
        duracion: 'Por 7 días',
        indicacion: 'Enjuagar por 1 minuto y escupir. No ingerir alimentos en los 30 min posteriores.',
      },
    ],
  },
];

const INITIAL_DIAGNOSTICOS: DiagnosticoDental[] = [
  {
    id: 'DX-1',
    pacienteId: 1,
    codigoCie: 'K07.2',
    descripcion: 'Anomalías de la relación entre los arcos dentarios (Clase II división 1)',
    pieza: 'Ambas Arcadas',
    fecha: '2026-08-15',
    estado: 'En Tratamiento',
  },
  {
    id: 'DX-2',
    pacienteId: 1,
    codigoCie: 'K05.0',
    descripcion: 'Gingivitis marginal crónica por acumulación de placa bacteriana',
    pieza: 'Sector Anterior',
    fecha: '2026-08-15',
    estado: 'Resuelto',
  },
  {
    id: 'DX-3',
    pacienteId: 2,
    codigoCie: 'K02.1',
    descripcion: 'Caries de la dentina con compromiso oclusomesial',
    pieza: 'Pieza 26',
    fecha: '2026-10-23',
    estado: 'Resuelto',
  },
  {
    id: 'DX-4',
    pacienteId: 3,
    codigoCie: 'K08.1',
    descripcion: 'Pérdida de dientes por accidente o extracción previa',
    pieza: 'Pieza 36',
    fecha: '2026-07-10',
    estado: 'En Tratamiento',
  },
];

export const HistoriaModule: React.FC<HistoriaModuleProps> = ({
  pacientes,
  doctors,
  initialTab = 'odontograma',
  selectedPacienteIdProp,
  initialOdontoData,
  onSaveOdontograma,
  onOpenOdontograma,
  onShowToast,
}) => {
  const [selectedPacienteId, setSelectedPacienteId] = useState<number>(selectedPacienteIdProp || pacientes[0]?.id || 1);
  const [activeTab, setActiveTab] = useState<'odontograma' | 'evoluciones' | 'recetas' | 'diagnosticos' | 'antecedentes'>(initialTab);
  const [searchEvolucion, setSearchEvolucion] = useState('');

  useEffect(() => {
    if (selectedPacienteIdProp) {
      setSelectedPacienteId(selectedPacienteIdProp);
    }
  }, [selectedPacienteIdProp]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Estados de datos
  const [evoluciones, setEvoluciones] = useState<EvolucionClinica[]>(INITIAL_EVOLUCIONES);
  const [recetas, setRecetas] = useState<RecetaMedica[]>(INITIAL_RECETAS);
  const [diagnosticos] = useState<DiagnosticoDental[]>(INITIAL_DIAGNOSTICOS);

  // Modales
  const [isNewEvoOpen, setIsNewEvoOpen] = useState(false);
  const [isNewRecetaOpen, setIsNewRecetaOpen] = useState(false);

  // Formulario Nueva Evolución (SOAP)
  const [newEvoDoctor, setNewEvoDoctor] = useState(doctors[0]?.nombre || 'Dr. Diego Mendoza');
  const [newEvoMotivo, setNewEvoMotivo] = useState('');
  const [newEvoSubjetivo, setNewEvoSubjetivo] = useState('');
  const [newEvoObjetivo, setNewEvoObjetivo] = useState('');
  const [newEvoApreciacion, setNewEvoApreciacion] = useState('');
  const [newEvoPlan, setNewEvoPlan] = useState('');

  // Formulario Nueva Receta
  const [newRecetaDoctor, setNewRecetaDoctor] = useState(doctors[0]?.nombre || 'Dr. Diego Mendoza');
  const [newMedNombre, setNewMedNombre] = useState('');
  const [newMedDosis, setNewMedDosis] = useState('');
  const [newMedFrecuencia, setNewMedFrecuencia] = useState('');
  const [newMedDuracion, setNewMedDuracion] = useState('');
  const [newMedIndicacion, setNewMedIndicacion] = useState('');

  const currentPaciente = pacientes.find((p) => p.id === selectedPacienteId) || pacientes[0];

  const currentEvoluciones = evoluciones.filter((e) => {
    if (e.pacienteId !== selectedPacienteId) return false;
    if (searchEvolucion.trim()) {
      const q = searchEvolucion.toLowerCase();
      return (
        e.motivo.toLowerCase().includes(q) ||
        e.doctor.toLowerCase().includes(q) ||
        e.subjetivo.toLowerCase().includes(q) ||
        e.plan.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const currentRecetas = recetas.filter((r) => r.pacienteId === selectedPacienteId);
  const currentDiagnosticos = diagnosticos.filter((d) => d.pacienteId === selectedPacienteId);

  const handleCreateEvolucion = (e: React.FormEvent) => {
    e.preventDefault();
    const docObj = doctors.find((d) => d.nombre === newEvoDoctor);
    const newEntry: EvolucionClinica = {
      id: `EVO-${Date.now().toString().slice(-4)}`,
      pacienteId: selectedPacienteId,
      fecha: new Date().toISOString().slice(0, 10),
      hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      doctor: newEvoDoctor,
      cop: docObj?.cop || 'COP 24510',
      motivo: newEvoMotivo || 'Control odontológico programado',
      subjetivo: newEvoSubjetivo,
      objetivo: newEvoObjetivo,
      apreciacion: newEvoApreciacion,
      plan: newEvoPlan,
    };

    setEvoluciones([newEntry, ...evoluciones]);
    setIsNewEvoOpen(false);
    onShowToast?.(`Nota de evolución SOAP guardada para ${currentPaciente?.nom}`);

    // Limpiar campos
    setNewEvoMotivo('');
    setNewEvoSubjetivo('');
    setNewEvoObjetivo('');
    setNewEvoApreciacion('');
    setNewEvoPlan('');
  };

  const handleCreateReceta = (e: React.FormEvent) => {
    e.preventDefault();
    const docObj = doctors.find((d) => d.nombre === newRecetaDoctor);
    const newEntry: RecetaMedica = {
      id: `REC-${Date.now().toString().slice(-4)}`,
      pacienteId: selectedPacienteId,
      fecha: new Date().toISOString().slice(0, 10),
      doctor: newRecetaDoctor,
      cop: docObj?.cop || 'COP 24510',
      items: [
        {
          nombre: newMedNombre,
          dosis: newMedDosis,
          frecuencia: newMedFrecuencia,
          duracion: newMedDuracion,
          indicacion: newMedIndicacion,
        },
      ],
    };

    setRecetas([newEntry, ...recetas]);
    setIsNewRecetaOpen(false);
    onShowToast?.(`Receta médica generada para ${currentPaciente?.nom}`);

    setNewMedNombre('');
    setNewMedDosis('');
    setNewMedFrecuencia('');
    setNewMedDuracion('');
    setNewMedIndicacion('');
  };

  const handleShareWhatsAppReceta = (receta: RecetaMedica) => {
    if (!currentPaciente) return;
    const phone = currentPaciente.tel.replace(/\D/g, '');
    let msg = `*RECETA MÉDICA - DENTAL FC*\n`;
    msg += `Paciente: ${currentPaciente.nom}\n`;
    msg += `Fecha: ${receta.fecha} | Prescribe: ${receta.doctor} (${receta.cop})\n\n`;
    receta.items.forEach((item, idx) => {
      msg += `*${idx + 1}. ${item.nombre}*\n`;
      msg += `  Dosis: ${item.dosis}\n`;
      msg += `  Frecuencia: ${item.frecuencia}\n`;
      msg += `  Duración: ${item.duracion}\n`;
      if (item.indicacion) msg += `  Indicación: ${item.indicacion}\n\n`;
    });
    msg += `_Consulte cualquier duda con su odontólogo tratante._`;

    const url = `https://wa.me/51${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="historia-module">
      {/* =========================================================
          1. CABECERA EJECUTIVA - HISTORIA CLÍNICA ODONTOLÓGICA
          ========================================================= */}
      <div className="corp-hero">
        <div className="corp-hero-main">
          <div className="corp-hero-tag">
            <span className="dot-ok" />
            <span>Expediente Odontológico Homologado MINSA / COP</span>
          </div>
          <h1 className="corp-hero-title">
            Historia Clínica y Evoluciones — <span>Dental FC</span>
          </h1>
          <p className="corp-hero-desc">
            Registro sistemático de evoluciones clínicas (SOAP), prescripciones farmacológicas, diagnósticos estomatológicos y trazabilidad médica.
          </p>

          <div className="corp-hero-chips">
            <div className="corp-chip chip-green">
              <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
              <span>{evoluciones.length} Sesiones Registradas</span>
            </div>
            <div className="corp-chip chip-blue">
              <Icon name="shield" size="sm" style={{ color: 'var(--primary)' }} />
              <span>Secreto Médico (Ley N° 26842)</span>
            </div>
            <div className="corp-chip chip-purple">
              <Icon name="file" size="sm" style={{ color: 'var(--warn)' }} />
              <span>Notas SOAP Digitales</span>
            </div>
          </div>
        </div>

        <div className="corp-hero-actions">
          <button className="btn btn-secondary" onClick={() => window.print()} title="Imprimir expediente clínico completo">
            <Icon name="printer" size="sm" />
            <span>Imprimir Historia</span>
          </button>
          <button className="btn btn-primary" onClick={() => setIsNewEvoOpen(true)} title="Registrar nota SOAP de evolución">
            <Icon name="plus" size="sm" />
            <span>Nueva Evolución</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          2. SELECTOR RÁPIDO DE PACIENTE & RESUMEN MÉDICO
          ========================================================= */}
      <div className="hc-patient-selector-card">
        <div className="hc-selector-left">
          <div className="hc-selector-label">
            <Icon name="users" size="sm" style={{ color: 'var(--primary)' }} />
            <span>Expediente Activo del Paciente:</span>
          </div>
          <select
            className="select hc-patient-dropdown"
            value={selectedPacienteId}
            onChange={(e) => setSelectedPacienteId(Number(e.target.value))}
          >
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                HC-{p.id.toString().padStart(5, '0')} — {p.nom} ({p.tipo}: {p.doc})
              </option>
            ))}
          </select>
        </div>

        {currentPaciente && (
          <div className="hc-patient-summary-strip">
            <div className="hc-patient-meta-item">
              <span className="lbl">Edad / Sexo:</span>
              <b>{currentPaciente.edad} años ({currentPaciente.sex === 'F' ? 'Mujer' : 'Varón'})</b>
            </div>
            <div className="hc-patient-meta-item">
              <span className="lbl">WhatsApp:</span>
              <b>{currentPaciente.tel}</b>
            </div>
            <div className="hc-patient-meta-item">
              <span className="lbl">Estado Clínico:</span>
              <span className={`badge ${currentPaciente.est === 'Activo' ? 'ok' : currentPaciente.est === 'Moroso' ? 'warn' : ''}`}>
                {currentPaciente.est}
              </span>
            </div>
            {activeTab !== 'odontograma' ? (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveTab('odontograma')}
                title="Ver Odontograma Dental del Paciente"
              >
                <Icon name="tooth" size="sm" style={{ color: 'var(--primary)' }} />
                <span>Ver Odontograma FDI</span>
              </button>
            ) : (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveTab('evoluciones')}
                title="Ver Evoluciones Clínicas (SOAP)"
              >
                <Icon name="clipboard" size="sm" style={{ color: 'var(--primary)' }} />
                <span>Ver Notas SOAP</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* =========================================================
          3. PESTAÑAS MÉDICAS DEL EXPEDIENTE
          ========================================================= */}
      <div className="tabs hc-tabs-bar">
        <button
          className={`tab ${activeTab === 'odontograma' ? 'on' : ''}`}
          onClick={() => setActiveTab('odontograma')}
        >
          <Icon name="tooth" size="sm" />
          <span>Odontograma Dental</span>
        </button>
        <button
          className={`tab ${activeTab === 'evoluciones' ? 'on' : ''}`}
          onClick={() => setActiveTab('evoluciones')}
        >
          <Icon name="clipboard" size="sm" />
          <span>Evolución Clínica (SOAP)</span>
          <span className="n">{currentEvoluciones.length}</span>
        </button>
        <button
          className={`tab ${activeTab === 'recetas' ? 'on' : ''}`}
          onClick={() => setActiveTab('recetas')}
        >
          <Icon name="file" size="sm" />
          <span>Recetario & Medicación</span>
          <span className="n">{currentRecetas.length}</span>
        </button>
        <button
          className={`tab ${activeTab === 'diagnosticos' ? 'on' : ''}`}
          onClick={() => setActiveTab('diagnosticos')}
        >
          <Icon name="activity" size="sm" />
          <span>Diagnósticos (CIE-10)</span>
          <span className="n">{currentDiagnosticos.length}</span>
        </button>
        <button
          className={`tab ${activeTab === 'antecedentes' ? 'on' : ''}`}
          onClick={() => setActiveTab('antecedentes')}
        >
          <Icon name="shield" size="sm" />
          <span>Antecedentes & Consentimientos</span>
        </button>
      </div>

      {/* =========================================================
          4. CONTENIDO DE LAS PESTAÑAS MÉDICAS
          ========================================================= */}

      {/* PESTAÑA 0: ODONTOGRAMA DENTAL */}
      {activeTab === 'odontograma' && (
        <div className="hc-tab-content">
          <OdontogramaModule
            embedded
            pacientes={pacientes}
            selectedPacienteId={selectedPacienteId}
            initialData={initialOdontoData}
            onSave={(data) => {
              onSaveOdontograma?.(data);
              onShowToast?.(`Odontograma de ${currentPaciente?.nom} guardado en su historia clínica`);
            }}
          />
        </div>
      )}

      {/* PESTAÑA 1: EVOLUCIONES CLÍNICAS (NOTAS SOAP) */}
      {activeTab === 'evoluciones' && (
        <div className="hc-tab-content">
          <div className="hc-tab-toolbar">
            <div className="search" style={{ flex: 1, minWidth: '240px' }}>
              <Icon name="search" size="sm" />
              <input
                className="input"
                placeholder="Buscar en evoluciones clínicas por motivo, síntoma o plan..."
                value={searchEvolucion}
                onChange={(e) => setSearchEvolucion(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setIsNewEvoOpen(true)}>
              <Icon name="plus" size="sm" />
              <span>Registrar Nota SOAP</span>
            </button>
          </div>

          {currentEvoluciones.length > 0 ? (
            <div className="hc-evoluciones-list">
              {currentEvoluciones.map((evo) => (
                <div key={evo.id} className="hc-evo-card">
                  <div className="hc-evo-head">
                    <div className="hc-evo-head-left">
                      <div className="hc-evo-badge">
                        <Icon name="clock" size="sm" />
                        <span>{evo.fecha} · {evo.hora}</span>
                      </div>
                      <h3 className="hc-evo-title">{evo.motivo}</h3>
                    </div>
                    <div className="hc-evo-doctor-tag">
                      <Icon name="user" size="sm" />
                      <span>{evo.doctor} ({evo.cop})</span>
                    </div>
                  </div>

                  <div className="hc-soap-grid">
                    <div className="hc-soap-box s">
                      <div className="hc-soap-letter">S</div>
                      <div className="hc-soap-body">
                        <b>Subjetivo (Anamnesis / Refiere paciente):</b>
                        <p>{evo.subjetivo}</p>
                      </div>
                    </div>

                    <div className="hc-soap-box o">
                      <div className="hc-soap-letter">O</div>
                      <div className="hc-soap-body">
                        <b>Objetivo (Examen clínico estomatológico):</b>
                        <p>{evo.objetivo}</p>
                      </div>
                    </div>

                    <div className="hc-soap-box a">
                      <div className="hc-soap-letter">A</div>
                      <div className="hc-soap-body">
                        <b>Apreciación / Diagnóstico presuntivo o definitivo:</b>
                        <p>{evo.apreciacion}</p>
                      </div>
                    </div>

                    <div className="hc-soap-box p">
                      <div className="hc-soap-letter">P</div>
                      <div className="hc-soap-body">
                        <b>Plan / Tratamiento realizado & Próxima cita:</b>
                        <p>{evo.plan}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="pacientes-empty-state">
              <div className="pacientes-empty-icon">
                <Icon name="clipboard" size="lg" />
              </div>
              <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text)' }}>
                No hay notas de evolución registradas
              </h4>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                No se han registrado sesiones clínicas SOAP para este paciente aún.
              </p>
              <button className="btn btn-primary btn-sm" onClick={() => setIsNewEvoOpen(true)}>
                <Icon name="plus" size="sm" />
                <span>Registrar Primera Evolución</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 2: RECETARIO & MEDICACIÓN */}
      {activeTab === 'recetas' && (
        <div className="hc-tab-content">
          <div className="hc-tab-toolbar">
            <div>
              <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text)' }}>
                Prescripciones Farmacológicas Oficiales
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                Recetas emitidas con firma y colegiatura COP para dispensación en boticas y farmacias.
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setIsNewRecetaOpen(true)}>
              <Icon name="plus" size="sm" />
              <span>Emitir Receta</span>
            </button>
          </div>

          {currentRecetas.length > 0 ? (
            <div className="hc-recetas-grid">
              {currentRecetas.map((rec) => (
                <div key={rec.id} className="hc-receta-card">
                  <div className="hc-receta-header">
                    <div>
                      <span className="hc-receta-folio">{rec.id}</span>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginTop: '2px' }}>
                        Fecha: {rec.fecha}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>{rec.doctor}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{rec.cop}</div>
                    </div>
                  </div>

                  <div className="hc-receta-body">
                    {rec.items.map((item, idx) => (
                      <div key={idx} className="hc-receta-item">
                        <div className="item-title">
                          <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
                          <b>{item.nombre}</b>
                        </div>
                        <div className="item-meta">
                          <span><b>Dosis:</b> {item.dosis}</span>
                          <span><b>Frecuencia:</b> {item.frecuencia}</span>
                          <span><b>Duración:</b> {item.duracion}</span>
                        </div>
                        {item.indicacion && (
                          <div className="item-indicacion">
                            <i>Nota: {item.indicacion}</i>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="hc-receta-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleShareWhatsAppReceta(rec)}
                      title="Enviar receta por WhatsApp al paciente"
                    >
                      <Icon name="phone" size="sm" style={{ color: '#10b981' }} />
                      <span>Enviar WhatsApp</span>
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => window.print()}
                      title="Imprimir receta oficial"
                    >
                      <Icon name="printer" size="sm" />
                      <span>Imprimir</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="pacientes-empty-state">
              <div className="pacientes-empty-icon">
                <Icon name="file" size="lg" />
              </div>
              <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text)' }}>
                No hay recetas emitidas
              </h4>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                El paciente no cuenta con prescripciones médicas activas en su historia clínica.
              </p>
              <button className="btn btn-primary btn-sm" onClick={() => setIsNewRecetaOpen(true)}>
                <Icon name="plus" size="sm" />
                <span>Emitir Primera Receta</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 3: DIAGNÓSTICOS CIE-10 */}
      {activeTab === 'diagnosticos' && (
        <div className="hc-tab-content">
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Código CIE-10</th>
                  <th>Descripción Diagnóstica</th>
                  <th>Pieza Dental / Arcada</th>
                  <th>Fecha de Detección</th>
                  <th>Estado Clínico</th>
                </tr>
              </thead>
              <tbody>
                {currentDiagnosticos.length > 0 ? (
                  currentDiagnosticos.map((dx) => (
                    <tr key={dx.id}>
                      <td>
                        <span className="badge info" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          {dx.codigoCie}
                        </span>
                      </td>
                      <td><b>{dx.descripcion}</b></td>
                      <td>{dx.pieza}</td>
                      <td>{dx.fecha}</td>
                      <td>
                        <span className={`badge ${dx.estado === 'Resuelto' ? 'ok' : dx.estado === 'En Tratamiento' ? 'warn' : 'info'}`}>
                          {dx.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      Sin diagnósticos registrados para este paciente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PESTAÑA 4: ANTECEDENTES & CONSENTIMIENTOS */}
      {activeTab === 'antecedentes' && (
        <div className="hc-tab-content">
          <div className="grid g2">
            <div className="card card-pad">
              <h3 style={{ margin: '0 0 14px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="alert" size="sm" style={{ color: 'var(--danger)' }} />
                <span>Alergias & Factores de Riesgo Clínico</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="badge danger">Alérgica a Penicilina</span>
                  <span className="badge warn">Hipersensibilidad Dentinaria</span>
                  <span className="badge">Tolerancia normal a Lidocaína</span>
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Advertencia para el operador: No prescribir derivados betalactámicos (Amoxicilina, Ampicilina). Utilizar Clindamicina o Claritromicina en caso de infección activa.
                </p>
              </div>
            </div>

            <div className="card card-pad">
              <h3 style={{ margin: '0 0 14px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="shield" size="sm" style={{ color: 'var(--primary)' }} />
                <span>Consentimientos Informados Digitales</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="list-row" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div className="grow">
                    <div style={{ fontSize: '12.5px', fontWeight: 600 }}>Consentimiento Tratamiento de Ortodoncia Fija</div>
                    <div className="sub">Firmado digitalmente el 15/08/2026 · Vigente</div>
                  </div>
                  <span className="badge ok">Firmado</span>
                </div>
                <div className="list-row" style={{ padding: '8px 0' }}>
                  <div className="grow">
                    <div style={{ fontSize: '12.5px', fontWeight: 600 }}>Protección de Datos Personales (Ley N° 29733)</div>
                    <div className="sub">Aceptación y autorización clínica de historia médica</div>
                  </div>
                  <span className="badge ok">Firmado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          5. MODALES INTERACTIVOS: NUEVA EVOLUCIÓN SOAP & NUEVA RECETA
          ========================================================= */}

      {/* Modal Nueva Evolución SOAP */}
      {isNewEvoOpen && (
        <div className="modal-overlay" onClick={() => setIsNewEvoOpen(false)}>
          <div className="modal wide" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <div className="modal-head">
              <h3>
                <Icon name="clipboard" size="lg" style={{ color: 'var(--primary)' }} />
                <span>Registrar Nota de Evolución Clínica (SOAP)</span>
              </h3>
              <button className="icon-btn" onClick={() => setIsNewEvoOpen(false)}>
                <Icon name="x" />
              </button>
            </div>

            <form onSubmit={handleCreateEvolucion}>
              <div className="modal-body" style={{ maxHeight: 'calc(88vh - 140px)', overflowY: 'auto' }}>
                <div className="form-grid">
                  <div className="field full">
                    <label>Paciente / Expediente</label>
                    <input
                      className="input"
                      value={`HC-${currentPaciente?.id.toString().padStart(5, '0')} — ${currentPaciente?.nom}`}
                      disabled
                    />
                  </div>

                  <div className="field">
                    <label>Odontólogo Responsable</label>
                    <select
                      className="select"
                      value={newEvoDoctor}
                      onChange={(e) => setNewEvoDoctor(e.target.value)}
                    >
                      {doctors.map((d) => (
                        <option key={d.id} value={d.nombre}>
                          {d.nombre} ({d.cop})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label>Motivo de Consulta de la Sesión</label>
                    <input
                      className="input"
                      value={newEvoMotivo}
                      onChange={(e) => setNewEvoMotivo(e.target.value)}
                      placeholder="Ej: Control de ortodoncia / Obturación pieza 26"
                      required
                    />
                  </div>

                  <div className="field full">
                    <label style={{ color: '#0284c7' }}><b>[S] Subjetivo:</b> Síntomas referidos por el paciente</label>
                    <textarea
                      className="textarea"
                      value={newEvoSubjetivo}
                      onChange={(e) => setNewEvoSubjetivo(e.target.value)}
                      placeholder="Paciente refiere que ya no siente dolor al frío, masticación normal..."
                      rows={2}
                      required
                    />
                  </div>

                  <div className="field full">
                    <label style={{ color: '#059669' }}><b>[O] Objetivo:</b> Hallazgos clínicos del examen intraoral</label>
                    <textarea
                      className="textarea"
                      value={newEvoObjetivo}
                      onChange={(e) => setNewEvoObjetivo(e.target.value)}
                      placeholder="Arcadas alineadas, resina íntegra, encías sin sangrado..."
                      rows={2}
                      required
                    />
                  </div>

                  <div className="field full">
                    <label style={{ color: '#d97706' }}><b>[A] Apreciación:</b> Diagnóstico estomatológico</label>
                    <textarea
                      className="textarea"
                      value={newEvoApreciacion}
                      onChange={(e) => setNewEvoApreciacion(e.target.value)}
                      placeholder="Evolución clínica favorable, oclusión estable..."
                      rows={2}
                      required
                    />
                  </div>

                  <div className="field full">
                    <label style={{ color: '#7c3aed' }}><b>[P] Plan:</b> Procedimiento efectuado y próxima cita</label>
                    <textarea
                      className="textarea"
                      value={newEvoPlan}
                      onChange={(e) => setNewEvoPlan(e.target.value)}
                      placeholder="Se realizó profilaxis y ajuste. Próximo control en 30 días..."
                      rows={2}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-foot">
                <button type="button" className="btn" onClick={() => setIsNewEvoOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Icon name="check" size="sm" />
                  <span>Guardar Nota Clínica</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Emitir Receta Médica */}
      {isNewRecetaOpen && (
        <div className="modal-overlay" onClick={() => setIsNewRecetaOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-head">
              <h3>
                <Icon name="file" size="lg" style={{ color: 'var(--primary)' }} />
                <span>Emitir Prescripción Médica Oficial</span>
              </h3>
              <button className="icon-btn" onClick={() => setIsNewRecetaOpen(false)}>
                <Icon name="x" />
              </button>
            </div>

            <form onSubmit={handleCreateReceta}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="field full">
                    <label>Paciente</label>
                    <input className="input" value={currentPaciente?.nom} disabled />
                  </div>

                  <div className="field full">
                    <label>Odontólogo Prescriptor</label>
                    <select
                      className="select"
                      value={newRecetaDoctor}
                      onChange={(e) => setNewRecetaDoctor(e.target.value)}
                    >
                      {doctors.map((d) => (
                        <option key={d.id} value={d.nombre}>
                          {d.nombre} ({d.cop})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field full">
                    <label>Nombre del Medicamento & Concentración</label>
                    <input
                      className="input"
                      value={newMedNombre}
                      onChange={(e) => setNewMedNombre(e.target.value)}
                      placeholder="Ej: Amoxicilina 500mg cápsulas"
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Dosis</label>
                    <input
                      className="input"
                      value={newMedDosis}
                      onChange={(e) => setNewMedDosis(e.target.value)}
                      placeholder="Ej: 1 cápsula vía oral"
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Frecuencia</label>
                    <input
                      className="input"
                      value={newMedFrecuencia}
                      onChange={(e) => setNewMedFrecuencia(e.target.value)}
                      placeholder="Ej: Cada 8 horas"
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Duración</label>
                    <input
                      className="input"
                      value={newMedDuracion}
                      onChange={(e) => setNewMedDuracion(e.target.value)}
                      placeholder="Ej: Por 7 días"
                      required
                    />
                  </div>

                  <div className="field full">
                    <label>Indicaciones Adicionales</label>
                    <input
                      className="input"
                      value={newMedIndicacion}
                      onChange={(e) => setNewMedIndicacion(e.target.value)}
                      placeholder="Ej: Tomar con abundantes líquidos tras los alimentos"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-foot">
                <button type="button" className="btn" onClick={() => setIsNewRecetaOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Icon name="check" size="sm" />
                  <span>Emitir Receta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
