import React, { useState } from 'react';
import { Icon } from '../../shared/components/Icon';
import './SoporteModule.css';

export interface TicketSoporte {
  id: string;
  asunto: string;
  categoria: 'SUNAT' | 'Agenda' | 'Odontograma' | 'Hardware / Impresoras' | 'Acceso y Cuentas';
  prioridad: 'Crítica' | 'Alta' | 'Media' | 'Baja';
  estado: 'Abierto' | 'En Proceso' | 'Resuelto' | 'Cerrado';
  fecha: string;
  hora: string;
  solicitante: string;
  detalle: string;
  respuestaTecnica?: string;
}

interface SoporteModuleProps {
  onShowToast?: (msg: string) => void;
}

export const SoporteModule: React.FC<SoporteModuleProps> = ({ onShowToast }) => {
  const [tickets, setTickets] = useState<TicketSoporte[]>([
    {
      id: 'TCK-1082',
      asunto: 'Sincronización de token OSE / SUNAT para comprobantes electrónicos',
      categoria: 'SUNAT',
      prioridad: 'Alta',
      estado: 'En Proceso',
      fecha: '2026-10-24',
      hora: '14:20',
      solicitante: 'Dr. Diego Mendoza',
      detalle: 'Al emitir boletas B001 en caja sale advertencia de latencia en la pasarela SUNAT.',
      respuestaTecnica: 'Ingeniería actualizó el endpoint secundario de contingencia. Pruebas exitosas.',
    },
    {
      id: 'TCK-1079',
      asunto: 'Configuración de impresora térmica para tickets de cita en Box 3',
      categoria: 'Hardware / Impresoras',
      prioridad: 'Media',
      estado: 'Resuelto',
      fecha: '2026-10-23',
      hora: '11:05',
      solicitante: 'Dra. Patricia Silva',
      detalle: 'La impresora EPSON TM-T20 no cortaba automáticamente el papel al finalizar turno.',
      respuestaTecnica: 'Driver ESC/POS recalibrado por control remoto.',
    },
    {
      id: 'TCK-1065',
      asunto: 'Exportación masiva de historias clínicas a PDF para auditoría legal',
      categoria: 'Acceso y Cuentas',
      prioridad: 'Media',
      estado: 'Resuelto',
      fecha: '2026-10-21',
      hora: '09:30',
      solicitante: 'Lic. Roxana Díaz',
      detalle: 'Requerimiento de carpeta consolidada con antecedentes y consentimientos firmados.',
      respuestaTecnica: 'Módulo de auditoría forense habilitado con exportación certificada.',
    },
  ]);

  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulario de nuevo ticket
  const [formData, setFormData] = useState({
    asunto: '',
    categoria: 'SUNAT' as TicketSoporte['categoria'],
    prioridad: 'Media' as TicketSoporte['prioridad'],
    detalle: '',
  });

  const filteredTickets = tickets.filter((t) => {
    const matchesEstado = filterEstado === 'todos' || t.estado === filterEstado;
    const matchesSearch =
      t.asunto.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.categoria.toLowerCase().includes(search.toLowerCase());
    return matchesEstado && matchesSearch;
  });

  const countAbiertos = tickets.filter((t) => t.estado === 'Abierto' || t.estado === 'En Proceso').length;
  const countResueltos = tickets.filter((t) => t.estado === 'Resuelto' || t.estado === 'Cerrado').length;

  const getPrioridadBadgeClass = (p: TicketSoporte['prioridad']) => {
    switch (p) {
      case 'Crítica':
        return 'danger';
      case 'Alta':
        return 'warn';
      case 'Media':
        return 'info';
      default:
        return 'muted';
    }
  };

  const getEstadoBadgeClass = (e: TicketSoporte['estado']) => {
    switch (e) {
      case 'Abierto':
        return 'warn';
      case 'En Proceso':
        return 'info';
      case 'Resuelto':
        return 'ok';
      case 'Cerrado':
        return 'muted';
      default:
        return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.asunto.trim() || !formData.detalle.trim()) {
      onShowToast?.('Por favor completa todos los campos del ticket');
      return;
    }

    const nextId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: TicketSoporte = {
      id: nextId,
      asunto: formData.asunto,
      categoria: formData.categoria,
      prioridad: formData.prioridad,
      estado: 'Abierto',
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      solicitante: 'Dr. Diego Mendoza (Administrador)',
      detalle: formData.detalle,
    };

    setTickets([newTicket, ...tickets]);
    setIsModalOpen(false);
    setFormData({
      asunto: '',
      categoria: 'SUNAT',
      prioridad: 'Media',
      detalle: '',
    });
    onShowToast?.(`Ticket de soporte ${nextId} creado. Un ingeniero atenderá tu solicitud.`);
  };

  return (
    <section className="soporte-module">
      {/* Banner de Módulo con Formato Empresarial */}
      <div className="module-banner">
        <div className="module-banner-content">
          <div className="module-banner-badge">
            <span className="hero-pulse" />
            <span>Centro de Asistencia & Soporte 24/7</span>
          </div>
          <h1 className="module-banner-title">
            <Icon name="headset" size="lg" style={{ color: 'var(--primary-2)' }} />
            <span>Soporte Técnico y Mesa de Ayuda — Dental FC</span>
          </h1>
          <p className="module-banner-desc">
            Atención preferencial para la sede clínica, monitoreo de servicios en la nube, contingencia SUNAT y resolución de incidencias.
          </p>
          <div className="module-banner-pills">
            <div className="module-banner-pill">
              <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
              <span>SLA Plan Pro: Respuesta en menos de 2h</span>
            </div>
            <div className="module-banner-pill">
              <Icon name="shield" size="sm" style={{ color: 'var(--primary-2)' }} />
              <span>Infraestructura 99.98% Operativa</span>
            </div>
          </div>
        </div>
        <div className="module-banner-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Icon name="plus" size="sm" />
            <span>Crear Ticket de Soporte</span>
          </button>
        </div>
      </div>

      {/* 4 KPIs de Soporte */}
      <div className="grid g4">
        <div className="card kpi">
          <div className="kpi-ic warn">
            <Icon name="headset" size="lg" />
          </div>
          <div className="kpi-details">
            <div className="v">{countAbiertos}</div>
            <div className="l">Tickets en Gestión</div>
            <div className="t up">Atención en curso</div>
          </div>
        </div>

        <div className="card kpi">
          <div className="kpi-ic ok">
            <Icon name="clock" size="lg" />
          </div>
          <div className="kpi-details">
            <div className="v">18 min</div>
            <div className="l">Tiempo Medio de Respuesta</div>
            <div className="t up">SLA cumplido 100%</div>
          </div>
        </div>

        <div className="card kpi">
          <div className="kpi-ic">
            <Icon name="check" size="lg" />
          </div>
          <div className="kpi-details">
            <div className="v">{countResueltos}</div>
            <div className="l">Tickets Resueltos</div>
            <div className="t up">Casos cerrados con éxito</div>
          </div>
        </div>

        <div className="card kpi">
          <div className="kpi-ic">
            <Icon name="shield" size="lg" />
          </div>
          <div className="kpi-details">
            <div className="v">99.98%</div>
            <div className="l">Disponibilidad del Sistema</div>
            <div className="t up">Servidores en alta disponibilidad</div>
          </div>
        </div>
      </div>

      {/* Layout Principal de 2 Columnas */}
      <div className="soporte-grid mt">
        {/* Columna Izquierda: Tickets de Soporte */}
        <div className="card">
          <div className="card-head">
            <h3>
              <Icon name="clipboard" />
              <span>Tickets de Soporte Registrados</span>
            </h3>
            <span className="sub">{filteredTickets.length} solicitudes</span>
          </div>

          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search" style={{ flex: 1, minWidth: '220px' }}>
              <Icon name="search" size="sm" />
              <input
                className="input"
                placeholder="Buscar ticket por código o palabra clave..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Estado:</span>
              <select
                className="select"
                style={{ width: 'auto', minWidth: '130px' }}
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="Abierto">Abiertos</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Resuelto">Resueltos</option>
              </select>
            </div>
          </div>

          <div>
            {filteredTickets.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No se encontraron tickets con el criterio seleccionado.
              </div>
            ) : (
              filteredTickets.map((t) => (
                <div key={t.id} className="ticket-item">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="ticket-code">{t.id}</span>
                      <span className={`badge ${getPrioridadBadgeClass(t.prioridad)}`}>
                        {t.prioridad}
                      </span>
                      <span className="tag" style={{ fontSize: '10.5px', padding: '1px 6px' }}>
                        {t.categoria}
                      </span>
                    </div>
                    <div className="ticket-title">{t.asunto}</div>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-soft)', margin: '4px 0 8px', lineHeight: 1.45 }}>
                      {t.detalle}
                    </p>
                    {t.respuestaTecnica && (
                      <div
                        style={{
                          background: 'var(--surface-2)',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          borderLeft: '3px solid var(--primary)',
                          fontSize: '12px',
                          color: 'var(--text)',
                          marginBottom: '8px',
                        }}
                      >
                        <b>Respuesta Técnica:</b> {t.respuestaTecnica}
                      </div>
                    )}
                    <div className="ticket-meta">
                      <span>Por: {t.solicitante}</span>
                      <span>·</span>
                      <span>{t.fecha} {t.hora}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span className={`badge ${getEstadoBadgeClass(t.estado)}`}>
                      {t.estado}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Columna Derecha: Canales Directos y Diagnóstico de Servicios */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Tarjeta de Canales de Contacto */}
          <div className="card">
            <div className="card-head">
              <h3>
                <Icon name="phone" />
                <span>Atención Directa para la Clínica</span>
              </h3>
            </div>
            <div className="card-body">
              <div className="contact-card-box">
                <div className="contact-channel-row">
                  <Icon name="message" style={{ color: 'var(--ok)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                      WhatsApp Business de Guardia
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      +51 987 654 321 (Respuesta inmediata)
                    </div>
                  </div>
                  <a
                    href="https://wa.me/51987654321"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm"
                    style={{ fontSize: '11.5px' }}
                  >
                    <span>Contactar</span>
                  </a>
                </div>

                <div className="contact-channel-row">
                  <Icon name="phone" style={{ color: 'var(--primary-2)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                      Central Telefónica Dental FJL
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      (01) 445 8890 — Anexo 4 (Sistemas)
                    </div>
                  </div>
                </div>

                <div className="contact-channel-row">
                  <Icon name="mail" style={{ color: 'var(--text-soft)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                      Correo de Ingeniería y Sistemas
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      soporte@dentalfjl.pe
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Estado del Sistema y Servicios */}
          <div className="card">
            <div className="card-head">
              <h3>
                <Icon name="shield" />
                <span>Diagnóstico del Sistema ERP</span>
              </h3>
              <span className="badge ok">100% Operativo</span>
            </div>
            <div className="card-body">
              <div className="service-health-list">
                <div className="service-health-item">
                  <div className="service-health-name">
                    <span className="live-dot" />
                    <span>Facturación Electrónica SUNAT</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Activo · 84ms
                  </span>
                </div>

                <div className="service-health-item">
                  <div className="service-health-name">
                    <span className="live-dot" />
                    <span>Base de Datos Multi-Tenant MySQL</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Activo · 12ms
                  </span>
                </div>

                <div className="service-health-item">
                  <div className="service-health-name">
                    <span className="live-dot" />
                    <span>Respaldo Automático en Nube</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Hoy 03:00 AM
                  </span>
                </div>

                <div className="service-health-item">
                  <div className="service-health-name">
                    <span className="live-dot" />
                    <span>Certificado SSL y Cifrado Médico</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Válido hasta Dic 2027
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Crear Ticket de Soporte */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>
                <Icon name="headset" />
                <span>Reportar Incidencia o Solicitud de Soporte</span>
              </h3>
              <button className="act" onClick={() => setIsModalOpen(false)}>
                <Icon name="x" size="sm" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="field full">
                    <label>Asunto del Requerimiento o Problema:</label>
                    <input
                      className="input"
                      placeholder="Ej. Problema con sincronización de comprobante SUNAT"
                      value={formData.asunto}
                      onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Categoría del Módulo:</label>
                    <select
                      className="select"
                      value={formData.categoria}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          categoria: e.target.value as TicketSoporte['categoria'],
                        })
                      }
                    >
                      <option value="SUNAT">Facturación SUNAT / OSE</option>
                      <option value="Agenda">Agenda y Citas</option>
                      <option value="Odontograma">Odontograma y Ficha Clínica</option>
                      <option value="Hardware / Impresoras">Hardware / Impresoras / Sillones</option>
                      <option value="Acceso y Cuentas">Acceso, Roles y Cuentas</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Nivel de Prioridad:</label>
                    <select
                      className="select"
                      value={formData.prioridad}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          prioridad: e.target.value as TicketSoporte['prioridad'],
                        })
                      }
                    >
                      <option value="Baja">Baja (Consulta general)</option>
                      <option value="Media">Media (Atención estándar)</option>
                      <option value="Alta">Alta (Afecta operaciones)</option>
                      <option value="Crítica">Crítica (Bloqueo total de sede)</option>
                    </select>
                  </div>
                  <div className="field full">
                    <label>Descripción detallada de la incidencia:</label>
                    <textarea
                      className="textarea"
                      placeholder="Indica qué ocurrió, mensajes de error en pantalla y pasos que realizaste..."
                      value={formData.detalle}
                      onChange={(e) => setFormData({ ...formData, detalle: e.target.value })}
                      required
                      rows={4}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-foot">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Icon name="save" size="sm" />
                  <span>Enviar Ticket de Soporte</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
