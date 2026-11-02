import React from 'react';
import { Icon } from '../Icon';
import './TermsModal.css';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="terms-title">
      <div className="terms-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del Modal */}
        <div className="terms-modal-head">
          <div className="terms-head-title-wrap">
            <div className="terms-head-icon">
              <Icon name="shield" size="lg" />
            </div>
            <div>
              <h3 id="terms-title" className="terms-head-title">
                Términos y Condiciones de Uso del Sistema Dental FC
              </h3>
              <p className="terms-head-sub">
                Marco Legal, Privacidad Sanitaria y Contrato de Software Odontológico SaaS
              </p>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar modal" title="Cerrar ventana">
            <Icon name="x" size="sm" />
          </button>
        </div>

        {/* Barra de Estado Legal y Vigencia */}
        <div className="terms-status-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pill">
              <Icon name="check" size="sm" />
              <span>Vigente 2026</span>
            </span>
            <span>Versión contractual: <b>v2.4 Enterprise</b></span>
          </div>
          <div>
            <span>Homologación: <b>MINSA / DIGEMID / Ley N° 29733</b></span>
          </div>
        </div>

        {/* Cuerpo con Cláusulas Legales y Médicas */}
        <div className="terms-modal-body">
          <div className="terms-notice-banner">
            <Icon name="shield" size="md" style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <b>Aviso Legal Obligatorio:</b> El uso de la plataforma <b>Dental FC</b> implica la aceptación plena e incondicional de los términos y condiciones aquí dispuestos. Todo el personal clínico y administrativo debe observar el estricto cumplimiento del secreto médico y la protección de datos biomédicos.
            </div>
          </div>

          {/* Cláusula 1 */}
          <div className="terms-section">
            <h4>
              <span className="sec-num">01</span>
              <span>Naturaleza y Objeto del Servicio</span>
            </h4>
            <p>
              Dental FC es una solución integral de software como servicio (SaaS) multi-tenant diseñada para la administración clínica, gestión de fichas odontológicas, odontograma estandarizado FDI, programación de turnos, control de insumos y liquidación de caja para instituciones odontológicas.
            </p>
            <p>
              La licencia otorgada es de carácter institucional, revocable, no exclusiva e intransferible, condicionada a la vigencia del plan de suscripción contratado.
            </p>
          </div>

          {/* Cláusula 2 */}
          <div className="terms-section">
            <h4>
              <span className="sec-num">02</span>
              <span>Protección de Datos Personales y Datos Sensibles (Ley N° 29733)</span>
            </h4>
            <p>
              De conformidad con la Ley de Protección de Datos Personales (Ley N° 29733) y su reglamento, toda información clínica, biométrica, radiográfica y de salud bucal recopilada en Dental FC es clasificada como <b>Dato Sensible</b>.
            </p>
            <ul>
              <li>Los datos de los pacientes pertenecen exclusivamente a la clínica y al titular del dato.</li>
              <li>Dental FC no comercializa, transfiere ni utiliza registros médicos para fines ajenos al servicio.</li>
              <li>Los profesionales tratantes están legalmente obligados al secreto profesional médico (Ley General de Salud N° 26842).</li>
            </ul>
          </div>

          {/* Cláusula 3 */}
          <div className="terms-section">
            <h4>
              <span className="sec-num">03</span>
              <span>Responsabilidad Profesional y Autonomía Médica</span>
            </h4>
            <p>
              El software Dental FC actúa como un soporte tecnológico y de archivo documental. <b>El diagnóstico, la elaboración del plan de tratamiento, la prescripción farmacológica y la ejecución de actos operatorios o quirúrgicos son de exclusiva responsabilidad del Cirujano Dentista colegiado y habilitado</b>.
            </p>
            <p>
              Dental FC no sustituye el juicio clínico profesional ni asume responsabilidad por diagnósticos o prescripciones emitidas por los usuarios habilitados.
            </p>
          </div>

          {/* Cláusula 4 */}
          <div className="terms-section">
            <h4>
              <span className="sec-num">04</span>
              <span>Seguridad, Aislamiento Multi-Tenant y Copias de Seguridad</span>
            </h4>
            <p>
              Para garantizar la confidencialidad absoluta e integridad de la información clínica, la arquitectura de Dental FC implementa:
            </p>
            <ul>
              <li><b>Aislamiento Criptográfico por Tenant:</b> Cada organización o sede opera con estricto filtrado de acceso mediante columna <code style={{ color: 'var(--primary)', fontWeight: 600 }}>tenant_id</code> a nivel de base de datos.</li>
              <li><b>Cifrado de Alto Nivel:</b> Encriptación en tránsito mediante TLS 1.3 y en reposo mediante algoritmo AES-256 bits.</li>
              <li><b>Trazabilidad y Auditoría Forense:</b> Cada modificación en historias clínicas y odontogramas genera un registro inmutable con sello de tiempo, usuario y terminal.</li>
            </ul>
          </div>

          {/* Cláusula 5 */}
          <div className="terms-section">
            <h4>
              <span className="sec-num">05</span>
              <span>Obligaciones del Usuario y Custodia de Credenciales</span>
            </h4>
            <p>
              Cada usuario con acceso a la plataforma es custodio exclusivo de su nombre de usuario y contraseña. Está prohibido compartir credenciales personales entre odontólogos o asistentes. Cualquier acción realizada bajo una sesión activa será atribuida legalmente al titular de la cuenta correspondiente.
            </p>
          </div>

          {/* Cláusula 6 */}
          <div className="terms-section">
            <h4>
              <span className="sec-num">06</span>
              <span>Disponibilidad (SLA) y Mesa de Soporte</span>
            </h4>
            <p>
              Dental FC se compromete a mantener un nivel de servicio y disponibilidad operativa no menor al <b>99.8% mensual</b>, con ventanas de mantenimiento programadas fuera del horario asistencial de la clínica y asistencia técnica a través del módulo institucional de Soporte.
            </p>
          </div>
        </div>

        {/* Pie del Modal */}
        <div className="terms-modal-foot">
          <div className="terms-foot-legal">
            <Icon name="tooth" size="sm" style={{ color: 'var(--primary)' }} />
            <span>Dental FC ERP Odontológico SaaS · Registros Clínicos Seguros</span>
          </div>
          <div className="terms-foot-actions">
            <button className="btn btn-secondary" onClick={handlePrint} title="Imprimir o guardar como PDF">
              <Icon name="printer" size="sm" />
              <span>Imprimir / Guardar Copia</span>
            </button>
            <button className="btn btn-primary" onClick={onClose}>
              <Icon name="check" size="sm" />
              <span>Entendido y Aceptar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
