import React, { useState } from 'react';
import { Icon } from '../../shared/components/Icon';
import { EventoAuditoria } from '../../shared/types/dental.types';
import './AuditoriaModule.css';

interface AuditoriaModuleProps {
  auditoria: EventoAuditoria[];
}

export const AuditoriaModule: React.FC<AuditoriaModuleProps> = ({ auditoria }) => {
  const [search, setSearch] = useState('');
  const [modFilter, setModFilter] = useState('todos');
  const [accFilter, setAccFilter] = useState('todos');

  const filteredEvents = auditoria.filter((e) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        e.usuario.toLowerCase().includes(q) ||
        e.paciente.toLowerCase().includes(q) ||
        e.detalle.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (modFilter !== 'todos' && e.modulo !== modFilter) return false;
    if (accFilter !== 'todos' && e.accion !== accFilter) return false;
    return true;
  });

  const getActionBadge = (accion: EventoAuditoria['accion']) => {
    switch (accion) {
      case 'Creó': return 'ok';
      case 'Modificó': return 'warn';
      case 'Anuló': return 'danger';
      case 'Acceso': return 'info';
      case 'Cierre': return 'purple';
      default: return '';
    }
  };

  return (
    <section className="auditoria-module">
      {/* 1. Cabecera Ejecutiva - Auditoría de Sistemas */}
      <div className="corp-hero">
        <div className="corp-hero-main">
          <div className="corp-hero-tag">
            <span className="dot-ok" />
            <span>Seguridad Informática & Trazabilidad del Sistema</span>
          </div>
          <h1 className="corp-hero-title">
            Auditoría y Bitácora del Sistema — <span>Dental FC</span>
          </h1>
          <p className="corp-hero-desc">
            Registro forense inmutable de inicios de sesión, cambios en expedientes, operaciones contables y accesos por usuario e IP.
          </p>
          <div className="corp-hero-chips">
            <div className="corp-chip chip-blue">
              <Icon name="shield" size="sm" style={{ color: 'var(--primary)' }} />
              <span>Cifrado SHA-256 Activo</span>
            </div>
            <div className="corp-chip chip-green">
              <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
              <span>Ley N° 29733 (Datos Personales)</span>
            </div>
            <div className="corp-chip chip-purple">
              <Icon name="activity" size="sm" style={{ color: 'var(--warn)' }} />
              <span>{filteredEvents.length} Eventos Registrados</span>
            </div>
          </div>
        </div>

        <div className="corp-hero-actions">
          <button className="btn btn-secondary" onClick={() => window.print()} title="Imprimir reporte de auditoría">
            <Icon name="printer" size="sm" />
            <span>Imprimir Bitácora</span>
          </button>
        </div>
      </div>

      {/* 2. KPIs de Auditoría y Seguridad */}
      <div className="corp-kpis-grid">
        <div className="corp-kpi-card" style={{ borderTop: '3px solid #2563eb' }}>
          <div className="corp-kpi-top">
            <div className="corp-kpi-ic primary">
              <Icon name="activity" size="lg" />
            </div>
            <span className="badge ok">100% Auditado</span>
          </div>
          <div>
            <div className="corp-kpi-lbl">Eventos Totales</div>
            <div className="corp-kpi-val">{auditoria.length}</div>
          </div>
          <div className="corp-kpi-footer">
            <span className="corp-kpi-trend up">
              <Icon name="check" size="sm" /> Trazabilidad activa
            </span>
            <span style={{ color: 'var(--text-muted)' }}>En vivo</span>
          </div>
        </div>

        <div className="corp-kpi-card" style={{ borderTop: '3px solid #10b981' }}>
          <div className="corp-kpi-top">
            <div className="corp-kpi-ic ok">
              <Icon name="clipboard" size="lg" />
            </div>
            <span className="badge ok">Clínico</span>
          </div>
          <div>
            <div className="corp-kpi-lbl">Operaciones Clínicas</div>
            <div className="corp-kpi-val">{auditoria.filter((a) => a.modulo === 'Tratamiento').length}</div>
          </div>
          <div className="corp-kpi-footer">
            <span className="corp-kpi-trend up">
              <Icon name="activity" size="sm" /> Fichas y recetas
            </span>
            <span style={{ color: 'var(--text-muted)' }}>Atenciones</span>
          </div>
        </div>

        <div className="corp-kpi-card" style={{ borderTop: '3px solid #8b5cf6' }}>
          <div className="corp-kpi-top">
            <div className="corp-kpi-ic purple">
              <Icon name="dollar" size="lg" />
            </div>
            <span className="badge ok">Contable</span>
          </div>
          <div>
            <div className="corp-kpi-lbl">Operaciones de Caja</div>
            <div className="corp-kpi-val">{auditoria.filter((a) => a.modulo === 'Pagos').length}</div>
          </div>
          <div className="corp-kpi-footer">
            <span className="corp-kpi-trend up">
              <Icon name="check" size="sm" /> Comprobantes SUNAT
            </span>
            <span style={{ color: 'var(--text-muted)' }}>Caja</span>
          </div>
        </div>

        <div className="corp-kpi-card" style={{ borderTop: '3px solid #f59e0b' }}>
          <div className="corp-kpi-top">
            <div className="corp-kpi-ic warn">
              <Icon name="shield" size="lg" />
            </div>
            <span className="badge ok">Seguro</span>
          </div>
          <div>
            <div className="corp-kpi-lbl">Control de Accesos</div>
            <div className="corp-kpi-val">{auditoria.filter((a) => a.modulo === 'Seguridad').length}</div>
          </div>
          <div className="corp-kpi-footer">
            <span className="corp-kpi-trend up">
              <Icon name="check" size="sm" /> Inicios de sesión
            </span>
            <span style={{ color: 'var(--text-muted)' }}>RBAC</span>
          </div>
        </div>
      </div>

      {/* 3. Filtros de Auditoría */}
      <div className="card card-pad mt" style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="search" style={{ flex: 1, minWidth: '240px' }}>
          <Icon name="search" size="sm" />
          <input
            className="input"
            placeholder="Buscar por usuario, paciente o detalle del registro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Módulo:</span>
          <select
            className="select"
            style={{ width: 'auto', minWidth: '150px' }}
            value={modFilter}
            onChange={(e) => setModFilter(e.target.value)}
          >
            <option value="todos">Todos los módulos</option>
            <option value="Tratamiento">Tratamiento</option>
            <option value="Pagos">Pagos</option>
            <option value="Seguridad">Seguridad</option>
            <option value="Citas">Citas</option>
            <option value="Inventario">Inventario</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Acción:</span>
          <select
            className="select"
            style={{ width: 'auto', minWidth: '140px' }}
            value={accFilter}
            onChange={(e) => setAccFilter(e.target.value)}
          >
            <option value="todos">Todas las acciones</option>
            <option value="Creó">Creó</option>
            <option value="Modificó">Modificó</option>
            <option value="Anuló">Anuló</option>
            <option value="Acceso">Acceso</option>
          </select>
        </div>
      </div>

      {/* 4. Tabla de Bitácora Forense */}
      <div className="card mt">
        <div className="card-head">
          <h3>
            <Icon name="shield" />
            <span>Registro de Trazabilidad y Operaciones</span>
          </h3>
          <span className="sub">{filteredEvents.length} eventos filtrados</span>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Fecha / Hora</th>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Módulo</th>
                <th>Afectado</th>
                <th>Detalle Operativo</th>
                <th>IP / Dispositivo</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((ev) => (
                <tr key={ev.id}>
                  <td>
                    <div>
                      <b>{ev.fecha}</b>
                      <span className="sub" style={{ display: 'block' }}>{ev.hora}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <b style={{ color: 'var(--text)' }}>{ev.usuario}</b>
                      <span className="sub" style={{ display: 'block' }}>{ev.rol}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getActionBadge(ev.accion)}`}>
                      {ev.accion}
                    </span>
                  </td>
                  <td>
                    <span className="badge" style={{ fontSize: '11px' }}>{ev.modulo}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{ev.paciente}</span>
                  </td>
                  <td style={{ fontSize: '12.5px', maxWidth: '300px' }}>
                    {ev.detalle}
                  </td>
                  <td>
                    <div>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-soft)' }}>{ev.ip}</span>
                      <span className="sub" style={{ display: 'block', fontSize: '10.5px' }}>{ev.dispositivo}</span>
                    </div>
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
