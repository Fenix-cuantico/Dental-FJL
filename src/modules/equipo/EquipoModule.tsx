import React, { useState } from 'react';
import { Icon } from '../../shared/components/Icon';
import { Doctor } from '../../shared/types/dental.types';
import './EquipoModule.css';

interface EquipoModuleProps {
  doctors: Doctor[];
  onOpenNewDoctor?: () => void;
  onNavigateAgenda?: (doctorId?: string) => void;
  onShowToast?: (msg: string) => void;
}

export const EquipoModule: React.FC<EquipoModuleProps> = ({
  doctors,
  onOpenNewDoctor,
  onNavigateAgenda,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');
  const [selectedEsp, setSelectedEsp] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  // Lista de especialidades únicas para los filtros rápidos
  const specialties = ['all', ...Array.from(new Set(doctors.map((d) => d.esp)))];

  const filteredDoctors = doctors.filter((d) => {
    // Filtro por especialidad
    if (selectedEsp !== 'all' && d.esp !== selectedEsp) {
      return false;
    }
    // Filtro por búsqueda
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        d.nombre.toLowerCase().includes(q) ||
        d.esp.toLowerCase().includes(q) ||
        d.cop.toLowerCase().includes(q) ||
        (d.box && d.box.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getDoctorInitials = (nombre: string) => {
    return nombre
      .replace(/^(Dr\.|Dra\.)\s*/, '')
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  };

  const getSpecialtyColor = (esp: string) => {
    switch (esp) {
      case 'Rehabilitación Oral':
        return {
          gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          accent: 'var(--primary)',
          pillClass: 'esp-blue',
        };
      case 'Odontología General':
        return {
          gradient: 'linear-gradient(135deg, #0d9488, #0f766e)',
          accent: '#0d9488',
          pillClass: 'esp-teal',
        };
      case 'Endodoncia':
        return {
          gradient: 'linear-gradient(135deg, #4f46e5, #4338ca)',
          accent: '#4f46e5',
          pillClass: 'esp-indigo',
        };
      case 'Ortodoncia':
        return {
          gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          accent: '#7c3aed',
          pillClass: 'esp-purple',
        };
      case 'Implantología':
        return {
          gradient: 'linear-gradient(135deg, #d97706, #b45309)',
          accent: '#d97706',
          pillClass: 'esp-amber',
        };
      case 'Odontopediatría':
        return {
          gradient: 'linear-gradient(135deg, #db2777, #be185d)',
          accent: '#db2777',
          pillClass: 'esp-rose',
        };
      case 'Cirugía Maxilofacial':
        return {
          gradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
          accent: '#0284c7',
          pillClass: 'esp-cyan',
        };
      case 'Periodoncia':
        return {
          gradient: 'linear-gradient(135deg, #059669, #047857)',
          accent: '#059669',
          pillClass: 'esp-emerald',
        };
      default:
        return {
          gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          accent: 'var(--primary)',
          pillClass: 'esp-blue',
        };
    }
  };

  const getStatusBadge = (estado: string = 'Disponible') => {
    switch (estado) {
      case 'Disponible':
        return {
          badgeClass: 'badge-status ok',
          dotClass: 'sdot-pulse ok',
          label: 'Disponible',
        };
      case 'En Consulta':
        return {
          badgeClass: 'badge-status info',
          dotClass: 'sdot-pulse info',
          label: 'En Consulta',
        };
      case 'En Cirugía':
        return {
          badgeClass: 'badge-status purple',
          dotClass: 'sdot-pulse purple',
          label: 'En Cirugía',
        };
      case 'En Pausa':
        return {
          badgeClass: 'badge-status warn',
          dotClass: 'sdot-pulse warn',
          label: 'En Pausa',
        };
      default:
        return {
          badgeClass: 'badge-status ok',
          dotClass: 'sdot-pulse ok',
          label: 'Disponible',
        };
    }
  };

  const handleWhatsAppContact = (e: React.MouseEvent, doc: Doctor) => {
    e.stopPropagation();
    const phone = doc.tel ? doc.tel.replace(/\D/g, '') : '987654321';
    const msg = `Hola ${doc.nombre}, te contacto desde la coordinación clínica de Dental FC.`;
    window.open(`https://wa.me/51${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section className="equipo-module">
      {/* 1. Cabecera Ejecutiva - Estilo Dashboard */}
      <div className="corp-hero">
        <div className="corp-hero-main">
          <div className="corp-hero-tag">
            <span className="dot-ok" />
            <span>Staff Médico Odontológico & Especialidades Clínicas</span>
          </div>
          <h1 className="corp-hero-title">
            Cuerpo Médico y Especialistas — <span>Dental FC</span>
          </h1>
          <p className="corp-hero-desc">
            Directorio de odontólogos especialistas, acreditación de colegiatura (COP/RNE), programación de boxes y monitoreo de jornada clínica en tiempo real.
          </p>
          <div className="corp-hero-chips">
            <div className="corp-chip chip-green">
              <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
              <span>{doctors.length} Especialistas Activos</span>
            </div>
            <div className="corp-chip chip-blue">
              <Icon name="shield" size="sm" style={{ color: 'var(--primary)' }} />
              <span>Colegiatura COP Homologada</span>
            </div>
            <div className="corp-chip chip-purple">
              <Icon name="activity" size="sm" style={{ color: 'var(--warn)' }} />
              <span>{doctors.reduce((acc, d) => acc + d.citas, 0)} Consultas Asignadas Hoy</span>
            </div>
          </div>
        </div>

        <div className="corp-hero-actions">
          {onOpenNewDoctor ? (
            <button className="btn btn-primary" onClick={onOpenNewDoctor} title="Registrar un nuevo odontólogo especialista">
              <Icon name="plus" size="sm" />
              <span>Agregar Profesional</span>
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => onShowToast?.('Formulario de registro de especialista habilitado')}
              title="Registrar un nuevo odontólogo especialista"
            >
              <Icon name="plus" size="sm" />
              <span>Agregar Profesional</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. KPIs Ejecutivos Reestructurados (Anti-Sobresaturación) */}
      <div className="corp-kpis-grid">
        <div className="corp-kpi-card">
          <div className="corp-kpi-top">
            <div className="corp-kpi-ic primary">
              <Icon name="user" size="lg" />
            </div>
            <span className="badge ok">100% Habilitados</span>
          </div>
          <div>
            <div className="corp-kpi-lbl">Staff Clínico Activo</div>
            <div className="corp-kpi-val">{doctors.length}</div>
          </div>
          <div className="corp-kpi-footer">
            <span className="corp-kpi-trend up">
              <Icon name="check" size="sm" /> Colegio Odontológico
            </span>
            <span style={{ color: 'var(--text-muted)' }}>Al día en aportes</span>
          </div>
        </div>

        <div className="corp-kpi-card">
          <div className="corp-kpi-top">
            <div className="corp-kpi-ic ok">
              <Icon name="calendar" size="lg" />
            </div>
            <span className="badge ok">Jornada Activa</span>
          </div>
          <div>
            <div className="corp-kpi-lbl">Citas Asignadas Hoy</div>
            <div className="corp-kpi-val">{doctors.reduce((acc, d) => acc + d.citas, 0)}</div>
          </div>
          <div className="corp-kpi-footer">
            <span className="corp-kpi-trend up">
              <Icon name="activity" size="sm" /> 8 consultorios
            </span>
            <span style={{ color: 'var(--text-muted)' }}>Distribución óptima</span>
          </div>
        </div>
      </div>

      {/* 3. Barra de Búsqueda, Filtros por Especialidad y Selector de Vista */}
      <div className="doc-filter-panel card">
        <div className="equipo-filter-controls-row">
          <div className="doc-search-wrapper" style={{ flex: 1 }}>
            <Icon name="search" size="sm" />
            <input
              className="input doc-search-input"
              placeholder="Buscar por especialista, especialidad clínica, COP o sillón asignado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="doc-clear-btn" onClick={() => setSearch('')}>
                <Icon name="x" size="sm" />
              </button>
            )}
          </div>

          <div className="equipo-view-seg">
            <button
              type="button"
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
              title="Vista en Listado"
            >
              <Icon name="list" size="sm" />
              <span>Listado</span>
            </button>
            <button
              type="button"
              className={viewMode === 'cards' ? 'active' : ''}
              onClick={() => setViewMode('cards')}
              title="Vista en Tarjetas"
            >
              <Icon name="grid" size="sm" />
              <span>Tarjetas</span>
            </button>
          </div>
        </div>

        {/* Chips de filtro por especialidad */}
        <div className="doc-specialty-chips">
          {specialties.map((esp) => {
            const count =
              esp === 'all' ? doctors.length : doctors.filter((d) => d.esp === esp).length;
            return (
              <button
                key={esp}
                type="button"
                className={`doc-chip-btn ${selectedEsp === esp ? 'active' : ''}`}
                onClick={() => setSelectedEsp(esp)}
              >
                <span>{esp === 'all' ? 'Todos los Especialistas' : esp}</span>
                <span className="doc-chip-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Vista de Listado Tabular vs. Tarjetas Médicas */}
      {viewMode === 'list' ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table className="data doc-table">
              <thead>
                <tr>
                  <th>Especialista</th>
                  <th>Registro COP</th>
                  <th>Especialidad Clínica</th>
                  <th>Box Asignado</th>
                  <th>Horario de Atención</th>
                  <th>Citas Hoy</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doc) => {
                  const spec = getSpecialtyColor(doc.esp);
                  const st = getStatusBadge(doc.estado || 'Disponible');
                  const initials = getDoctorInitials(doc.nombre);

                  return (
                    <tr key={doc.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            className="doccard-avatar"
                            style={{
                              width: '36px',
                              height: '36px',
                              fontSize: '13px',
                              background: spec.gradient,
                              flexShrink: 0,
                            }}
                          >
                            <span>{initials}</span>
                          </div>
                          <div>
                            <b style={{ color: 'var(--text)', fontSize: '13.5px' }}>{doc.nombre}</b>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              Rating: {doc.rating || '4.9'} ({doc.reviews || '84'} reseñas)
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="pf-code-pill">{doc.cop}</span>
                      </td>
                      <td>
                        <span className={`badge ${spec.pillClass}`}>
                          {doc.esp}
                        </span>
                      </td>
                      <td>
                        <b>{doc.box || 'Box 01'}</b>
                      </td>
                      <td>
                        <span style={{ fontSize: '12.5px', color: 'var(--text)' }}>
                          {doc.turno || '08:00 - 14:00'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                          {doc.citas} citas
                        </span>
                      </td>
                      <td>
                        <span className={st.badgeClass}>
                          <span className={st.dotClass} />
                          <span>{st.label}</span>
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn-table-action"
                            onClick={(e) => handleWhatsAppContact(e, doc)}
                            title="Contactar vía WhatsApp"
                          >
                            <Icon name="phone" size="sm" style={{ color: '#10b981' }} />
                          </button>
                          {onNavigateAgenda && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => onNavigateAgenda(doc.id)}
                              title="Ver citas del doctor en agenda"
                            >
                              <Icon name="calendar" size="sm" />
                              <span>Agenda</span>
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedDoctor(doc)}
                            title="Ver perfil completo"
                          >
                            <Icon name="user" size="sm" />
                            <span>Perfil</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="docgrid-elevated mt">
        {filteredDoctors.map((doc) => {
          const spec = getSpecialtyColor(doc.esp);
          const st = getStatusBadge(doc.estado || 'Disponible');
          const initials = getDoctorInitials(doc.nombre);

          return (
            <div
              className="doccard-elevated"
              key={doc.id}
              onClick={() => setSelectedDoctor(doc)}
              tabIndex={0}
              role="button"
            >
              {/* Barra superior de acento según especialidad */}
              <div
                className="doccard-accent-bar"
                style={{ background: spec.gradient }}
              />

              <div className="doccard-body">
                {/* Cabecera de la Tarjeta */}
                <div className="doccard-header">
                  {/* Avatar Squircle con Gradiente y Monograma */}
                  <div className="doccard-avatar-wrapper">
                    <div
                      className="doccard-avatar"
                      style={{ background: spec.gradient }}
                    >
                      <span>{initials}</span>
                    </div>
                    {/* Indicador de estado en tiempo real */}
                    <span className={`doccard-avatar-status ${st.dotClass}`} />
                  </div>

                  {/* Nombre, Especialidad y COP */}
                  <div className="doccard-identity">
                    <div className="doccard-top-row">
                      <h3 className="doccard-name">{doc.nombre}</h3>
                      <div className="doccard-rating">
                        <Icon name="star" size="sm" style={{ color: '#f59e0b' }} />
                        <b>{doc.rating || '4.9'}</b>
                        <span className="reviews">({doc.reviews || '84'})</span>
                      </div>
                    </div>

                    <div className="doccard-tags-row">
                      <span className={`doccard-specialty-pill ${spec.pillClass}`}>
                        <span className="pill-dot" style={{ background: spec.accent }} />
                        {doc.esp}
                      </span>
                      <span className="doccard-cop-pill">
                        <Icon name="shield" size="sm" style={{ color: 'var(--primary)' }} />
                        <span>{doc.cop}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tira Operativa: Sillón Dental y Turno */}
                <div className="doccard-op-strip">
                  <div className="doccard-op-item" title="Sillón / Box Clínico asignado">
                    <Icon name="layers" size="sm" />
                    <span>{doc.box || 'Box 01 (Principal)'}</span>
                  </div>
                  <div className="doccard-op-item" title="Horario de atención clínica">
                    <Icon name="clock" size="sm" />
                    <span>{doc.turno || '08:00 - 14:00'}</span>
                  </div>
                </div>

                {/* Métricas Bento (Pacientes, Citas hoy, Años experiencia) */}
                <div className="doccard-bento-stats">
                  <div className="bento-tile">
                    <div className="bento-icon-wrapper blue">
                      <Icon name="users" size="sm" />
                    </div>
                    <div className="bento-content">
                      <b className="bento-val">{doc.pac}</b>
                      <span className="bento-lbl">Pacientes</span>
                    </div>
                  </div>

                  <div className="bento-tile">
                    <div className="bento-icon-wrapper green">
                      <Icon name="calendar" size="sm" />
                    </div>
                    <div className="bento-content">
                      <b className="bento-val">{doc.citas}</b>
                      <span className="bento-lbl">Citas hoy</span>
                    </div>
                  </div>

                  <div className="bento-tile">
                    <div className="bento-icon-wrapper purple">
                      <Icon name="activity" size="sm" />
                    </div>
                    <div className="bento-content">
                      <b className="bento-val">{doc.años}a</b>
                      <span className="bento-lbl">Experiencia</span>
                    </div>
                  </div>
                </div>

                {/* Pie de Tarjeta: Estado y Acciones Rápidas */}
                <div className="doccard-footer">
                  <div className={st.badgeClass}>
                    <span className={st.dotClass} />
                    <span>{st.label}</span>
                  </div>

                  <div className="doccard-actions" onClick={(e) => e.stopPropagation()}>
                    {/* Botón WhatsApp directo */}
                    <button
                      className="doc-btn-icon-wa"
                      onClick={(e) => handleWhatsAppContact(e, doc)}
                      title={`Escribir por WhatsApp al ${doc.nombre}`}
                    >
                      <Icon name="headset" size="sm" />
                    </button>

                    {/* Botón Ficha Médica */}
                    <button
                      className="btn btn-secondary btn-sm doc-btn-ficha"
                      onClick={() => setSelectedDoctor(doc)}
                      title="Ver credenciales y perfil médico"
                    >
                      <Icon name="user" size="sm" />
                      <span>Ficha</span>
                    </button>

                    {/* Botón Ver Agenda */}
                    <button
                      className="btn btn-primary btn-sm doc-btn-agenda"
                      onClick={() => {
                        if (onNavigateAgenda) {
                          onNavigateAgenda(doc.id);
                        } else {
                          onShowToast?.(`Abriendo agenda del ${doc.nombre}`);
                        }
                      }}
                      title="Ver citas del especialista en la agenda"
                    >
                      <Icon name="calendar" size="sm" />
                      <span>Agenda</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {filteredDoctors.length === 0 && (
        <div className="doc-empty-state card">
          <Icon name="users" size="lg" style={{ color: 'var(--text-muted)' }} />
          <h3>No se encontraron especialistas</h3>
          <p>Intenta con otro término de búsqueda o selecciona otra especialidad.</p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearch('');
              setSelectedEsp('all');
            }}
          >
            Limpiar Filtros
          </button>
        </div>
      )}

      {/* 5. Modal de Ficha Médica del Especialista */}
      {selectedDoctor && (
        <div className="modal-backdrop" onClick={() => setSelectedDoctor(null)}>
          <div
            className="modal-card doc-profile-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px' }}
          >
            {/* Cabecera del Modal */}
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <div
                  className="doc-modal-avatar"
                  style={{
                    background: getSpecialtyColor(selectedDoctor.esp).gradient,
                  }}
                >
                  {getDoctorInitials(selectedDoctor.nombre)}
                </div>
                <div>
                  <h2 className="modal-title">{selectedDoctor.nombre}</h2>
                  <div className="doc-modal-sub">
                    <span className="esp">{selectedDoctor.esp}</span>
                    <span className="sep">·</span>
                    <span className="cop">{selectedDoctor.cop} (Habilitado)</span>
                  </div>
                </div>
              </div>
              <button
                className="btn-close"
                onClick={() => setSelectedDoctor(null)}
                aria-label="Cerrar modal"
              >
                <Icon name="x" size="sm" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="modal-body doc-modal-body">
              {/* Bloque de Información Rápida */}
              <div className="doc-modal-grid-2">
                <div className="doc-modal-info-card">
                  <span className="lbl">Box / Consultorio Asignado</span>
                  <b>{selectedDoctor.box || 'Box 01 (Principal)'}</b>
                  <span className="sub-lbl">Sillón electromecánico equipado</span>
                </div>
                <div className="doc-modal-info-card">
                  <span className="lbl">Horario de Atención Clínica</span>
                  <b>{selectedDoctor.turno || '08:00 - 14:00'}</b>
                  <span className="sub-lbl">Lunes a Sábado · Turno Activo</span>
                </div>
              </div>

              {/* Estadísticas de Rendimiento */}
              <div className="doc-modal-metrics">
                <div className="metric-box">
                  <span className="num">{selectedDoctor.pac}</span>
                  <span className="txt">Pacientes Atendidos</span>
                </div>
                <div className="metric-box">
                  <span className="num">{selectedDoctor.citas}</span>
                  <span className="txt">Citas Hoy</span>
                </div>
                <div className="metric-box">
                  <span className="num">{selectedDoctor.años} años</span>
                  <span className="txt">Experiencia Quirúrgica</span>
                </div>
                <div className="metric-box">
                  <span className="num" style={{ color: '#f59e0b' }}>
                    ★ {selectedDoctor.rating || 4.9}
                  </span>
                  <span className="txt">{selectedDoctor.reviews || 84} Evaluaciones</span>
                </div>
              </div>

              {/* Canales de Comunicación Directa */}
              <div className="doc-modal-contact-strip">
                <div className="contact-item">
                  <Icon name="phone" size="sm" />
                  <span>{selectedDoctor.tel || '+51 987 234 567'}</span>
                </div>
                <div className="contact-item">
                  <Icon name="mail" size="sm" />
                  <span>{selectedDoctor.mail || 'especialista@dentalfc.pe'}</span>
                </div>
                <div className="contact-item">
                  <Icon name="shield" size="sm" />
                  <span>RNE: RNE-{selectedDoctor.cop.replace(/\D/g, '')}</span>
                </div>
              </div>
            </div>

            {/* Pie del Modal con Acciones */}
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={(e) => handleWhatsAppContact(e, selectedDoctor)}
              >
                <Icon name="headset" size="sm" />
                <span>Contactar WhatsApp</span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedDoctor(null)}
                >
                  Cerrar
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const docId = selectedDoctor.id;
                    setSelectedDoctor(null);
                    if (onNavigateAgenda) {
                      onNavigateAgenda(docId);
                    } else {
                      onShowToast?.(`Abriendo agenda del ${selectedDoctor.nombre}`);
                    }
                  }}
                >
                  <Icon name="calendar" size="sm" />
                  <span>Ver en Agenda</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
