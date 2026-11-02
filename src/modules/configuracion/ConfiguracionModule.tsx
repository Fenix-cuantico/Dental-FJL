import React, { useState } from 'react';
import { Icon } from '../../shared/components/Icon';
import { ExcelImportModule } from '../excel/ExcelImportModule';
import { TenantsModule } from '../tenants/TenantsModule';
import './ConfiguracionModule.css';

interface ConfiguracionModuleProps {
  onShowToast?: (msg: string) => void;
  onNavigate?: (view: string) => void;
}

export const ConfiguracionModule: React.FC<ConfiguracionModuleProps> = ({ onShowToast, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'sunat' | 'notif' | 'horarios' | 'excel' | 'tenants'>('general');

  // Form states
  const [formData, setFormData] = useState({
    nombreComercial: 'Dental FC',
    razonSocial: 'DENTAL FJL S.A.C.',
    ruc: '20601234567',
    telefono: '01 445 8890',
    whatsapp: '+51 987 654 321',
    email: 'contacto@dentalfjl.pe',
    direccion: 'Av. Larco 456, Int. 302, Miraflores, Lima',
    zonaHoraria: 'America/Lima (UTC-05:00)',
    moneda: 'PEN',
    serieBoleta: 'B001',
    serieFactura: 'F001',
    serieNotaCredito: 'NC01',
    tokenSunat: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDYwMTIzNDU2NyJ9',
    autoSunatEmail: true,
    whatsappReminder: true,
    tabletConsent: true,
    stockAlert: true,
    dailyDigest: true,
    duracionCita: '45',
  });

  const handleToggle = (key: keyof typeof formData) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onShowToast?.('Configuración institucional de la clínica guardada correctamente');
  };

  return (
    <section className="configuracion-module">
      {/* Banner de Módulo con Fondo Ambiental */}
      <div className="module-banner">
        <div className="module-banner-content">
          <div className="module-banner-badge">
            <span className="hero-pulse" />
            <span>Ajustes Globales del Sistema</span>
          </div>
          <h1 className="module-banner-title">
            <Icon name="settings" size="lg" style={{ color: 'var(--primary-2)' }} />
            <span>Configuración de Sede y Parámetros — Dental FC</span>
          </h1>
          <p className="module-banner-desc">
            Ajustes institucionales, facturación electrónica SUNAT, automatizaciones de WhatsApp y consultorios.
          </p>
          <div className="module-banner-pills">
            <div className="module-banner-pill">
              <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
              <span>Sede Central Surco</span>
            </div>
            <div className="module-banner-pill">
              <Icon name="shield" size="sm" style={{ color: 'var(--primary-2)' }} />
              <span>Conexión SUNAT Operativa</span>
            </div>
          </div>
        </div>
        <div className="module-banner-actions">
          <button className="btn" onClick={() => onShowToast?.('Parámetros restaurados al valor de fábrica')} style={{ background: 'var(--surface)' }}>
            <Icon name="eraser" size="sm" />
            <span>Descartar</span>
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Icon name="save" size="sm" />
            <span>Guardar Parámetros</span>
          </button>
        </div>
      </div>

      {/* Tabs de Navegación */}
      <div className="config-nav-tabs">
        <button
          type="button"
          className={`config-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <Icon name="building" size="sm" />
          <span>Datos de la Clínica & Sede</span>
        </button>
        <button
          type="button"
          className={`config-tab-btn ${activeTab === 'sunat' ? 'active' : ''}`}
          onClick={() => setActiveTab('sunat')}
        >
          <Icon name="file" size="sm" />
          <span>Facturación Electrónica SUNAT</span>
        </button>
        <button
          type="button"
          className={`config-tab-btn ${activeTab === 'notif' ? 'active' : ''}`}
          onClick={() => setActiveTab('notif')}
        >
          <Icon name="message" size="sm" />
          <span>Automatización & WhatsApp</span>
        </button>
        <button
          type="button"
          className={`config-tab-btn ${activeTab === 'horarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('horarios')}
        >
          <Icon name="clock" size="sm" />
          <span>Horarios y Boxes Clínicos</span>
        </button>
        <button
          type="button"
          className={`config-tab-btn ${activeTab === 'excel' ? 'active' : ''}`}
          onClick={() => setActiveTab('excel')}
        >
          <Icon name="database" size="sm" />
          <span>Portear Excel a BD</span>
        </button>
        <button
          type="button"
          className={`config-tab-btn ${activeTab === 'tenants' ? 'active' : ''}`}
          onClick={() => setActiveTab('tenants')}
        >
          <Icon name="layers" size="sm" />
          <span>Gestión de Tenants</span>
        </button>
      </div>

      {/* CONTENIDO: TAB 1 - GENERAL */}
      {activeTab === 'general' && (
        <div className="grid g2">
          <div className="config-section-card">
            <div className="config-section-title">
              <Icon name="building" style={{ color: 'var(--primary-2)' }} />
              <span>Identidad Institucional y Fiscal</span>
            </div>
            <p className="config-section-sub">
              Estos datos aparecerán en los encabezados de recetas médicas, odontogramas y presupuestos emitidos.
            </p>

            <div className="form-grid">
              <div className="field full">
                <label>Nombre Comercial de la Clínica</label>
                <input
                  type="text"
                  className="input"
                  name="nombreComercial"
                  value={formData.nombreComercial}
                  onChange={handleChange}
                />
              </div>

              <div className="field full">
                <label>Razón Social (Personería Jurídica)</label>
                <input
                  type="text"
                  className="input"
                  name="razonSocial"
                  value={formData.razonSocial}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>RUC (11 Dígitos)</label>
                <input
                  type="text"
                  className="input"
                  name="ruc"
                  value={formData.ruc}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Teléfono Fijo / Central</label>
                <input
                  type="text"
                  className="input"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>WhatsApp Oficial de Citas</label>
                <input
                  type="text"
                  className="input"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Correo Electrónico de Contacto</label>
                <input
                  type="email"
                  className="input"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="field full">
                <label>Dirección Física de la Sede</label>
                <input
                  type="text"
                  className="input"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="config-section-card">
            <div className="config-section-title">
              <Icon name="grid" style={{ color: 'var(--primary-2)' }} />
              <span>Parámetros Regionales y Moneda</span>
            </div>
            <p className="config-section-sub">
              Configura el huso horario para el agendamiento y la divisa contable de cobros.
            </p>

            <div className="form-grid">
              <div className="field full">
                <label>Zona Horaria del Servidor</label>
                <select
                  className="select"
                  name="zonaHoraria"
                  value={formData.zonaHoraria}
                  onChange={handleChange}
                >
                  <option value="America/Lima (UTC-05:00)">America/Lima (UTC-05:00 - Perú)</option>
                  <option value="America/Bogota (UTC-05:00)">America/Bogota (UTC-05:00 - Colombia)</option>
                  <option value="America/Santiago (UTC-04:00)">America/Santiago (UTC-04:00 - Chile)</option>
                </select>
              </div>

              <div className="field full">
                <label>Moneda de Operación</label>
                <select
                  className="select"
                  name="moneda"
                  value={formData.moneda}
                  onChange={handleChange}
                >
                  <option value="PEN">Sol Peruano (PEN - S/)</option>
                  <option value="USD">Dólar Estadounidense (USD - $)</option>
                </select>
              </div>

              <div className="field full">
                <label>Multi-Tenancy SaaS</label>
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    fontSize: '12.5px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tenant ID Aislado:</span>
                    <b style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-2)' }}>tenant_fjl_001</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Base de Datos:</span>
                    <span style={{ color: 'var(--ok)', fontWeight: 600 }}>MySQL 8.x InnoDB (Particionada)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO: TAB 2 - SUNAT */}
      {activeTab === 'sunat' && (
        <div className="grid g2">
          <div className="config-section-card">
            <div className="config-section-title">
              <Icon name="file" style={{ color: 'var(--primary-2)' }} />
              <span>Conexión con Proveedor de Servicios Electrónicos (PSE)</span>
            </div>
            <p className="config-section-sub">
              Emisión directa de comprobantes de pago autorizados bajo la normativa tributaria peruana SUNAT.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '12px',
                background: 'var(--ok-soft)',
                border: '1px solid var(--ok)',
                marginBottom: '18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="live-dot" />
                <div>
                  <b style={{ color: 'var(--ok)', display: 'block', fontSize: '13.5px' }}>
                    Servicio PSE Homologado Activo
                  </b>
                  <span style={{ fontSize: '12px', color: 'var(--text-soft)' }}>
                    Conexión SOAP/REST con Nubefact / SUNAT OSE operativa
                  </span>
                </div>
              </div>
              <button
                className="btn btn-sm"
                onClick={() => onShowToast?.('Verificación de conexión SUNAT exitosa: Latencia 84ms')}
              >
                Probar Ping
              </button>
            </div>

            <div className="form-grid">
              <div className="field full">
                <label>Token de Autorización API SUNAT (PSE)</label>
                <input
                  type="password"
                  className="input"
                  name="tokenSunat"
                  value={formData.tokenSunat}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Serie Boletas de Venta</label>
                <input
                  type="text"
                  className="input"
                  name="serieBoleta"
                  value={formData.serieBoleta}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Serie Facturas Electrónicas</label>
                <input
                  type="text"
                  className="input"
                  name="serieFactura"
                  value={formData.serieFactura}
                  onChange={handleChange}
                />
              </div>

              <div className="field full">
                <label>Serie Notas de Crédito</label>
                <input
                  type="text"
                  className="input"
                  name="serieNotaCredito"
                  value={formData.serieNotaCredito}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="config-section-card">
            <div className="config-section-title">
              <Icon name="shield" style={{ color: 'var(--primary-2)' }} />
              <span>Certificado Digital Tributario & Automatismos</span>
            </div>
            <p className="config-section-sub">
              Criptografía y despacho inmediato de representaciones impresas (PDF + XML + CDR).
            </p>

            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>Certificado Tributario:</span>
                <span className="badge ok">Válido</span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                Vigencia: Hasta el <b>24 de Octubre de 2027</b> · Emisor: <b>RENIEC Autoridad Certificadora</b>
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="list-row-pro">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Envío automático de XML/CDR al paciente</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Al liquidar un cobro en caja, despachar de inmediato el comprobante electrónico al correo del paciente
                  </div>
                </div>
                <label className="switch-pro">
                  <input
                    type="checkbox"
                    checked={formData.autoSunatEmail}
                    onChange={() => handleToggle('autoSunatEmail')}
                  />
                  <span className="slider" />
                </label>
              </div>

              <div className="list-row-pro">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Modo Contingencia Automático</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Almacena localmente las boletas si SUNAT presenta caídas y las reintenta sincronizar periódicamente
                  </div>
                </div>
                <label className="switch-pro">
                  <input type="checkbox" defaultChecked />
                  <span className="slider" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO: TAB 3 - NOTIFICACIONES & WHATSAPP */}
      {activeTab === 'notif' && (
        <div className="grid g2">
          <div className="config-section-card">
            <div className="config-section-title">
              <Icon name="message" style={{ color: 'var(--ok)' }} />
              <span>Recordatorios Automatizados vía WhatsApp Business Cloud</span>
            </div>
            <p className="config-section-sub">
              Reduce la tasa de ausentismo médico enviando recordatorios inteligentes con botones de confirmación y cancelación.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="list-row-pro">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>Recordatorio automático 24 horas antes</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Envía un mensaje interactivo con el nombre del doctor, fecha, hora y sede de atención
                  </div>
                </div>
                <label className="switch-pro">
                  <input
                    type="checkbox"
                    checked={formData.whatsappReminder}
                    onChange={() => handleToggle('whatsappReminder')}
                  />
                  <span className="slider" />
                </label>
              </div>

              <div className="field full">
                <label>Plantilla de Mensaje WhatsApp</label>
                <textarea
                  className="textarea"
                  rows={4}
                  defaultValue="Hola {paciente}, le recordamos su cita odontológica en Dental FC con el {doctor} el día {fecha} a las {hora}. Para confirmar responda con SI."
                />
                <span className="sub" style={{ fontSize: '11px', marginTop: '4px', display: 'block' }}>
                  Variables permitidas: {'{paciente}'}, {'{doctor}'}, {'{fecha}'}, {'{hora}'}, {'{sede}'}
                </span>
              </div>
            </div>
          </div>

          <div className="config-section-card">
            <div className="config-section-title">
              <Icon name="activity" style={{ color: 'var(--primary-2)' }} />
              <span>Consentimientos Digitales y Alertas Operativas</span>
            </div>
            <p className="config-section-sub">
              Captura firmas digitales y mantén informada a la gerencia de la clínica en tiempo real.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="list-row-pro">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Firma digital en tableta (iPad / Android)</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Habilitar captura de firma biométrica táctil para consentimientos informados en box
                  </div>
                </div>
                <label className="switch-pro">
                  <input
                    type="checkbox"
                    checked={formData.tabletConsent}
                    onChange={() => handleToggle('tabletConsent')}
                  />
                  <span className="slider" />
                </label>
              </div>

              <div className="list-row-pro">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Alerta de Stock Crítico de Insumos</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Notificar de inmediato al asistente y administrador cuando un insumo caiga por debajo del stock mínimo
                  </div>
                </div>
                <label className="switch-pro">
                  <input
                    type="checkbox"
                    checked={formData.stockAlert}
                    onChange={() => handleToggle('stockAlert')}
                  />
                  <span className="slider" />
                </label>
              </div>

              <div className="list-row-pro">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Resumen Diario Nocturno al Director Médico</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Envío de correo a las 20:30 hrs con recaudación de caja, pacientes atendidos y citas reprogramadas
                  </div>
                </div>
                <label className="switch-pro">
                  <input
                    type="checkbox"
                    checked={formData.dailyDigest}
                    onChange={() => handleToggle('dailyDigest')}
                  />
                  <span className="slider" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO: TAB 4 - HORARIOS Y BOXES */}
      {activeTab === 'horarios' && (
        <div className="grid g2">
          <div className="config-section-card">
            <div className="config-section-title">
              <Icon name="clock" style={{ color: 'var(--primary-2)' }} />
              <span>Turnos de Atención de la Sede</span>
            </div>
            <p className="config-section-sub">
              Define los horarios en que los odontólogos podrán recibir reservas en la agenda.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <b>Lunes a Viernes</b>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Jornada continuada</div>
                </div>
                <span className="badge info">08:00 - 20:00</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <b>Sábados</b>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Turno matutino especial</div>
                </div>
                <span className="badge info">09:00 - 15:00</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <b>Domingos y Feriados</b>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Atención exclusiva de urgencias</div>
                </div>
                <span className="badge muted">Guardia Pasiva</span>
              </div>

              <div className="field full" style={{ marginTop: '10px' }}>
                <label>Duración Estándar de Cita Clínica</label>
                <select
                  className="select"
                  name="duracionCita"
                  value={formData.duracionCita}
                  onChange={handleChange}
                >
                  <option value="30">30 Minutos (Control / Revisión rápida)</option>
                  <option value="45">45 Minutos (Tratamiento estándar)</option>
                  <option value="60">60 Minutos (Cirugía / Endodoncia)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="config-section-card">
            <div className="config-section-title">
              <Icon name="layers" style={{ color: 'var(--primary-2)' }} />
              <span>Consultorios Clínicos Habilitados (Boxes)</span>
            </div>
            <p className="config-section-sub">
              Sillones dentales asignados a la sede para la asignación de doctores y pacientes simultáneos.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'var(--primary-soft)',
                      color: 'var(--primary-2)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                    }}
                  >
                    B1
                  </div>
                  <div>
                    <b style={{ fontSize: '14px' }}>Box 1 · Operatoria & Estética</b>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sillón KaVo Primus · Dr. Mendoza</div>
                  </div>
                </div>
                <span className="badge ok">Activo</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'var(--primary-soft)',
                      color: 'var(--primary-2)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                    }}
                  >
                    B2
                  </div>
                  <div>
                    <b style={{ fontSize: '14px' }}>Box 2 · Endodoncia & Microscopía</b>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sillón Gnatus S300 · Dra. Castro</div>
                  </div>
                </div>
                <span className="badge ok">Activo</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'var(--primary-soft)',
                      color: 'var(--primary-2)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                    }}
                  >
                    B3
                  </div>
                  <div>
                    <b style={{ fontSize: '14px' }}>Box 3 · Ortodoncia & Diagnóstico</b>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sillón A-dec 500 · Dr. Ríos</div>
                  </div>
                </div>
                <span className="badge ok">Activo</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'var(--primary-soft)',
                      color: 'var(--primary-2)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                    }}
                  >
                    B4
                  </div>
                  <div>
                    <b style={{ fontSize: '14px' }}>Box 4 · Cirugía & Rayos X Digital</b>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sillón Belmont · Quirófano menor</div>
                  </div>
                </div>
                <span className="badge ok">Activo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO: TAB 5 - PORTEAR EXCEL A BD */}
      {activeTab === 'excel' && <ExcelImportModule onShowToast={onShowToast} />}

      {/* CONTENIDO: TAB 6 - GESTIÓN DE TENANTS */}
      {activeTab === 'tenants' && <TenantsModule onShowToast={onShowToast} />}
    </section>
  );
};
