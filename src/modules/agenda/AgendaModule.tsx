import React, { useState } from 'react';
import { Icon } from '../../shared/components/Icon';
import { Doctor } from '../../shared/types/dental.types';
import './AgendaModule.css';

export interface AgendaEvent {
  id: string;
  doctor: string; // Doctor ID (D1, D2, D3, D4)
  paciente: string;
  hc: string;
  tratamiento: string;
  hora: string;
  duracionMin: number;
  estado: 'Confirmada' | 'Por confirmar' | 'Atendida' | 'Cancelada';
  costo: number;
  box: string;
}

interface AgendaModuleProps {
  doctors: Doctor[];
  onOpenNewCita: () => void;
  onOpenPatientFicha?: (pacienteNombre: string) => void;
}

export const AgendaModule: React.FC<AgendaModuleProps> = ({
  doctors,
  onOpenNewCita,
  onOpenPatientFicha,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<string>('todos');
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');
  const [fechaAgenda, setFechaAgenda] = useState<string>('2026-10-24');
  const [viewMode, setViewMode] = useState<'matriz' | 'lista'>('matriz');

  const [citas] = useState<AgendaEvent[]>([
    {
      id: 'c1',
      doctor: 'D4',
      paciente: 'Ana María Quispe Rojas',
      hc: 'HC-00412',
      tratamiento: 'Control mensual ortodoncia',
      hora: '09:00',
      duracionMin: 30,
      estado: 'Confirmada',
      costo: 120,
      box: 'Box 4',
    },
    {
      id: 'c2',
      doctor: 'D1',
      paciente: 'Juan Pérez López',
      hc: 'HC-00389',
      tratamiento: 'Evaluación y corona sobre implante',
      hora: '09:00',
      duracionMin: 45,
      estado: 'Confirmada',
      costo: 750,
      box: 'Box 1',
    },
    {
      id: 'c3',
      doctor: 'D2',
      paciente: 'Rosa Huamán Díaz',
      hc: 'HC-00215',
      tratamiento: 'Obturación con resina compuesta',
      hora: '10:00',
      duracionMin: 60,
      estado: 'Confirmada',
      costo: 220,
      box: 'Box 2',
    },
    {
      id: 'c4',
      doctor: 'D3',
      paciente: 'Carlos Ruiz Huamán',
      hc: 'HC-00108',
      tratamiento: 'Endodoncia multirradicular pieza 16',
      hora: '10:00',
      duracionMin: 90,
      estado: 'Por confirmar',
      costo: 620,
      box: 'Box 3',
    },
    {
      id: 'c5',
      doctor: 'D1',
      paciente: 'Lucía Fernández Ramos',
      hc: 'HC-00631',
      tratamiento: 'Rehabilitación y profilaxis ultrasónica',
      hora: '11:00',
      duracionMin: 45,
      estado: 'Atendida',
      costo: 180,
      box: 'Box 1',
    },
    {
      id: 'c6',
      doctor: 'D2',
      paciente: 'Pedro Sánchez Flores',
      hc: 'HC-00523',
      tratamiento: 'Consulta clínica y diagnóstico integral',
      hora: '12:00',
      duracionMin: 30,
      estado: 'Confirmada',
      costo: 60,
      box: 'Box 2',
    },
    {
      id: 'c7',
      doctor: 'D4',
      paciente: 'Marco Díaz Vargas',
      hc: 'HC-00702',
      tratamiento: 'Instalación de brackets metálicos',
      hora: '14:00',
      duracionMin: 90,
      estado: 'Confirmada',
      costo: 1800,
      box: 'Box 4',
    },
    {
      id: 'c8',
      doctor: 'D3',
      paciente: 'Valeria Mendoza Soto',
      hc: 'HC-00344',
      tratamiento: 'Control pulpar y radiografía periapical',
      hora: '15:00',
      duracionMin: 30,
      estado: 'Por confirmar',
      costo: 150,
      box: 'Box 3',
    },
    {
      id: 'c9',
      doctor: 'D1',
      paciente: 'Mateo Quispe Vera',
      hc: 'HC-00819',
      tratamiento: 'Profilaxis pediátrica y flúor gel',
      hora: '16:00',
      duracionMin: 40,
      estado: 'Confirmada',
      costo: 120,
      box: 'Box 1',
    },
  ]);

  const horas = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
  const activeDoctors = doctors.slice(0, 4);

  const filteredCitas = citas.filter((c) => {
    if (selectedDoc !== 'todos' && c.doctor !== selectedDoc) return false;
    if (selectedEstado !== 'todos' && c.estado !== selectedEstado) return false;
    return true;
  });

  const getBadgeType = (estado: AgendaEvent['estado']): 'ok' | 'warn' | 'info' | 'danger' => {
    switch (estado) {
      case 'Confirmada':
        return 'ok';
      case 'Por confirmar':
        return 'warn';
      case 'Atendida':
        return 'info';
      case 'Cancelada':
        return 'danger';
      default:
        return 'info';
    }
  };

  const totalConfirmadas = citas.filter((c) => c.estado === 'Confirmada').length;
  const totalPorConfirmar = citas.filter((c) => c.estado === 'Por confirmar').length;
  const totalAtendidas = citas.filter((c) => c.estado === 'Atendida').length;

  return (
    <section className="agenda-module">
      {/* =========================================================
          1. CABECERA EJECUTIVA / CLINICAL BANNER
          ========================================================= */}
      <div className="agenda-hero">
        <div className="agenda-hero-main">
          <div className="agenda-hero-tag">
            <span className="dot-ok" />
            <span>Sede Surco Central · Cronograma Médico Oficial</span>
          </div>
          <h1 className="agenda-hero-title">
            Agenda y Programación de Citas — <span>Dental FC</span>
          </h1>
          <p className="agenda-hero-desc">
            Planificación de sillones clínicos, asignación de especialistas y monitoreo de flujo asistencial en tiempo real.
          </p>

          <div className="agenda-hero-chips">
            <div className="agenda-chip">
              <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
              <span>4 Boxes en Operación Continua</span>
            </div>
            <div className="agenda-chip">
              <Icon name="clock" size="sm" style={{ color: 'var(--primary)' }} />
              <span>Jornada: 09:00 - 18:00 hrs</span>
            </div>
            <div className="agenda-chip">
              <Icon name="activity" size="sm" style={{ color: 'var(--text-soft)' }} />
              <span>Ocupación de sillones: 88.5%</span>
            </div>
          </div>
        </div>

        <div className="agenda-hero-actions">
          <button className="btn btn-primary" onClick={onOpenNewCita}>
            <Icon name="plus" size="sm" />
            <span>Programar Cita</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          2. 4 KPIS EJECUTIVOS DE AGENDA
          ========================================================= */}
      <div className="agenda-kpis-grid">
        <div className="agenda-kpi-card">
          <div className="agenda-kpi-top">
            <div className="agenda-kpi-ic primary">
              <Icon name="calendar" size="lg" />
            </div>
            <span className="badge ok">Jornada Activa</span>
          </div>
          <div>
            <div className="agenda-kpi-lbl">Total Citas Programadas</div>
            <div className="agenda-kpi-val">{citas.length}</div>
          </div>
          <div className="agenda-kpi-footer">
            <span>Capacidad asignada: 88%</span>
            <span style={{ color: 'var(--ok)', fontWeight: 700 }}>+3 vs ayer</span>
          </div>
        </div>

        <div className="agenda-kpi-card">
          <div className="agenda-kpi-top">
            <div className="agenda-kpi-ic ok">
              <Icon name="check" size="lg" />
            </div>
            <span className="badge ok">
              {Math.round((totalConfirmadas / citas.length) * 100)}% del total
            </span>
          </div>
          <div>
            <div className="agenda-kpi-lbl">Citas Confirmadas</div>
            <div className="agenda-kpi-val">{totalConfirmadas}</div>
          </div>
          <div className="agenda-kpi-footer">
            <span>Notificadas por WhatsApp</span>
            <span style={{ color: 'var(--ok)', fontWeight: 700 }}>SLA OK</span>
          </div>
        </div>

        <div className="agenda-kpi-card">
          <div className="agenda-kpi-top">
            <div className="agenda-kpi-ic warn">
              <Icon name="clock" size="lg" />
            </div>
            <span className="badge warn">Pendiente Gestión</span>
          </div>
          <div>
            <div className="agenda-kpi-lbl">Por Confirmar</div>
            <div className="agenda-kpi-val">{totalPorConfirmar}</div>
          </div>
          <div className="agenda-kpi-footer">
            <span>Requieren llamada de recepción</span>
            <span style={{ color: 'var(--warn)', fontWeight: 700 }}>Prioridad</span>
          </div>
        </div>

        <div className="agenda-kpi-card">
          <div className="agenda-kpi-top">
            <div className="agenda-kpi-ic purple">
              <Icon name="activity" size="lg" />
            </div>
            <span className="badge info">En Curso</span>
          </div>
          <div>
            <div className="agenda-kpi-lbl">Atendidas en Turno</div>
            <div className="agenda-kpi-val">{totalAtendidas}</div>
          </div>
          <div className="agenda-kpi-footer">
            <span>Concluidas y facturadas</span>
            <span style={{ color: 'var(--text-soft)', fontWeight: 700 }}>100% registro</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. BARRA DE HERRAMIENTAS Y FILTROS CLÍNICOS
          ========================================================= */}
      <div className="agenda-toolbar">
        <div className="agenda-filters-group">
          {/* Navegación de Fecha */}
          <div className="agenda-nav-date">
            <button
              title="Día anterior"
              onClick={() => {
                const d = new Date(fechaAgenda);
                d.setDate(d.getDate() - 1);
                setFechaAgenda(d.toISOString().split('T')[0]);
              }}
            >
              <Icon name="chevron-l" size="sm" />
            </button>
            <span className="agenda-date-display">
              Sábado, 24 de Octubre de 2026
            </span>
            <button
              title="Día siguiente"
              onClick={() => {
                const d = new Date(fechaAgenda);
                d.setDate(d.getDate() + 1);
                setFechaAgenda(d.toISOString().split('T')[0]);
              }}
            >
              <Icon name="chevron-r" size="sm" />
            </button>
          </div>

          <input
            type="date"
            className="input"
            style={{ width: 'auto', height: '34px', fontSize: '12px' }}
            value={fechaAgenda}
            onChange={(e) => setFechaAgenda(e.target.value)}
          />

          {/* Filtro por Profesional */}
          <div className="agenda-filter-item">
            <label>Especialista:</label>
            <select
              className="select"
              style={{ width: 'auto', minWidth: '180px', height: '34px', fontSize: '12px' }}
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
            >
              <option value="todos">Todos los profesionales</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre} ({d.esp})
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Estado */}
          <div className="agenda-filter-item">
            <label>Estado:</label>
            <select
              className="select"
              style={{ width: 'auto', minWidth: '150px', height: '34px', fontSize: '12px' }}
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="Confirmada">Confirmadas</option>
              <option value="Por confirmar">Por confirmar</option>
              <option value="Atendida">Atendidas</option>
              <option value="Cancelada">Canceladas</option>
            </select>
          </div>
        </div>

        {/* Selector de Modo de Vista */}
        <div className="seg">
          <button
            className={viewMode === 'matriz' ? 'on' : ''}
            onClick={() => setViewMode('matriz')}
            title="Vista de sillones y doctores"
          >
            <Icon name="grid" size="sm" />
            <span>Matriz de Boxes</span>
          </button>
          <button
            className={viewMode === 'lista' ? 'on' : ''}
            onClick={() => setViewMode('lista')}
            title="Vista en lista cronológica"
          >
            <Icon name="activity" size="sm" />
            <span>Lista Cronológica</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          4. CUADRO PRINCIPAL DE AGENDA
          ========================================================= */}
      {viewMode === 'matriz' ? (
        <div className="agenda-matrix-wrap">
          <div className="agenda-matrix">
            {/* Cabecera Hora */}
            <div className="ag-matrix-h">
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
                HORA
              </span>
            </div>

            {/* Cabeceras de Especialistas y Boxes */}
            {activeDoctors.map((doc, idx) => (
              <div className="ag-matrix-h" key={doc.id}>
                <span className="ag-doc-name">{doc.nombre}</span>
                <span className="ag-doc-box">
                  <Icon name="tooth" size="sm" />
                  <span>Box {idx + 1} · {doc.esp}</span>
                </span>
              </div>
            ))}

            {/* Celdas Horarias */}
            {horas.map((h) => (
              <React.Fragment key={h}>
                <div className="ag-matrix-time">{h}</div>
                {activeDoctors.map((doc, idx) => {
                  const citaSlot = filteredCitas.find(
                    (c) => c.hora === h && c.doctor === doc.id
                  );
                  return (
                    <div
                      className="ag-matrix-slot"
                      key={`${h}-${doc.id}`}
                      onClick={() => {
                        if (!citaSlot) onOpenNewCita();
                      }}
                    >
                      {citaSlot ? (
                        <div
                          className={`ag-corp-card ${getBadgeType(citaSlot.estado)}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenPatientFicha) onOpenPatientFicha(citaSlot.paciente);
                          }}
                          title={`Click para abrir la historia clínica de ${citaSlot.paciente}`}
                        >
                          <div className="ag-corp-head">
                            <span className="ag-corp-pat">{citaSlot.paciente}</span>
                            <span
                              className={`badge ${getBadgeType(citaSlot.estado)}`}
                              style={{ fontSize: '9px', padding: '1px 5px' }}
                            >
                              {citaSlot.estado}
                            </span>
                          </div>
                          <span className="ag-corp-treat">{citaSlot.tratamiento}</span>
                          <div className="ag-corp-foot">
                            <span style={{ color: 'var(--text-muted)' }}>
                              Box {idx + 1} · {citaSlot.hc}
                            </span>
                            <span className="ag-corp-cost">S/ {citaSlot.costo.toFixed(2)}</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        /* Vista de Lista Cronológica */
        <div className="corp-card">
          <div className="corp-card-head">
            <h3>
              <Icon name="calendar" />
              <span>Listado Cronológico de Citas ({filteredCitas.length} registros)</span>
            </h3>
          </div>
          <div className="corp-agenda-list">
            {filteredCitas.map((cita) => (
              <div
                key={cita.id}
                className="corp-agenda-row"
                onClick={() => onOpenPatientFicha && onOpenPatientFicha(cita.paciente)}
              >
                <div className="corp-time-box">
                  <span className="h">{cita.hora}</span>
                  <span className="p">Turno</span>
                </div>
                <div className="corp-avatar">
                  {cita.paciente.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div className="corp-pat-info">
                  <div className="corp-pat-line">
                    <span className="corp-pat-name">{cita.paciente}</span>
                    <span className="badge" style={{ fontSize: '10px', padding: '1px 6px' }}>
                      {cita.hc}
                    </span>
                  </div>
                  <div className="corp-meta-line">
                    <b>{cita.tratamiento}</b>
                    <span>•</span>
                    <span>{doctors.find((d) => d.id === cita.doctor)?.nombre}</span>
                    <span>•</span>
                    <span className="corp-box-badge">{cita.box}</span>
                  </div>
                </div>
                <div className="corp-row-actions">
                  <span className="ag-corp-cost" style={{ marginRight: '8px' }}>
                    S/ {cita.costo.toFixed(2)}
                  </span>
                  <span className={`badge ${getBadgeType(cita.estado)}`}>
                    {cita.estado}
                  </span>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenPatientFicha) onOpenPatientFicha(cita.paciente);
                    }}
                  >
                    <span>Expediente</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
