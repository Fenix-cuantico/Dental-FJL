import React from 'react';
import { Icon, IconName } from './Icon';
import { ViewType } from './Sidebar';
import './Topbar.css';

interface TopbarProps {
  activeView: ViewType;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleMenu: () => void;
  onOpenTerms?: () => void;
}

const VIEW_METADATA: Record<ViewType, { title: string; icon: IconName }> = {
  dashboard: { title: 'Panel General', icon: 'grid' },
  agenda: { title: 'Agenda de Citas', icon: 'calendar' },
  pacientes: { title: 'Directorio de Pacientes y Clientes', icon: 'users' },
  odontograma: { title: 'Odontograma Dental Interactivo', icon: 'tooth' },
  tratamientos: { title: 'Catálogo de Tratamientos y Aranceles', icon: 'tag' },
  clinico: { title: 'Historial Clínico', icon: 'file' },
  caja: { title: 'Caja y Movimientos', icon: 'card' },
  inventario: { title: 'Inventario y Stock de Insumos', icon: 'layers' },
  reportes: { title: 'Reportes e Informes Consolidados', icon: 'activity' },
  equipo: { title: 'Equipo y Profesionales', icon: 'user' },
  roles: { title: 'Roles y Accesos', icon: 'lock' },
  planes: { title: 'Planes y Suscripción SaaS', icon: 'star' },
  configuracion: { title: 'Configuración Sede y Clínica', icon: 'settings' },
  historia: { title: 'Historia Clínica y Evoluciones Médicas', icon: 'file' },
  auditoria: { title: 'Auditoría y Trazabilidad del Sistema', icon: 'shield' },
  'excel-import': { title: 'Importación y Migración Excel', icon: 'database' },
  tenants: { title: 'Gestión de Sedes y Tenants', icon: 'layers' },
  terminos: { title: 'Términos y Condiciones Legales', icon: 'file' },
  soporte: { title: 'Soporte Técnico y Mesa de Ayuda', icon: 'headset' },
};

export const Topbar: React.FC<TopbarProps> = ({
  activeView,
  theme,
  onToggleTheme,
  onToggleMenu,
  onOpenTerms,
}) => {
  const meta = VIEW_METADATA[activeView] || { title: 'Módulo', icon: 'grid' };

  return (
    <header className="topbar">
      <button className="icon-btn" id="menuBtn" onClick={onToggleMenu} aria-label="Abrir menú">
        <Icon name="menu" />
      </button>

      {/* Migas de pan enriquecidas con icono */}
      <div className="crumbs">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon name="tooth" size="sm" style={{ color: 'var(--primary-2)' }} />
          <span>Dental FC</span>
        </span>
        <Icon name="chevron-r" size="sm" />
        <b style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon name={meta.icon} size="sm" />
          <span>{meta.title}</span>
        </b>
      </div>

      <div className="top-spacer" />

      {/* Indicador de Estado Clínico en Vivo */}
      <div className="top-status-pill">
        <span className="live-dot" />
        <span>Sede Surco · 4 Boxes Activos</span>
      </div>

      {/* Segmented Switcher de Tema (Claro / Oscuro) Muy Visible */}
      <div className="theme-toggle-wrap" role="group" aria-label="Selector de tema">
        <button
          type="button"
          className={`theme-opt ${theme === 'light' ? 'active' : ''}`}
          onClick={() => theme !== 'light' && onToggleTheme()}
          title="Activar Modo Claro"
        >
          <Icon name="sun" size="sm" />
          <span>Claro</span>
        </button>
        <button
          type="button"
          className={`theme-opt ${theme === 'dark' ? 'active' : ''}`}
          onClick={() => theme !== 'dark' && onToggleTheme()}
          title="Activar Modo Oscuro"
        >
          <Icon name="moon" size="sm" />
          <span>Oscuro</span>
        </button>
      </div>

      {/* Apartado / Icono de Términos y Condiciones */}
      <button
        type="button"
        className="icon-btn top-terms-btn"
        onClick={onOpenTerms}
        title="Términos y Condiciones del Sistema"
        aria-label="Términos y Condiciones"
      >
        <Icon name="shield" />
      </button>

      {/* Notificaciones */}
      <button className="icon-btn" style={{ position: 'relative' }} title="Notificaciones del sistema" aria-label="Notificaciones">
        <Icon name="bell" />
        <span className="notif-badge" />
      </button>

      {/* Perfil Rápido */}
      <div className="top-user-chip" title="Sesión activa: Dr. Diego Mendoza">
        <div className="avatar alt2" style={{ width: '32px', height: '32px', fontSize: '11.5px' }}>
          DM
        </div>
        <div className="user-info-text">
          <span className="u-name">Dr. D. Mendoza</span>
          <span className="u-role">Dir. Médico</span>
        </div>
      </div>
    </header>
  );
};
