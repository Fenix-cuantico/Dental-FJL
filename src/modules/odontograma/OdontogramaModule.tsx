import React, { useState, useEffect } from 'react';
import { Icon } from '../../shared/components/Icon';
import {
  CaraDental,
  CondicionCara,
  CondicionPieza,
  OdontogramaData,
  Paciente,
} from '../../shared/types/dental.types';
import './OdontogramaModule.css';

type ActiveTool = CondicionCara | CondicionPieza | 'sano';

interface OdontogramaModuleProps {
  pacientes: Paciente[];
  initialData?: OdontogramaData;
  onSave?: (data: OdontogramaData) => void;
  selectedPacienteId?: number;
  embedded?: boolean;
}

const TOOTH_NAMES: Record<number, string> = {
  18: 'Tercer molar sup. der.',
  17: 'Segundo molar sup. der.',
  16: 'Primer molar sup. der.',
  15: 'Segundo premolar sup. der.',
  14: 'Primer premolar sup. der.',
  13: 'Canino sup. der.',
  12: 'Incisivo lateral sup. der.',
  11: 'Incisivo central sup. der.',
  21: 'Incisivo central sup. izq.',
  22: 'Incisivo lateral sup. izq.',
  23: 'Canino sup. izq.',
  24: 'Primer premolar sup. izq.',
  25: 'Segundo premolar sup. izq.',
  26: 'Primer molar sup. izq.',
  27: 'Segundo molar sup. izq.',
  28: 'Tercer molar sup. izq.',
  48: 'Tercer molar inf. der.',
  47: 'Segundo molar inf. der.',
  46: 'Primer molar inf. der.',
  45: 'Segundo premolar inf. der.',
  44: 'Primer premolar inf. der.',
  43: 'Canino inf. der.',
  42: 'Incisivo lateral inf. der.',
  41: 'Incisivo central inf. der.',
  31: 'Incisivo central inf. izq.',
  32: 'Incisivo lateral inf. izq.',
  33: 'Canino inf. izq.',
  34: 'Primer premolar inf. izq.',
  35: 'Segundo premolar inf. izq.',
  36: 'Primer molar inf. izq.',
  37: 'Segundo molar inf. izq.',
  38: 'Tercer molar inf. izq.',
};

export const OdontogramaModule: React.FC<OdontogramaModuleProps> = ({
  pacientes,
  initialData,
  onSave,
  selectedPacienteId = 1,
  embedded = false,
}) => {
  const [currentPacienteId, setCurrentPacienteId] = useState<number>(selectedPacienteId);
  const [dentition, setDentition] = useState<'perm' | 'temp'>('perm');
  const [activeTool, setActiveTool] = useState<ActiveTool>('caries');
  const [selectedTooth, setSelectedTooth] = useState<number>(26);

  useEffect(() => {
    if (selectedPacienteId) {
      setCurrentPacienteId(selectedPacienteId);
    }
  }, [selectedPacienteId]);

  const [odontoData, setOdontoData] = useState<OdontogramaData>(
    initialData || {
      16: { f: { O: 'caries', D: 'caries' } },
      26: { f: { O: 'obtur', M: 'obtur' } },
      36: { whole: 'endo', f: {} },
      46: { whole: 'corona', f: {} },
      18: { whole: 'ausente', f: {} },
      11: { f: { M: 'fractura' } },
      24: { f: { O: 'sellante' } },
      37: { whole: 'implante', f: {} },
      21: { f: { V: 'obtur' } },
      47: { f: { O: 'caries' } },
    }
  );

  // Arcos Permanentes (FDI)
  const permSupDer = [18, 17, 16, 15, 14, 13, 12, 11];
  const permSupIzq = [21, 22, 23, 24, 25, 26, 27, 28];
  const permInfDer = [48, 47, 46, 45, 44, 43, 42, 41];
  const permInfIzq = [31, 32, 33, 34, 35, 36, 37, 38];

  // Arcos Temporales
  const tempSupDer = [55, 54, 53, 52, 51];
  const tempSupIzq = [61, 62, 63, 64, 65];
  const tempInfDer = [85, 84, 83, 82, 81];
  const tempInfIzq = [71, 72, 73, 74, 75];

  const supDer = dentition === 'perm' ? permSupDer : tempSupDer;
  const supIzq = dentition === 'perm' ? permSupIzq : tempSupIzq;
  const infDer = dentition === 'perm' ? permInfDer : tempInfDer;
  const infIzq = dentition === 'perm' ? permInfIzq : tempInfIzq;

  const currentPaciente = pacientes.find((p) => p.id === currentPacienteId) || pacientes[0];

  const handleFaceClick = (toothNum: number, face: CaraDental, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTooth(toothNum);

    setOdontoData((prev) => {
      const copy = { ...prev };
      const current = copy[toothNum] || { f: {} };
      const faces = { ...(current.f || {}) };

      if (['caries', 'obtur', 'sellante', 'fractura'].includes(activeTool)) {
        faces[face] = activeTool as CondicionCara;
        copy[toothNum] = { ...current, f: faces };
      } else if (activeTool === 'sano') {
        delete faces[face];
        copy[toothNum] = { ...current, f: faces };
      }
      return copy;
    });
  };

  const handleToothClick = (toothNum: number) => {
    setSelectedTooth(toothNum);

    if (['endo', 'corona', 'implante', 'ausente'].includes(activeTool)) {
      setOdontoData((prev) => {
        const copy = { ...prev };
        const current = copy[toothNum] || { f: {} };
        const wholeCond = activeTool as CondicionPieza;
        if (current.whole === wholeCond) {
          delete current.whole;
        } else {
          current.whole = wholeCond;
        }
        copy[toothNum] = current;
        return copy;
      });
    } else if (activeTool === 'sano') {
      setOdontoData((prev) => {
        const copy = { ...prev };
        delete copy[toothNum];
        return copy;
      });
    }
  };

  // Cálculo de estadísticas consolidadas
  let countCaries = 0;
  let countObtur = 0;
  let countSellante = 0;
  let countFractura = 0;
  let countEndo = 0;
  let countCorona = 0;
  let countImplante = 0;
  let countAusente = 0;

  Object.values(odontoData).forEach((entry) => {
    if (entry.whole === 'endo') countEndo++;
    if (entry.whole === 'corona') countCorona++;
    if (entry.whole === 'implante') countImplante++;
    if (entry.whole === 'ausente') countAusente++;

    if (entry.f) {
      Object.values(entry.f).forEach((c) => {
        if (c === 'caries') countCaries++;
        if (c === 'obtur') countObtur++;
        if (c === 'sellante') countSellante++;
        if (c === 'fractura') countFractura++;
      });
    }
  });

  const renderSingleTooth = (num: number) => {
    const toothData = odontoData[num] || { f: {} };
    const faces = toothData.f || {};
    const whole = toothData.whole;
    const isSelected = selectedTooth === num;
    const isAbsent = whole === 'ausente';

    return (
      <div
        key={num}
        className={`tooth ${isSelected ? 'sel' : ''} ${isAbsent ? 'absent' : ''}`}
        onClick={() => handleToothClick(num)}
      >
        <div className="num">{num}</div>
        <svg viewBox="0 0 44 44" aria-label={`Pieza dental ${num}`}>
          {/* Cara Superior (Vestibular en superior, Lingual en inferior) */}
          <polygon
            className={`face ${faces.V || ''}`}
            points="0,0 44,0 33,11 11,11"
            onClick={(e) => handleFaceClick(num, 'V', e)}
          />
          {/* Cara Derecha (Distal en cuadrante 1 y 4, Mesial en 2 y 3) */}
          <polygon
            className={`face ${faces.D || ''}`}
            points="44,0 44,44 33,33 33,11"
            onClick={(e) => handleFaceClick(num, 'D', e)}
          />
          {/* Cara Inferior (Palatina en superior, Vestibular en inferior) */}
          <polygon
            className={`face ${faces.P || faces.L || ''}`}
            points="0,44 44,44 33,33 11,33"
            onClick={(e) => handleFaceClick(num, 'P', e)}
          />
          {/* Cara Izquierda (Mesial en cuadrante 1 y 4, Distal en 2 y 3) */}
          <polygon
            className={`face ${faces.M || ''}`}
            points="0,0 11,11 11,33 0,44"
            onClick={(e) => handleFaceClick(num, 'M', e)}
          />
          {/* Cara Central (Oclusal) */}
          <polygon
            className={`face ${faces.O || ''}`}
            points="11,11 33,11 33,33 11,33"
            onClick={(e) => handleFaceClick(num, 'O', e)}
          />

          {/* Superposiciones de pieza completa */}
          {whole === 'endo' && (
            <line x1="22" y1="2" x2="22" y2="42" stroke="var(--purple)" strokeWidth="3.5" className="overlay-shape" />
          )}
          {whole === 'corona' && (
            <circle cx="22" cy="22" r="18" fill="none" stroke="var(--gold)" strokeWidth="3" className="overlay-shape" />
          )}
          {whole === 'implante' && (
            <path
              d="M17 10h10M22 10v22M15 32h14M18 20h8M19 26h6"
              stroke="var(--teal)"
              strokeWidth="2.5"
              className="overlay-shape"
            />
          )}
          {whole === 'ausente' && (
            <g className="overlay-shape">
              <line x1="4" y1="4" x2="40" y2="40" stroke="var(--danger)" strokeWidth="2.5" />
              <line x1="40" y1="4" x2="4" y2="40" stroke="var(--danger)" strokeWidth="2.5" />
            </g>
          )}
        </svg>
      </div>
    );
  };

  return (
    <section className="odontograma-module">
      {/* Cabecera Ejecutiva - Estilo Dashboard */}
      {!embedded && (
        <div className="corp-hero">
          <div className="corp-hero-main">
            <div className="corp-hero-tag">
              <span className="dot-ok" />
              <span>Mapeo Anatómico FDI & Diagnóstico Visual</span>
            </div>
            <h1 className="corp-hero-title">
              Odontograma Clínico Interactivo — <span>Dental FC</span>
            </h1>
            <p className="corp-hero-desc">
              Registro anatómico por caras dentales, diagnóstico patológico digital en tiempo real y plan de tratamiento valorizado.
            </p>
            <div className="corp-hero-chips">
              <div className="corp-chip">
                <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
                <span>Norma Técnica FDI Odontológica</span>
              </div>
              <div className="corp-chip">
                <Icon name="user" size="sm" style={{ color: 'var(--primary)' }} />
                <span>Paciente: {currentPaciente.nom}</span>
              </div>
              <div className="corp-chip">
                <Icon name="tooth" size="sm" style={{ color: 'var(--warn)' }} />
                <span>Dentición: {dentition === 'perm' ? 'Permanente (32)' : 'Temporal (20)'}</span>
              </div>
            </div>
          </div>

          <div className="corp-hero-actions">
            <button className="btn btn-secondary" onClick={() => window.print()}>
              <Icon name="printer" size="sm" />
              <span>Imprimir Ficha</span>
            </button>
            <button
              className="btn btn-primary"
              onClick={() => onSave && onSave(odontoData)}
            >
              <Icon name="save" size="sm" />
              <span>Guardar Odontograma</span>
            </button>
          </div>
        </div>
      )}

      {/* Selector de Paciente y Dentición */}
      <div className="card card-pad mt" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {!embedded ? (
            <>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Paciente:</span>
              <select
                className="select"
                style={{ width: 'auto', minWidth: '220px' }}
                value={currentPacienteId}
                onChange={(e) => setCurrentPacienteId(Number(e.target.value))}
              >
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom} (HC #{p.id.toString().padStart(5, '0')})
                  </option>
                ))}
              </select>
              <span className="badge ok" style={{ fontSize: '11px' }}>
                {currentPaciente.tipo}: {currentPaciente.doc}
              </span>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="tooth" size="sm" style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                Odontograma Anatómico de {currentPaciente.nom}
              </span>
              <span className="badge ok" style={{ fontSize: '11px' }}>
                FDI Homologado
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="seg">
            <button
              className={dentition === 'perm' ? 'on' : ''}
              onClick={() => setDentition('perm')}
            >
              Permanente (32)
            </button>
            <button
              className={dentition === 'temp' ? 'on' : ''}
              onClick={() => setDentition('temp')}
            >
              Temporal (20)
            </button>
          </div>
          {embedded && onSave && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onSave(odontoData)}
              title="Guardar cambios del odontograma"
            >
              <Icon name="save" size="sm" />
              <span>Guardar Odontograma</span>
            </button>
          )}
        </div>
      </div>

      {/* Resumen de Hallazgos Clínicos (Stat Chips) */}
      <div className="card mt" style={{ padding: '12px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-soft)' }}>
            Hallazgos en el Odontograma:
          </span>
          <div className="stat-chips">
            <span className="stat-chip">
              <span className="sw caries" />
              <span>Caries: <b>{countCaries}</b></span>
            </span>
            <span className="stat-chip">
              <span className="sw obtur" />
              <span>Obturaciones: <b>{countObtur}</b></span>
            </span>
            <span className="stat-chip">
              <span className="sw sellante" />
              <span>Sellantes: <b>{countSellante}</b></span>
            </span>
            <span className="stat-chip">
              <span className="sw fractura" />
              <span>Fracturas: <b>{countFractura}</b></span>
            </span>
            <span className="stat-chip">
              <span className="sw" style={{ background: 'var(--purple)' }} />
              <span>Endodoncias: <b>{countEndo}</b></span>
            </span>
            <span className="stat-chip">
              <span className="sw" style={{ background: 'var(--gold)' }} />
              <span>Coronas: <b>{countCorona}</b></span>
            </span>
            <span className="stat-chip">
              <span className="sw" style={{ background: 'var(--teal)' }} />
              <span>Implantes: <b>{countImplante}</b></span>
            </span>
            <span className="stat-chip">
              <span className="sw" style={{ background: 'var(--text-muted)' }} />
              <span>Ausentes: <b>{countAusente}</b></span>
            </span>
          </div>
        </div>
      </div>

      {/* Layout Principal: Diagrama por Caras a la izquierda, Herramientas & Detalle a la derecha */}
      <div className="odo-layout mt">
        <div>
          {/* Mapeo Dental FDI Completo */}
          <div className="card">
            <div className="card-head">
              <h3>
                <Icon name="layers" />
                <span>Odontograma Anatómico (Sistema FDI)</span>
              </h3>
              <span className="sub">Haga clic en la cara para aplicar la herramienta activa</span>
            </div>
            <div className="card-body">
              <div className="chart-scroll">
                <div className="chart">
                  <div className="orient">
                    <span>Cuadrante 1 (Sup. Der)</span>
                    <span>Cuadrante 2 (Sup. Izq)</span>
                  </div>

                  {/* Arcada Superior */}
                  <div className="arch-row">
                    {supDer.map((num) => renderSingleTooth(num))}
                    <div style={{ width: '24px' }} />
                    {supIzq.map((num) => renderSingleTooth(num))}
                  </div>

                  <div className="arch-sep" />

                  {/* Arcada Inferior */}
                  <div className="arch-row">
                    {infDer.map((num) => renderSingleTooth(num))}
                    <div style={{ width: '24px' }} />
                    {infIzq.map((num) => renderSingleTooth(num))}
                  </div>

                  <div className="orient" style={{ marginTop: '8px' }}>
                    <span>Cuadrante 4 (Inf. Der)</span>
                    <span>Cuadrante 3 (Inf. Izq)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modelo Bucal General (Vista de Arcada Dental) */}
          <div className="card mt">
            <div className="card-head">
              <h3>
                <Icon name="eye" />
                <span>Modelo Bucal General (Curva de Oclusión)</span>
              </h3>
              <span className="sub">Vista topográfica de ambas arcadas</span>
            </div>
            <div className="card-body">
              <div className="mouth-wrap">
                <svg viewBox="0 0 540 220" style={{ maxWidth: '540px' }} role="img" aria-label="Arcada dental superior e inferior">
                  {/* Arco Guía Superior */}
                  <path d="M 60 100 Q 270 20 480 100" fill="none" stroke="var(--border-strong)" strokeWidth="2" strokeDasharray="4 4" />
                  {/* Arco Guía Inferior */}
                  <path d="M 60 120 Q 270 200 480 120" fill="none" stroke="var(--border-strong)" strokeWidth="2" strokeDasharray="4 4" />

                  {/* Dientes en curva superior */}
                  {[
                    { n: 18, x: 60, y: 100 }, { n: 17, x: 86, y: 80 }, { n: 16, x: 114, y: 64 }, { n: 15, x: 144, y: 52 },
                    { n: 14, x: 176, y: 44 }, { n: 13, x: 210, y: 38 }, { n: 12, x: 242, y: 35 }, { n: 11, x: 260, y: 35 },
                    { n: 21, x: 280, y: 35 }, { n: 22, x: 298, y: 35 }, { n: 23, x: 330, y: 38 }, { n: 24, x: 364, y: 44 },
                    { n: 25, x: 396, y: 52 }, { n: 26, x: 426, y: 64 }, { n: 27, x: 454, y: 80 }, { n: 28, x: 480, y: 100 }
                  ].map((t) => {
                    const d = odontoData[t.n];
                    let fill = 'var(--tooth)';
                    if (d?.whole === 'endo') fill = 'var(--purple-soft)';
                    else if (d?.whole === 'corona') fill = 'var(--warn-soft)';
                    else if (d?.whole === 'implante') fill = 'var(--info-soft)';
                    else if (d?.f && Object.values(d.f).includes('caries')) fill = 'var(--danger-soft)';
                    else if (d?.f && Object.values(d.f).includes('obtur')) fill = 'var(--info-soft)';
                    return (
                      <g key={t.n} onClick={() => setSelectedTooth(t.n)} style={{ cursor: 'pointer' }}>
                        <circle
                          cx={t.x}
                          cy={t.y}
                          r={selectedTooth === t.n ? 11 : 9}
                          fill={fill}
                          stroke={selectedTooth === t.n ? 'var(--primary-2)' : 'var(--tooth-stroke)'}
                          strokeWidth={selectedTooth === t.n ? 2.5 : 1.2}
                        />
                        <text x={t.x} y={t.y} className="m-num" fontSize="7.5">{t.n}</text>
                      </g>
                    );
                  })}

                  {/* Dientes en curva inferior */}
                  {[
                    { n: 48, x: 60, y: 120 }, { n: 47, x: 86, y: 140 }, { n: 46, x: 114, y: 156 }, { n: 45, x: 144, y: 168 },
                    { n: 44, x: 176, y: 176 }, { n: 43, x: 210, y: 182 }, { n: 42, x: 242, y: 185 }, { n: 41, x: 260, y: 185 },
                    { n: 31, x: 280, y: 185 }, { n: 32, x: 298, y: 185 }, { n: 33, x: 330, y: 182 }, { n: 34, x: 364, y: 176 },
                    { n: 35, x: 396, y: 168 }, { n: 36, x: 426, y: 156 }, { n: 37, x: 454, y: 140 }, { n: 38, x: 480, y: 120 }
                  ].map((t) => {
                    const d = odontoData[t.n];
                    let fill = 'var(--tooth)';
                    if (d?.whole === 'endo') fill = 'var(--purple-soft)';
                    else if (d?.whole === 'corona') fill = 'var(--warn-soft)';
                    else if (d?.whole === 'implante') fill = 'var(--info-soft)';
                    else if (d?.f && Object.values(d.f).includes('caries')) fill = 'var(--danger-soft)';
                    else if (d?.f && Object.values(d.f).includes('obtur')) fill = 'var(--info-soft)';
                    return (
                      <g key={t.n} onClick={() => setSelectedTooth(t.n)} style={{ cursor: 'pointer' }}>
                        <circle
                          cx={t.x}
                          cy={t.y}
                          r={selectedTooth === t.n ? 11 : 9}
                          fill={fill}
                          stroke={selectedTooth === t.n ? 'var(--primary-2)' : 'var(--tooth-stroke)'}
                          strokeWidth={selectedTooth === t.n ? 2.5 : 1.2}
                        />
                        <text x={t.x} y={t.y} className="m-num" fontSize="7.5">{t.n}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="legend">
                <span><i style={{ borderColor: 'var(--danger)', background: 'var(--danger-soft)' }} />Caries</span>
                <span><i style={{ borderColor: 'var(--info)', background: 'var(--info-soft)' }} />Obturación</span>
                <span><i style={{ borderColor: 'var(--ok)', background: 'var(--ok-soft)' }} />Sellante</span>
                <span><i style={{ borderColor: 'var(--warn)', background: 'var(--warn-soft)' }} />Fractura</span>
                <span><i style={{ borderColor: 'var(--purple)', background: 'var(--purple-soft)' }} />Endodoncia</span>
                <span><i style={{ borderColor: 'var(--gold)', background: 'var(--warn-soft)' }} />Corona</span>
                <span><i style={{ borderColor: 'var(--teal)', background: 'var(--info-soft)' }} />Implante</span>
                <span><i style={{ borderColor: 'var(--text-muted)', borderStyle: 'dashed' }} />Ausente</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Paleta de Herramientas y Detalle de Pieza */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Herramientas Odontológicas */}
          <div className="card">
            <div className="card-head">
              <h3>
                <Icon name="edit" />
                <span>Herramientas Clínicas</span>
              </h3>
            </div>
            <div className="card-body">
              <div className="tools">
                <div className="tool-group">Patología por caras</div>

                <button
                  className={`tool ${activeTool === 'caries' ? 'on' : ''}`}
                  onClick={() => setActiveTool('caries')}
                >
                  <span className="sw caries" />
                  <span>Caries Dental</span>
                </button>

                <button
                  className={`tool ${activeTool === 'obtur' ? 'on' : ''}`}
                  onClick={() => setActiveTool('obtur')}
                >
                  <span className="sw obtur" />
                  <span>Obturación</span>
                </button>

                <button
                  className={`tool ${activeTool === 'sellante' ? 'on' : ''}`}
                  onClick={() => setActiveTool('sellante')}
                >
                  <span className="sw sellante" />
                  <span>Sellante</span>
                </button>

                <button
                  className={`tool ${activeTool === 'fractura' ? 'on' : ''}`}
                  onClick={() => setActiveTool('fractura')}
                >
                  <span className="sw fractura" />
                  <span>Fractura</span>
                </button>

                <button
                  className={`tool ${activeTool === 'sano' ? 'on' : ''}`}
                  onClick={() => setActiveTool('sano')}
                >
                  <span className="sw sano" />
                  <span>Borrador / Sano</span>
                </button>

                <div className="tool-group">Pieza Completa</div>

                <button
                  className={`tool ${activeTool === 'endo' ? 'on' : ''}`}
                  onClick={() => setActiveTool('endo')}
                >
                  <span className="sw" style={{ background: 'var(--purple)' }} />
                  <span>Endodoncia</span>
                </button>

                <button
                  className={`tool ${activeTool === 'corona' ? 'on' : ''}`}
                  onClick={() => setActiveTool('corona')}
                >
                  <span className="sw" style={{ background: 'var(--gold)' }} />
                  <span>Corona Protésica</span>
                </button>

                <button
                  className={`tool ${activeTool === 'implante' ? 'on' : ''}`}
                  onClick={() => setActiveTool('implante')}
                >
                  <span className="sw" style={{ background: 'var(--teal)' }} />
                  <span>Implante Dental</span>
                </button>

                <button
                  className={`tool ${activeTool === 'ausente' ? 'on' : ''}`}
                  onClick={() => setActiveTool('ausente')}
                >
                  <span className="sw" style={{ background: 'var(--text-muted)' }} />
                  <span>Pieza Ausente</span>
                </button>
              </div>
            </div>
          </div>

          {/* Detalle de Pieza Seleccionada */}
          <div className="card">
            <div className="card-head">
              <h3>
                <Icon name="tooth" />
                <span>Pieza Seleccionada</span>
              </h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--primary-grad)',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '20px',
                    fontWeight: 800,
                  }}
                >
                  {selectedTooth}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>
                    {TOOTH_NAMES[selectedTooth] || `Pieza ${selectedTooth}`}
                  </div>
                  <div className="sub">
                    {selectedTooth >= 11 && selectedTooth <= 28 ? 'Arcada Superior' : 'Arcada Inferior'}
                  </div>
                </div>
              </div>

              {/* Estado cara por cara */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                {(['V', 'P', 'M', 'D', 'O'] as CaraDental[]).map((face) => {
                  const cond = odontoData[selectedTooth]?.f?.[face];
                  const faceLabel =
                    face === 'V'
                      ? 'Vestibular'
                      : face === 'P'
                      ? 'Palatina/Lingual'
                      : face === 'M'
                      ? 'Mesial'
                      : face === 'D'
                      ? 'Distal'
                      : 'Oclusal';
                  return (
                    <div
                      key={face}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        fontSize: '12px',
                      }}
                    >
                      <span className="sub" style={{ display: 'block', fontSize: '10.5px' }}>
                        {faceLabel}
                      </span>
                      <b style={{ textTransform: 'capitalize', color: cond ? 'var(--text)' : 'var(--text-muted)' }}>
                        {cond || 'Sano'}
                      </b>
                    </div>
                  );
                })}
              </div>

              {odontoData[selectedTooth]?.whole && (
                <div style={{ marginBottom: '14px' }}>
                  <span className="sub" style={{ display: 'block', fontSize: '11px', marginBottom: '4px' }}>
                    Condición de pieza completa:
                  </span>
                  <span className="badge purple" style={{ textTransform: 'uppercase', fontWeight: 700 }}>
                    {odontoData[selectedTooth]?.whole}
                  </span>
                </div>
              )}

              <button
                className="btn btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setOdontoData((prev) => {
                    const copy = { ...prev };
                    delete copy[selectedTooth];
                    return copy;
                  });
                }}
              >
                <Icon name="eraser" size="sm" />
                <span>Limpiar pieza {selectedTooth} (Marcar sana)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
