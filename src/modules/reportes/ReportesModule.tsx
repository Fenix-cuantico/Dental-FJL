import React, { useState } from 'react';
import { Icon } from '../../shared/components/Icon';
import { Doctor, ReporteItem, formatMoney } from '../../shared/types/dental.types';
import './ReportesModule.css';

interface ReportesModuleProps {
  doctors: Doctor[];
  reportes: ReporteItem[];
}

type DatePreset = 'hoy' | 'esta-semana' | 'semana-ant' | 'este-mes' | 'mes-ant' | 'todo';

export const ReportesModule: React.FC<ReportesModuleProps> = ({ doctors, reportes }) => {
  const [preset, setPreset] = useState<DatePreset>('todo');
  const [dateFrom, setDateFrom] = useState<string>('2026-10-19');
  const [dateTo, setDateTo] = useState<string>('2026-10-24');
  const [docFilter, setDocFilter] = useState<string>('todos');
  const [methodFilter, setMethodFilter] = useState<string>('todos');

  const applyPreset = (p: DatePreset) => {
    setPreset(p);
    switch (p) {
      case 'hoy':
        setDateFrom('2026-10-24');
        setDateTo('2026-10-24');
        break;
      case 'esta-semana':
        setDateFrom('2026-10-19');
        setDateTo('2026-10-24');
        break;
      case 'semana-ant':
        setDateFrom('2026-10-12');
        setDateTo('2026-10-18');
        break;
      case 'este-mes':
        setDateFrom('2026-10-01');
        setDateTo('2026-10-31');
        break;
      case 'mes-ant':
        setDateFrom('2026-09-01');
        setDateTo('2026-09-30');
        break;
      case 'todo':
        setDateFrom('2026-10-01');
        setDateTo('2026-10-31');
        break;
    }
  };

  const filteredItems = reportes.filter((r) => {
    if (dateFrom && r.f < dateFrom) return false;
    if (dateTo && r.f > dateTo) return false;
    if (docFilter !== 'todos' && r.doc !== docFilter) return false;
    if (methodFilter !== 'todos' && r.met !== methodFilter) return false;
    return true;
  });

  const totalRecaudado = filteredItems.reduce((acc, r) => acc + r.m, 0);
  const numTransacciones = filteredItems.length;
  const ticketPromedio = numTransacciones > 0 ? totalRecaudado / numTransacciones : 0;

  const totalDigital = filteredItems
    .filter((r) => r.met !== 'Efectivo')
    .reduce((acc, r) => acc + r.m, 0);
  const pctDigital = totalRecaudado > 0 ? (totalDigital / totalRecaudado) * 100 : 0;

  // Exportar a Excel (.csv con UTF-8 BOM nativo, sin ninguna librería externa)
  const exportToExcel = () => {
    const headers = ['Fecha', 'Hora', 'Comprobante', 'Nro', 'Paciente', 'Concepto', 'Doctor ID', 'Metodo', 'Estado', 'Monto'];
    const rows = filteredItems.map((r) => [
      r.f,
      r.h,
      r.comp,
      r.nro,
      `"${r.pac.replace(/"/g, '""')}"`,
      `"${r.con.replace(/"/g, '""')}"`,
      r.doc,
      r.met,
      r.est,
      r.m.toFixed(2),
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Reporte_Dental_FJL_${dateFrom}_al_${dateTo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="reportes-module">
      {/* Cabecera para Impresión Limpia PDF */}
      <div className="print-head">
        <h2 style={{ fontSize: '20px', color: '#1e3a8a' }}>Dental FC — Reporte Contable y Clínico</h2>
        <p style={{ fontSize: '12px', color: '#555' }}>
          Periodo: {dateFrom} al {dateTo} | Generado el: {new Date().toLocaleDateString('es-PE')}
        </p>
      </div>

      {/* Hero Corporativo Dental FC */}
      <div className="corp-hero">
        <div className="corp-hero-content">
          <div className="corp-hero-tag">
            <span className="dot-ok" />
            <span>Auditoría & Analítica Clínica</span>
          </div>
          <h1 className="corp-hero-title">
            Reportes e Inteligencia de Negocio — <span>Dental FC</span>
          </h1>
          <p className="corp-hero-subtitle">
            Auditoría de ingresos contables, atenciones odontológicas y exportación ejecutiva en Excel y formato oficial PDF.
          </p>
          <div className="corp-hero-meta">
            <span className="corp-meta-chip">
              <Icon name="calendar" size="sm" style={{ color: 'var(--primary-2)' }} />
              Periodo: {dateFrom} al {dateTo}
            </span>
            <span className="corp-meta-chip">
              <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
              {filteredItems.length} Operaciones Auditadas
            </span>
            <span className="corp-meta-chip">
              <Icon name="clock" size="sm" />
              Cierre fiscal sincronizado
            </span>
          </div>
        </div>
        <div className="corp-hero-actions">
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Icon name="printer" size="sm" />
            <span>Imprimir / PDF</span>
          </button>
          <button className="btn btn-primary" onClick={exportToExcel}>
            <Icon name="download" size="sm" />
            <span>Exportar a Excel (.csv)</span>
          </button>
        </div>
      </div>

      {/* Selector de Rango de Fechas & Filtros */}
      <div className="card card-pad mt">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-soft)' }}>
              Periodo de análisis:
            </span>
            <div className="seg">
              <button className={preset === 'hoy' ? 'on' : ''} onClick={() => applyPreset('hoy')}>
                Hoy
              </button>
              <button className={preset === 'esta-semana' ? 'on' : ''} onClick={() => applyPreset('esta-semana')}>
                Esta semana
              </button>
              <button className={preset === 'semana-ant' ? 'on' : ''} onClick={() => applyPreset('semana-ant')}>
                Semana anterior
              </button>
              <button className={preset === 'este-mes' ? 'on' : ''} onClick={() => applyPreset('este-mes')}>
                Este mes
              </button>
              <button className={preset === 'mes-ant' ? 'on' : ''} onClick={() => applyPreset('mes-ant')}>
                Mes anterior
              </button>
              <button className={preset === 'todo' ? 'on' : ''} onClick={() => applyPreset('todo')}>
                Todo
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Desde:</span>
              <input
                type="date"
                className="input"
                style={{ width: 'auto' }}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Hasta:</span>
              <input
                type="date"
                className="input"
                style={{ width: 'auto' }}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Profesional:</span>
              <select
                className="select"
                style={{ width: 'auto', minWidth: '180px' }}
                value={docFilter}
                onChange={(e) => setDocFilter(e.target.value)}
              >
                <option value="todos">Todos los doctores</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre} ({d.esp})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Método:</span>
              <select
                className="select"
                style={{ width: 'auto', minWidth: '160px' }}
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
              >
                <option value="todos">Todos los métodos</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Yape / Plin">Yape / Plin</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPIs Corporativos */}
      <div className="corp-kpis-grid mt">
        <div className="corp-kpi-card">
          <div className="kpi-ic ok">
            <Icon name="dollar" size="md" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Recaudado</span>
            <span className="kpi-val">{formatMoney(totalRecaudado)}</span>
            <span className="kpi-sub positive">Periodo seleccionado</span>
          </div>
        </div>

        <div className="corp-kpi-card">
          <div className="kpi-ic">
            <Icon name="clipboard" size="md" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Transacciones Realizadas</span>
            <span className="kpi-val">{numTransacciones}</span>
            <span className="kpi-sub positive">Cobros completados</span>
          </div>
        </div>

        <div className="corp-kpi-card">
          <div className="kpi-ic">
            <Icon name="card" size="md" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Ticket Promedio</span>
            <span className="kpi-val">{formatMoney(ticketPromedio)}</span>
            <span className="kpi-sub neutral">Por atención clínica</span>
          </div>
        </div>

        <div className="corp-kpi-card">
          <div className="kpi-ic">
            <Icon name="activity" size="md" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Cobranza Digital / Tarjetas</span>
            <span className="kpi-val">{pctDigital.toFixed(1)}%</span>
            <span className="kpi-sub neutral">{(100 - pctDigital).toFixed(1)}% en efectivo</span>
          </div>
        </div>
      </div>

      {/* Tabla Detallada con Suma Final */}
      <div className="card mt">
        <div className="card-head">
          <h3>
            <Icon name="file" />
            <span>Detalle de Movimientos Clínicos y Financieros</span>
          </h3>
          <span className="sub">{filteredItems.length} transacciones registradas</span>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Fecha / Hora</th>
                <th>Comprobante</th>
                <th>Paciente</th>
                <th>Concepto / Procedimiento</th>
                <th>Doctor</th>
                <th>Método de Pago</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((r, idx) => {
                const doc = doctors.find((d) => d.id === r.doc);
                return (
                  <tr key={idx}>
                    <td>
                      <div>
                        <b>{r.f}</b>
                        <span className="sub" style={{ display: 'block' }}>{r.h}</span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <b>{r.nro}</b>
                        <span className="sub" style={{ display: 'block' }}>{r.comp}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{r.pac}</span>
                    </td>
                    <td>{r.con}</td>
                    <td>
                      <span className="sub">{doc?.nombre || r.doc}</span>
                    </td>
                    <td>
                      <span className="badge">{r.met}</span>
                    </td>
                    <td>
                      <span className="badge ok">{r.est}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800 }}>
                      {formatMoney(r.m)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--surface-2)', fontWeight: 800 }}>
                <td colSpan={7} style={{ textAlign: 'right', padding: '16px' }}>
                  Total Consolidado del Periodo:
                </td>
                <td style={{ textAlign: 'right', padding: '16px', color: 'var(--primary-2)', fontSize: '17px' }}>
                  {formatMoney(totalRecaudado)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
};
