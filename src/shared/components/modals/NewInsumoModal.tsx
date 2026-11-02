import React, { useState } from 'react';
import { Icon } from '../Icon';
import { Insumo } from '../../types/dental.types';

interface NewInsumoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (insumo: Insumo) => void;
}

export const NewInsumoModal: React.FC<NewInsumoModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('Restauración');
  const [stockActual, setStockActual] = useState<number>(10);
  const [stockMinimo, setStockMinimo] = useState<number>(5);
  const [unidad, setUnidad] = useState('unidades');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const act = Number(stockActual);
    const min = Number(stockMinimo);
    const pct = min > 0 ? Math.round((act / min) * 100) : 100;
    const estado = pct <= 20 ? 'Crítico' : pct <= 50 ? 'Bajo' : 'Normal';

    onSubmit({
      id: `INS-${Math.floor(10 + Math.random() * 90)}`,
      nombre,
      categoria,
      stockActual: act,
      stockMinimo: min,
      unidad,
      estado,
      porcentaje: Math.min(pct, 100),
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="modal-head">
          <h3>
            <Icon name="layers" size="lg" />
            <span>Registrar Nuevo Insumo / Material</span>
          </h3>
          <button className="icon-btn" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="field full">
                <label>Nombre del Insumo / Material Dental</label>
                <input
                  className="input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Alginato Cromático para Impresiones"
                  required
                />
              </div>

              <div className="field">
                <label>Categoría</label>
                <select
                  className="select"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="Anestésicos">Anestésicos</option>
                  <option value="Restauración">Restauración</option>
                  <option value="Bioseguridad">Bioseguridad</option>
                  <option value="Inyectables">Inyectables</option>
                  <option value="Endodoncia">Endodoncia</option>
                  <option value="Ortodoncia">Ortodoncia</option>
                  <option value="Cirugía">Cirugía</option>
                </select>
              </div>

              <div className="field">
                <label>Unidad de Medida</label>
                <input
                  className="input"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                  placeholder="Ej: cajas, jeringas, tubos"
                  required
                />
              </div>

              <div className="field">
                <label>Stock Inicial Actual</label>
                <input
                  type="number"
                  min="0"
                  className="input"
                  value={stockActual}
                  onChange={(e) => setStockActual(Number(e.target.value))}
                  required
                />
              </div>

              <div className="field">
                <label>Punto de Reorden (Stock Mínimo)</label>
                <input
                  type="number"
                  min="1"
                  className="input"
                  value={stockMinimo}
                  onChange={(e) => setStockMinimo(Number(e.target.value))}
                  required
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
              <span>Guardar en Inventario</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
