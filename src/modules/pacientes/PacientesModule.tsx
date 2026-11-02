import React, { useState } from 'react';
import { Icon } from '../../shared/components/Icon';
import { Paciente } from '../../shared/types/dental.types';
import { FichaPacientePage } from './FichaPacientePage';
import { EditPacienteModal } from './EditPacienteModal';
import './PacientesModule.css';

interface PacientesModuleProps {
  pacientes: Paciente[];
  onOpenNewPaciente: () => void;
  onOpenOdontograma?: (pacienteId: number) => void;
  onOpenHistoria?: (pacienteId: number) => void;
  onToggleFavorite?: (id: number) => void;
  onUpdatePaciente?: (paciente: Paciente) => void;
  onDeletePaciente?: (id: number) => void;
}

const AVATAR_COLORS = ['avatar-blue', 'avatar-emerald', 'avatar-purple', 'avatar-teal', 'avatar-amber'];
const getAvatarClass = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

export const PacientesModule: React.FC<PacientesModuleProps> = ({
  pacientes,
  onOpenNewPaciente,
  onOpenOdontograma,
  onOpenHistoria,
  onToggleFavorite,
  onUpdatePaciente,
  onDeletePaciente,
}) => {
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [tagFilter, setTagFilter] = useState('');
  const [sortBy, setSortBy] = useState<'nombre' | 'reciente' | 'edad' | 'mora'>('reciente');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  
  // Modales
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);
  const [deletingPaciente, setDeletingPaciente] = useState<Paciente | null>(null);

  // Estadísticas rápidas
  const countActivos = pacientes.filter((p) => p.est === 'Activo').length;
  const countMorosos = pacientes.filter((p) => p.est === 'Moroso').length;
  const countInactivos = pacientes.filter((p) => p.est === 'Inactivo').length;
  const countFavs = pacientes.filter((p) => p.fav).length;

  // Filtrado
  const filteredPacientes = pacientes.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        p.nom.toLowerCase().includes(q) ||
        p.doc.includes(q) ||
        p.mail.toLowerCase().includes(q) ||
        p.tel.includes(q) ||
        p.dir.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (estadoFilter && p.est !== estadoFilter) return false;
    if (onlyFavs && !p.fav) return false;
    if (tagFilter && !p.tags.includes(tagFilter)) return false;
    return true;
  });

  // Ordenamiento
  const sortedPacientes = [...filteredPacientes].sort((a, b) => {
    switch (sortBy) {
      case 'nombre':
        return a.nom.localeCompare(b.nom);
      case 'reciente':
        return b.id - a.id;
      case 'edad':
        return b.edad - a.edad;
      case 'mora':
        if (a.est === 'Moroso' && b.est !== 'Moroso') return -1;
        if (a.est !== 'Moroso' && b.est === 'Moroso') return 1;
        return a.nom.localeCompare(b.nom);
      default:
        return 0;
    }
  });

  const exportPacientesToCSV = () => {
    const headers = [
      'ID_HC',
      'Nombre',
      'TipoDoc',
      'Documento',
      'Edad',
      'Sexo',
      'Telefono',
      'Email',
      'Direccion',
      'Estado',
      'Etiquetas',
    ];
    const rows = sortedPacientes.map((p) => [
      `HC-${p.id.toString().padStart(5, '0')}`,
      `"${p.nom.replace(/"/g, '""')}"`,
      p.tipo,
      p.doc,
      p.edad,
      p.sex,
      p.tel,
      p.mail,
      `"${p.dir.replace(/"/g, '""')}"`,
      p.est,
      `"${p.tags.join(', ')}"`,
    ]);
    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Directorio_Pacientes_Dental_FC_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setSearch('');
    setEstadoFilter('');
    setOnlyFavs(false);
    setTagFilter('');
    setSortBy('reciente');
  };

  const handleConfirmDelete = () => {
    if (deletingPaciente && onDeletePaciente) {
      onDeletePaciente(deletingPaciente.id);
    }
    setDeletingPaciente(null);
  };

  // VISTA DE PÁGINA COMPLETA PARA EL EXPEDIENTE DEL PACIENTE (NO MODAL)
  if (selectedPaciente) {
    return (
      <section className="pacientes-module">
        <FichaPacientePage
          paciente={selectedPaciente}
          onBack={() => setSelectedPaciente(null)}
          onOpenHistoria={onOpenHistoria}
          onOpenOdontograma={onOpenOdontograma}
          onEditPaciente={(p) => {
            setEditingPaciente(p);
          }}
          onScheduleCita={() => {
            // Se puede abrir creación rápida de cita
          }}
        />

        {/* Modal de Edición de Paciente si se activa desde la ficha */}
        <EditPacienteModal
          paciente={editingPaciente}
          isOpen={!!editingPaciente}
          onClose={() => setEditingPaciente(null)}
          onSubmit={(updated) => {
            if (onUpdatePaciente) {
              onUpdatePaciente(updated);
            }
            setSelectedPaciente(updated);
          }}
        />
      </section>
    );
  }

  return (
    <section className="pacientes-module">
      {/* =========================================================
          1. CABECERA EJECUTIVA - ESTILO DENTAL FC
          ========================================================= */}
      <div className="corp-hero">
        <div className="corp-hero-main">
          <div className="corp-hero-tag">
            <span className="dot-ok" />
            <span>Fichas Clínicas Digitales & Odontogramas Homologados</span>
          </div>
          <h1 className="corp-hero-title">
            Directorio de Pacientes y Clientes — <span>Dental FC</span>
          </h1>
          <p className="corp-hero-desc">
            Expedientes médicos, antecedentes odontológicos, consentimientos informados y estados de cuenta en tiempo real.
          </p>
          <div className="corp-hero-chips">
            <div className="corp-chip chip-green">
              <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
              <span>{pacientes.length} Pacientes en Sede</span>
            </div>
            <div className="corp-chip chip-blue">
              <Icon name="activity" size="sm" style={{ color: 'var(--primary)' }} />
              <span>+24 Nuevos este mes</span>
            </div>
            <div className="corp-chip chip-purple">
              <Icon name="star" size="sm" style={{ color: 'var(--warn)' }} />
              <span>98.4% Satisfacción Clínica</span>
            </div>
          </div>
        </div>

        <div className="corp-hero-actions">
          <button className="btn btn-secondary" onClick={exportPacientesToCSV} title="Descargar reporte Excel / CSV">
            <Icon name="download" size="sm" />
            <span>Exportar CSV</span>
          </button>
          <button className="btn btn-primary" onClick={onOpenNewPaciente} title="Registrar nuevo paciente en la clínica">
            <Icon name="plus" size="sm" />
            <span>Nuevo Paciente</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          2. KPIS EJECUTIVOS CON ACENTOS DE COLOR
          ========================================================= */}
      <div className="corp-kpis-grid">
        <div className="corp-kpi-card" onClick={() => { setEstadoFilter(''); setOnlyFavs(false); }} style={{ cursor: 'pointer' }}>
          <div className="corp-kpi-top">
            <div className="corp-kpi-ic primary">
              <Icon name="users" size="lg" />
            </div>
            <span className="badge ok">+18 altas</span>
          </div>
          <div>
            <div className="corp-kpi-lbl">Total Pacientes Registrados</div>
            <div className="corp-kpi-val">{pacientes.length}</div>
          </div>
          <div className="corp-kpi-footer">
            <span className="corp-kpi-trend up">
              <Icon name="check" size="sm" /> Base clínica activa
            </span>
            <span style={{ color: 'var(--text-muted)' }}>100% digital</span>
          </div>
        </div>

        <div className="corp-kpi-card" onClick={() => { setEstadoFilter('Activo'); setOnlyFavs(false); }} style={{ cursor: 'pointer' }}>
          <div className="corp-kpi-top">
            <div className="corp-kpi-ic ok">
              <Icon name="check" size="lg" />
            </div>
            <span className="badge ok">En curso</span>
          </div>
          <div>
            <div className="corp-kpi-lbl">En Tratamiento Activo</div>
            <div className="corp-kpi-val">{countActivos}</div>
          </div>
          <div className="corp-kpi-footer">
            <span className="corp-kpi-trend up">
              <Icon name="activity" size="sm" /> Ortodoncia e Implantes
            </span>
            <span style={{ color: 'var(--text-muted)' }}>Seguimiento</span>
          </div>
        </div>


        <div className="corp-kpi-card" onClick={() => { setEstadoFilter('Moroso'); setOnlyFavs(false); }} style={{ cursor: 'pointer' }}>
          <div className="corp-kpi-top">
            <div className="corp-kpi-ic warn">
              <Icon name="alert" size="lg" />
            </div>
            <span className="badge warn">{countMorosos > 0 ? 'Gestión' : 'Al día'}</span>
          </div>
          <div>
            <div className="corp-kpi-lbl">Saldos por Cobrar / Mora</div>
            <div className="corp-kpi-val">{countMorosos}</div>
          </div>
          <div className="corp-kpi-footer">
            <span className={`corp-kpi-trend ${countMorosos > 0 ? 'down' : 'up'}`}>
              <Icon name="alert" size="sm" /> {countMorosos > 0 ? 'Requiere cobranza' : 'Sin deudas'}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>Finanzas</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. BARRA DE BÚSQUEDA Y FILTRADO EJECUTIVO
          ========================================================= */}
      <div className="pacientes-filter-bar">
        <div className="pacientes-search-wrap">
          <Icon name="search" size="sm" style={{ color: 'var(--text-muted)' }} />
          <input
            placeholder="Buscar por nombre, DNI, teléfono, correo o dirección..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              title="Borrar búsqueda"
            >
              <Icon name="x" size="sm" />
            </button>
          )}
        </div>

        <div className="pacientes-chips-group">
          <button
            className={`pacientes-chip-btn ${estadoFilter === '' && !onlyFavs ? 'active' : ''}`}
            onClick={() => {
              setEstadoFilter('');
              setOnlyFavs(false);
            }}
          >
            <span>Todos ({pacientes.length})</span>
          </button>
          <button
            className={`pacientes-chip-btn ${estadoFilter === 'Activo' && !onlyFavs ? 'active' : ''}`}
            onClick={() => {
              setEstadoFilter('Activo');
              setOnlyFavs(false);
            }}
          >
            <span className="dot-active" />
            <span>Activos ({countActivos})</span>
          </button>
          <button
            className={`pacientes-chip-btn ${estadoFilter === 'Moroso' && !onlyFavs ? 'active' : ''}`}
            onClick={() => {
              setEstadoFilter('Moroso');
              setOnlyFavs(false);
            }}
          >
            <span className="dot-warn" />
            <span>En Mora ({countMorosos})</span>
          </button>
          <button
            className={`pacientes-chip-btn ${estadoFilter === 'Inactivo' && !onlyFavs ? 'active' : ''}`}
            onClick={() => {
              setEstadoFilter('Inactivo');
              setOnlyFavs(false);
            }}
          >
            <span>Inactivos ({countInactivos})</span>
          </button>
          <button
            className={`pacientes-chip-btn ${onlyFavs ? 'active' : ''}`}
            onClick={() => setOnlyFavs(!onlyFavs)}
          >
            <Icon name="star" size="sm" style={{ color: onlyFavs ? '#fff' : '#f59e0b' }} />
            <span>Favoritos ({countFavs})</span>
          </button>
        </div>

        {/* Selector de Orden y Modo de Vista */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="pacientes-sort-wrap">
            <select
              className="pacientes-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              title="Ordenar lista de pacientes"
            >
              <option value="reciente">Más Recientes (ID)</option>
              <option value="nombre">Por Nombre (A-Z)</option>
              <option value="edad">Mayor Edad</option>
              <option value="mora">En Mora Primero</option>
            </select>
          </div>

          <div className="pacientes-view-seg">
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
              title="Vista en Listado"
            >
              <Icon name="menu" size="sm" />
              <span>Listado</span>
            </button>
            <button
              className={viewMode === 'cards' ? 'active' : ''}
              onClick={() => setViewMode('cards')}
              title="Vista en Tarjetas"
            >
              <Icon name="grid" size="sm" />
              <span>Tarjetas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Filtros Activos & Contador */}
      <div className="pacientes-active-filters-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span>
            Mostrando <b>{sortedPacientes.length}</b> de <b>{pacientes.length}</b> pacientes registrados
          </span>
          {tagFilter && (
            <span className="paciente-filter-tag-chip">
              Etiqueta: #{tagFilter}
              <button onClick={() => setTagFilter('')}>
                <Icon name="x" size="sm" />
              </button>
            </span>
          )}
        </div>
        {(search || estadoFilter || onlyFavs || tagFilter || sortBy !== 'reciente') && (
          <button
            onClick={handleResetFilters}
            className="pacientes-reset-btn"
          >
            <Icon name="eraser" size="sm" />
            <span>Restablecer filtros</span>
          </button>
        )}
      </div>

      {/* =========================================================
          4. VISTA DE TABLA / LISTADO ELEGANTE
          ========================================================= */}
      {viewMode === 'list' ? (
        <div className="pacientes-table-card">
          {sortedPacientes.length > 0 ? (
            <div className="pacientes-table-wrap">
              <table className="pacientes-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px', textAlign: 'center' }}>Fav</th>
                    <th>Paciente / Historia</th>
                    <th>Documento</th>
                    <th>Edad / Sexo</th>
                    <th>Contacto Directo</th>
                    <th>Dirección</th>
                    <th>Etiquetas</th>
                    <th>Estado</th>
                    <th style={{ textAlign: 'center', width: '142px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPacientes.map((p) => {
                    const avatarColorClass = getAvatarClass(p.id);
                    const cleanPhone = p.tel.replace(/\D/g, '');
                    const waLink = `https://wa.me/51${cleanPhone}?text=Hola%20${encodeURIComponent(p.nom)},%20te%20saludamos%20de%20la%20cl%C3%ADnica%20Dental%20FC.`;

                    return (
                      <tr key={p.id}>
                        {/* Favorito */}
                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => onToggleFavorite && onToggleFavorite(p.id)}
                            className={`paciente-star-btn ${p.fav ? 'is-fav' : ''}`}
                            title={p.fav ? 'Quitar de favoritos' : 'Marcar como favorito'}
                          >
                            <Icon name="star" size="sm" />
                          </button>
                        </td>

                        {/* Paciente / Historia */}
                        <td>
                          <div
                            className="paciente-user-cell"
                            onClick={() => setSelectedPaciente(p)}
                            title="Ver ficha clínica completa"
                          >
                            <div className={`agenda-avatar ${avatarColorClass}`}>
                              {p.nom
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')}
                            </div>
                            <div>
                              <div className="paciente-name">{p.nom}</div>
                              <span className="paciente-hc">
                                HC-{p.id.toString().padStart(5, '0')}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Documento */}
                        <td>
                          <span className="badge" style={{ marginRight: '6px' }}>{p.tipo}</span>
                          <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{p.doc}</span>
                        </td>

                        {/* Edad y Sexo */}
                        <td>
                          <span className={`sex-badge ${p.sex === 'F' ? 'f' : 'm'}`}>
                            <Icon name={p.sex === 'F' ? 'venus' : 'mars'} size="sm" />
                            <span>{p.sex === 'F' ? 'Mujer' : 'Varón'}</span>
                          </span>
                          <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>· {p.edad} años</span>
                        </td>

                        {/* Contacto WhatsApp & Correo */}
                        <td>
                          <div className="paciente-contact-col">
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="phone-wa-link"
                              title="Chatear por WhatsApp"
                            >
                              <Icon name="phone" size="sm" style={{ color: '#10b981' }} />
                              <span>{p.tel}</span>
                            </a>
                            <a
                              href={`mailto:${p.mail}`}
                              className="mail-link"
                              title="Enviar correo electrónico"
                            >
                              {p.mail}
                            </a>
                          </div>
                        </td>

                        {/* Dirección */}
                        <td style={{ fontSize: '12px', maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-muted)' }} title={p.dir}>
                          {p.dir}
                        </td>

                        {/* Etiquetas */}
                        <td>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {p.tags.map((t, idx) => (
                              <button
                                key={idx}
                                className={`paciente-tag-pill ${tagFilter === t ? 'active-tag' : ''}`}
                                onClick={() => setTagFilter(tagFilter === t ? '' : t)}
                                title={`Filtrar por etiqueta #${t}`}
                              >
                                #{t}
                              </button>
                            ))}
                          </div>
                        </td>

                        {/* Estado */}
                        <td>
                          <span
                            className={`paciente-status-chip ${
                              p.est === 'Activo' ? 'activo' : p.est === 'Moroso' ? 'moroso' : 'inactivo'
                            }`}
                          >
                            <span className="dot" />
                            <span>{p.est}</span>
                          </span>
                        </td>

                        {/* Acciones: Formato 1 arriba, 2 en medio y 1 abajo */}
                        <td style={{ textAlign: 'center' }}>
                          <div className="paciente-actions-1-2-1">
                            {/* 1 Arriba: Perfil (ancho completo) */}
                            <button
                              className="btn-action-tile perfil btn-action-full"
                              onClick={() => setSelectedPaciente(p)}
                              title="Ver Perfil y Estado de Cuenta del Paciente"
                            >
                              <Icon name="user" size="sm" />
                              <span>Perfil</span>
                            </button>

                            {/* 2 En Medio: Historia y Editar */}
                            {onOpenHistoria ? (
                              <button
                                className="btn-action-tile historia"
                                onClick={() => onOpenHistoria(p.id)}
                                title="Abrir Historia Clínica Oficial (Odontograma 3D, notas SOAP y recetas)"
                              >
                                <Icon name="file" size="sm" />
                                <span>Historia</span>
                              </button>
                            ) : onOpenOdontograma ? (
                              <button
                                className="btn-action-tile odonto"
                                onClick={() => onOpenOdontograma(p.id)}
                                title="Abrir Odontograma Dental"
                              >
                                <Icon name="tooth" size="sm" />
                                <span>Odonto</span>
                              </button>
                            ) : (
                              <div />
                            )}

                            <button
                              className="btn-action-tile edit"
                              onClick={() => setEditingPaciente(p)}
                              title="Editar Datos del Paciente"
                            >
                              <Icon name="edit" size="sm" />
                              <span>Editar</span>
                            </button>

                            {/* 1 Abajo: Archivar (ancho completo) */}
                            {onDeletePaciente ? (
                              <button
                                className="btn-action-tile delete btn-action-full"
                                onClick={() => setDeletingPaciente(p)}
                                title="Archivar Paciente"
                              >
                                <Icon name="trash" size="sm" />
                                <span>Archivar</span>
                              </button>
                            ) : (
                              <div />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="pacientes-empty-state">
              <div className="pacientes-empty-icon">
                <Icon name="search" size="lg" />
              </div>
              <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text)' }}>
                No se encontraron pacientes
              </h4>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                No hay resultados coincidentes para los criterios de búsqueda actuales.
              </p>
              <button className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
                Limpiar búsqueda y filtros
              </button>
            </div>
          )}
        </div>
      ) : (
        /* =========================================================
           5. VISTA DE TARJETAS (CARDS VIEW) ELEVADA
           ========================================================= */
        <div className="pcards">
          {sortedPacientes.length > 0 ? (
            sortedPacientes.map((p) => {
              const avatarColorClass = getAvatarClass(p.id);
              const cleanPhone = p.tel.replace(/\D/g, '');
              const waLink = `https://wa.me/51${cleanPhone}?text=Hola%20${encodeURIComponent(p.nom)},%20te%20saludamos%20de%20la%20cl%C3%ADnica%20Dental%20FC.`;

              return (
                <div className="pcard" key={p.id}>
                  <div className="pcard-top">
                    <div className={`agenda-avatar ${avatarColorClass}`} style={{ width: '44px', height: '44px', fontSize: '15px' }}>
                      {p.nom
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="nm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.nom}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        HC-{p.id.toString().padStart(5, '0')} · {p.tipo}: <b>{p.doc}</b> · {p.edad} años
                      </div>
                    </div>
                    <button
                      onClick={() => onToggleFavorite && onToggleFavorite(p.id)}
                      className={`paciente-star-btn ${p.fav ? 'is-fav' : ''}`}
                      title={p.fav ? 'Quitar de favoritos' : 'Marcar favorito'}
                    >
                      <Icon name="star" size="sm" />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="pcard-line phone-wa-link"
                      title="Enviar mensaje de WhatsApp"
                    >
                      <Icon name="phone" size="sm" style={{ color: '#10b981' }} />
                      <span>{p.tel}</span>
                    </a>
                    <a
                      href={`mailto:${p.mail}`}
                      className="pcard-line mail-link"
                    >
                      <Icon name="mail" size="sm" />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.mail}</span>
                    </a>
                    <div className="pcard-line" title={p.dir}>
                      <Icon name="pin" size="sm" />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.dir}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {p.tags.map((t, idx) => (
                      <button
                        key={idx}
                        className={`paciente-tag-pill ${tagFilter === t ? 'active-tag' : ''}`}
                        onClick={() => setTagFilter(tagFilter === t ? '' : t)}
                      >
                        #{t}
                      </button>
                    ))}
                  </div>

                  <div className="pcard-foot">
                    <span
                      className={`paciente-status-chip ${
                        p.est === 'Activo' ? 'activo' : p.est === 'Moroso' ? 'moroso' : 'inactivo'
                      }`}
                    >
                      <span className="dot" />
                      <span>{p.est}</span>
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {onOpenOdontograma && (
                        <button
                          className="btn-table-action primary"
                          onClick={() => onOpenOdontograma(p.id)}
                          title="Odontograma Dental"
                        >
                          <Icon name="tooth" size="sm" />
                        </button>
                      )}
                      <button
                        className="btn-table-action"
                        onClick={() => setEditingPaciente(p)}
                        title="Editar Datos"
                      >
                        <Icon name="edit" size="sm" />
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setSelectedPaciente(p)}
                        title="Ver Perfil y Estado de Cuenta"
                      >
                        <Icon name="user" size="sm" />
                        <span>Perfil</span>
                      </button>
                      {onOpenHistoria ? (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => onOpenHistoria(p.id)}
                          title="Abrir Historia Clínica Oficial"
                        >
                          <Icon name="file" size="sm" />
                          <span>Historia</span>
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setSelectedPaciente(p)}
                        >
                          <Icon name="user" size="sm" />
                          <span>Perfil</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="pacientes-empty-state" style={{ gridColumn: '1 / -1' }}>
              <div className="pacientes-empty-icon">
                <Icon name="search" size="lg" />
              </div>
              <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text)' }}>
                No se encontraron pacientes
              </h4>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                No hay resultados coincidentes para los filtros aplicados.
              </p>
              <button className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
                Limpiar búsqueda y filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          6. MODALES: FICHA, EDICIÓN Y CONFIRMACIÓN DE ARCHIVADO
          ========================================================= */}



      {/* Modal de Edición de Paciente */}
      <EditPacienteModal
        paciente={editingPaciente}
        isOpen={!!editingPaciente}
        onClose={() => setEditingPaciente(null)}
        onSubmit={(updated) => {
          if (onUpdatePaciente) {
            onUpdatePaciente(updated);
          }
        }}
      />

      {/* Modal de Confirmación de Eliminación / Archivado */}
      {deletingPaciente && (
        <div className="modal-overlay" onClick={() => setDeletingPaciente(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-head">
              <h3 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="trash" size="lg" />
                <span>¿Archivar Expediente de Paciente?</span>
              </h3>
              <button className="icon-btn" onClick={() => setDeletingPaciente(null)}>
                <Icon name="x" />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '13.5px', color: 'var(--text)', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                ¿Está seguro de archivar a <b>{deletingPaciente.nom}</b> (HC-{deletingPaciente.id.toString().padStart(5, '0')})?
              </p>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Su historia clínica y registros contables quedarán preservados en auditoría conforme a la Ley General de Salud N° 26842, pero no figurará en la agenda activa.
              </p>
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={() => setDeletingPaciente(null)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                <Icon name="trash" size="sm" />
                <span>Sí, Archivar Paciente</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
