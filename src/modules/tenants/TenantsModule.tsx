import React, { useState } from 'react';
import { Icon } from '../../shared/components/Icon';
import './TenantsModule.css';

interface TenantsModuleProps {
  onShowToast?: (msg: string, type?: 'ok' | 'warn' | 'err') => void;
}

interface TenantUserBranch {
  id: string;
  nombre: string;
  rol: string;
  email: string;
  estado: 'Activo' | 'Bloqueado' | 'En Espera';
  avatarInitials: string;
}

interface TenantFeature {
  id: string;
  nombre: string;
  bloqueado: boolean;
  motivoBloqueo?: string;
}

interface TenantData {
  id: string;
  nombre: string;
  ruc: string;
  tipo: 'master' | 'subordinado' | 'franquicia' | 'piloto';
  plan: string;
  estado: 'Activo' | 'Restringido' | 'Piloto';
  baseDatos: string;
  almacenamiento: string;
  usuariosCount: number;
  usuarios: TenantUserBranch[];
  funciones: TenantFeature[];
}

const INITIAL_TENANTS: TenantData[] = [
  {
    id: 'TENANT-001',
    nombre: 'Dental FC — Sede Matriz Surco',
    ruc: '20601234567',
    tipo: 'master',
    plan: 'Enterprise Titanium Core',
    estado: 'Activo',
    baseDatos: 'dentalfc_tenant_master',
    almacenamiento: '14.8 GB / Ilimitado',
    usuariosCount: 18,
    usuarios: [
      { id: 'U-101', nombre: 'Admin Maestro (Tú)', rol: 'Super Administrador Global', email: 'root@dentalfc.pe', estado: 'Activo', avatarInitials: 'AM' },
      { id: 'U-102', nombre: 'Dr. Fernando Silva Castro', rol: 'Director Médico de Sede', email: 'fsilva@dentalfc.pe', estado: 'Activo', avatarInitials: 'FS' },
      { id: 'U-103', nombre: 'Dra. Patricia Lima Wong', rol: 'Jefa de Cirugía y Ortodoncia', email: 'plima@dentalfc.pe', estado: 'Activo', avatarInitials: 'PL' },
      { id: 'U-104', nombre: 'Jorge Linares Ramos', rol: 'Supervisor de Caja y Tesorería', email: 'jlinares@dentalfc.pe', estado: 'Activo', avatarInitials: 'JL' },
    ],
    funciones: [
      { id: 'odonto', nombre: 'Odontograma 3D Avanzado', bloqueado: false },
      { id: 'sunat', nombre: 'Facturación SUNAT Multi-RUC', bloqueado: false },
      { id: 'caja', nombre: 'Caja Diaria y Cobranzas', bloqueado: false },
      { id: 'excel', nombre: 'Portado Excel a BD (ETL)', bloqueado: false },
      { id: 'audit', nombre: 'Auditoría Forense Inmutable', bloqueado: false },
      { id: 'ia', nombre: 'Diagnóstico IA de Radiografías', bloqueado: false },
    ],
  },
  {
    id: 'TENANT-002',
    nombre: 'Dental FC — Sede Miraflores (Especialidades)',
    ruc: '20601234568',
    tipo: 'subordinado',
    plan: 'Clínico Profesional',
    estado: 'Activo',
    baseDatos: 'dentalfc_tenant_miraflores',
    almacenamiento: '6.2 GB / 25 GB',
    usuariosCount: 11,
    usuarios: [
      { id: 'U-201', nombre: 'Dr. Alejandro Soto Vega', rol: 'Coordinador Clínico Sede', email: 'asoto@miraflores.dentalfc.pe', estado: 'Activo', avatarInitials: 'AS' },
      { id: 'U-202', nombre: 'Dra. Lucía Méndez Ruiz', rol: 'Especialista en Endodoncia', email: 'lmendez@miraflores.dentalfc.pe', estado: 'Activo', avatarInitials: 'LM' },
      { id: 'U-203', nombre: 'Carlos Quispe Gómez', rol: 'Recepción y Admisión', email: 'cquispe@miraflores.dentalfc.pe', estado: 'Activo', avatarInitials: 'CQ' },
    ],
    funciones: [
      { id: 'odonto', nombre: 'Odontograma 3D Avanzado', bloqueado: false },
      { id: 'sunat', nombre: 'Facturación SUNAT Multi-RUC', bloqueado: false },
      { id: 'caja', nombre: 'Caja Diaria y Cobranzas', bloqueado: false },
      { id: 'excel', nombre: 'Portado Excel a BD (ETL)', bloqueado: true, motivoBloqueo: 'Requiere autorización expresa del Admin Maestro' },
      { id: 'audit', nombre: 'Auditoría Forense Inmutable', bloqueado: true, motivoBloqueo: 'Privilegio exclusivo del Master Tenant' },
      { id: 'ia', nombre: 'Diagnóstico IA de Radiografías', bloqueado: false },
    ],
  },
  {
    id: 'TENANT-003',
    nombre: 'Dental FC — Sede San Isidro (Estética Dental)',
    ruc: '20601234569',
    tipo: 'subordinado',
    plan: 'Estándar Clínico',
    estado: 'Activo',
    baseDatos: 'dentalfc_tenant_sanisidro',
    almacenamiento: '4.1 GB / 15 GB',
    usuariosCount: 7,
    usuarios: [
      { id: 'U-301', nombre: 'Dra. Vanessa Paredes', rol: 'Especialista en Carillas y Diseño', email: 'vparedes@sanisidro.dentalfc.pe', estado: 'Activo', avatarInitials: 'VP' },
      { id: 'U-302', nombre: 'Dr. Gonzalo Alarcón', rol: 'Periodoncia e Implantes', email: 'galarcon@sanisidro.dentalfc.pe', estado: 'Activo', avatarInitials: 'GA' },
      { id: 'U-303', nombre: 'Elena Castillo Vera', rol: 'Cajera de Consultorio', email: 'ecastillo@sanisidro.dentalfc.pe', estado: 'Activo', avatarInitials: 'EC' },
    ],
    funciones: [
      { id: 'odonto', nombre: 'Odontograma 3D Avanzado', bloqueado: false },
      { id: 'sunat', nombre: 'Facturación SUNAT Multi-RUC', bloqueado: false },
      { id: 'caja', nombre: 'Caja Diaria y Cobranzas', bloqueado: false },
      { id: 'excel', nombre: 'Portado Excel a BD (ETL)', bloqueado: true, motivoBloqueo: 'Función bloqueada por suscripción' },
      { id: 'audit', nombre: 'Auditoría Forense Inmutable', bloqueado: true, motivoBloqueo: 'Función reservada para el Admin Central' },
      { id: 'ia', nombre: 'Diagnóstico IA de Radiografías', bloqueado: true, motivoBloqueo: 'Módulo opcional no contratado' },
    ],
  },
  {
    id: 'TENANT-004',
    nombre: 'Dental FC — Sede Los Olivos (Franquicia Norte)',
    ruc: '20609876543',
    tipo: 'franquicia',
    plan: 'Franquicia Convenio',
    estado: 'Restringido',
    baseDatos: 'dentalfc_tenant_losolivos',
    almacenamiento: '8.9 GB / 20 GB',
    usuariosCount: 12,
    usuarios: [
      { id: 'U-401', nombre: 'Dr. Manuel Becerra', rol: 'Titular Franquiciado', email: 'mbecerra@losolivos.dentalfc.pe', estado: 'Bloqueado', avatarInitials: 'MB' },
      { id: 'U-402', nombre: 'Dra. Diana Chávez', rol: 'Odontóloga General', email: 'dchavez@losolivos.dentalfc.pe', estado: 'Bloqueado', avatarInitials: 'DC' },
    ],
    funciones: [
      { id: 'odonto', nombre: 'Odontograma 3D Avanzado', bloqueado: true, motivoBloqueo: 'Acceso congelado por mora administrativa' },
      { id: 'sunat', nombre: 'Facturación SUNAT Multi-RUC', bloqueado: true, motivoBloqueo: 'Acceso congelado por mora administrativa' },
      { id: 'caja', nombre: 'Caja Diaria y Cobranzas', bloqueado: true, motivoBloqueo: 'Modo solo lectura activado por Admin Maestro' },
      { id: 'excel', nombre: 'Portado Excel a BD (ETL)', bloqueado: true, motivoBloqueo: 'Bloqueado por Super Admin' },
      { id: 'audit', nombre: 'Auditoría Forense Inmutable', bloqueado: true, motivoBloqueo: 'Bloqueado por Super Admin' },
      { id: 'ia', nombre: 'Diagnóstico IA de Radiografías', bloqueado: true, motivoBloqueo: 'Bloqueado por Super Admin' },
    ],
  },
];

export const TenantsModule: React.FC<TenantsModuleProps> = ({ onShowToast }) => {
  const [tenants, setTenants] = useState<TenantData[]>(INITIAL_TENANTS);
  const [selectedTenant, setSelectedTenant] = useState<TenantData | null>(null);
  const [filterType, setFilterType] = useState<string>('todos');

  // Conteo global
  const totalUsuarios = tenants.reduce((acc, t) => acc + t.usuariosCount, 0);

  // Manejador para alternar bloqueo de funciones en un tenant
  const handleToggleFeatureLock = (tenantId: string, featureId: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        const newFunciones = t.funciones.map((f) => {
          if (f.id !== featureId) return f;
          const nextState = !f.bloqueado;
          return {
            ...f,
            bloqueado: nextState,
            motivoBloqueo: nextState ? 'Bloqueado manualmente por el Admin Maestro' : undefined,
          };
        });
        return { ...t, funciones: newFunciones };
      })
    );

    if (onShowToast) {
      onShowToast(`Políticas de funciones actualizadas para el tenant '${tenantId}'`, 'ok');
    }
  };

  // Manejador para alternar estado del tenant (Activo / Restringido)
  const handleToggleTenantStatus = (tenantId: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        if (t.tipo === 'master') {
          if (onShowToast) onShowToast('El Tenant Maestro no puede ser suspendido.', 'warn');
          return t;
        }
        const nextStatus = t.estado === 'Activo' ? 'Restringido' : 'Activo';
        return { ...t, estado: nextStatus };
      })
    );

    if (onShowToast) {
      onShowToast(`Estado del tenant '${tenantId}' modificado por el Admin Maestro.`, 'warn');
    }
  };

  const filteredTenants = tenants.filter((t) => {
    if (filterType === 'todos') return true;
    return t.tipo === filterType;
  });

  return (
    <section className="tenants-module">
      {/* Hero Corporativo: Super Admin Console */}
      <div className="corp-hero">
        <div className="corp-hero-content">
          <div className="corp-hero-tag">
            <span className="dot-ok" />
            <span>Super Admin Global • Modo Control Maestro Total</span>
          </div>
          <h1 className="corp-hero-title">
            Gestión de Tenants y Multiclínica — <span>Dental FC</span>
          </h1>
          <p className="corp-hero-subtitle">
            Consola centralizada para gobernar sedes inquilinas (tenants), visualizar ramificaciones jerárquicas de usuarios y bloquear o habilitar módulos del sistema en tiempo real.
          </p>
          <div className="corp-hero-meta">
            <span className="corp-meta-chip">
              <Icon name="shield" size="sm" style={{ color: 'var(--ok)' }} />
              Control Maestro Activo (Tú)
            </span>
            <span className="corp-meta-chip">
              <Icon name="building" size="sm" style={{ color: 'var(--primary-2)' }} />
              {tenants.length} Sedes Tenant Conectadas
            </span>
            <span className="corp-meta-chip">
              <Icon name="users" size="sm" />
              {totalUsuarios} Usuarios en el Ecosistema
            </span>
          </div>
        </div>
        <div className="corp-hero-actions">
          <button
            className="btn btn-secondary"
            onClick={() => onShowToast?.('Verificación de aislamiento de esquemas multi-tenant exitosa. Todos los esquemas PostgreSQL están encriptados.', 'ok')}
          >
            <Icon name="shield" size="sm" />
            <span>Auditar Aislamiento BD</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onShowToast?.('Formulario de aprovisionamiento de nueva sede tenant listo para conectar con orquestador backend.', 'ok')}
          >
            <Icon name="plus" size="sm" />
            <span>Nuevo Tenant / Sede</span>
          </button>
        </div>
      </div>

      {/* Tarjeta de Control Maestro (Tú como Super Admin) */}
      <div className="card master-control-console-card">
        <div className="master-console-header">
          <div className="master-console-title-box">
            <div className="master-shield-badge">
              <Icon name="shield" size="md" />
            </div>
            <div>
              <span className="master-subtitle">Jerarquía Máxima del Ecosistema</span>
              <h2 className="master-title">Consola de Mando Maestro — Super Administrador</h2>
            </div>
          </div>
          <div className="master-status-tag">
            <span className="dot-ok" />
            <span>Privilegios Irrestrictos de Infraestructura</span>
          </div>
        </div>

        <p className="master-desc">
          Desde esta posición administras el nodo central y la federación de sedes. Los tenants subordinados operan en entornos aislados (“burbujas de inquilino”) con acceso restringido a las capacidades que habilites o bloquees a continuación.
        </p>

        <div className="master-kpis-row">
          <div className="master-kpi">
            <span className="kpi-num">1</span>
            <span className="kpi-txt">Sede Matriz (Control Total)</span>
          </div>
          <div className="master-kpi">
            <span className="kpi-num">3</span>
            <span className="kpi-txt">Sedes Subordinadas / Franquicias</span>
          </div>
          <div className="master-kpi">
            <span className="kpi-num">{totalUsuarios}</span>
            <span className="kpi-txt">Cuentas Médicas Federadas</span>
          </div>
          <div className="master-kpi">
            <span className="kpi-num ok">100%</span>
            <span className="kpi-txt">Aislamiento Criptográfico</span>
          </div>
        </div>
      </div>

      {/* Filtros de Tenants */}
      <div className="card card-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Filtrar Sedes por Tipo:</span>
          <select
            className="select"
            style={{ width: 'auto', minWidth: '180px' }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="todos">Todos los Tenants ({tenants.length})</option>
            <option value="master">Sede Matriz (Master)</option>
            <option value="subordinado">Sedes Subordinadas</option>
            <option value="franquicia">Franquicias Externas</option>
          </select>
        </div>

        <div className="tenants-legend">
          <span className="legend-item">
            <span className="legend-dot ok" />
            <span>Desbloqueado</span>
          </span>
          <span className="legend-item">
            <span className="legend-dot locked" />
            <span>Función Bloqueada</span>
          </span>
        </div>
      </div>

      {/* Grid de Burbujas de Tenants y sus Ramificaciones */}
      <div className="tenants-grid">
        {filteredTenants.map((tenant) => (
          <div
            key={tenant.id}
            className={`card tenant-card ${tenant.tipo === 'master' ? 'is-master' : ''} ${tenant.estado === 'Restringido' ? 'is-restricted' : ''}`}
          >
            {/* Cabecera del Tenant */}
            <div className="tenant-card-header">
              <div className="tenant-id-badge">
                <Icon name="building" size="sm" />
                <span>{tenant.id}</span>
                <span className="tenant-type-tag">{tenant.tipo.toUpperCase()}</span>
              </div>

              {tenant.tipo !== 'master' && (
                <button
                  type="button"
                  className={`btn-toggle-status ${tenant.estado === 'Activo' ? 'active' : 'restricted'}`}
                  onClick={() => handleToggleTenantStatus(tenant.id)}
                  title="Cambiar estado del Tenant"
                >
                  <span className={`dot-status ${tenant.estado === 'Activo' ? 'ok' : 'err'}`} />
                  <span>{tenant.estado}</span>
                </button>
              )}
            </div>

            <h3 className="tenant-name">{tenant.nombre}</h3>

            <div className="tenant-meta-pills">
              <span className="meta-pill">
                <Icon name="card" size="sm" />
                <span>RUC {tenant.ruc}</span>
              </span>
              <span className="meta-pill">
                <Icon name="database" size="sm" />
                <span>{tenant.baseDatos}</span>
              </span>
              <span className="meta-pill">
                <Icon name="layers" size="sm" />
                <span>{tenant.almacenamiento}</span>
              </span>
            </div>

            {/* Ramificación de Usuarios del Tenant */}
            <div className="tenant-branch-section">
              <div className="tenant-branch-header">
                <span className="section-title">
                  <Icon name="users" size="sm" />
                  <span>Ramificación de Usuarios ({tenant.usuariosCount} en sede)</span>
                </span>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setSelectedTenant(tenant)}
                >
                  Ver Todos
                </button>
              </div>

              <div className="user-branch-list">
                {tenant.usuarios.map((u) => (
                  <div key={u.id} className="user-branch-item">
                    <div className="user-avatar-circle">{u.avatarInitials}</div>
                    <div className="user-branch-info">
                      <b className="user-name">{u.nombre}</b>
                      <span className="user-role">{u.rol}</span>
                    </div>
                    <span className={`badge ${u.estado === 'Activo' ? 'ok' : 'err'}`} style={{ fontSize: '10.5px' }}>
                      {u.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Matriz de Funciones del Tenant (Funciones Bloqueadas / Habilitadas) */}
            <div className="tenant-features-section">
              <div className="tenant-branch-header">
                <span className="section-title">
                  <Icon name="lock" size="sm" />
                  <span>Control de Módulos & Bloqueos</span>
                </span>
                <span className="sub-helper">
                  {tenant.tipo === 'master' ? 'Acceso maestro irrestricto' : 'Gestionado por Admin'}
                </span>
              </div>

              <div className="features-capsules-grid">
                {tenant.funciones.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`feature-capsule ${f.bloqueado ? 'locked' : 'unlocked'}`}
                    onClick={() => {
                      if (tenant.tipo === 'master') {
                        onShowToast?.('El Tenant Maestro no puede bloquear sus propios módulos base.', 'warn');
                        return;
                      }
                      handleToggleFeatureLock(tenant.id, f.id);
                    }}
                    title={f.bloqueado ? f.motivoBloqueo || 'Módulo bloqueado' : 'Módulo habilitado. Clic para bloquear.'}
                  >
                    <div className="capsule-icon">
                      <Icon name={f.bloqueado ? 'lock' : 'check'} size="sm" />
                    </div>
                    <span className="capsule-name">{f.nombre}</span>
                    <span className="capsule-state">{f.bloqueado ? 'Bloqueado' : 'Activo'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Acciones de Tenant */}
            <div className="tenant-card-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  onShowToast?.(
                    `Sesión de impersonación iniciada en '${tenant.nombre}' bajo control maestro de auditoría.`,
                    'ok'
                  );
                }}
              >
                <Icon name="user" size="sm" />
                <span>Impersonar Sede</span>
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setSelectedTenant(tenant)}
              >
                <Icon name="settings" size="sm" />
                <span>Ajustar Parámetros</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Inspección Detallada de Ramificación del Tenant */}
      {selectedTenant && (
        <div className="modal-overlay" onClick={() => setSelectedTenant(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-head">
              <h3>
                <Icon name="layers" size="lg" />
                <span>Ramificación Completa — {selectedTenant.nombre}</span>
              </h3>
              <button className="icon-btn" onClick={() => setSelectedTenant(null)}>
                <Icon name="x" />
              </button>
            </div>

            <div className="modal-body">
              <div className="card" style={{ padding: '16px', marginBottom: '16px', background: 'var(--surface-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="sub">Esquema Base de Datos:</span>
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{selectedTenant.baseDatos}</code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="sub">Plan de Suscripción:</span>
                  <b>{selectedTenant.plan}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="sub">Cuota Almacenamiento:</span>
                  <b>{selectedTenant.almacenamiento}</b>
                </div>
              </div>

              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700 }}>
                Árbol de Accesos y Médicos Adscritos:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedTenant.usuarios.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      background: 'var(--surface-2)',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="user-avatar-circle">{u.avatarInitials}</div>
                      <div>
                        <b style={{ fontSize: '13px', display: 'block' }}>{u.nombre}</b>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{u.email} • {u.rol}</span>
                      </div>
                    </div>
                    <span className={`badge ${u.estado === 'Activo' ? 'ok' : 'err'}`}>
                      {u.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-foot">
              <button className="btn" onClick={() => setSelectedTenant(null)}>
                Cerrar Panel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  onShowToast?.(`Políticas y permisos guardados para ${selectedTenant.nombre}`, 'ok');
                  setSelectedTenant(null);
                }}
              >
                <Icon name="check" size="sm" />
                <span>Guardar Permisos de Tenant</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
