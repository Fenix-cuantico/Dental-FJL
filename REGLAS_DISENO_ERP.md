# Manual de Estándares y Reglas de Diseño ERP Clínico
## Arquitectura de Información, Jerarquía Visual y Criterios Anti-Saturación
**Plataforma:** Dental FC / Sistema de Gestión Odontológica Especializada  
**Objetivo:** Garantizar una experiencia de usuario corporativa, limpia, predecible y de alto rendimiento clínico, eliminando la sobresaturación de información, distracciones visuales e incoherencias de interacción.

---

## 1. Principio Fundamental: Cero Emojis y Sobriedad Institucional
- **Prohibición Total de Emojis:** Queda terminantemente prohibido el uso de emojis en cualquier capa de la interfaz de usuario: títulos de vistas, botones, tarjetas KPI, chips de estado, alertas, toasts, modales o registros de tablas.
- **Micro-Iconografía SVG de Precisión:**
  - Toda referencia visual debe utilizar vectores SVG lineales normalizados con `strokeWidth="2"` o equivalente (ej. `shared/components/Icon.tsx`).
  - Los iconos tienen una función de anclaje visual y reconocimiento rápido; nunca deben utilizarse con fines puramente decorativos o redundantes.
  - El tamaño estándar de iconos es estricto: `sm` (16px) para botones y tablas, `md` (18px) para navegación secundaria, y `lg` (24px) exclusivamente para cabeceras y tarjetas principales.

---

## 2. Arquitectura de Navegación: Páginas Completas vs. Modales

### 2.1 Cuándo utilizar una Vista de Página Completa
Las vistas de página completa están reservadas para entidades de negocio complejas o flujos continuos de trabajo clínico:
- **Expediente / Perfil de Paciente:** No debe confinarse en ventanas emergentes tipo modal. El perfil contiene múltiples dimensiones (filiación, citas históricas, presupuestos, estados contables, odontograma oficial y repositorio de archivos). Requiere el 100% del viewport para evitar barras de desplazamiento anidadas y sensación de ahogo.
- **Historia Clínica y Odontograma Digital:** Espacio clínico interactivo de alta precisión odontológica.
- **Módulos de Auditoría y Facturación Masiva.**

**Estándar de Vistas de Detalle:**
1. Botón de retorno explícito en la esquina superior izquierda: `← Volver al Directorio de Pacientes`.
2. Miga de pan (*breadcrumb*) corporativa clara.
3. Barra de pestañas (*tabs*) visible y horizontalmente despejada.
4. Altura fluida con scroll nativo del contenedor principal, eliminando `overflow: hidden` innecesario.

### 2.2 Cuándo utilizar Modales (Diálogos Flotantes)
Los modales se restringen exclusivamente a **operaciones atómicas, puntuales e irreversibles o de captura rápida**:
- Diálogo de confirmación de archivado o eliminación.
- Formulario modal de creación rápida de cita (1-2 minutos de captura).
- Registro rápido de nuevo pago o cobro puntual.
- Ajuste rápido de stock en bodega.
- Lectura de Términos y Condiciones Legales.
*Regla de oro:* Si el modal requiere pestañas secundarias o más de 3 niveles de información anidada, debe convertirse de inmediato en una vista de página.

---

## 3. Disciplina en Indicadores Clave (KPIs) y Reglas Anti-Saturación

### 3.1 Separación Estricta de Dominios
- **Panel General / Dashboard Clínico:** Su objetivo primordial es el turno y la continuidad operativa del día.
  - **Métricas Permitidas:** Citas del día, estado de ocupación de consultorios/boxes, personal de turno activo, alertas de insumos críticos.
  - **Métricas Prohibidas:** No saturar con balances financieros mensuales (Recaudación acumulada, Cartera morosa) ni métricas estáticas de marketing (Pacientes históricos registrados). Esos indicadores pertenecen exclusivamente al módulo contable de Caja y Reportes.
- **Módulo de Personal / Equipo Médico:**
  - **Métricas Permitidas:** Personal activo en jornada, citas asignadas hoy por especialista, cobertura de consultorios.
  - **Métricas Prohibidas:** Promedios de años de experiencia o acumulados de pacientes en tratamiento que no aportan valor de decisión táctica y saturan la visual.

### 3.2 Reglas Ergonómicas de Columnas y Anti-Disparidad
- **Prohibición de Filas Disparejas (Cards Huérfanos):** Nunca usar una cuadrícula de 3 columnas para 4 tarjetas, lo cual genera una fila de 3 y una tarjeta solitaria en la segunda fila.
- **Correspondencia Estricta de Columnas:**
  - **2 Tarjetas:** 1 fila de 2 columnas (`repeat(2, 1fr)`). Ejemplos: *Tratamientos* y *Equipo Médico*.
  - **3 Tarjetas:** 1 fila de 3 columnas (`repeat(3, 1fr)`). Ejemplos: *Dashboard General* y *Pacientes y Clientes*.
  - **4 Tarjetas:** 1 fila continua de 4 columnas (`repeat(4, 1fr)`). Ejemplos: *Stock de Insumos*, *Caja y Pagos*, *Reportes* y *Auditoría*.
- **Comportamiento Responsivo:** Adaptación ergonómica fluida a 2 columnas en pantallas medianas (tablets / laptops pequeñas) y 1 columna en móviles.
- Cada tarjeta debe tener: Etiqueta descriptiva (11-12px, semibold), Cifra principal clara (20-24px, bold, números tabulares) y un único indicador contextual de tendencia o estado sin sobrecargar.

---

## 4. Dualidad de Vistas: Listados Tabulares y Tarjetas Visuales
Todo directorio de datos masivos (Pacientes, Personal Médico, Inventario, Procedimientos) debe ofrecer un selector de visualización persistente:

1. **Vista Listado (`Listado`):**
   - Es la vista predeterminada para operadores que requieren máxima densidad de información y rapidez de escaneo.
   - Cabeceras de tabla fijas, textos con contraste AAA y bordes sutiles (`1px solid var(--border)`).
   - Datos clave alineados lógicamente (texto a la izquierda, números y fechas a la derecha o centrados).
   - Columna de acciones compacta a la derecha con botones agrupados.
2. **Vista de Tarjetas (`Tarjetas`):**
   - Orientada a supervisión ejecutiva y visualización rápida.
   - Máximo de 3 a 4 columnas responsivas.
   - Información esencial sin desbordes de texto (`text-overflow: ellipsis`).

---

## 5. Espaciado, Aire Negativo y Ritmo Visual
- **Márgenes de Respiración:** Ningún componente interactivo debe colocarse a menos de 16px de otro contenedor principal.
- **Espaciado Interno (*Padding*):**
  - Tarjetas de información: 18px a 24px de acolchado interno.
  - Tablas: celdas con `padding: 12px 16px` para permitir lectura descansada.
  - Pestañas (*tabs*): altura mínima de 40px con `gap: 8px` entre items.
- **Eliminación de Micro-Widgets Huérfanos:**
  - Se eliminan vistas en miniatura decorativas (ej. miniaturas no funcionales de odontogramas en el pie del dashboard). Los diagramas anatómicos requieren escala y contexto clínico propio.

---

## 6. Sistema Tipográfico y Semántica de Colores

### 6.1 Jerarquía de Textos
| Nivel | Tamaño | Peso | Uso Específico |
| :--- | :--- | :--- | :--- |
| **H1 - Título de Vista** | 22px - 24px | 800 (Bold) | Nombre del módulo o cabecera del paciente |
| **H2 - Subtítulo de Sección** | 16px - 18px | 700 (Bold) | Agrupaciones temáticas dentro de la página |
| **H3 - Título de Tarjeta** | 14px - 15px | 700 (Bold) | Cabeceras de widgets y tablas |
| **Body / Texto Regular** | 13px - 13.5px | 400 - 500 | Datos de contacto, descripciones y filas |
| **Metadatos y Badges** | 11px - 12px | 600 - 700 | Estados, chips, códigos HC y horas |

### 6.2 Tokens de Color Semántico
- **Azul Primario (`--primary`, `#2563eb` / `#3b82f6`):** Identidad clínica, botones de acción primaria, enlaces institucionales.
- **Esmeralda (`--ok`, `#10b981` / `#059669`):** Citas confirmadas, profesionales disponibles, cuentas al día, tratamientos completados.
- **Ámbar (`--warn`, `#f59e0b` / `#d97706`):** Citas por confirmar, expedientes en pausa, saldos pendientes de regularización.
- **Rojo Carmesí (`--danger`, `#ef4444` / `#dc2626`):** Moras críticas, cancelaciones, stock nulo, alertas de riesgo médico.
- **Índigo / Púrpura (`--purple`, `#8b5cf6`):** Especialidades clínicas avanzadas (Ortodoncia, Cirugía) y procedimientos en curso.

---

## 7. Módulo de Archivos y Documentación Clínica
En el expediente de paciente, la pestaña **Archivos** debe regirse por los siguientes estándares:
1. **Área de Carga Drag & Drop:** Clara y sobria, con soporte para formatos diagnósticos (`.jpg`, `.png`, `.pdf`, `.dcm`, `.docx`).
2. **Filtro por Categorías:**
   - Todos los Archivos
   - Radiografías (Panorámicas, Periapicales, Cefalométricas)
   - Fotografías Clínicas (Intraorales y Extraorales)
   - Consentimientos y Documentos Legales
   - Informes de Laboratorio Dental
3. **Ficha de Archivo:** Cada documento debe exhibir peso, fecha de subida, profesional responsable, extensión y acciones inmediatas de visualización o descarga segura.

---

## 8. Verificación y Cumplimiento
Cualquier nueva pantalla o reestructuración de código en el sistema Dental FC debe contrastarse contra este documento antes de ser fusionada en producción, garantizando que el software conserve su carácter de suite médica de clase mundial sin recargos cosméticos superfluos.
