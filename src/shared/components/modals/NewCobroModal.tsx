import React, { useState } from 'react';
import { Icon } from '../Icon';
import { Doctor, MetodoPago, Paciente, ReporteItem } from '../../types/dental.types';

interface NewCobroModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacientes: Paciente[];
  doctors: Doctor[];
  onSubmit: (cobro: ReporteItem) => void;
}

export const NewCobroModal: React.FC<NewCobroModalProps> = ({
  isOpen,
  onClose,
  pacientes,
  doctors,
  onSubmit,
}) => {
  const [pac, setPac] = useState(pacientes[0]?.nom || '');
  const [comp, setComp] = useState<'Boleta' | 'Factura' | 'Recibo'>('Boleta');
  const [nro, setNro] = useState(`B001-${Math.floor(100000 + Math.random() * 900000)}`);
  const [con, setCon] = useState('Consulta y diagnóstico odontológico');
  const [doc, setDoc] = useState(doctors[0]?.id || 'D1');
  const [met, setMet] = useState<MetodoPago>('Tarjeta');
  const [monto, setMonto] = useState<number>(150);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');

    onSubmit({
      f: '2026-10-24',
      h: `${hours}:${mins}`,
      comp,
      nro,
      pac,
      con,
      doc,
      met,
      est: 'Pagado',
      m: Number(monto),
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="modal-head">
          <h3>
            <Icon name="card" size="lg" />
            <span>Registrar Cobro en Caja</span>
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
                  value={pac}
                  onChange={(e) => setPac(e.target.value)}
                  required
                >
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.nom}>
                      {p.nom} ({p.tipo}: {p.doc})
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Tipo de Comprobante</label>
                <select
                  className="select"
                  value={comp}
                  onChange={(e) => {
                    const c = e.target.value as 'Boleta' | 'Factura' | 'Recibo';
                    setComp(c);
                    const prefix = c === 'Boleta' ? 'B001' : c === 'Factura' ? 'F001' : 'R';
                    setNro(`${prefix}-${Math.floor(100000 + Math.random() * 900000)}`);
                  }}
                >
                  <option value="Boleta">Boleta de Venta Electrónica</option>
                  <option value="Factura">Factura Electrónica</option>
                  <option value="Recibo">Recibo de Caja</option>
                </select>
              </div>

              <div className="field">
                <label>N° Comprobante</label>
                <input
                  className="input"
                  value={nro}
                  onChange={(e) => setNro(e.target.value)}
                  required
                />
              </div>

              <div className="field full">
                <label>Concepto / Procedimiento Cobrado</label>
                <input
                  className="input"
                  value={con}
                  onChange={(e) => setCon(e.target.value)}
                  placeholder="Ej: Obturación con resina, Control brackets, etc."
                  required
                />
              </div>

              <div className="field">
                <label>Profesional Tratante</label>
                <select
                  className="select"
                  value={doc}
                  onChange={(e) => setDoc(e.target.value)}
                  required
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombre} ({d.esp})
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Método de Pago</label>
                <select
                  className="select"
                  value={met}
                  onChange={(e) => setMet(e.target.value as MetodoPago)}
                >
                  <option value="Tarjeta">Tarjeta de Crédito / Débito (POS)</option>
                  <option value="Efectivo">Efectivo en Caja</option>
                  <option value="Yape / Plin">Billetera Móvil (Yape / Plin)</option>
                  <option value="Transferencia">Transferencia Bancaria</option>
                </select>
              </div>

              <div className="field full">
                <label>Monto a Cobrar (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  className="input"
                  value={monto}
                  onChange={(e) => setMonto(Number(e.target.value))}
                  required
                  style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary-2)' }}
                />
              </div>
            </div>
          </div>

          <div className="modal-foot">
            <button type="button" className="btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Icon name="check" size="sm" />
              <span>Emitir Comprobante y Cobrar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
