import React, { useState } from 'react';
import { Icon } from '../Icon';
import { Doctor, Paciente } from '../../types/dental.types';
import './Modals.css';

interface NewCitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  pacientes: Paciente[];
  onSubmit: (cita: {
    paciente: string;
    doctor: string;
    fecha: string;
    hora: string;
    tratamiento: string;
    costo: number;
    metodo: string;
  }) => void;
}

export const NewCitaModal: React.FC<NewCitaModalProps> = ({
  isOpen,
  onClose,
  doctors,
  pacientes,
  onSubmit,
}) => {
  const [paciente, setPaciente] = useState(pacientes[0]?.nom || '');
  const [doctor, setDoctor] = useState(doctors[0]?.id || 'D1');
  const [fecha, setFecha] = useState('2026-10-24');
  const [hora, setHora] = useState('11:00');
  const [tratamiento, setTratamiento] = useState('Consulta y diagnóstico');
  const [costo, setCosto] = useState(60);
  const [metodo, setMetodo] = useState('Efectivo');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      paciente,
      doctor,
      fecha,
      hora,
      tratamiento,
      costo: Number(costo),
      metodo,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-head">
          <h3>
            <Icon name="calendar" size="lg" />
            <span>Agendar Nueva Cita Odontológica</span>
          </h3>
          <button className="icon-btn" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="field full">
                <label>Paciente</label>
                <select
                  className="select"
                  value={paciente}
                  onChange={(e) => setPaciente(e.target.value)}
                  required
                >
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.nom}>
                      {p.nom} ({p.tipo}: {p.doc})
                    </option>
                  ))}
                </select>
              </div>

              <div className="field full">
                <label>Profesional Asignado</label>
                <select
                  className="select"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  required
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombre} — {d.esp} ({d.cop})
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Fecha de Consulta</label>
                <input
                  type="date"
                  className="input"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>Horario</label>
                <select
                  className="select"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                >
                  <option value="09:00">09:00 hrs</option>
                  <option value="10:00">10:00 hrs</option>
                  <option value="11:00">11:00 hrs</option>
                  <option value="12:00">12:00 hrs</option>
                  <option value="14:00">14:00 hrs</option>
                  <option value="15:00">15:00 hrs</option>
                  <option value="16:00">16:00 hrs</option>
                  <option value="17:00">17:00 hrs</option>
                </select>
              </div>

              <div className="field full">
                <label>Procedimiento o Motivo</label>
                <input
                  className="input"
                  value={tratamiento}
                  onChange={(e) => setTratamiento(e.target.value)}
                  placeholder="Ej: Obturación con resina, Profilaxis, etc."
                  required
                />
              </div>

              <div className="field">
                <label>Costo Estimado (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  value={costo}
                  onChange={(e) => setCosto(Number(e.target.value))}
                  required
                />
              </div>

              <div className="field">
                <label>Medio de Pago Previsto</label>
                <select
                  className="select"
                  value={metodo}
                  onChange={(e) => setMetodo(e.target.value)}
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta (POS)</option>
                  <option value="Yape / Plin">Yape / Plin</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-foot">
            <button type="button" className="btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Icon name="check" size="sm" />
              <span>Confirmar Cita</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
