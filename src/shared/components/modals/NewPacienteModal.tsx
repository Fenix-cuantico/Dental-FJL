import React, { useState } from 'react';
import { Icon } from '../Icon';
import { EstadoPaciente, Paciente, Sexo, TipoDocumento } from '../../types/dental.types';

interface NewPacienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paciente: Omit<Paciente, 'id' | 'fav'>) => void;
}

export const NewPacienteModal: React.FC<NewPacienteModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [nom, setNom] = useState('');
  const [tipo, setTipo] = useState<TipoDocumento>('DNI');
  const [doc, setDoc] = useState('');
  const [edad, setEdad] = useState<number>(30);
  const [sex, setSex] = useState<Sexo>('F');
  const [tel, setTel] = useState('');
  const [mail, setMail] = useState('');
  const [dir, setDir] = useState('');
  const [tagsStr, setTagsStr] = useState('Nuevo');
  const [est, setEst] = useState<EstadoPaciente>('Activo');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      nom,
      tipo,
      doc,
      edad: Number(edad),
      sex,
      tel,
      mail,
      dir,
      tags,
      est,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-head">
          <h3>
            <Icon name="users" size="lg" />
            <span>Registrar Nuevo Paciente</span>
          </h3>
          <button className="icon-btn" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="field full">
                <label>Nombres y Apellidos Completos</label>
                <input
                  className="input"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ej: Sofía Mendoza Alarcón"
                  required
                />
              </div>

              <div className="field">
                <label>Tipo de Documento</label>
                <select
                  className="select"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoDocumento)}
                >
                  <option value="DNI">DNI (Perú)</option>
                  <option value="CEX">Carné de Extranjería</option>
                  <option value="PAS">Pasaporte</option>
                </select>
              </div>

              <div className="field">
                <label>Número de Documento</label>
                <input
                  className="input"
                  value={doc}
                  onChange={(e) => setDoc(e.target.value)}
                  placeholder="Ej: 74819203"
                  required
                />
              </div>

              <div className="field">
                <label>Edad (Años)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  className="input"
                  value={edad}
                  onChange={(e) => setEdad(Number(e.target.value))}
                  required
                />
              </div>

              <div className="field">
                <label>Sexo Biológico</label>
                <select
                  className="select"
                  value={sex}
                  onChange={(e) => setSex(e.target.value as Sexo)}
                >
                  <option value="F">Femenino</option>
                  <option value="M">Masculino</option>
                </select>
              </div>

              <div className="field">
                <label>Teléfono Celular / WhatsApp</label>
                <input
                  type="tel"
                  className="input"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="Ej: 994 123 456"
                  required
                />
              </div>

              <div className="field">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  className="input"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  placeholder="paciente@correo.com"
                  required
                />
              </div>

              <div className="field full">
                <label>Dirección de Residencia</label>
                <input
                  className="input"
                  value={dir}
                  onChange={(e) => setDir(e.target.value)}
                  placeholder="Ej: Av. Benavides 1420, Dpto 502, Miraflores"
                  required
                />
              </div>

              <div className="field">
                <label>Etiquetas (Separadas por coma)</label>
                <input
                  className="input"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="VIP, Ortodoncia, Sensibilidad"
                />
              </div>

              <div className="field">
                <label>Estado Inicial</label>
                <select
                  className="select"
                  value={est}
                  onChange={(e) => setEst(e.target.value as EstadoPaciente)}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Moroso">Moroso</option>
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
              <span>Guardar Paciente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
