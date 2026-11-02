import React, { useState, useEffect } from 'react';
import { Sidebar, ViewType } from './shared/components/Sidebar';
import { Topbar } from './shared/components/Topbar';
import { Toast } from './shared/components/Toast';

// Módulos
import { DashboardModule } from './modules/dashboard/DashboardModule';
import { AgendaModule } from './modules/agenda/AgendaModule';
import { PacientesModule } from './modules/pacientes/PacientesModule';
import { CajaModule } from './modules/caja/CajaModule';
import { InventarioModule } from './modules/inventario/InventarioModule';
import { ReportesModule } from './modules/reportes/ReportesModule';
import { EquipoModule } from './modules/equipo/EquipoModule';
import { RolesModule } from './modules/roles/RolesModule';
import { HistoriaModule } from './modules/historia/HistoriaModule';
import { AuditoriaModule } from './modules/auditoria/AuditoriaModule';
import { PlanesModule } from './modules/planes/PlanesModule';
import { ConfiguracionModule } from './modules/configuracion/ConfiguracionModule';
import { TratamientosModule } from './modules/tratamientos/TratamientosModule';
import { SoporteModule } from './modules/soporte/SoporteModule';
import { TerminosModule } from './modules/terminos/TerminosModule';
import { ExcelImportModule } from './modules/excel/ExcelImportModule';
import { TenantsModule } from './modules/tenants/TenantsModule';

// Modales de Creación
import { NewCitaModal } from './shared/components/modals/NewCitaModal';
import { NewPacienteModal } from './shared/components/modals/NewPacienteModal';
import { NewCobroModal } from './shared/components/modals/NewCobroModal';
import { NewInsumoModal } from './shared/components/modals/NewInsumoModal';
import { TermsModal } from './shared/components/modals/TermsModal';

// Datos Iniciales
import {
  INITIAL_AUDITORIA,
  INITIAL_DOCS,
  INITIAL_INSUMOS,
  INITIAL_ODONTOGRAMA,
  INITIAL_PACIENTES,
  INITIAL_REPORTES,
  INITIAL_TRATAMIENTOS,
} from './shared/data/mockData';
import {
  Doctor,
  EventoAuditoria,
  Insumo,
  OdontogramaData,
  Paciente,
  ReporteItem,
} from './shared/types/dental.types';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('nexora-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Estados de datos
  const [pacientes, setPacientes] = useState<Paciente[]>(INITIAL_PACIENTES);
  const [doctors] = useState<Doctor[]>(INITIAL_DOCS);
  const [insumos, setInsumos] = useState<Insumo[]>(INITIAL_INSUMOS);
  const [reportes, setReportes] = useState<ReporteItem[]>(INITIAL_REPORTES);
  const [auditoria, setAuditoria] = useState<EventoAuditoria[]>(INITIAL_AUDITORIA);
  const [odontoData, setOdontoData] = useState<OdontogramaData>(INITIAL_ODONTOGRAMA);
  const [selectedOdontoPatientId, setSelectedOdontoPatientId] = useState<number>(1);

  // Estados de modales
  const [isNewCitaOpen, setIsNewCitaOpen] = useState(false);
  const [isNewPacienteOpen, setIsNewPacienteOpen] = useState(false);
  const [isNewCobroOpen, setIsNewCobroOpen] = useState(false);
  const [isNewInsumoOpen, setIsNewInsumoOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Notificación Toast
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3500);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('nexora-theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handlePedirStock = (nombreInsumo?: string) => {
    const text = nombreInsumo
      ? `Orden de reposición generada para: ${nombreInsumo}`
      : 'Orden de reposición generada para todos los insumos bajo stock mínimo';
    showToast(text);

    // Registro de auditoría automática
    const newAudit: EventoAuditoria = {
      id: Date.now(),
      fecha: '2026-10-24',
      hora: '11:25',
      usuario: 'Dr. Diego Mendoza',
      rol: 'Administrador',
      accion: 'Creó',
      modulo: 'Inventario',
      paciente: '-',
      detalle: text,
      ip: '192.168.1.24',
      dispositivo: 'Escritorio - Chrome',
    };
    setAuditoria((prev) => [newAudit, ...prev]);
  };

  const handleAjustarStock = (id: string, delta: number) => {
    setInsumos((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stockActual + delta);
          const pct = Math.round((newStock / item.stockMinimo) * 100);
          const estado = pct <= 20 ? 'Crítico' : pct <= 50 ? 'Bajo' : 'Normal';
          return {
            ...item,
            stockActual: newStock,
            porcentaje: Math.min(pct, 100),
            estado,
          };
        }
        return item;
      })
    );
    showToast(`Stock de insumo ${id} actualizado`);
  };

  const handleCreateCita = (cita: {
    paciente: string;
    doctor: string;
    fecha: string;
    hora: string;
    tratamiento: string;
    costo: number;
    metodo: string;
  }) => {
    showToast(`Cita agendada para ${cita.paciente} el ${cita.fecha} a las ${cita.hora}`);
  };

  const handleCreatePaciente = (data: Omit<Paciente, 'id' | 'fav'>) => {
    const newId = pacientes.length > 0 ? Math.max(...pacientes.map((p) => p.id)) + 1 : 1;
    const newPaciente: Paciente = {
      ...data,
      id: newId,
      fav: false,
    };
    setPacientes((prev) => [newPaciente, ...prev]);
    showToast(`Paciente ${data.nom} registrado con éxito`);
  };

  const handleUpdatePaciente = (updated: Paciente) => {
    setPacientes((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    showToast(`Expediente de ${updated.nom} actualizado con éxito`);
  };

  const handleDeletePaciente = (id: number) => {
    const target = pacientes.find((p) => p.id === id);
    setPacientes((prev) => prev.filter((p) => p.id !== id));
    showToast(`Paciente ${target?.nom || ''} archivado del sistema`);
  };

  const handleCreateCobro = (item: ReporteItem) => {
    setReportes((prev) => [item, ...prev]);
    showToast(`Cobro de S/ ${item.m.toFixed(2)} registrado (${item.comp} ${item.nro})`);
  };

  const handleCreateInsumo = (item: Insumo) => {
    setInsumos((prev) => [item, ...prev]);
    showToast(`Insumo ${item.nombre} registrado con éxito`);
  };

  const handleToggleFavorite = (id: number) => {
    setPacientes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, fav: !p.fav } : p))
    );
  };

  const handleOpenOdontograma = (pacienteId: number) => {
    setSelectedOdontoPatientId(pacienteId);
    setActiveView('odontograma');
  };

  const renderCurrentModule = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardModule
            onNavigate={setActiveView}
            insumos={insumos}
            onPedirStock={handlePedirStock}
            onOpenNewCita={() => setIsNewCitaOpen(true)}
          />
        );
      case 'agenda':
        return (
          <AgendaModule
            doctors={doctors}
            onOpenNewCita={() => setIsNewCitaOpen(true)}
            onOpenPatientFicha={() => setActiveView('pacientes')}
          />
        );
      case 'pacientes':
        return (
          <PacientesModule
            pacientes={pacientes}
            onOpenNewPaciente={() => setIsNewPacienteOpen(true)}
            onOpenOdontograma={handleOpenOdontograma}
            onOpenHistoria={(id) => {
              setSelectedOdontoPatientId(id);
              setActiveView('historia');
              showToast('Abriendo Historia Clínica oficial del paciente');
            }}
            onToggleFavorite={handleToggleFavorite}
            onUpdatePaciente={handleUpdatePaciente}
            onDeletePaciente={handleDeletePaciente}
          />
        );
      case 'odontograma':
      case 'historia':
      case 'clinico':
        return (
          <HistoriaModule
            pacientes={pacientes}
            doctors={doctors}
            selectedPacienteIdProp={selectedOdontoPatientId}
            initialTab={activeView === 'odontograma' ? 'odontograma' : 'odontograma'}
            initialOdontoData={odontoData}
            onSaveOdontograma={(data) => {
              setOdontoData(data);
              showToast('Odontograma guardado correctamente en la historia clínica');
            }}
            onOpenOdontograma={handleOpenOdontograma}
            onShowToast={showToast}
          />
        );
      case 'caja':
        return (
          <CajaModule
            reportes={reportes}
            onOpenNewCobro={() => setIsNewCobroOpen(true)}
            onShowToast={showToast}
          />
        );
      case 'inventario':
        return (
          <InventarioModule
            insumos={insumos}
            onOpenNewInsumo={() => setIsNewInsumoOpen(true)}
            onPedirStock={handlePedirStock}
            onAjustarStock={handleAjustarStock}
          />
        );
      case 'reportes':
        return <ReportesModule doctors={doctors} reportes={reportes} />;
      case 'equipo':
        return (
          <EquipoModule
            doctors={doctors}
            onNavigateAgenda={(_docId) => {
              setActiveView('agenda');
              showToast('Filtrando citas del especialista en la agenda');
            }}
            onShowToast={showToast}
          />
        );
      case 'roles':
        return <RolesModule onShowToast={showToast} />;
      case 'planes':
        return <PlanesModule onShowToast={showToast} />;
      case 'configuracion':
        return (
          <ConfiguracionModule
            onShowToast={showToast}
            onNavigate={(view) => setActiveView(view as any)}
          />
        );
      case 'excel-import':
        return <ExcelImportModule onShowToast={showToast} />;
      case 'tenants':
        return <TenantsModule onShowToast={showToast} />;
      case 'auditoria':
        return <AuditoriaModule auditoria={auditoria} />;
      case 'tratamientos':
        return (
          <TratamientosModule
            initialTratamientos={INITIAL_TRATAMIENTOS}
            onShowToast={showToast}
          />
        );
      case 'soporte':
        return <SoporteModule onShowToast={showToast} />;
      case 'terminos':
        return <TerminosModule onShowToast={showToast} />;
      default:
        return (
          <DashboardModule
            onNavigate={setActiveView}
            insumos={insumos}
            onPedirStock={handlePedirStock}
            onOpenNewCita={() => setIsNewCitaOpen(true)}
            onOpenTerms={() => setActiveView('terminos')}
          />
        );
    }
  };

  return (
    <div className="app">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenTerms={() => setActiveView('terminos')}
        pacientesCount={pacientes.length}
      />

      <div className="main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar
          activeView={activeView}
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleMenu={() => setSidebarOpen(!sidebarOpen)}
          onOpenTerms={() => setActiveView('terminos')}
        />

        <main className="content" style={{ padding: '24px 28px', flex: 1 }}>
          {renderCurrentModule()}
        </main>
      </div>

      {/* Modales de Creación y Marco Legal */}
      <NewCitaModal
        isOpen={isNewCitaOpen}
        onClose={() => setIsNewCitaOpen(false)}
        doctors={doctors}
        pacientes={pacientes}
        onSubmit={handleCreateCita}
      />

      <NewPacienteModal
        isOpen={isNewPacienteOpen}
        onClose={() => setIsNewPacienteOpen(false)}
        onSubmit={handleCreatePaciente}
      />

      <NewCobroModal
        isOpen={isNewCobroOpen}
        onClose={() => setIsNewCobroOpen(false)}
        pacientes={pacientes}
        doctors={doctors}
        onSubmit={handleCreateCobro}
      />

      <NewInsumoModal
        isOpen={isNewInsumoOpen}
        onClose={() => setIsNewInsumoOpen(false)}
        onSubmit={handleCreateInsumo}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Notificación Toast */}
      <Toast message={toast.msg} visible={toast.show} />
    </div>
  );
};

export default App;
