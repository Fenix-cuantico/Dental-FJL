import React, { useState } from 'react';
import { Icon } from '../../shared/components/Icon';
import './PlanesModule.css';

interface PlanesModuleProps {
  onShowToast?: (msg: string) => void;
}

interface PlanTier {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  badge?: string;
  isCurrent?: boolean;
  features: string[];
  storageGB: number;
  usersLimit: string;
  sedesLimit: string;
  ctaText: string;
  ctaVariant: 'secondary' | 'current' | 'emerald';
}

export const PlanesModule: React.FC<PlanesModuleProps> = ({ onShowToast }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  const tiers: PlanTier[] = [
    {
      id: 'basic',
      name: 'Plan Básico',
      tagline: 'Ideal para odontólogos independientes o consultorios individuales.',
      priceMonthly: 99,
      priceAnnual: 79,
      storageGB: 5,
      usersLimit: '1 Usuario activo',
      sedesLimit: '1 Sede única',
      ctaText: 'Elegir Plan',
      ctaVariant: 'secondary',
      features: [
        'Agenda de citas digital',
        'Registro de hasta 200 Pacientes',
        'Ficha clínica básica',
        '1 Usuario activo',
        'Soporte por correo electrónico',
      ],
    },
    {
      id: 'pro',
      name: 'Plan Clínico (Pro)',
      tagline: 'El plan ideal para clínicas dentales medianas en crecimiento.',
      priceMonthly: 199,
      priceAnnual: 159,
      badge: 'TU PLAN ACTIVO',
      isCurrent: true,
      storageGB: 10,
      usersLimit: 'Hasta 5 Usuarios activos',
      sedesLimit: 'Hasta 2 Sedes',
      ctaText: 'Plan Actual',
      ctaVariant: 'current',
      features: [
        'Agenda y Planificador Semanal',
        'Pacientes ilimitados',
        'Odontograma interactivo FDI',
        'Historias clínicas completas',
        'Hasta 5 Usuarios activos',
        'Soporte prioritario 24/7',
      ],
    },
    {
      id: 'integral',
      name: 'Plan Integral (Premium)',
      tagline: 'Acceso ilimitado para corporaciones odontológicas multi-sede.',
      priceMonthly: 349,
      priceAnnual: 279,
      badge: 'MÁXIMA POTENCIA',
      storageGB: 100,
      usersLimit: 'Usuarios ilimitados',
      sedesLimit: 'Multisede Ilimitada',
      ctaText: 'Elegir Plan',
      ctaVariant: 'emerald',
      features: [
        'Todo lo del plan Clínico (Pro)',
        'Módulo de Caja y Pagos (Finanzas)',
        'Control de Personal y Comisiones',
        'Gestión Multi-inquilino / Sedes',
        'Usuarios activos ilimitados',
        'Copias de seguridad diarias automatizadas',
      ],
    },
  ];

  const handleSelectPlan = (tier: PlanTier) => {
    if (tier.isCurrent) {
      onShowToast?.(`Tu clínica ya cuenta con el plan ${tier.name}`);
      return;
    }
    setSelectedPlan(tier.id);
    onShowToast?.(`Solicitud enviada para migrar al ${tier.name}. Se aplicará en tu próximo ciclo.`);
  };

  const handleDownloadInvoice = (folio: string) => {
    onShowToast?.(`Descargando comprobante oficial ${folio} en formato PDF...`);
  };

  return (
    <section className="planes-module">
      {/* Hero Corporativo Dental FC */}
      <div className="corp-hero">
        <div className="corp-hero-content">
          <div className="corp-hero-tag">
            <span className="dot-ok" />
            <span>Suscripción SaaS & Licenciamiento Cloud</span>
          </div>
          <h1 className="corp-hero-title">
            Planes de Suscripción y Licenciamiento — <span>Dental FC</span>
          </h1>
          <p className="corp-hero-subtitle">
            Gestión de licencias activas, capacidad de almacenamiento clínico y escalabilidad multi-sede.
          </p>
          <div className="corp-hero-meta">
            <span className="corp-meta-chip">
              <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
              Plan Clínico (Pro) Activo
            </span>
            <span className="corp-meta-chip">
              <Icon name="shield" size="sm" style={{ color: 'var(--primary-2)' }} />
              SLA 99.9% Garantizado
            </span>
            <span className="corp-meta-chip">
              <Icon name="database" size="sm" style={{ color: 'var(--text-soft)' }} />
              Backups Diarios Cifrados
            </span>
          </div>
        </div>
        <div className="corp-hero-actions">
          <button className="btn btn-secondary" onClick={() => onShowToast?.('Historial fiscal sincronizado')}>
            <Icon name="receipt" size="sm" />
            <span>Historial Fiscal</span>
          </button>
        </div>
      </div>

      {/* 1. BARRA SUPERIOR DE ESTADO DE CUENTA Y ALMACENAMIENTO */}
      <div className="account-status-card">
        <div className="account-status-left">
          <div className="status-badge-live">
            <span className="live-dot ok" />
            <span className="status-text">Tu cuenta está al día</span>
          </div>
          <span className="account-meta-text">
            Sede Central Surco · Próxima facturación: <b>24 Nov 2026</b> (Visa •••• 4821)
          </span>
        </div>

        <div className="account-status-right">
          <div className="storage-info-header">
            <span className="storage-label">Espacio de Archivos</span>
            <span className="storage-numbers">
              <b>1.8</b> / 10 GB
            </span>
          </div>
          <div className="storage-mini-track">
            <div className="storage-mini-fill" style={{ width: '18%' }} />
          </div>
        </div>
      </div>

      {/* 2. SELECTOR DE CICLO DE FACTURACIÓN (MENSUAL / ANUAL) */}
      <div className="billing-cycle-section">
        <div className="billing-toggle-pill-luxe">
          <button
            type="button"
            className={`billing-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Facturación Mensual
          </button>
          <button
            type="button"
            className={`billing-btn ${billingCycle === 'annual' ? 'active' : ''}`}
            onClick={() => setBillingCycle('annual')}
          >
            <span>Facturación Anual</span>
            <span className="discount-pill">20% desc</span>
          </button>
        </div>
        <p className="billing-helper-text">
          {billingCycle === 'annual'
            ? 'Ahorro institucional de 2 meses completos con el pago anualizado.'
            : 'Cancela o cambia de plan en cualquier momento sin penalizaciones.'}
        </p>
      </div>

      {/* 3. GRID DE TARJETAS DE PLANES (ESTÉTICA ELEVADA) */}
      <div className="plan-grid-luxe">
        {tiers.map((tier) => {
          const price = billingCycle === 'annual' ? tier.priceAnnual : tier.priceMonthly;
          const isCurrent = tier.isCurrent;

          return (
            <div
              key={tier.id}
              className={`plan-card-luxe ${isCurrent ? 'active-featured' : ''} ${
                tier.id === 'integral' ? 'integral-tier' : ''
              }`}
            >
              {/* Badge superior flotante */}
              {tier.badge && (
                <div className="floating-tier-badge">
                  <span className="badge-pulse-glow" />
                  <span>{tier.badge}</span>
                </div>
              )}

              {/* Cabecera del plan */}
              <div className="tier-header">
                <h3 className="tier-title">{tier.name}</h3>
                <p className="tier-tagline">{tier.tagline}</p>
              </div>

              {/* Bloque de Precio */}
              <div className="tier-price-block">
                <div className="price-display">
                  <span className="price-currency">S/.</span>
                  <span className="price-number">{price}</span>
                  <span className="price-interval">/ mes</span>
                </div>
                {billingCycle === 'annual' && (
                  <span className="price-annual-note">Facturado S/ {price * 12} anual</span>
                )}
              </div>

              {/* Lista de Características con Checkmarks Estilizados */}
              <ul className="tier-features-list">
                {tier.features.map((feat, idx) => (
                  <li key={idx} className="tier-feature-item">
                    <span className="check-icon-circle">
                      <Icon name="check" size="sm" />
                    </span>
                    <span className="feature-text">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Botón CTA con distintas variantes */}
              <div className="tier-cta-wrap">
                {tier.ctaVariant === 'current' ? (
                  <button
                    type="button"
                    className="btn-tier btn-tier-current"
                    onClick={() => handleSelectPlan(tier)}
                  >
                    <span>Plan Actual</span>
                  </button>
                ) : tier.ctaVariant === 'emerald' ? (
                  <button
                    type="button"
                    className="btn-tier btn-tier-emerald"
                    onClick={() => handleSelectPlan(tier)}
                  >
                    <span>{tier.ctaText}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-tier btn-tier-secondary"
                    onClick={() => handleSelectPlan(tier)}
                  >
                    <span>{tier.ctaText}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. COMPARATIVA DETALLADA DE CARACTERÍSTICAS (FEATURE MATRIX) */}
      <div className="card matrix-card mt">
        <div className="card-head matrix-head">
          <div className="matrix-head-title">
            <Icon name="search" size="sm" style={{ color: 'var(--primary-2)' }} />
            <h3>Comparativa Detallada de Características</h3>
          </div>
          <span className="sub">Todos los planes incluyen cifrado médico SSL 256-bit y soporte SUNAT</span>
        </div>

        <div className="table-wrap">
          <table className="data matrix-table">
            <thead>
              <tr>
                <th style={{ width: '38%' }}>Funcionalidad / Módulo</th>
                <th style={{ width: '20%', textAlign: 'center' }}>Plan Básico</th>
                <th style={{ width: '22%', textAlign: 'center' }} className="highlight-col">
                  Plan Clínico (Pro)
                </th>
                <th style={{ width: '20%', textAlign: 'center' }}>Plan Integral</th>
              </tr>
            </thead>
            <tbody>
              {/* Sección Clínica */}
              <tr className="matrix-cat-row">
                <td colSpan={4}>MÓDULOS CLÍNICOS & PACIENTES</td>
              </tr>
              <tr>
                <td>Límite de Pacientes registrados</td>
                <td style={{ textAlign: 'center' }}>Hasta 200</td>
                <td style={{ textAlign: 'center' }} className="highlight-col font-bold">
                  Ilimitados
                </td>
                <td style={{ textAlign: 'center' }} className="font-bold">Ilimitados</td>
              </tr>
              <tr>
                <td>Agenda de Citas y Calendario Semanal</td>
                <td style={{ textAlign: 'center' }}><span className="matrix-check">✓</span></td>
                <td style={{ textAlign: 'center' }} className="highlight-col"><span className="matrix-check">✓</span></td>
                <td style={{ textAlign: 'center' }}><span className="matrix-check">✓</span></td>
              </tr>
              <tr>
                <td>Odontograma Digital Interactivo FDI</td>
                <td style={{ textAlign: 'center' }}><span className="matrix-dash">—</span></td>
                <td style={{ textAlign: 'center' }} className="highlight-col"><span className="matrix-check">✓</span></td>
                <td style={{ textAlign: 'center' }}><span className="matrix-check">✓</span></td>
              </tr>
              <tr>
                <td>Historia Clínica y Anamnesis completa</td>
                <td style={{ textAlign: 'center' }}>Básica</td>
                <td style={{ textAlign: 'center' }} className="highlight-col">Completa + Firma</td>
                <td style={{ textAlign: 'center' }}>Completa + Firma</td>
              </tr>

              {/* Sección Gestión y Finanzas */}
              <tr className="matrix-cat-row">
                <td colSpan={4}>ADMINISTRACIÓN, FINANZAS & SUNAT</td>
              </tr>
              <tr>
                <td>Caja Diaria y Arqueo de Turno</td>
                <td style={{ textAlign: 'center' }}><span className="matrix-check">✓</span></td>
                <td style={{ textAlign: 'center' }} className="highlight-col"><span className="matrix-check">✓</span></td>
                <td style={{ textAlign: 'center' }}><span className="matrix-check">✓</span></td>
              </tr>
              <tr>
                <td>Facturación Electrónica SUNAT (Boletas / Facturas)</td>
                <td style={{ textAlign: 'center' }}><span className="matrix-dash">—</span></td>
                <td style={{ textAlign: 'center' }} className="highlight-col"><span className="matrix-check">✓</span></td>
                <td style={{ textAlign: 'center' }}><span className="matrix-check">✓</span></td>
              </tr>
              <tr>
                <td>Liquidación de Comisiones Médicas</td>
                <td style={{ textAlign: 'center' }}><span className="matrix-dash">—</span></td>
                <td style={{ textAlign: 'center' }} className="highlight-col"><span className="matrix-dash">—</span></td>
                <td style={{ textAlign: 'center' }}><span className="matrix-check">✓</span></td>
              </tr>
              <tr>
                <td>Gestión Multi-Inquilino / Multi-Sedes</td>
                <td style={{ textAlign: 'center' }}>1 Sede</td>
                <td style={{ textAlign: 'center' }} className="highlight-col">Hasta 2 Sedes</td>
                <td style={{ textAlign: 'center' }}>Sedes Ilimitadas</td>
              </tr>

              {/* Sección Almacenamiento & Soporte */}
              <tr className="matrix-cat-row">
                <td colSpan={4}>INFRAESTRUCTURA, NUBE & SOPORTE</td>
              </tr>
              <tr>
                <td>Espacio en la Nube para Radiografías HD</td>
                <td style={{ textAlign: 'center' }}>5 GB</td>
                <td style={{ textAlign: 'center' }} className="highlight-col font-bold">10 GB</td>
                <td style={{ textAlign: 'center' }} className="font-bold">100 GB</td>
              </tr>
              <tr>
                <td>Usuarios Concurrentes Activos</td>
                <td style={{ textAlign: 'center' }}>1 Usuario</td>
                <td style={{ textAlign: 'center' }} className="highlight-col">Hasta 5 Usuarios</td>
                <td style={{ textAlign: 'center' }}>Ilimitados</td>
              </tr>
              <tr>
                <td>Copias de Seguridad Diarias Automáticas</td>
                <td style={{ textAlign: 'center' }}><span className="matrix-dash">—</span></td>
                <td style={{ textAlign: 'center' }} className="highlight-col"><span className="matrix-check">✓</span></td>
                <td style={{ textAlign: 'center' }}><span className="matrix-check">✓</span></td>
              </tr>
              <tr>
                <td>Canal de Soporte Técnico</td>
                <td style={{ textAlign: 'center' }}>Email 24h</td>
                <td style={{ textAlign: 'center' }} className="highlight-col font-bold">
                  WhatsApp 24/7
                </td>
                <td style={{ textAlign: 'center' }} className="font-bold">Gerente Dedicado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. HISTORIAL DE FACTURAS SUNAT */}
      <div className="card mt">
        <div className="card-head">
          <div>
            <h3>
              <Icon name="card" />
              <span>Historial de Comprobantes de Suscripción SaaS</span>
            </h3>
            <span className="sub">Comprobantes fiscales emitidos automáticamente por Dental FJL</span>
          </div>
          <button className="btn btn-sm" onClick={() => onShowToast?.('Exportando reporte contable...')}>
            <Icon name="printer" size="sm" />
            <span>Imprimir Historial</span>
          </button>
        </div>

        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Nº Factura SUNAT</th>
                <th>Fecha de Emisión</th>
                <th>Concepto del Servicio</th>
                <th>Método de Pago</th>
                <th>Importe Total</th>
                <th>Estado</th>
                <th style={{ textAlign: 'center' }}>Descarga</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>F001-0004821</b>
                </td>
                <td>24/10/2026</td>
                <td>Suscripción Plan Clínico Pro (Octubre - Noviembre 2026)</td>
                <td>Visa •••• 4821</td>
                <td>
                  <b style={{ fontFamily: 'var(--font-mono)' }}>S/ 199.00</b>
                </td>
                <td>
                  <span className="badge ok">
                    <Icon name="check" size="sm" />
                    <span>Pagado</span>
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    className="icon-btn"
                    title="Descargar Factura Electrónica (PDF)"
                    onClick={() => handleDownloadInvoice('F001-0004821')}
                  >
                    <Icon name="download" size="sm" />
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <b style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>F001-0004109</b>
                </td>
                <td>24/09/2026</td>
                <td>Suscripción Plan Clínico Pro (Septiembre - Octubre 2026)</td>
                <td>Visa •••• 4821</td>
                <td>
                  <b style={{ fontFamily: 'var(--font-mono)' }}>S/ 199.00</b>
                </td>
                <td>
                  <span className="badge ok">
                    <Icon name="check" size="sm" />
                    <span>Pagado</span>
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    className="icon-btn"
                    title="Descargar Factura Electrónica (PDF)"
                    onClick={() => handleDownloadInvoice('F001-0004109')}
                  >
                    <Icon name="download" size="sm" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
