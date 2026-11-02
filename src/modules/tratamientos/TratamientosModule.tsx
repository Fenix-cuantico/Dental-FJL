import React, { useState } from 'react';
import { Icon } from '../../shared/components/Icon';
import { TratamientoCatalogo } from '../../shared/types/dental.types';
import './TratamientosModule.css';

interface TratamientosModuleProps {
  initialTratamientos: TratamientoCatalogo[];
  onShowToast?: (msg: string) => void;
}

export const TratamientosModule: React.FC<TratamientosModuleProps> = ({
  initialTratamientos,
  onShowToast,
}) => {
  const [tratamientos, setTratamientos] = useState<TratamientoCatalogo[]>(initialTratamientos);
  const [search, setSearch] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TratamientoCatalogo | null>(null);

  // Formulario de nuevo tratamiento
  const [formData, setFormData] = useState({
    id: '',
    n: '',
    c: 'Preventiva',
    d: 45,
    p: 100,
  });

  const categorias = Array.from(new Set(tratamientos.map((t) => t.c)));

  const filteredTratamientos = tratamientos.filter((t) => {
    const matchesSearch =
      t.n.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.c.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoriaFilter === 'todas' || t.c === categoriaFilter;
    return matchesSearch && matchesCat;
  });

  // Métricas calculadas
  const totalProcedimientos = tratamientos.length;
  const precioPromedio =
    totalProcedimientos > 0
      ? tratamientos.reduce((acc, curr) => acc + curr.p, 0) / totalProcedimientos
      : 0;
  const duracionPromedio =
    totalProcedimientos > 0
      ? Math.round(tratamientos.reduce((acc, curr) => acc + curr.d, 0) / totalProcedimientos)
      : 0;

  const handleOpenCreateModal = () => {
    const nextNum = tratamientos.length + 1;
    const nextCode = `T-${String(nextNum).padStart(3, '0')}`;
    setFormData({
      id: nextCode,
      n: '',
      c: 'Restauradora',
      d: 45,
      p: 150,
    });
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: TratamientoCatalogo) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      n: item.n,
      c: item.c,
      d: item.d,
      p: item.p,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.n.trim()) {
      onShowToast?.('Por favor ingresa el nombre del tratamiento');
      return;
    }

    if (editingItem) {
      setTratamientos((prev) =>
        prev.map((t) => (t.id === editingItem.id ? { ...formData } : t))
      );
      onShowToast?.(`Tratamiento ${formData.id} actualizado con éxito`);
    } else {
      setTratamientos((prev) => [formData, ...prev]);
      onShowToast?.(`Tratamiento "${formData.n}" registrado en el catálogo`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(`¿Estás seguro de dar de baja el tratamiento ${id} del catálogo clínico?`)) {
      setTratamientos((prev) => prev.filter((t) => t.id !== id));
      onShowToast?.(`Tratamiento ${id} eliminado del catálogo`);
    }
  };

  return (
    <section className="tratamientos-module">
      {/* 1. Cabecera Ejecutiva - Estilo Dashboard */}
      <div className="corp-hero">
        <div className="corp-hero-main">
          <div className="corp-hero-tag">
            <span className="dot-ok" />
            <span>Tarifario Clínico & Procedimientos Médicos</span>
          </div>
          <h1 className="corp-hero-title">
            Catálogo de Tratamientos y Aranceles — <span>Dental FC</span>
          </h1>
          <p className="corp-hero-desc">
            Aranceles odontológicos oficiales, tiempos estimados en sillón clínico, insumos asociados y clasificación por especialidades.
          </p>
          <div className="corp-hero-chips">
            <div className="corp-chip">
              <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
              <span>{totalProcedimientos} Procedimientos Registrados</span>
            </div>
            <div className="corp-chip">
              <Icon name="clock" size="sm" style={{ color: 'var(--primary)' }} />
              <span>{categorias.length} Especialidades Odontológicas</span>
            </div>
            <div className="corp-chip">
              <Icon name="dollar" size="sm" style={{ color: 'var(--warn)' }} />
              <span>Tarifario Vigente 2026</span>
            </div>
          </div>
        </div>

        <div className="corp-hero-actions">
          <button
            className="btn btn-secondary"
            onClick={() => window.print()}
          >
            <Icon name="printer" size="sm" />
            <span>Imprimir Tarifario</span>
          </button>
          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            <Icon name="plus" size="sm" />
            <span>Nuevo Procedimiento</span>
          </button>
        </div>
      </div>

      {/* 2. KPIs Ejecutivos Reestructurados (2 Columnas Limpias) */}
      <div className="corp-kpis-grid">
        <div className="corp-kpi-card">
          <div className="corp-kpi-top">
            <div className="corp-kpi-ic primary">
              <Icon name="tag" size="lg" />
            </div>
            <span className="badge ok">Vigente 2026</span>
          </div>
          <div>
            <div className="corp-kpi-lbl">Procedimientos Activos</div>
            <div className="corp-kpi-val">{totalProcedimientos}</div>
          </div>
          <div className="corp-kpi-footer">
            <span className="corp-kpi-trend up">
              <Icon name="check" size="sm" /> Catálogo completo
            </span>
            <span style={{ color: 'var(--text-muted)' }}>Aranceles</span>
          </div>
        </div>

        <div className="corp-kpi-card">
          <div className="corp-kpi-top">
            <div className="corp-kpi-ic warn">
              <Icon name="layers" size="lg" />
            </div>
            <span className="badge ok">Especialidades</span>
          </div>
          <div>
            <div className="corp-kpi-lbl">Áreas Clínicas</div>
            <div className="corp-kpi-val">{categorias.length}</div>
          </div>
          <div className="corp-kpi-footer">
            <span className="corp-kpi-trend up">
              <Icon name="check" size="sm" /> Cobertura odontológica
            </span>
            <span style={{ color: 'var(--text-muted)' }}>Integral</span>
          </div>
        </div>
      </div>

      {/* Filtros y Buscador */}
      <div className="card card-pad mt" style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="search" style={{ flex: 1, minWidth: '240px' }}>
          <Icon name="search" size="sm" />
          <input
            className="input"
            placeholder="Buscar por código (ej. T-005), nombre del procedimiento o especialidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)' }}>Especialidad:</span>
          <select
            className="select"
            style={{ width: 'auto', minWidth: '180px' }}
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
          >
            <option value="todas">Todas las especialidades</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla del Tarifario */}
      <div className="card mt">
        <div className="card-head">
          <h3>
            <Icon name="clipboard" />
            <span>Tarifario Oficial de Procedimientos</span>
          </h3>
          <span className="sub">{filteredTratamientos.length} registros</span>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th style={{ width: '90px' }}>Código</th>
                <th>Procedimiento / Tratamiento</th>
                <th style={{ width: '160px' }}>Especialidad</th>
                <th style={{ width: '130px' }}>Tiempo en Sillón</th>
                <th style={{ width: '130px', textAlign: 'right' }}>Arancel (S/)</th>
                <th style={{ width: '110px', textAlign: 'center' }}>Estado</th>
                <th style={{ width: '90px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTratamientos.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No se encontraron tratamientos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredTratamientos.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span className="tratamiento-code">{t.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '13.5px' }}>
                        {t.n}
                      </div>
                    </td>
                    <td>
                      <span className="cat-badge-clinica">{t.c}</span>
                    </td>
                    <td>
                      <span className="duration-pill">
                        <Icon name="clock" size="sm" />
                        <span>{t.d} min</span>
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      S/ {t.p.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge ok">Activo</span>
                    </td>
                    <td>
                      <div className="row-actions" style={{ justifyContent: 'center' }}>
                        <button
                          className="act"
                          title="Editar Arancel"
                          onClick={() => handleOpenEditModal(t)}
                        >
                          <Icon name="edit" size="sm" />
                        </button>
                        <button
                          className="act"
                          title="Eliminar Tratamiento"
                          onClick={() => handleDelete(t.id)}
                        >
                          <Icon name="trash" size="sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear / Editar Tratamiento */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>
                <Icon name="tag" />
                <span>{editingItem ? 'Editar Arancel de Tratamiento' : 'Nuevo Procedimiento Odontológico'}</span>
              </h3>
              <button className="act" onClick={() => setIsModalOpen(false)}>
                <Icon name="x" size="sm" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="field">
                    <label>Código de Procedimiento:</label>
                    <input
                      className="input"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Especialidad Clínica:</label>
                    <select
                      className="select"
                      value={formData.c}
                      onChange={(e) => setFormData({ ...formData, c: e.target.value })}
                    >
                      <option value="Preventiva">Preventiva</option>
                      <option value="Restauradora">Restauradora</option>
                      <option value="Endodoncia">Endodoncia</option>
                      <option value="Periodoncia">Periodoncia</option>
                      <option value="Cirugía">Cirugía</option>
                      <option value="Ortodoncia">Ortodoncia</option>
                      <option value="Implantología">Implantología</option>
                      <option value="Rehabilitación">Rehabilitación</option>
                      <option value="Estética">Estética</option>
                      <option value="Odontopediatría">Odontopediatría</option>
                    </select>
                  </div>
                  <div className="field full">
                    <label>Nombre del Procedimiento / Tratamiento:</label>
                    <input
                      className="input"
                      placeholder="Ej. Obturación con resina fotocurable"
                      value={formData.n}
                      onChange={(e) => setFormData({ ...formData, n: e.target.value })}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Duración Estimada (Minutos):</label>
                    <input
                      type="number"
                      min="10"
                      step="5"
                      className="input"
                      value={formData.d}
                      onChange={(e) => setFormData({ ...formData, d: parseInt(e.target.value) || 30 })}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Arancel Oficial (Soles S/):</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className="input"
                      value={formData.p}
                      onChange={(e) => setFormData({ ...formData, p: parseFloat(e.target.value) || 0 })}
                      required
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
                  <span>{editingItem ? 'Guardar Cambios' : 'Registrar Procedimiento'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
