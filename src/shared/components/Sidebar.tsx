import React from 'react';
import { Icon, IconName } from './Icon';
import './Sidebar.css';

export type ViewType =
  | 'dashboard'
  | 'agenda'
  | 'pacientes'
  | 'odontograma'
  | 'tratamientos'
  | 'clinico'
  | 'caja'
  | 'inventario'
  | 'reportes'
  | 'equipo'
  | 'roles'
  | 'planes'
  | 'configuracion'
  | 'excel-import'
  | 'tenants'
  | 'historia'
  | 'auditoria'
  | 'terminos'
  | 'soporte';

interface SidebarProps {
  activeView: ViewType;
  onNavigate: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenTerms?: () => void;
  pacientesCount?: number;
}

interface NavItemDef {
  id: ViewType;
  label: string;
  icon: IconName;
  count?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  isOpen,
  onClose,
  onOpenTerms,
  pacientesCount,
}) => {
  const principalItems: NavItemDef[] = [
    { id: 'dashboard', label: 'Panel General', icon: 'grid' },
  ];

  const clinicoItems: NavItemDef[] = [
    { id: 'agenda', label: 'Agenda de Citas', icon: 'calendar', count: 18 },
    { id: 'pacientes', label: 'Pacientes y Clientes', icon: 'users', count: pacientesCount },
    { id: 'historia', label: 'Historia Clínica', icon: 'file' },
  ];

  const operacionesItems: NavItemDef[] = [
    { id: 'equipo', label: 'Equipo y Personal', icon: 'user' },
    { id: 'tratamientos', label: 'Tratamientos', icon: 'tag' },
    { id: 'inventario', label: 'Stock de Insumos', icon: 'layers' },
  ];

  const financieroItems: NavItemDef[] = [
    { id: 'caja', label: 'Caja y Pagos', icon: 'card' },
    { id: 'reportes', label: 'Reportes e Informes', icon: 'activity' },
  ];

  const saasItems: NavItemDef[] = [
    { id: 'planes', label: 'Suscripciones y Planes', icon: 'card' },
  ];

  const sistemaItems: NavItemDef[] = [
    { id: 'configuracion', label: 'Configuración', icon: 'settings' },
    { id: 'excel-import', label: 'Portear Excel a BD', icon: 'database' },
    { id: 'tenants', label: 'Gestión de Tenants', icon: 'layers' },
    { id: 'roles', label: 'Roles y Accesos', icon: 'lock' },
    { id: 'auditoria', label: 'Auditoría del Sistema', icon: 'shield' },
    { id: 'terminos', label: 'Términos y Condiciones', icon: 'file' },
    { id: 'soporte', label: 'Soporte Técnico', icon: 'headset' },
  ];

  const renderNavGroup = (label: string, items: NavItemDef[]) => (
    <>
      <div className="nav-label">{label}</div>
      {items.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${activeView === item.id ? 'active' : ''}`}
          onClick={() => {
            onNavigate(item.id);
            onClose();
          }}
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
          {item.count !== undefined && <span className="count">{item.count}</span>}
        </button>
      ))}
    </>
  );

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand">
        <div className="brand-logo">
          <Icon name="tooth" size="lg" />
        </div>
        <div>
          <div className="brand-name">Dental FC</div>
          <div className="brand-sub">Clínica Dental</div>
        </div>
      </div>

      <nav className="nav">
        {renderNavGroup('Principal', principalItems)}
        {renderNavGroup('Clínico', clinicoItems)}
        {renderNavGroup('Operaciones', operacionesItems)}
        {renderNavGroup('Financiero', financieroItems)}
        {renderNavGroup('Administración SaaS', saasItems)}
        {renderNavGroup('Sistema', sistemaItems)}
      </nav>

      {/* Apartado Legal y Normativo */}
      <div className="sidebar-legal-bar">
        <button
          type="button"
          className="sidebar-legal-btn"
          onClick={() => {
            onOpenTerms?.();
            onClose();
          }}
          title="Consultar Términos, Condiciones y Políticas de Privacidad"
        >
          <Icon name="shield" size="sm" />
          <span>Términos y Condiciones</span>
        </button>
      </div>

      <div className="side-foot">
        <div className="avatar alt2" style={{ position: 'relative' }}>
          DM
          <span style={{ position: 'absolute', bottom: 0, right: 0, width: '9px', height: '9px', borderRadius: '50%', background: 'var(--ok)', border: '2px solid var(--sidebar-bg)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="who" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Dr. Diego Mendoza
          </div>
          <div className="role">Director Médico</div>
        </div>
      </div>
    </aside>
  );
};
