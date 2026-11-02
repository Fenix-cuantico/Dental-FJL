import React, { useState } from 'react';
import { Icon } from '../../shared/components/Icon';
import { ViewType } from '../../shared/components/Sidebar';
import { Insumo } from '../../shared/types/dental.types';
import './DashboardModule.css';

interface DashboardModuleProps {
  onNavigate: (view: ViewType) => void;
  insumos: Insumo[];
  onPedirStock: (nombreInsumo?: string) => void;
  onOpenNewCita: () => void;
  onOpenTerms?: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  onNavigate,
  insumos,
  onPedirStock,
  onOpenNewCita,
  onOpenTerms,
}) => {
  const [slide, setSlide] = useState<0 | 1>(0);
  const [chartMode] = useState<'pacientes' | 'ingresos'>('pacientes');

  const weekPatients = [
    { day: 'Lun', count: 14, money: 3200, height: 64 },
    { day: 'Mar', count: 18, money: 4850, height: 82 },
    { day: 'Mié', count: 12, money: 2900, height: 55 },
    { day: 'Jue', count: 22, money: 6100, height: 100, isPeak: true },
    { day: 'Vie', count: 16, money: 4300, height: 73 },
    { day: 'Sáb', count: 9, money: 2150, height: 41 },
    { day: 'Dom', count: 2, money: 600, height: 14 },
  ];

  const nextAppointments = [
    {
      time: '09:00',
      period: 'AM',
      patient: 'Ana María Quispe Rojas',
      hc: 'HC-00412',
      treat: 'Control de ortodoncia',
      doctor: 'Dra. Valeria Ríos',
      box: 'Box 1 · Sillón Central',
      badge: 'Confirmada',
      badgeType: 'ok',
      isNext: true,
      color: 'blue',
    },
    {
      time: '10:30',
      period: 'AM',
      patient: 'Juan Pérez López',
      hc: 'HC-00389',
      treat: 'Raspado y alisado radicular',
      doctor: 'Dra. Renata Vidal',
      box: 'Box 2 · Periodoncia',
      badge: 'Confirmada',
      badgeType: 'ok',
      isNext: false,
      color: 'emerald',
    },
    {
      time: '11:15',
      period: 'AM',
      patient: 'Rosa Huamán Díaz',
      hc: 'HC-00215',
      treat: 'Obturación con resina compuesta',
      doctor: 'Dra. Camila Torres',
      box: 'Box 3 · Operatoria',
      badge: 'Por confirmar',
      badgeType: 'warn',
      isNext: false,
      color: 'purple',
    },
    {
      time: '12:00',
      period: 'PM',
      patient: 'Carlos Ruiz Huamán',
      hc: 'HC-00108',
      treat: 'Control postquirúrgico de implante',
      doctor: 'Dr. Mateo Paredes',
      box: 'Box 1 · Cirugía',
      badge: 'Confirmada',
      badgeType: 'ok',
      isNext: false,
      color: 'teal',
    },
    {
      time: '15:30',
      period: 'PM',
      patient: 'Pedro Sánchez Flores',
      hc: 'HC-00523',
      treat: 'Evaluación y plan de tratamiento',
      doctor: 'Dr. Diego Mendoza',
      box: 'Box 4 · Diagnóstico',
      badge: 'Programada',
      badgeType: 'info',
      isNext: false,
      color: 'amber',
    },
    {
      time: '16:30',
      period: 'PM',
      patient: 'Lucía Morales Vega',
      hc: 'HC-00341',
      treat: 'Profilaxis y destartraje ultrasónico',
      doctor: 'Dra. Valeria Ríos',
      box: 'Box 2 · Higiene',
      badge: 'Confirmada',
      badgeType: 'ok',
      isNext: false,
      color: 'emerald',
    },
  ];

  const criticalStock = insumos
    .filter((i) => i.estado === 'Crítico' || i.estado === 'Bajo')
    .slice(0, 4);

  return (
    <section className="dashboard-module">
      {/* =========================================================
          1. CABECERA EJECUTIVA / CLINICAL BANNER
          ========================================================= */}
      <div className="corp-hero">
        <div className="corp-hero-main">
          <div className="corp-hero-tag">
            <span className="dot-ok" />
            <span>Sede Surco Central · Conexión en Tiempo Real</span>
            <span style={{ opacity: 0.35, margin: '0 4px' }}>•</span>
            <button
              type="button"
              onClick={onOpenTerms}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                padding: 0,
              }}
              title="Leer Términos y Condiciones del Sistema"
            >
              <Icon name="shield" size="sm" />
              <span>Términos y Condiciones</span>
            </button>
          </div>
          <h1 className="corp-hero-title">
            Panel de Operaciones Clínicas — <span>Dental FC</span>
          </h1>
          <p className="corp-hero-desc">
            Sesión activa: <b>Dr. Diego Mendoza</b> (Director Médico). Hay <b>18 citas programadas</b> para la jornada de hoy con un índice de cumplimiento del <b>94.2%</b>.
          </p>

          <div className="corp-hero-chips">
            <div className="corp-chip chip-green">
              <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
              <span>4 Consultorios Operativos</span>
            </div>
            <div className="corp-chip chip-blue">
              <Icon name="clock" size="sm" style={{ color: 'var(--primary)' }} />
              <span>Próximo turno: 09:00 AM (Box 1)</span>
            </div>
            <div className="corp-chip chip-purple">
              <Icon name="activity" size="sm" />
              <span>Ocupación de agenda: 88%</span>
            </div>
          </div>
        </div>

        <div className="corp-hero-actions">
          <button className="btn btn-primary" onClick={onOpenNewCita}>
            <Icon name="plus" size="sm" />
            <span>Programar Cita</span>
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('odontograma')}>
            <Icon name="tooth" size="sm" />
            <span>Odontograma Digital</span>
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('caja')}>
            <Icon name="card" size="sm" />
            <span>Arqueo de Caja</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          2. ACCESOS RÁPIDOS CORPORATIVOS
          ========================================================= */}
      <div className="corp-actions-bar">
        <div className="corp-action-btn" onClick={onOpenNewCita}>
          <div className="corp-action-ic blue">
            <Icon name="calendar" size="lg" />
          </div>
          <div className="corp-action-text">
            <span className="corp-action-title">Nueva Cita</span>
            <span className="corp-action-desc">Agendamiento médico</span>
          </div>
        </div>

        <div className="corp-action-btn" onClick={() => onNavigate('pacientes')}>
          <div className="corp-action-ic green">
            <Icon name="users" size="lg" />
          </div>
          <div className="corp-action-text">
            <span className="corp-action-title">Fichero de Pacientes</span>
            <span className="corp-action-desc">Historias y filiaciones</span>
          </div>
        </div>

        <div className="corp-action-btn" onClick={() => onNavigate('tratamientos')}>
          <div className="corp-action-ic purple">
            <Icon name="tag" size="lg" />
          </div>
          <div className="corp-action-text">
            <span className="corp-action-title">Catálogo Aranceles</span>
            <span className="corp-action-desc">Tarifario de procedimientos</span>
          </div>
        </div>

        <div className="corp-action-btn" onClick={() => onNavigate('caja')}>
          <div className="corp-action-ic amber">
            <Icon name="card" size="lg" />
          </div>
          <div className="corp-action-text">
            <span className="corp-action-title">Caja y Comprobantes</span>
            <span className="corp-action-desc">SUNAT y cobranzas</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. KPIS OPERATIVOS CLÍNICOS (REESTRUCTURADOS)
          ========================================================= */}
      <div className="corp-kpis-grid">
        {/* KPI 1: Citas del Día */}
        <div
          className="corp-kpi-card kpi-blue"
          onClick={() => onNavigate('agenda')}
          title="Ver agenda de citas clínicas"
        >
          <div className="corp-kpi-top">
            <div className="corp-kpi-ic primary">
              <Icon name="calendar" size="lg" />
            </div>
            <span className="badge ok">88% Capacidad</span>
          </div>
          <div>
            <div className="corp-kpi-lbl">Citas Programadas Hoy</div>
            <div className="corp-kpi-val">18</div>
          </div>
          <div className="corp-kpi-footer">
            <span className="corp-kpi-trend up">
              <Icon name="check" size="sm" /> 14 confirmadas
            </span>
            <span style={{ color: 'var(--text-muted)' }}>4 pendientes</span>
          </div>
        </div>

        {/* KPI 2: Boxes y Consultorios Activos */}
        <div
          className="corp-kpi-card kpi-emerald"
          onClick={() => onNavigate('agenda')}
          title="Ver distribución de boxes clínicos"
        >
          <div className="corp-kpi-top">
            <div className="corp-kpi-ic ok">
              <Icon name="building" size="lg" />
            </div>
            <span className="badge ok">100% Operativo</span>
          </div>
          <div>
            <div className="corp-kpi-lbl">Consultorios Activos</div>
            <div className="corp-kpi-val">4 de 4</div>
          </div>
          <div className="corp-kpi-footer">
            <span className="corp-kpi-trend up">
              <Icon name="activity" size="sm" /> Boxes 01 al 04 en turno
            </span>
            <span style={{ color: 'var(--text-muted)' }}>Sede Surco</span>
          </div>
        </div>

        {/* KPI 3: Especialistas de Guardia / En Turno */}
        <div
          className="corp-kpi-card kpi-purple"
          onClick={() => onNavigate('equipo')}
          title="Ver personal médico de turno"
        >
          <div className="corp-kpi-top">
            <div className="corp-kpi-ic purple">
              <Icon name="users" size="lg" />
            </div>
            <span className="badge info">Jornada Activa</span>
          </div>
          <div>
            <div className="corp-kpi-lbl">Especialistas de Turno</div>
            <div className="corp-kpi-val">8</div>
          </div>
          <div className="corp-kpi-footer">
            <span className="corp-kpi-trend up">
              <Icon name="shield" size="sm" /> COP Habilitado
            </span>
            <span style={{ color: 'var(--text-muted)' }}>08:00 - 20:00</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          4. CUADRO PRINCIPAL: AGENDA CLÍNICA Y CONTROL DE OPERACIONES
          ========================================================= */}
      <div className="corp-main-grid">
        {/* Tabla de Turnos Clínicos */}
        <div className="corp-card">
          <div className="corp-card-head">
            <h3>
              <Icon name="clock" />
              <span>Programación de Turnos Clínicos de Hoy</span>
            </h3>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => onNavigate('agenda')}
            >
              <span>Ver agenda semanal</span>
              <Icon name="chevron-r" size="sm" />
            </button>
          </div>

          <div className="corp-agenda-list">
            {nextAppointments.map((app, idx) => (
              <div
                key={idx}
                className={`corp-agenda-item ${app.isNext ? 'is-active-turn' : ''}`}
                onClick={() => onNavigate(app.isNext ? 'odontograma' : 'agenda')}
              >
                {/* 1. Cápsula Horaria */}
                <div className="agenda-time-capsule">
                  <span className="time-val">{app.time}</span>
                  <span className="time-period">{app.period}</span>
                </div>

                {/* 2. Avatar de Iniciales Multicolor */}
                <div className={`agenda-avatar avatar-${app.color}`}>
                  {app.patient
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>

                {/* 3. Información del Paciente y Cita */}
                <div className="agenda-info-main">
                  <div className="agenda-pat-header">
                    <span className="agenda-pat-name" title={app.patient}>{app.patient}</span>
                    <span className="agenda-hc-pill">{app.hc}</span>
                  </div>
                  <div className="agenda-meta-line">
                    <span className="treat-text" title={app.treat}>
                      <Icon name="tooth" size="sm" />
                      <span>{app.treat}</span>
                    </span>
                    <span className="meta-sep">•</span>
                    <span className="doc-text" title={app.doctor}>{app.doctor}</span>
                    <span className="meta-sep">•</span>
                    <span className="box-pill" title={app.box}>{app.box.split('·')[0].trim()}</span>
                  </div>
                </div>

                {/* 4. Chip de Estado y Botón de Acción */}
                <div className="agenda-actions-col">
                  {app.isNext ? (
                    <span className="agenda-status-chip is-live-chip" title="Paciente en turno inmediato">
                      <span className="live-dot-ping" />
                      <span>Turno Inmediato</span>
                    </span>
                  ) : (
                    <span className={`agenda-status-chip ${app.badgeType}`}>
                      <span className="chip-dot" />
                      <span>{app.badge}</span>
                    </span>
                  )}
                  <button
                    className={`btn btn-sm ${app.isNext ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(app.isNext ? 'odontograma' : 'agenda');
                    }}
                  >
                    {app.isNext ? (
                      <>
                        <span>Atender</span>
                        <Icon name="chevron-r" size="sm" />
                      </>
                    ) : (
                      <span>Ficha</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pie de Agenda: Resumen Operativo y Enlace Directo */}
          <div className="corp-agenda-footer">
            <div className="agenda-footer-left">
              <span className="dot-pulse-green" />
              <span><b>6 citas prioritarias</b> (Vista previa de hoy)</span>
            </div>
            <div className="agenda-footer-right">
              <span className="agenda-foot-stat">
                Sillones: <b>4/4 activos</b>
              </span>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => onNavigate('agenda')}
              >
                <span>Ver cronograma</span>
                <Icon name="chevron-r" size="sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Columna Lateral: Flujo de Pacientes y Odontograma Sede */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Módulo de Flujo Semanal e Insumos */}
          <div className="corp-card">
            <div className="corp-card-head">
              <h3>
                <Icon
                  name={slide === 0 ? 'activity' : 'alert'}
                />
                <span>
                  {slide === 0 ? 'Flujo Semanal de Atenciones' : 'Monitoreo de Insumos Críticos'}
                </span>
              </h3>
              <div className="seg">
                <button
                  className={slide === 0 ? 'on' : ''}
                  onClick={() => setSlide(0)}
                >
                  <span>Atenciones</span>
                </button>
                <button
                  className={slide === 1 ? 'on' : ''}
                  onClick={() => setSlide(1)}
                >
                  <span>Stock</span>
                </button>
              </div>
            </div>

            <div style={{ padding: '14px 18px' }}>
              {slide === 0 ? (
                /* Gráfico de Barras Operativo */
                <div className="corp-bars-wrap">
                  <div className="corp-bars-container">
                    {weekPatients.map((w, idx) => (
                      <div className="corp-bar-col" key={idx}>
                        <span className="corp-bar-val">
                          {chartMode === 'pacientes'
                            ? w.count
                            : `S/${(w.money / 1000).toFixed(1)}k`}
                        </span>
                        <div
                          className={`corp-bar-track ${w.isPeak ? 'peak' : ''}`}
                          style={{ height: `${w.height}%` }}
                          title={`${w.count} pacientes el ${w.day}`}
                        />
                        <span className="corp-bar-day">{w.day}</span>
                      </div>
                    ))}
                  </div>

                  <div className="corp-bars-foot">
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>
                        Total semana:{' '}
                      </span>
                      <b style={{ color: 'var(--text)' }}>93 atenciones</b>
                    </div>
                    <div>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        Pico de atención: <b>Jueves (22)</b>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Monitoreo de Stock */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {criticalStock.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        padding: '10px 12px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '6px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '12.5px',
                            fontWeight: 700,
                            color: 'var(--text)',
                          }}
                        >
                          {item.nombre}
                        </span>
                        <span
                          className={`badge ${
                            item.estado === 'Crítico' ? 'danger' : 'warn'
                          }`}
                        >
                          {item.stockActual} {item.unidad}
                        </span>
                      </div>
                      <div className="progress">
                        <i
                          style={{
                            width: `${item.porcentaje}%`,
                            background:
                              item.estado === 'Crítico'
                                ? 'var(--danger)'
                                : 'var(--warn)',
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '6px',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {criticalStock.length} materiales bajo stock mínimo
                    </span>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => onPedirStock()}
                    >
                      <Icon name="download" size="sm" />
                      <span>Solicitar Reposición</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pie Institucional con Apartado de Términos y Normativa */}
      <footer className="corp-dashboard-footer">
        <div className="foot-left">
          <span><b>Dental FC</b> v2.4 Enterprise SaaS · Plataforma Odontológica Homologada</span>
        </div>
        <div className="foot-right">
          <button type="button" className="foot-legal-link" onClick={onOpenTerms}>
            <Icon name="shield" size="sm" />
            <span>Términos y Condiciones del Servicio</span>
          </button>
          <span>•</span>
          <button type="button" className="foot-legal-link" onClick={onOpenTerms}>
            <span>Políticas de Privacidad Sanitaria (Ley N° 29733)</span>
          </button>
        </div>
      </footer>
    </section>
  );
};
