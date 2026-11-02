import React, { useState } from 'react';
import { Icon } from '../../shared/components/Icon';
import './TerminosModule.css';

interface TerminosModuleProps {
  onShowToast?: (msg: string) => void;
}

interface TerminoSeccion {
  id: number;
  titulo: string;
  resumen: string;
  contenido: {
    parrafos: string[];
    puntosClave?: string[];
    normativa?: string;
  };
}

const SECCIONES_LEGALES: TerminoSeccion[] = [
  {
    id: 1,
    titulo: '1. Introducción y Aceptación',
    resumen: 'Marco normativo del software odontológico SaaS y aceptación vinculante de términos.',
    contenido: {
      parrafos: [
        'El presente documento establece los términos, condiciones y políticas de uso legal del software clínico como servicio (SaaS) Dental FC, desarrollado para la administración estomatológica, gestión de expedientes clínicos electrónicos, facturación electrónica y odontograma digital.',
        'Al acceder, registrar credenciales o interactuar con cualquier módulo de la plataforma, el usuario (personal médico, cirujanos dentistas, asistentes dentales o personal administrativo) declara haber leído, comprendido y aceptado plenamente todas las disposiciones aquí contenidas sin reserva alguna.',
      ],
      puntosClave: [
        'Licencia institucional no transferible otorgada exclusivamente a la sede clínica.',
        'Uso estrictamente confidencial de credenciales personales de acceso médico.',
        'Aceptación incondicional de los protocolos de seguridad y auditoría en tiempo real.',
      ],
      normativa: 'Conforme a la Ley General de Salud N° 26842 y normativa sectorial del MINSA.',
    },
  },
  {
    id: 2,
    titulo: '2. Privacidad y Datos Sensibles',
    resumen: 'Tratamiento de historias clínicas, datos biomédicos y confidencialidad médica.',
    contenido: {
      parrafos: [
        'De acuerdo con la Ley de Protección de Datos Personales (Ley N° 29733), toda la información clínica odontológica, antecedentes patológicos, odontogramas, radiografías y prescripciones son calificados formalmente como Datos Sensibles de Salud.',
        'La clínica y sus profesionales asumen el deber inquebrantable de secreto profesional y confidencialidad. Ningún miembro del equipo podrá extraer, compartir, fotografiar o divulgar registros médicos fuera del estricto marco de la atención asistencial del paciente.',
      ],
      puntosClave: [
        'Aislamiento de bases de datos por sede clínica (arquitectura multi-tenant criptográfica).',
        'Cifrado de extremo a extremo en tránsito (TLS 1.3) y en reposo (AES-256).',
        'Derecho exclusivo de acceso, rectificación y cancelación por parte del paciente titular.',
      ],
      normativa: 'Ley N° 29733 de Protección de Datos Personales y secreto médico deontológico COP.',
    },
  },
  {
    id: 3,
    titulo: '3. Responsabilidad de Cuentas y Accesos',
    resumen: 'Custodia de contraseñas, roles de usuario y responsabilidad médica individual.',
    contenido: {
      parrafos: [
        'Cada usuario habilitado es responsable único de la confidencialidad de su usuario y contraseña institucional. Queda expresamente prohibido el uso compartido de cuentas entre especialistas o personal de apoyo.',
        'El sistema mantiene un registro forense inmutable de auditoría donde cada inicio de sesión, modificación de odontograma o emisión de comprobante queda asociado a la identidad del profesional, dirección IP y marca de tiempo.',
      ],
      puntosClave: [
        'Cierre automático de sesión tras inactividad prolongada en consultorio.',
        'Obligación de reporte inmediato ante cualquier sospecha de vulneración de credenciales.',
        'Los diagnósticos y recetas emitidos son de responsabilidad exclusiva del dentista colegiado (COP).',
      ],
      normativa: 'Código de Ética y Deontología del Colegio Odontológico del Perú (COP).',
    },
  },
  {
    id: 4,
    titulo: '4. Transacciones, Caja y Recibos',
    resumen: 'Registro contable fidedigno, arqueo de caja y emisión de comprobantes fiscales.',
    contenido: {
      parrafos: [
        'Todo ingreso, abono, anticipo o cobro registrado en el módulo de Caja Diaria debe corresponder fidedignamente a prestaciones odontológicas o aranceles efectivamente cotizados en el catálogo de tratamientos.',
        'La emisión de boletas y facturas electrónicas se rige por las directrices de la Superintendencia Nacional de Aduanas y de Administración Tributaria (SUNAT), garantizando correlatividad y validez contable.',
      ],
      puntosClave: [
        'Prohibición de alterar o duplicar números de comprobante de pago.',
        'Registro obligatorio del método de pago (Efectivo, Tarjeta POS, Yape, Plin o Transferencia).',
        'Cuadre de caja diario y conciliación obligatoria al cierre de cada jornada médica.',
      ],
      normativa: 'Reglamento de Comprobantes de Pago de la SUNAT.',
    },
  },
  {
    id: 5,
    titulo: '5. Terminación e Incumplimiento',
    resumen: 'Sanciones, revocación de accesos por mala praxis o vulneración de datos.',
    contenido: {
      parrafos: [
        'La clínica Dental FC se reserva el derecho de suspender o revocar el acceso de forma inmediata a cualquier usuario del sistema que incumpla las políticas de confidencialidad de datos de pacientes, abuse del uso de la red o manipule de forma maliciosa las bases de datos de cobros y facturación.',
        'El cese laboral o profesional de un especialista conlleva la inhabilitación automática e irrevocable de su perfil en la plataforma, preservándose la integridad histórica de sus actos médicos conforme a ley.',
      ],
      puntosClave: [
        'Inhabilitación inmediata ante filtración intencional de fichas o radiografías.',
        'Retención de auditoría forense por un periodo mínimo de 20 años según normativa de salud.',
        'Responsabilidad civil y penal derivada del mal uso de historias clínicas electrónicas.',
      ],
      normativa: 'Norma Técnica de Salud para la Gestión de Historias Clínicas (NTS N° 139-MINSA).',
    },
  },
];

export const TerminosModule: React.FC<TerminosModuleProps> = ({ onShowToast }) => {
  const [seccionActiva, setSeccionActiva] = useState<number>(5);
  const [terminosAceptados, setTerminosAceptados] = useState<boolean>(true);

  const seccion = SECCIONES_LEGALES.find((s) => s.id === seccionActiva) || SECCIONES_LEGALES[0];

  const handleDescargarPDF = () => {
    onShowToast?.('Generando documento oficial de Términos y Condiciones en PDF...');
    window.print();
  };

  const handleToggleAceptacion = () => {
    const nuevoEstado = !terminosAceptados;
    setTerminosAceptados(nuevoEstado);
    if (nuevoEstado) {
      onShowToast?.('Términos de servicio de la clínica aceptados correctamente');
    } else {
      onShowToast?.('Términos en estado pendiente de conformidad');
    }
  };

  return (
    <section className="terminos-module">
      {/* 1. Cabecera Corporativa */}
      <div className="corp-hero">
        <div className="corp-hero-main">
          <div className="corp-hero-tag">
            <span className="dot-ok" />
            <span>Marco Regulatorio & Seguridad Jurídica Sanitaria</span>
          </div>
          <h1 className="corp-hero-title">
            Términos y Condiciones — <span>Dental FC</span>
          </h1>
          <p className="corp-hero-desc">
            Políticas de uso de software, privacidad de datos de pacientes y secretismo profesional homologadas ante la Ley N° 29733 y normativa MINSA.
          </p>
          <div className="corp-hero-chips">
            <div className="corp-chip chip-green">
              <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
              <span>Versión Legal 2.4 Homologada</span>
            </div>
            <div className="corp-chip chip-blue">
              <Icon name="shield" size="sm" style={{ color: 'var(--primary)' }} />
              <span>Vigente y Vinculante 2026</span>
            </div>
            <div className="corp-chip chip-purple">
              <Icon name="file" size="sm" />
              <span>Ley N° 29733 & NTS N° 139-MINSA</span>
            </div>
          </div>
        </div>

        <div className="corp-hero-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDescargarPDF}
            title="Descargar documento legal en PDF o imprimir"
          >
            <Icon name="download" size="sm" />
            <span>Descargar en PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Cuerpo en Dos Columnas (Estructura de la Maqueta) */}
      <div className="terminos-layout-grid">
        {/* Columna Izquierda: Información de Versión e Índice de Secciones */}
        <div className="terminos-sidebar-col">
          {/* Card Información de Versión */}
          <div className="card terminos-info-card">
            <div className="terminos-card-label">INFORMACIÓN DE VERSIÓN</div>
            <div className="terminos-version-val">Versión Legal: 2.4</div>
            <div className="terminos-version-sub">Actualizado: 18 de Julio 2026</div>
            <div className="terminos-version-badge-wrap">
              <span className="badge ok">Estado: Vigente y Vinculante</span>
            </div>
          </div>

          {/* Índice de Secciones Interactivo */}
          <div className="terminos-index-wrap">
            <div className="terminos-card-label" style={{ padding: '0 4px 6px 4px' }}>
              ÍNDICE DE SECCIONES
            </div>
            <div className="terminos-index-list">
              {SECCIONES_LEGALES.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  className={`terminos-nav-btn ${seccionActiva === sec.id ? 'active' : ''}`}
                  onClick={() => setSeccionActiva(sec.id)}
                >
                  <span className="terminos-nav-title">{sec.titulo}</span>
                  <Icon name="chevron-r" size="sm" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Contenido Detallado de la Sección */}
        <div className="terminos-content-col">
          <div className="card terminos-content-card">
            <div className="terminos-content-header">
              <div className="corp-hero-tag" style={{ marginBottom: '6px' }}>
                <Icon name="shield" size="sm" />
                <span>Cláusula Oficial · Dental FC Suite</span>
              </div>
              <h2 className="terminos-section-h2">{seccion.titulo}</h2>
              <p className="terminos-section-sub">{seccion.resumen}</p>
            </div>

            <div className="terminos-divider" />

            <div className="terminos-content-body">
              {seccion.contenido.parrafos.map((p, idx) => (
                <p key={idx} className="terminos-p">
                  {p}
                </p>
              ))}

              {seccion.contenido.puntosClave && (
                <div className="terminos-keypoints-box">
                  <div className="terminos-keypoints-title">
                    <Icon name="check" size="sm" style={{ color: 'var(--ok)' }} />
                    <span>Puntos Clave y Obligaciones del Personal:</span>
                  </div>
                  <ul className="terminos-keypoints-list">
                    {seccion.contenido.puntosClave.map((pt, pIdx) => (
                      <li key={pIdx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {seccion.contenido.normativa && (
                <div className="terminos-normativa-pill">
                  <Icon name="shield" size="sm" style={{ color: 'var(--primary)' }} />
                  <span><b>Marco Normativo Aplicable:</b> {seccion.contenido.normativa}</span>
                </div>
              )}
            </div>
          </div>

          {/* Barra Inferior: Switch de Aceptación y Botón de Descarga */}
          <div className="terminos-bottom-bar card">
            <label className="terminos-toggle-label" onClick={handleToggleAceptacion}>
              <div className={`terminos-switch ${terminosAceptados ? 'checked' : ''}`}>
                <div className="terminos-switch-thumb" />
              </div>
              <span className="terminos-toggle-text">
                Acepto los términos de servicio de la clínica
              </span>
            </label>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleDescargarPDF}
              title="Descargar copia certificada en PDF"
            >
              <Icon name="download" size="sm" />
              <span>Descargar en PDF</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
