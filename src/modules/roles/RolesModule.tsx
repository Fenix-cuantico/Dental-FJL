import React, { useState } from 'react';
import { Icon, IconName } from '../../shared/components/Icon';
import './RolesModule.css';

interface RolesModuleProps {
  onShowToast?: (msg: string) => void;
}

interface RoleDefinition {
  id: string;
  name: string;
  title: string;
  desc: string;
  level: string;
  levelBadge: 'danger' | 'purple' | 'info' | 'warn';
  icon: IconName;
  usersCount: number;
  assignedUsers: { name: string; email: string; avatar: string; status: 'online' | 'offline' }[];
}

interface PermissionItem {
  id: string;
  code: string;
  name: string;
  desc: string;
  category: 'clinica' | 'agenda' | 'caja' | 'inventario' | 'seguridad';
}

export const RolesModule: React.FC<RolesModuleProps> = ({ onShowToast }) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('doctor');
  const [viewMode, setViewMode] = useState<'granular' | 'matrix'>('granular');

  const roles: RoleDefinition[] = [
    {
      id: 'admin',
      name: 'Administrador / Director',
      title: 'Dirección Médica y Gerencia',
      desc: 'Control integral y absoluto del ERP, auditoría forense, sedes y configuración del sistema.',
      level: 'Nivel 5 · Crítico Total',
      levelBadge: 'purple',
      icon: 'shield',
      usersCount: 2,
      assignedUsers: [
        { name: 'Dr. Diego Mendoza', email: 'dmendoza@dentalfc.pe', avatar: 'DM', status: 'online' },
        { name: 'Dra. Valeria Castro', email: 'vcastro@dentalfc.pe', avatar: 'VC', status: 'online' },
      ],
    },
    {
      id: 'doctor',
      name: 'Odontólogo Especialista',
      title: 'Cuerpo Clínico Facultativo',
      desc: 'Atención a pacientes, diagnóstico clínico, odontograma 3D interactivo y prescripción médica.',
      level: 'Nivel 4 · Clínico Avanzado',
      levelBadge: 'info',
      icon: 'tooth',
      usersCount: 8,
      assignedUsers: [
        { name: 'Dr. Diego Mendoza', email: 'dmendoza@dentalfc.pe', avatar: 'DM', status: 'online' },
        { name: 'Dra. Valeria Castro', email: 'vcastro@dentalfc.pe', avatar: 'VC', status: 'online' },
        { name: 'Dr. Roberto Ríos', email: 'rrios@dentalfc.pe', avatar: 'RR', status: 'offline' },
        { name: 'Dra. Lucía Alarcón', email: 'lalarcon@dentalfc.pe', avatar: 'LA', status: 'online' },
      ],
    },
    {
      id: 'recepcion',
      name: 'Recepción y Admisión',
      title: 'Frontdesk y Operaciones',
      desc: 'Agendamiento de citas, gestión de sala de espera, cobros en caja y emisión de boletas SUNAT.',
      level: 'Nivel 3 · Operativo',
      levelBadge: 'warn',
      icon: 'calendar',
      usersCount: 3,
      assignedUsers: [
        { name: 'Carla Morales', email: 'cmorales@dentalfc.pe', avatar: 'CM', status: 'online' },
        { name: 'Pamela Torres', email: 'ptorres@dentalfc.pe', avatar: 'PT', status: 'offline' },
        { name: 'Ximena Salas', email: 'xsalas@dentalfc.pe', avatar: 'XS', status: 'online' },
      ],
    },
    {
      id: 'asistente',
      name: 'Asistente Dental',
      title: 'Soporte y Esterilización',
      desc: 'Control de esterilización, preparación de box clínico y registro de consumo de insumos.',
      level: 'Nivel 2 · Asistencia',
      levelBadge: 'info',
      icon: 'layers',
      usersCount: 4,
      assignedUsers: [
        { name: 'Rosa Huamán', email: 'rhuaman@dentalfc.pe', avatar: 'RH', status: 'online' },
        { name: 'Sonia Vega', email: 'svega@dentalfc.pe', avatar: 'SV', status: 'online' },
        { name: 'Elena Quispe', email: 'equispe@dentalfc.pe', avatar: 'EQ', status: 'offline' },
      ],
    },
  ];

  const categories = [
    { id: 'clinica', name: 'Área Clínica & Pacientes', badge: 'CLINIC', icon: 'tooth' as IconName },
    { id: 'agenda', name: 'Agenda & Citas Médicas', badge: 'SCHED', icon: 'calendar' as IconName },
    { id: 'caja', name: 'Caja, Cobros & SUNAT', badge: 'FINANCE', icon: 'card' as IconName },
    { id: 'inventario', name: 'Inventario & Suministros', badge: 'STOCK', icon: 'layers' as IconName },
    { id: 'seguridad', name: 'Seguridad & Auditoría', badge: 'SYSTEM', icon: 'shield' as IconName },
  ];

  const permissionList: PermissionItem[] = [
    // Clínica
    { id: 'odonto_view', code: 'CLINIC.ODONTO.VIEW', name: 'Ver Odontograma Dental y Ficha Clínica', desc: 'Permite consultar el estado dental, histórico de tratamientos y antecedentes médicos del paciente.', category: 'clinica' },
    { id: 'odonto_edit', code: 'CLINIC.ODONTO.EDIT', name: 'Editar Caras Dentales y Diagnósticos', desc: 'Permite marcar caras dentales, caries, prótesis, extracciones y sellantes en tiempo real.', category: 'clinica' },
    { id: 'presupuestos_create', code: 'CLINIC.BUDGET.CREATE', name: 'Crear Planes de Tratamiento y Presupuestos', desc: 'Permite presupuestar procedimientos clínicos y enviar cotizaciones formales al paciente.', category: 'clinica' },
    { id: 'receta_prescribe', code: 'CLINIC.RECIPE.WRITE', name: 'Prescribir Recetas Médicas Digitales', desc: 'Permite generar recetas con firma digital y código QR para despacho en farmacia.', category: 'clinica' },

    // Agenda
    { id: 'agenda_view', code: 'SCHED.APPT.VIEW', name: 'Visualizar Calendario y Agenda de Citas', desc: 'Permite revisar la ocupación diaria y semanal de los boxes de atención de la clínica.', category: 'agenda' },
    { id: 'agenda_create', code: 'SCHED.APPT.CREATE', name: 'Agendar Nuevas Citas Médicas', desc: 'Permite registrar citas con paciente, doctor, box y tratamiento seleccionado.', category: 'agenda' },
    { id: 'agenda_cancel', code: 'SCHED.APPT.CANCEL', name: 'Cancelar y Bloquear Turnos de Box', desc: 'Permite cancelar citas confirmadas y aplicar bloqueos por mantenimiento de sillón.', category: 'agenda' },
    { id: 'agenda_whatsapp', code: 'SCHED.WHATSAPP.SEND', name: 'Despacho de Recordatorios por WhatsApp', desc: 'Permite enviar mensajes de WhatsApp personalizados con confirmación de asistencia.', category: 'agenda' },

    // Caja
    { id: 'caja_charge', code: 'FINANCE.CHARGE.CREATE', name: 'Registrar Cobros y Liquidaciones', desc: 'Permite cobrar en efectivo, tarjeta POS, Yape/Plin o transferencia bancaria.', category: 'caja' },
    { id: 'caja_sunat', code: 'FINANCE.SUNAT.EMIT', name: 'Emitir Boletas y Facturas Electrónicas SUNAT', desc: 'Permite enviar comprobantes oficiales de pago al proveedor PSE homologado.', category: 'caja' },
    { id: 'caja_discount', code: 'FINANCE.DISCOUNT.APPLY', name: 'Aplicar Descuentos Especiales (> 10%)', desc: 'Permite aplicar rebajas promocionales en el presupuesto total del tratamiento.', category: 'caja' },
    { id: 'caja_void', code: 'FINANCE.VOID.INVOICE', name: 'Anular Comprobantes y Notas de Crédito', desc: 'Permite emitir notas de crédito para anulación fiscal de ventas erróneas.', category: 'caja' },

    // Inventario
    { id: 'inv_consume', code: 'STOCK.CONSUME.RECORD', name: 'Registrar Consumo de Insumos en Box', desc: 'Permite descargar unidades de anestesia, resinas o agujas utilizadas durante la atención.', category: 'inventario' },
    { id: 'inv_restock', code: 'STOCK.ORDER.CREATE', name: 'Generar Órdenes de Reposición a Proveedores', desc: 'Permite solicitar nuevos pedidos de materiales cuando se alcanza el stock mínimo.', category: 'inventario' },
    { id: 'inv_adjust', code: 'STOCK.ADJUST.WRITE', name: 'Ajuste Manual de Inventario por Merma', desc: 'Permite regularizar el conteo físico de insumos por caducidad o rotura de empaque.', category: 'inventario' },

    // Seguridad
    { id: 'sec_audit', code: 'SYSTEM.AUDIT.VIEW', name: 'Auditar Registro Forense de Eventos', desc: 'Permite consultar el historial de quién, cuándo y qué acción modificó en el sistema.', category: 'seguridad' },
    { id: 'sec_users', code: 'SYSTEM.USERS.MANAGE', name: 'Crear y Suspender Cuentas de Personal', desc: 'Permite crear credenciales, restablecer contraseñas y desactivar accesos.', category: 'seguridad' },
    { id: 'sec_config', code: 'SYSTEM.SETTINGS.EDIT', name: 'Modificar Configuración de la Clínica y Sede', desc: 'Permite editar parámetros fiscales SUNAT, horarios y credenciales API del ERP.', category: 'seguridad' },
  ];

  // Matriz de permisos inicial
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({
    admin: {
      odonto_view: true, odonto_edit: true, presupuestos_create: true, receta_prescribe: true,
      agenda_view: true, agenda_create: true, agenda_cancel: true, agenda_whatsapp: true,
      caja_charge: true, caja_sunat: true, caja_discount: true, caja_void: true,
      inv_consume: true, inv_restock: true, inv_adjust: true,
      sec_audit: true, sec_users: true, sec_config: true,
    },
    doctor: {
      odonto_view: true, odonto_edit: true, presupuestos_create: true, receta_prescribe: true,
      agenda_view: true, agenda_create: true, agenda_cancel: false, agenda_whatsapp: true,
      caja_charge: false, caja_sunat: false, caja_discount: false, caja_void: false,
      inv_consume: true, inv_restock: true, inv_adjust: false,
      sec_audit: false, sec_users: false, sec_config: false,
    },
    recepcion: {
      odonto_view: true, odonto_edit: false, presupuestos_create: true, receta_prescribe: false,
      agenda_view: true, agenda_create: true, agenda_cancel: true, agenda_whatsapp: true,
      caja_charge: true, caja_sunat: true, caja_discount: false, caja_void: false,
      inv_consume: false, inv_restock: true, inv_adjust: false,
      sec_audit: false, sec_users: false, sec_config: false,
    },
    asistente: {
      odonto_view: true, odonto_edit: false, presupuestos_create: false, receta_prescribe: false,
      agenda_view: true, agenda_create: false, agenda_cancel: false, agenda_whatsapp: false,
      caja_charge: false, caja_sunat: false, caja_discount: false, caja_void: false,
      inv_consume: true, inv_restock: true, inv_adjust: false,
      sec_audit: false, sec_users: false, sec_config: false,
    },
  });

  const activeRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const togglePermission = (roleId: string, permId: string) => {
    setPermissions((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permId]: !prev[roleId]?.[permId],
      },
    }));
  };

  const handleToggleCategory = (catId: string, grantAll: boolean) => {
    const permsInCat = permissionList.filter((p) => p.category === catId);
    setPermissions((prev) => {
      const updatedRole = { ...prev[selectedRoleId] };
      permsInCat.forEach((p) => {
        updatedRole[p.id] = grantAll;
      });
      return {
        ...prev,
        [selectedRoleId]: updatedRole,
      };
    });
    onShowToast?.(
      grantAll
        ? `Todos los permisos de la categoría activados para ${activeRole.name}`
        : `Permisos de la categoría revocados para ${activeRole.name}`
    );
  };

  const handleSave = () => {
    onShowToast?.(`Matriz RBAC guardada con éxito para el perfil ${activeRole.name}`);
  };

  const handleExportJSON = () => {
    onShowToast?.('Política de seguridad RBAC exportada en formato JSON seguro');
  };

  // Contadores de permisos
  const countActivePerms = (roleId: string) => {
    const rolePerms = permissions[roleId] || {};
    return Object.values(rolePerms).filter(Boolean).length;
  };

  return (
    <section className="roles-module">
      {/* Banner Corporativo */}
      <div className="module-banner">
        <div className="module-banner-content">
          <div className="module-banner-badge">
            <span className="hero-pulse" />
            <span>Seguridad & Control de Permisos RBAC</span>
          </div>
          <h1 className="module-banner-title">
            <Icon name="lock" size="lg" style={{ color: 'var(--primary-2)' }} />
            <span>Gestión de Roles y Accesos — Dental FC</span>
          </h1>
          <p className="module-banner-desc">
            Asignación granular de privilegios, segregación de funciones clínicas y auditoría de perfiles operativos.
          </p>
          <div className="module-banner-pills">
            <div className="module-banner-pill">
              <Icon name="shield" size="sm" style={{ color: 'var(--ok)' }} />
              <span>Matriz RBAC Activa</span>
            </div>
            <div className="module-banner-pill">
              <Icon name="users" size="sm" style={{ color: 'var(--primary-2)' }} />
              <span>{roles.length} Perfiles Configurados</span>
            </div>
            <div className="module-banner-pill">
              <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
              <span>Segregación ISO 27001</span>
            </div>
          </div>
        </div>
        <div className="module-banner-actions">
          <button className="btn" onClick={handleExportJSON} style={{ background: 'var(--surface)' }}>
            <Icon name="download" size="sm" />
            <span>Exportar Política</span>
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Icon name="save" size="sm" />
            <span>Guardar Permisos</span>
          </button>
        </div>
      </div>

      {/* Selector de Modo de Vista (Granular vs Matriz) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div className="seg">
          <button
            type="button"
            className={viewMode === 'granular' ? 'active' : ''}
            onClick={() => setViewMode('granular')}
          >
            <Icon name="grid" size="sm" />
            <span>Configuración Granular por Rol</span>
          </button>
          <button
            type="button"
            className={viewMode === 'matrix' ? 'active' : ''}
            onClick={() => setViewMode('matrix')}
          >
            <Icon name="layers" size="sm" />
            <span>Matriz Comparativa Global</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
          <span className="live-dot" />
          <span>Aislamiento de permisos activo por tenant institucional</span>
        </div>
      </div>

      {/* TARJETAS INTERACTIVAS DE ROLES (SELECTOR PRINCIPAL) */}
      <div className="roles-grid-cards">
        {roles.map((role) => {
          const isSelected = selectedRoleId === role.id;
          const activeCount = countActivePerms(role.id);
          const totalPerms = permissionList.length;
          const pct = Math.round((activeCount / totalPerms) * 100);

          return (
            <div
              key={role.id}
              className={`role-card-pro ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedRoleId(role.id)}
            >
              <div className="role-card-top">
                <div className="role-icon-box">
                  <Icon name={role.icon} size="md" />
                </div>
                <span className={`badge ${role.levelBadge}`} style={{ fontSize: '11px' }}>
                  {role.level}
                </span>
              </div>

              <div>
                <div className="role-title">{role.name}</div>
                <div className="role-desc">{role.desc}</div>
              </div>

              <div className="role-footer">
                <div>
                  <b style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{activeCount} / {totalPerms}</b>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>permisos ({pct}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon name="users" size="sm" />
                  <span style={{ fontWeight: 600 }}>{role.usersCount} usuarios</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* VISTA 1: CONFIGURACIÓN GRANULAR POR ROL */}
      {viewMode === 'granular' && (
        <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '20px' }}>
          {/* Columna Izquierda: Permisos Agrupados por Categoría */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: '14px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--primary-grad)',
                    color: '#ffffff',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Icon name={activeRole.icon} size="md" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontFamily: 'var(--font-heading)' }}>
                    Permisos de: {activeRole.name}
                  </h3>
                  <span className="sub" style={{ fontSize: '12px' }}>
                    {activeRole.title} · {countActivePerms(activeRole.id)} permisos concedidos
                  </span>
                </div>
              </div>

              <span className={`badge ${activeRole.levelBadge}`}>{activeRole.level}</span>
            </div>

            {/* Listado de Categorías con Acordeón / Cards */}
            {categories.map((cat) => {
              const catPerms = permissionList.filter((p) => p.category === cat.id);
              const grantedCount = catPerms.filter((p) => permissions[activeRole.id]?.[p.id]).length;
              const allGranted = grantedCount === catPerms.length;

              return (
                <div key={cat.id} className="perm-category-card">
                  <div className="perm-category-header">
                    <div className="perm-category-title">
                      <Icon name={cat.icon} size="sm" style={{ color: 'var(--primary-2)' }} />
                      <span>{cat.name}</span>
                      <span className="cat-badge">{cat.badge}</span>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 500 }}>
                        ({grantedCount} de {catPerms.length})
                      </span>
                    </div>

                    <div className="perm-category-actions">
                      <button
                        type="button"
                        className="btn btn-sm"
                        style={{ fontSize: '11.5px', padding: '4px 10px' }}
                        onClick={() => handleToggleCategory(cat.id, !allGranted)}
                      >
                        {allGranted ? 'Revocar Grupo' : 'Conceder Grupo'}
                      </button>
                    </div>
                  </div>

                  <div>
                    {catPerms.map((perm) => {
                      const isGranted = !!permissions[activeRole.id]?.[perm.id];

                      return (
                        <div key={perm.id} className="perm-item-row">
                          <div className="perm-info">
                            <div className="perm-name-wrap">
                              <span className="perm-name">{perm.name}</span>
                              <span className="perm-code">{perm.code}</span>
                            </div>
                            <div className="perm-detail">{perm.desc}</div>
                          </div>

                          <label className="switch-pro" title={`${isGranted ? 'Desactivar' : 'Activar'} ${perm.name}`}>
                            <input
                              type="checkbox"
                              checked={isGranted}
                              onChange={() => togglePermission(activeRole.id, perm.id)}
                            />
                            <span className="slider" />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Columna Derecha: Panel de Usuarios Asignados a este Rol */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '80px' }}>
              <div className="card-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="users" style={{ color: 'var(--primary-2)' }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>Usuarios con este Perfil</h3>
                    <span className="sub" style={{ fontSize: '11.5px' }}>{activeRole.usersCount} miembros asignados</span>
                  </div>
                </div>
              </div>

              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeRole.assignedUsers.map((user, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar alt2" style={{ position: 'relative', width: '34px', height: '34px', fontSize: '12px' }}>
                        {user.avatar}
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: user.status === 'online' ? 'var(--ok)' : 'var(--text-muted)',
                            border: '1.5px solid var(--surface-2)',
                          }}
                        />
                      </div>
                      <div>
                        <b style={{ fontSize: '13px', display: 'block', color: 'var(--text)' }}>{user.name}</b>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.email}</span>
                      </div>
                    </div>

                    <button
                      className="icon-btn"
                      title="Ver ficha del profesional"
                      onClick={() => onShowToast?.(`Ficha de ${user.name} abierta`)}
                    >
                      <Icon name="eye" size="sm" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                  onClick={() => onShowToast?.('Abriendo selector de usuarios para vincular al rol')}
                >
                  <Icon name="plus" size="sm" />
                  <span>Asignar Más Usuarios</span>
                </button>
              </div>

              {/* Caja de Ayuda de Seguridad */}
              <div
                style={{
                  padding: '16px',
                  background: 'var(--primary-soft)',
                  borderTop: '1px solid var(--border)',
                  borderRadius: '0 0 16px 16px',
                  fontSize: '12px',
                  color: 'var(--text-soft)',
                  lineHeight: 1.45,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--primary-2)', marginBottom: '4px' }}>
                  <Icon name="shield" size="sm" />
                  <span>Aislamiento Criptográfico</span>
                </div>
                Los cambios en los roles se aplican inmediatamente mediante la revalidación del token JWT del usuario sin requerir reinicio de sesión.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: MATRIZ COMPARATIVA GLOBAL */}
      {viewMode === 'matrix' && (
        <div className="card mt">
          <div className="card-head">
            <h3>
              <Icon name="shield" />
              <span>Matriz Comparativa de Privilegios por Perfil Operativo</span>
            </h3>
            <span className="sub">Alterna permisos directamente en la cuadrícula para auditorías de cumplimiento</span>
          </div>

          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th style={{ minWidth: '260px' }}>Privilegio / Módulo</th>
                  {roles.map((r) => (
                    <th key={r.id} style={{ textAlign: 'center', minWidth: '150px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Icon name={r.icon} size="sm" />
                        <span>{r.name.split('/')[0]}</span>
                      </div>
                      <div className="sub" style={{ fontSize: '10px' }}>
                        {countActivePerms(r.id)} permisos
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => {
                  const catPerms = permissionList.filter((p) => p.category === cat.id);

                  return (
                    <React.Fragment key={cat.id}>
                      <tr style={{ background: 'var(--surface-2)' }}>
                        <td colSpan={roles.length + 1} style={{ padding: '10px 16px', fontWeight: 700, color: 'var(--primary-2)' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <Icon name={cat.icon} size="sm" />
                            <span>{cat.name}</span>
                          </div>
                        </td>
                      </tr>
                      {catPerms.map((perm) => (
                        <tr key={perm.id}>
                          <td>
                            <b style={{ color: 'var(--text)', display: 'block' }}>{perm.name}</b>
                            <span className="perm-code" style={{ fontSize: '10px' }}>{perm.code}</span>
                          </td>
                          {roles.map((r) => {
                            const isGranted = !!permissions[r.id]?.[perm.id];

                            return (
                              <td key={r.id} style={{ textAlign: 'center' }}>
                                <label className="switch-pro" style={{ transform: 'scale(0.85)' }}>
                                  <input
                                    type="checkbox"
                                    checked={isGranted}
                                    onChange={() => togglePermission(r.id, perm.id)}
                                  />
                                  <span className="slider" />
                                </label>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
