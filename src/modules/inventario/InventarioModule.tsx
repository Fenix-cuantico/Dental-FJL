import React, { useState } from 'react';
import { Icon } from '../../shared/components/Icon';
import { Insumo } from '../../shared/types/dental.types';
import './InventarioModule.css';

interface InventarioModuleProps {
  insumos: Insumo[];
  onOpenNewInsumo: () => void;
  onPedirStock: (nombreInsumo?: string) => void;
  onAjustarStock?: (id: string, delta: number) => void;
}

export const InventarioModule: React.FC<InventarioModuleProps> = ({
  insumos,
  onOpenNewInsumo,
  onPedirStock,
  onAjustarStock,
}) => {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('todos');

  const categories = Array.from(new Set(insumos.map((i) => i.categoria)));

  const filteredInsumos = insumos.filter((i) => {
    if (search.trim() && !i.nombre.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== 'todos' && i.categoria !== catFilter) return false;
    return true;
  });

  const countCriticos = insumos.filter((i) => i.estado === 'Crítico').length;
  const countBajos = insumos.filter((i) => i.estado === 'Bajo').length;
  const countNormal = insumos.filter((i) => i.estado === 'Normal').length;

  return (
    <section className="inventario-module">
      {/* Hero Corporativo Dental FC */}
      <div className="corp-hero">
        <div className="corp-hero-content">
          <div className="corp-hero-tag">
            <span className="dot-ok" />
            <span>Kárdex & Farmacia Dental</span>
          </div>
          <h1 className="corp-hero-title">
            Inventario y Control de Insumos — <span>Dental FC</span>
          </h1>
          <p className="corp-hero-subtitle">
            Supervisión de existencias clínicas, alertas de stock mínimo y reposición automatizada de consumibles médicos.
          </p>
          <div className="corp-hero-meta">
            <span className="corp-meta-chip">
              <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
              {countNormal} Insumos en Nivel Óptimo
            </span>
            {countCriticos > 0 ? (
              <span className="corp-meta-chip" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)' }}>
                <Icon name="alert" size="sm" style={{ color: 'var(--danger)' }} />
                {countCriticos} en Nivel Crítico
              </span>
            ) : (
              <span className="corp-meta-chip">
                <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
                Sin alertas críticas
              </span>
            )}
            <span className="corp-meta-chip">
              <Icon name="clock" size="sm" />
              Kárdex actualizado en vivo
            </span>
          </div>
        </div>
        <div className="corp-hero-actions">
          <button className="btn btn-secondary" onClick={() => onPedirStock()}>
            <Icon name="download" size="sm" />
            <span>Generar Orden</span>
          </button>
          <button className="btn btn-primary" onClick={onOpenNewInsumo}>
            <Icon name="plus" size="sm" />
            <span>Nuevo Insumo</span>
          </button>
        </div>
      </div>

      {/* KPIs Corporativos */}
      <div className="corp-kpis-grid">
        <div className="corp-kpi-card">
          <div className="kpi-ic">
            <Icon name="layers" size="md" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Materiales</span>
            <span className="kpi-val">{insumos.length}</span>
            <span className="kpi-sub positive">Catálogo en almacén</span>
          </div>
        </div>

        <div className="corp-kpi-card">
          <div className="kpi-ic warn" style={{ background: countCriticos > 0 ? 'rgba(239, 68, 68, 0.12)' : undefined, color: countCriticos > 0 ? 'var(--danger)' : undefined }}>
            <Icon name="alert" size="md" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">En Estado Crítico</span>
            <span className="kpi-val" style={{ color: countCriticos > 0 ? 'var(--danger)' : undefined }}>{countCriticos}</span>
            <span className="kpi-sub negative">Requieren compra urgente</span>
          </div>
        </div>

        <div className="corp-kpi-card">
          <div className="kpi-ic">
            <Icon name="activity" size="md" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Bajo el Mínimo</span>
            <span className="kpi-val">{countBajos}</span>
            <span className="kpi-sub neutral">En monitoreo preventivo</span>
          </div>
        </div>

        <div className="corp-kpi-card">
          <div className="kpi-ic ok">
            <Icon name="check" size="md" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Nivel Óptimo</span>
            <span className="kpi-val">{countNormal}</span>
            <span className="kpi-sub positive">Abastecidos para atención</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="card card-pad mt" style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="search" style={{ flex: 1, minWidth: '240px' }}>
          <Icon name="search" size="sm" />
          <input
            className="input"
            placeholder="Buscar material o insumo por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Categoría:</span>
          <select
            className="select"
            style={{ width: 'auto', minWidth: '170px' }}
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
          >
            <option value="todos">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de Insumos */}
      <div className="card mt">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Código</th>
                <th>Material / Insumo</th>
                <th>Categoría</th>
                <th>Stock Actual</th>
                <th>Stock Mínimo</th>
                <th style={{ width: '180px' }}>Nivel de Existencia</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInsumos.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="badge" style={{ fontSize: '11px' }}>{item.id}</span>
                  </td>
                  <td>
                    <b style={{ color: 'var(--text)' }}>{item.nombre}</b>
                  </td>
                  <td>
                    <span className="sub">{item.categoria}</span>
                  </td>
                  <td>
                    <b style={{ fontSize: '14px', color: item.estado === 'Crítico' ? 'var(--danger)' : 'var(--text)' }}>
                      {item.stockActual}
                    </b>{' '}
                    <span className="sub">{item.unidad}</span>
                  </td>
                  <td>
                    <span>{item.stockMinimo} {item.unidad}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress" style={{ flex: 1, height: '6px' }}>
                        <i
                          style={{
                            width: `${item.porcentaje}%`,
                            background:
                              item.estado === 'Crítico'
                                ? 'var(--danger)'
                                : item.estado === 'Bajo'
                                ? 'var(--warn)'
                                : 'var(--ok)',
                          }}
                        />
                      </div>
                      <span className="sub" style={{ fontSize: '11px', width: '32px', textAlign: 'right' }}>
                        {item.porcentaje}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${item.estado === 'Crítico' ? 'danger' : item.estado === 'Bajo' ? 'warn' : 'ok'}`}>
                      {item.estado}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions" style={{ justifyContent: 'flex-end' }}>
                      {onAjustarStock && (
                        <>
                          <button
                            className="act"
                            onClick={() => onAjustarStock(item.id, -1)}
                            title="Descontar 1 unidad"
                          >
                            -
                          </button>
                          <button
                            className="act"
                            onClick={() => onAjustarStock(item.id, 1)}
                            title="Ingresar 1 unidad"
                          >
                            +
                          </button>
                        </>
                      )}
                      <button
                        className="btn btn-sm"
                        style={{ padding: '3px 8px', fontSize: '11.5px' }}
                        onClick={() => onPedirStock(item.nombre)}
                        title="Pedir reposición a proveedor"
                      >
                        Reponer
                      </button>
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
