import React, { useState } from 'react';
import { Icon } from '../../shared/components/Icon';
import { MetodoPago, ReporteItem, formatMoney } from '../../shared/types/dental.types';
import './CajaModule.css';

interface CajaModuleProps {
  reportes: ReporteItem[];
  onOpenNewCobro: () => void;
  onShowToast?: (msg: string, type?: 'ok' | 'warn' | 'err') => void;
}

interface PatientPaymentProfile {
  id: number;
  nom: string;
  doc: string;
  presupuesto: number;
  tratamientos: string[];
}

interface PatientTransaction {
  id: string;
  pacienteId: number;
  fecha: string;
  monto: number;
  metodo: 'Yape' | 'Plin' | 'Efectivo' | 'Tarjeta';
  estado: 'Confirmado' | 'Pendiente';
  concepto: string;
  obs?: string;
}

const MOCK_PATIENTS_PAYMENT: PatientPaymentProfile[] = [
  {
    id: 1,
    nom: 'Ana María Quispe Rojas',
    doc: '71234567',
    presupuesto: 1370.0,
    tratamientos: [
      'Endodoncia Molar 4.6 (Conductometría y Obturación)',
      'Curación con Resina Fotocurable 3M',
      'Profilaxis y Destartraje Ultrasónico',
    ],
  },
  {
    id: 2,
    nom: 'Carlos Eduardo Mendoza Paredes',
    doc: '45892134',
    presupuesto: 2400.0,
    tratamientos: [
      'Diseño de Sonrisa - Carillas E-Max',
      'Blanqueamiento Láser en Consultorio',
    ],
  },
  {
    id: 3,
    nom: 'Lucía Fernanda Vargas Meléndez',
    doc: '73219482',
    presupuesto: 850.0,
    tratamientos: [
      'Ortodoncia Control Mensual (Arcos y Ligaduras)',
      'Limpieza y Flúor Barniz',
    ],
  },
  {
    id: 4,
    nom: 'Roberto Gómez Bolaños',
    doc: '08912345',
    presupuesto: 1800.0,
    tratamientos: [
      'Implante Dental Titanio Grado V',
      'Corona sobre Implante Porcelana',
    ],
  },
];

const INITIAL_TRANSACTIONS: PatientTransaction[] = [
  {
    id: 'tx-1',
    pacienteId: 1,
    fecha: '10 Mar 2026',
    monto: 120.0,
    metodo: 'Plin',
    estado: 'Confirmado',
    concepto: 'Apertura de historia y radiografías periapicales',
  },
  {
    id: 'tx-2',
    pacienteId: 1,
    fecha: '01 Jun 2026',
    monto: 40.0,
    metodo: 'Efectivo',
    estado: 'Confirmado',
    concepto: 'Control post-operatorio y medicación',
  },
  {
    id: 'tx-3',
    pacienteId: 1,
    fecha: '15 Jun 2026',
    monto: 500.0,
    metodo: 'Efectivo',
    estado: 'Confirmado',
    concepto: 'Instrumentación mecánica y desinfección rotatoria',
  },
  {
    id: 'tx-4',
    pacienteId: 1,
    fecha: '08 Jul 2026',
    monto: 80.0,
    metodo: 'Yape',
    estado: 'Confirmado',
    concepto: 'Abono para sellado provisional',
  },
];

export const CajaModule: React.FC<CajaModuleProps> = ({
  reportes,
  onOpenNewCobro,
  onShowToast,
}) => {
  // Pestaña activa: 'pagos' (Cuenta corriente) vs 'movimientos' (Arqueo y Diario)
  const [activeTab, setActiveTab] = useState<'pagos' | 'movimientos'>('pagos');

  // Estado del módulo de pagos y cuenta corriente
  const [selectedPacienteId, setSelectedPacienteId] = useState<number>(1);
  const [selectedTratamiento, setSelectedTratamiento] = useState<string>('');
  const [montoAbono, setMontoAbono] = useState<string>('150.00');
  const [metodoPago, setMetodoPago] = useState<'Yape' | 'Plin' | 'Efectivo' | 'Tarjeta'>('Efectivo');
  const [observaciones, setObservaciones] = useState<string>('');
  const [transactions, setTransactions] = useState<PatientTransaction[]>(INITIAL_TRANSACTIONS);

  // Estados del diario de movimientos
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('todos');
  const [showCierreModal, setShowCierreModal] = useState(false);

  // Paciente actual seleccionado en cuenta corriente
  const currentPatient =
    MOCK_PATIENTS_PAYMENT.find((p) => p.id === selectedPacienteId) || MOCK_PATIENTS_PAYMENT[0];

  // Cálculos dinámicos de estado de cuenta
  const currentPatientTransactions = transactions.filter(
    (t) => t.pacienteId === currentPatient.id
  );
  const abonoAcumulado = currentPatientTransactions.reduce((acc, t) => acc + t.monto, 0);
  const presupuestoTotal = currentPatient.presupuesto;
  const deudaPendiente = Math.max(0, presupuestoTotal - abonoAcumulado);
  const porcentajeCubierto =
    presupuestoTotal > 0 ? Math.min(100, Math.round((abonoAcumulado / presupuestoTotal) * 100)) : 0;

  // Manejador para registrar un nuevo pago
  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const montoNum = parseFloat(montoAbono);
    if (isNaN(montoNum) || montoNum <= 0) {
      if (onShowToast) {
        onShowToast('Por favor ingrese un monto válido para el abono.', 'warn');
      }
      return;
    }

    const newTx: PatientTransaction = {
      id: `tx-${Date.now()}`,
      pacienteId: currentPatient.id,
      fecha: new Date().toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      monto: montoNum,
      metodo: metodoPago,
      estado: 'Confirmado',
      concepto: selectedTratamiento || 'Abono general a cuenta clínica',
      obs: observaciones.trim() || undefined,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setObservaciones('');

    if (onShowToast) {
      onShowToast(
        `Abono de S/. ${montoNum.toFixed(2)} registrado correctamente en la cuenta de ${currentPatient.nom}`,
        'ok'
      );
    }
  };

  // Manejador para eliminar una transacción del historial
  const handleDeleteTx = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    if (onShowToast) {
      onShowToast('Transacción eliminada del estado de cuenta.', 'warn');
    }
  };

  // Cálculos para la vista de arqueo de caja de hoy
  const todayTransactions = reportes.filter((r) => r.f === '2026-10-24');
  const filteredTransactions = todayTransactions.filter((r) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        r.pac.toLowerCase().includes(q) ||
        r.nro.toLowerCase().includes(q) ||
        r.con.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (methodFilter !== 'todos' && r.met !== methodFilter) return false;
    return true;
  });

  const totalIngresos = todayTransactions.reduce((acc, r) => acc + r.m, 0);
  const totalTarjeta = todayTransactions
    .filter((r) => r.met === 'Tarjeta')
    .reduce((acc, r) => acc + r.m, 0);
  const totalEfectivo = todayTransactions
    .filter((r) => r.met === 'Efectivo')
    .reduce((acc, r) => acc + r.m, 0);
  const totalDigital = todayTransactions
    .filter((r) => r.met === 'Yape / Plin' || r.met === 'Transferencia')
    .reduce((acc, r) => acc + r.m, 0);

  return (
    <section className="caja-module">
      {/* Hero Corporativo Dental FC */}
      <div className="corp-hero">
        <div className="corp-hero-content">
          <div className="corp-hero-tag">
            <span className="dot-ok" />
            <span>Tesorería & Facturación SUNAT</span>
          </div>
          <h1 className="corp-hero-title">
            Caja y Pagos — <span>Dental FC</span>
          </h1>
          <p className="corp-hero-subtitle">
            Gestión integral de abonos, cuentas corrientes de pacientes, arqueo diario de caja y emisión tributaria.
          </p>
          <div className="corp-hero-meta">
            <span className="corp-meta-chip">
              <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
              Turno Mañana Abierto
            </span>
            <span className="corp-meta-chip">
              <Icon name="dollar" size="sm" style={{ color: 'var(--primary-2)' }} />
              S/ {totalIngresos.toLocaleString()} Cobrados Hoy
            </span>
            <span className="corp-meta-chip">
              <Icon name="clock" size="sm" />
              Arqueo en tiempo real
            </span>
          </div>
        </div>
        <div className="corp-hero-actions">
          <button className="btn btn-secondary" onClick={() => setShowCierreModal(true)}>
            <Icon name="printer" size="sm" />
            <span>Cierre de Caja</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setActiveTab('pagos');
              if (onOpenNewCobro) onOpenNewCobro();
            }}
          >
            <Icon name="plus" size="sm" />
            <span>Registrar Cobro</span>
          </button>
        </div>
      </div>

      {/* 4 KPIs Corporativos en fila de 4 continua */}
      <div className="corp-kpis-grid">
        <div className="corp-kpi-card">
          <div className="kpi-ic ok">
            <Icon name="dollar" size="md" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Ingresos de Hoy</span>
            <span className="kpi-val">{formatMoney(totalIngresos)}</span>
            <span className="kpi-sub positive">{todayTransactions.length} operaciones registradas</span>
          </div>
        </div>

        <div className="corp-kpi-card">
          <div className="kpi-ic">
            <Icon name="card" size="md" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Tarjeta / POS</span>
            <span className="kpi-val">{formatMoney(totalTarjeta)}</span>
            <span className="kpi-sub neutral">
              {((totalTarjeta / (totalIngresos || 1)) * 100).toFixed(0)}% del total
            </span>
          </div>
        </div>

        <div className="corp-kpi-card">
          <div className="kpi-ic">
            <Icon name="activity" size="md" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Efectivo Físico</span>
            <span className="kpi-val">{formatMoney(totalEfectivo)}</span>
            <span className="kpi-sub positive">En gaveta de recepción</span>
          </div>
        </div>

        <div className="corp-kpi-card">
          <div className="kpi-ic">
            <Icon name="phone" size="md" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Yape / Plin / Bancos</span>
            <span className="kpi-val">{formatMoney(totalDigital)}</span>
            <span className="kpi-sub positive">Acreditado en cuenta</span>
          </div>
        </div>
      </div>

      {/* Pestañas de Navegación de Caja */}
      <div className="caja-view-tabs">
        <button
          className={`caja-tab-btn ${activeTab === 'pagos' ? 'active' : ''}`}
          onClick={() => setActiveTab('pagos')}
        >
          <Icon name="receipt" size="sm" />
          <span>Registrar Pago & Estado de Cuenta</span>
        </button>
        <button
          className={`caja-tab-btn ${activeTab === 'movimientos' ? 'active' : ''}`}
          onClick={() => setActiveTab('movimientos')}
        >
          <Icon name="clock" size="sm" />
          <span>Movimientos Diarios & Arqueo</span>
        </button>
      </div>

      {/* =========================================================
          VISTA 1: REGISTRAR NUEVO PAGO Y ESTADO DE CUENTA (MOCKUP ADAPTADO)
          ========================================================= */}
      {activeTab === 'pagos' && (
        <div className="caja-pagos-grid">
          {/* Columna Izquierda: Formulario Registrar Nuevo Pago */}
          <div className="card caja-pay-form-card">
            <div className="caja-card-header">
              <h2 className="caja-card-title">Registrar Nuevo Pago</h2>
              <span className="caja-card-badge">Abono Clínico</span>
            </div>

            <form onSubmit={handleRegisterPayment} className="caja-form-body">
              {/* Seleccionar Paciente */}
              <div className="form-group">
                <label className="form-label" htmlFor="pay-paciente-select">
                  Seleccionar Paciente
                </label>
                <div className="select-wrap">
                  <select
                    id="pay-paciente-select"
                    className="select"
                    value={selectedPacienteId}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setSelectedPacienteId(id);
                      setSelectedTratamiento('');
                    }}
                  >
                    {MOCK_PATIENTS_PAYMENT.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nom} — DNI {p.doc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tratamiento / Concepto */}
              <div className="form-group">
                <label className="form-label" htmlFor="pay-tratamiento-select">
                  Tratamiento / Concepto
                </label>
                <div className="select-wrap">
                  <select
                    id="pay-tratamiento-select"
                    className="select"
                    value={selectedTratamiento}
                    onChange={(e) => setSelectedTratamiento(e.target.value)}
                  >
                    <option value="">Seleccionar tratamiento...</option>
                    {currentPatient.tratamientos.map((t, idx) => (
                      <option key={idx} value={t}>
                        {t}
                      </option>
                    ))}
                    <option value="Consulta y Evaluación General">Consulta y Evaluación General</option>
                    <option value="Control de Urgencia Odontológica">Control de Urgencia Odontológica</option>
                  </select>
                </div>
              </div>

              {/* Monto del Abono */}
              <div className="form-group">
                <label className="form-label" htmlFor="pay-monto-input">
                  Monto del Abono (S/.)
                </label>
                <div className="input-prefix-wrap">
                  <span className="input-prefix">S/.</span>
                  <input
                    id="pay-monto-input"
                    type="number"
                    step="0.01"
                    min="1"
                    className="input input-with-prefix"
                    value={montoAbono}
                    onChange={(e) => setMontoAbono(e.target.value)}
                    placeholder="150.00"
                    required
                  />
                </div>
              </div>

              {/* Método de Pago (4 opciones en grilla interactiva) */}
              <div className="form-group">
                <label className="form-label">Método de Pago</label>
                <div className="metodo-pago-grid">
                  {/* Yape */}
                  <button
                    type="button"
                    className={`metodo-btn yape ${metodoPago === 'Yape' ? 'active' : ''}`}
                    onClick={() => setMetodoPago('Yape')}
                  >
                    <div className="metodo-icon-wrapper yape-bg">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <rect x="5" y="2" width="14" height="20" rx="3" />
                        <line x1="12" y1="18" x2="12" y2="18.01" />
                      </svg>
                    </div>
                    <span className="metodo-name">Yape</span>
                    {metodoPago === 'Yape' && <span className="metodo-check-dot" />}
                  </button>

                  {/* Plin */}
                  <button
                    type="button"
                    className={`metodo-btn plin ${metodoPago === 'Plin' ? 'active' : ''}`}
                    onClick={() => setMetodoPago('Plin')}
                  >
                    <div className="metodo-icon-wrapper plin-bg">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <polyline points="17 1 21 5 17 9" />
                        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                        <polyline points="7 23 3 19 7 15" />
                        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                      </svg>
                    </div>
                    <span className="metodo-name">Plin</span>
                    {metodoPago === 'Plin' && <span className="metodo-check-dot" />}
                  </button>

                  {/* Efectivo */}
                  <button
                    type="button"
                    className={`metodo-btn efectivo ${metodoPago === 'Efectivo' ? 'active' : ''}`}
                    onClick={() => setMetodoPago('Efectivo')}
                  >
                    <div className="metodo-icon-wrapper efectivo-bg">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="M6 12h.01M18 12h.01" />
                      </svg>
                    </div>
                    <span className="metodo-name">Efectivo</span>
                    {metodoPago === 'Efectivo' && <span className="metodo-check-dot" />}
                  </button>

                  {/* Tarjeta */}
                  <button
                    type="button"
                    className={`metodo-btn tarjeta ${metodoPago === 'Tarjeta' ? 'active' : ''}`}
                    onClick={() => setMetodoPago('Tarjeta')}
                  >
                    <div className="metodo-icon-wrapper tarjeta-bg">
                      <Icon name="card" size="sm" />
                    </div>
                    <span className="metodo-name">Tarjeta</span>
                    {metodoPago === 'Tarjeta' && <span className="metodo-check-dot" />}
                  </button>
                </div>
              </div>

              {/* Observaciones / Notas */}
              <div className="form-group">
                <label className="form-label" htmlFor="pay-observaciones">
                  Observaciones / Notas
                </label>
                <input
                  id="pay-observaciones"
                  type="text"
                  className="input"
                  placeholder="Ej. Abono por curación de molar..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </div>

              {/* Botón Principal Registrar Pago */}
              <button type="submit" className="btn btn-primary btn-block btn-registrar-pago">
                <Icon name="check" size="sm" />
                <span>Registrar Pago</span>
              </button>
            </form>
          </div>

          {/* Columna Derecha: Estado de Cuenta & Historial */}
          <div className="caja-pay-right-col">
            {/* Card Superior: Estado de Cuenta del Paciente */}
            <div className="card caja-account-card">
              <div className="caja-account-header">
                <div>
                  <span className="caja-account-badge">Presupuesto y Finanzas</span>
                  <h3 className="caja-account-title">
                    Estado de Cuenta — <span>{currentPatient.nom}</span>
                  </h3>
                </div>
                <div className="caja-account-doc-chip">
                  <Icon name="user" size="sm" />
                  <span>DNI {currentPatient.doc}</span>
                </div>
              </div>

              <div className="caja-account-stats-grid">
                <div className="caja-stat-item">
                  <span className="caja-stat-label">Presupuesto Total:</span>
                  <span className="caja-stat-value">S/. {presupuestoTotal.toFixed(2)}</span>
                </div>

                <div className="caja-stat-item">
                  <span className="caja-stat-label">Abono Acumulado:</span>
                  <span className="caja-stat-value text-ok">S/. {abonoAcumulado.toFixed(2)}</span>
                </div>

                <div className="caja-stat-item highlight-deuda">
                  <span className="caja-stat-label">Deuda Pendiente:</span>
                  <span className="caja-stat-value text-warn">S/. {deudaPendiente.toFixed(2)}</span>
                </div>
              </div>

              {/* Barra de Progreso Presupuestal */}
              <div className="caja-progress-container">
                <div className="caja-progress-bar-track">
                  <div
                    className="caja-progress-bar-fill"
                    style={{ width: `${porcentajeCubierto}%` }}
                  />
                </div>
                <div className="caja-progress-meta">
                  <span className="caja-progress-percentage">{porcentajeCubierto}% cubierto del presupuesto</span>
                  <span className="caja-progress-remaining">
                    {deudaPendiente === 0 ? 'Cuenta completamente saldada' : `Resta S/. ${deudaPendiente.toFixed(2)} por cancelar`}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Inferior: Historial de Transacciones */}
            <div className="card caja-tx-card">
              <div className="card-head">
                <h3>
                  <Icon name="receipt" size="sm" />
                  <span>Historial de Transacciones</span>
                </h3>
                <span className="sub">{currentPatientTransactions.length} abonos registrados</span>
              </div>

              <div className="table-wrap">
                <table className="data">
                  <thead>
                    <tr>
                      <th>FECHA</th>
                      <th>IMPORTE</th>
                      <th>MÉTODO</th>
                      <th>ESTADO</th>
                      <th style={{ textAlign: 'center' }}>ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPatientTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                          No hay transacciones registradas para este paciente.
                        </td>
                      </tr>
                    ) : (
                      currentPatientTransactions.map((tx) => (
                        <tr key={tx.id}>
                          <td>
                            <span className="caja-tx-date">{tx.fecha}</span>
                          </td>
                          <td>
                            <span className="caja-tx-monto">S/. {tx.monto.toFixed(2)}</span>
                          </td>
                          <td>
                            <span className={`caja-tx-method-pill ${tx.metodo.toLowerCase()}`}>
                              {tx.metodo === 'Yape' && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                                  <rect x="5" y="2" width="14" height="20" rx="3" />
                                </svg>
                              )}
                              {tx.metodo === 'Plin' && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                                  <polyline points="17 1 21 5 17 9" />
                                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                                </svg>
                              )}
                              {tx.metodo === 'Efectivo' && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                                  <rect x="2" y="6" width="20" height="12" rx="2" />
                                  <circle cx="12" cy="12" r="2" />
                                </svg>
                              )}
                              {tx.metodo === 'Tarjeta' && <Icon name="card" size="sm" />}
                              <span>{tx.metodo}</span>
                            </span>
                          </td>
                          <td>
                            <span className="badge ok">{tx.estado}</span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              className="icon-btn caja-btn-delete"
                              onClick={() => handleDeleteTx(tx.id)}
                              title="Eliminar abono de la cuenta"
                            >
                              <Icon name="trash" size="sm" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          VISTA 2: DIARIO DE MOVIMIENTOS & ARQUEO DE CAJA GENERAL
          ========================================================= */}
      {activeTab === 'movimientos' && (
        <>
          {/* Filtros de Movimientos */}
          <div className="card card-pad" style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search" style={{ flex: 1, minWidth: '240px' }}>
              <Icon name="search" size="sm" />
              <input
                className="input"
                placeholder="Buscar por paciente, número de comprobante o concepto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Método de pago:</span>
              <select
                className="select"
                style={{ width: 'auto', minWidth: '170px' }}
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

          {/* Tabla de Movimientos Recientes */}
          <div className="card">
            <div className="card-head">
              <h3>
                <Icon name="clock" />
                <span>Movimientos de hoy (24/10/2026)</span>
              </h3>
              <span className="sub">{filteredTransactions.length} registros</span>
            </div>
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Comprobante</th>
                    <th>Paciente</th>
                    <th>Concepto / Procedimiento</th>
                    <th>Método de Pago</th>
                    <th>Estado</th>
                    <th style={{ textAlign: 'right' }}>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((r, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className="time-pill" style={{ fontSize: '11.5px', padding: '3px 7px' }}>
                          {r.h}
                        </span>
                      </td>
                      <td>
                        <div>
                          <b style={{ color: 'var(--text)' }}>{r.nro}</b>
                          <span className="sub" style={{ display: 'block' }}>{r.comp}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{r.pac}</span>
                      </td>
                      <td>{r.con}</td>
                      <td>
                        <span className="badge" style={{ fontSize: '11px' }}>{r.met}</span>
                      </td>
                      <td>
                        <span className="badge ok">{r.est}</span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '14px' }}>
                        {formatMoney(r.m)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--surface-2)', fontWeight: 800 }}>
                    <td colSpan={6} style={{ textAlign: 'right', padding: '14px 16px' }}>
                      Total en Caja del Turno:
                    </td>
                    <td style={{ textAlign: 'right', padding: '14px 16px', color: 'var(--primary-2)', fontSize: '16px' }}>
                      {formatMoney(totalIngresos)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal Arqueo y Cierre de Caja */}
      {showCierreModal && (
        <div className="modal-overlay" onClick={() => setShowCierreModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-head">
              <h3>
                <Icon name="printer" size="lg" />
                <span>Arqueo y Cierre de Caja del Día</span>
              </h3>
              <button className="icon-btn" onClick={() => setShowCierreModal(false)}>
                <Icon name="x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="card" style={{ padding: '16px', marginBottom: '16px', background: 'var(--surface-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="sub">Sede:</span>
                  <b>Sede Central (Surco)</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="sub">Cajero(a) a cargo:</span>
                  <b>Jorge Linares (Caja Turno Mañana)</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="sub">Fecha de corte:</span>
                  <b>24/10/2026 — 13:00 hrs</b>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: '8px' }}>
                  <span>Efectivo contado físico en gaveta:</span>
                  <b>{formatMoney(totalEfectivo)}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: '8px' }}>
                  <span>Transacciones POS Tarjetas:</span>
                  <b>{formatMoney(totalTarjeta)}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: '8px' }}>
                  <span>Transferencias & Billeteras:</span>
                  <b>{formatMoney(totalDigital)}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--primary-soft)', border: '1px solid var(--primary)', borderRadius: '8px', fontSize: '15px' }}>
                  <b>Total Arqueado:</b>
                  <b style={{ color: 'var(--primary-2)' }}>{formatMoney(totalIngresos)}</b>
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={() => setShowCierreModal(false)}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  window.print();
                  setShowCierreModal(false);
                }}
              >
                <Icon name="printer" size="sm" />
                <span>Imprimir Ticket de Cierre</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
