import React, { useState } from 'react';
import { Icon } from '../../shared/components/Icon';
import { Paciente, formatMoney } from '../../shared/types/dental.types';
import './PacientesModule.css';

interface FichaPacienteModalProps {
  paciente: Paciente | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenHistoria?: (pacienteId: number) => void;
  onOpenOdontograma?: (pacienteId: number) => void;
  onEditPaciente?: (paciente: Paciente) => void;
  onScheduleCita?: (pacienteNom: string) => void;
}

const AVATAR_COLORS = ['avatar-blue', 'avatar-emerald', 'avatar-purple', 'avatar-teal', 'avatar-amber'];
const getAvatarClass = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

export const FichaPacienteModal: React.FC<FichaPacienteModalProps> = ({
  paciente,
  isOpen,
  onClose,
  onOpenHistoria,
  onOpenOdontograma,
  onEditPaciente,
  onScheduleCita,
}) => {
  const [activeTab, setActiveTab] = useState<'citas' | 'trat' | 'pagos' | 'datos'>('citas');

  if (!isOpen || !paciente) return null;

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
    onClose();
    if (onOpenHistoria) {
      onOpenHistoria(paciente.id);
    } else if (onOpenOdontograma) {
      onOpenOdontograma(paciente.id);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal wide pf-modal-shell" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '980px' }}>
        {/* =========================================================
            1. CABECERA DEL MODAL - PERFIL Y CUENTA ADMINISTRATIVA
            ========================================================= */}
        <div className="modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="pf-modal-head-ic">
              <Icon name="user" size="lg" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Perfil y Cuenta del Paciente</span>
                <span className="pf-hc-badge">HC-{paciente.id.toString().padStart(5, '0')}</span>
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Filiación, contactos, historial de citas, presupuestos y cobranzas
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleGoToHistoria}
              title="Abrir la Historia Clínica oficial (Odontograma 3D, notas SOAP y recetas)"
            >
              <Icon name="file" size="sm" />
              <span>Abrir Historia Clínica</span>
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handlePrint}
              title="Imprimir resumen de cuenta y citas del paciente"
            >
              <Icon name="printer" size="sm" />
              <span>Imprimir</span>
            </button>
            <button className="icon-btn" onClick={onClose} aria-label="Cerrar perfil">
              <Icon name="x" />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ maxHeight: 'calc(90vh - 140px)', overflowY: 'auto', padding: '20px 24px' }}>
          {/* =========================================================
              2. TARJETA DE IDENTIFICACIÓN DEL PACIENTE (HERO)
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
                    title="Enviar mensaje por WhatsApp"
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

          {/* =========================================================
              3. BANNER INFORMATIVO: ENLACE A HISTORIA CLÍNICA OFICIAL
              ========================================================= */}
          <div className="pf-clinical-banner">
            <div className="pf-clinical-banner-text">
              <Icon name="tooth" size="sm" style={{ color: 'var(--primary)' }} />
              <span>
                El <b>Odontograma Dental (FDI)</b>, evoluciones <b>SOAP</b>, <b>recetario médico</b> y diagnósticos <b>CIE-10</b> se encuentran en la <b>Historia Clínica Oficial</b>.
              </span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleGoToHistoria}
              title="Abrir historia clínica del paciente"
            >
              <Icon name="file" size="sm" />
              <span>Ir a Historia Clínica</span>
            </button>
          </div>

          {/* Acciones Rápidas del Encabezado */}
          <div className="pf-quick-actions-bar">
            {onEditPaciente && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onEditPaciente(paciente)}
              >
                <Icon name="edit" size="sm" />
                <span>Editar Datos de Contacto</span>
              </button>
            )}
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleGoToHistoria}
            >
              <Icon name="tooth" size="sm" style={{ color: 'var(--primary)' }} />
              <span>Ver Odontograma & Notas SOAP</span>
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (onScheduleCita) {
                  onScheduleCita(paciente.nom);
                } else {
                  setActiveTab('citas');
                }
              }}
            >
              <Icon name="calendar" size="sm" />
              <span>Agendar Nueva Cita</span>
            </button>
          </div>

          {/* =========================================================
              4. PESTAÑAS ADMINISTRATIVAS Y DE CUENTA
              ========================================================= */}
          <div className="tabs pf-tabs-bar">
            <button
              className={`tab ${activeTab === 'citas' ? 'on' : ''}`}
              onClick={() => setActiveTab('citas')}
            >
              <Icon name="calendar" size="sm" />
              <span>Citas & Controles</span>
              <span className="n">3</span>
            </button>
            <button
              className={`tab ${activeTab === 'trat' ? 'on' : ''}`}
              onClick={() => setActiveTab('trat')}
            >
              <Icon name="clipboard" size="sm" />
              <span>Tratamientos & Presupuesto</span>
              <span className="n">4</span>
            </button>
            <button
              className={`tab ${activeTab === 'pagos' ? 'on' : ''}`}
              onClick={() => setActiveTab('pagos')}
            >
              <Icon name="card" size="sm" />
              <span>Estado de Cuenta & Pagos</span>
              <span className="n">4</span>
            </button>
            <button
              className={`tab ${activeTab === 'datos' ? 'on' : ''}`}
              onClick={() => setActiveTab('datos')}
            >
              <Icon name="user" size="sm" />
              <span>Filiación & Facturación</span>
            </button>
          </div>

          {/* =========================================================
              5. CONTENIDO DE LAS PESTAÑAS ADMINISTRATIVAS
              ========================================================= */}

          {/* TAB 1: CITAS & CONTROLES */}
          {activeTab === 'citas' && (
            <div className="tabpane on">
              <div className="pf-section-intro">
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text)' }}>
                    Historial de Citas y Sesiones del Paciente
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                    Registro cronológico de asistencias, box odontológico y profesional asignado.
                  </p>
                </div>
              </div>

              <div className="table-wrap" style={{ marginTop: '12px' }}>
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
            <div className="tabpane on">
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

              <div className="table-wrap" style={{ marginTop: '12px' }}>
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
            <div className="tabpane on">
              <div className="pf-balance-card">
                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                    Total Facturado a la Fecha
                  </span>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginTop: '2px' }}>
                    S/ 2,160.00
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--ok)', fontWeight: 600 }}>
                    S/ 1,680.00 pagados
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

          {/* TAB 4: FILIACIÓN & DATOS DE FACTURACIÓN */}
          {activeTab === 'datos' && (
            <div className="tabpane on">
              <div className="pf-section-intro">
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text)' }}>
                    Ficha de Filiación, Contacto y Datos Fiscales
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                    Información personal de contacto para notificaciones de citas y emisión de comprobantes electrónicos.
                  </p>
                </div>
              </div>

              <div className="grid g2" style={{ marginTop: '14px' }}>
                <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon name="user" size="sm" style={{ color: 'var(--primary)' }} />
                    <span>Datos Personales de Filiación</span>
                  </h4>
                  <div className="pf-meta-item">
                    <span style={{ width: '130px', color: 'var(--text-muted)', fontSize: '12px' }}>Nombre completo:</span>
                    <b style={{ color: 'var(--text)' }}>{paciente.nom}</b>
                  </div>
                  <div className="pf-meta-item">
                    <span style={{ width: '130px', color: 'var(--text-muted)', fontSize: '12px' }}>Documento ({paciente.tipo}):</span>
                    <b>{paciente.doc}</b>
                  </div>
                  <div className="pf-meta-item">
                    <span style={{ width: '130px', color: 'var(--text-muted)', fontSize: '12px' }}>Edad / Sexo:</span>
                    <span>{paciente.edad} años ({paciente.sex === 'F' ? 'Mujer' : 'Varón'})</span>
                  </div>
                  <div className="pf-meta-item">
                    <span style={{ width: '130px', color: 'var(--text-muted)', fontSize: '12px' }}>Estado en el sistema:</span>
                    <span className={`badge ${paciente.est === 'Activo' ? 'ok' : isMoroso ? 'warn' : ''}`}>
                      {paciente.est}
                    </span>
                  </div>
                </div>

                <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon name="phone" size="sm" style={{ color: 'var(--ok)' }} />
                    <span>Canales de Comunicación & Envío</span>
                  </h4>
                  <div className="pf-meta-item">
                    <span style={{ width: '130px', color: 'var(--text-muted)', fontSize: '12px' }}>WhatsApp / Móvil:</span>
                    <a href={waUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--ok)', fontWeight: 700 }}>
                      {paciente.tel} (Directo)
                    </a>
                  </div>
                  <div className="pf-meta-item">
                    <span style={{ width: '130px', color: 'var(--text-muted)', fontSize: '12px' }}>Correo Electrónico:</span>
                    <a href={`mailto:${paciente.mail}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                      {paciente.mail}
                    </a>
                  </div>
                  <div className="pf-meta-item">
                    <span style={{ width: '130px', color: 'var(--text-muted)', fontSize: '12px' }}>Dirección fiscal:</span>
                    <span style={{ color: 'var(--text)' }}>{paciente.dir}</span>
                  </div>
                  <div className="pf-meta-item">
                    <span style={{ width: '130px', color: 'var(--text-muted)', fontSize: '12px' }}>Etiquetas / Tags:</span>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {paciente.tags.map((t, i) => (
                        <span key={i} className="paciente-tag-pill">#{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="modal-foot" style={{ justifyContent: 'space-between' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Registro administrativo conforme a Ley de Protección de Datos Personales N° 29733
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn" onClick={onClose}>
              Cerrar
            </button>
            <button className="btn btn-primary" onClick={handleGoToHistoria}>
              <Icon name="file" size="sm" />
              <span>Abrir Historia Clínica Oficial</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
