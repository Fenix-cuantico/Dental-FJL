# Dental FJL — Frontend SPA (Maqueta Interactiva)

Interfaz de usuario y maqueta funcional interactiva de alta fidelidad para el sistema **Dental FJL / Nexora Clinical ERP**. Desarrollada como una Single Page Application (SPA) modular, rápida y desacoplada, orientada a la gestión clínica, administrativa y financiera de consultorios y redes odontológicas.

---

## Stack Tecnológico

| Herramienta / Librería | Versión | Rol en la Aplicación |
| :--- | :--- | :--- |
| **React** | 19.x | Biblioteca de renderizado y componentes reactivos |
| **TypeScript** | 5.8+ | Tipado estricto de extremo a extremo sin tipos `any` implícitos |
| **Vite** | 8.x | Herramienta de compilación, empaquetado y HMR ultra veloz |
| **Oxlint** | 1.88+ | Linter de alto rendimiento para validación estática de código |
| **Tokens CSS Nativos** | CSS3 / HSL | Sistema de diseño corporativo sin dependencias pesadas de UI |
| **SVG Interactivo** | Estándar W3C | Renderizado vectorial para el odontograma anatómico FDI |

---

## Características de la Maqueta

* **Estado Completo en Cliente:** Todos los módulos operan de forma interactiva con datos iniciales realistas (médicos colegiados, pacientes, catálogo de aranceles, inventario de insumos y reportes de caja).
* **Odontograma SVG de Alta Precisión:** Representación anatómica en norma FDI (32 dientes permanentes y 20 piezas temporales / pediátricas). Soporta selección por caras (Vestibular, Lingual, Palatina, Mesial, Distal, Oclusal) y afectaciones de pieza completa (coronas, endodoncias, extracciones, implantes).
* **Navegación Dual:** Vistas de directorio con alternancia entre modo listado tabular (alta densidad) y modo tarjetas ejecutivas.
* **Sistema de Temas Dinámico:** Conmutación instantánea entre modo Claro y Oscuro mediante variables CSS nativas sin recargar la página.
* **Diálogos Modales y Páginas de Ficha Completa:** Respeto estricto a las normas de experiencia clínica; operaciones atómicas en modales y flujos profundos en vistas dedicadas (expediente de paciente, historia clínica).

---

## Estructura del Código Fuente

El proyecto sigue una arquitectura **Feature-Based (Modular)**:

```
frontend/
├── public/                 # Favicon y assets estáticos públicos
├── src/
│   ├── assets/             # Gráficos e ilustraciones
│   ├── modules/            # Módulos de negocio independientes
│   │   ├── agenda/         # Calendario de citas por box/sillón
│   │   ├── auditoria/      # Trazabilidad y bitácora de eventos del sistema
│   │   ├── caja/           # Cuenta corriente, cobros y arqueo diario
│   │   ├── configuracion/  # Parámetros clínicos, facturación y horarios
│   │   ├── dashboard/      # Panel general de control y KPIs operativos
│   │   ├── equipo/         # Profesionales de la salud, turnos y colegiaturas
│   │   ├── excel/          # Porteo y mapeo de datos desde archivos Excel/CSV
│   │   ├── historia/       # Ficha médica, anamnesis y evoluciones
│   │   ├── inventario/     # Kardex de insumos y alertas de stock mínimo
│   │   ├── odontograma/    # Odontograma anatómico interactivo en SVG
│   │   ├── pacientes/      # Directorio, filtros y ficha integral de paciente
│   │   ├── planes/         # Planes de suscripción SaaS y licencias
│   │   ├── reportes/       # Informes consolidados y exportaciones
│   │   ├── roles/          # Matriz de permisos y control de acceso (RBAC)
│   │   ├── soporte/        # Centro de ayuda y tickets de asistencia
│   │   ├── tenants/        # Gestión multi-sede y clínicas activas
│   │   ├── terminos/       # Términos y condiciones del servicio
│   │   └── tratamientos/   # Catálogo de aranceles y procedimientos clínicos
│   ├── shared/
│   │   ├── api/            # Cliente HTTP nativo (apiClient.ts con fetch() tipado)
│   │   ├── components/     # Componentes transversales (Sidebar, Topbar, Modal, Icon, Toast)
│   │   ├── data/           # Datos semilla e inicializadores de la maqueta
│   │   └── types/          # Interfaces TypeScript compartidas (dental.types.ts)
│   └── styles/             # Tokens CSS (colores, espaciado, botones, tablas, tarjetas)
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Cliente HTTP y Conexión Backend

La comunicación con el backend (previsto en Java 21 / Spring Boot 3) está centralizada en `src/shared/api/apiClient.ts`:

* Implementación con `fetch()` nativo tipado con genéricos `<T>`.
* Cero librerías externas de red para maximizar la seguridad y reducir el tamaño del bundle.
* Inyección automática del token JWT (`Authorization: Bearer <token>`) desde el almacenamiento local.
* Manejo estandarizado de respuestas 204 No Content y redirección automática ante expiración de sesión (401).

---

## Guía de Comandos

En la raíz de la carpeta `frontend/`:

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar entorno de desarrollo
```bash
npm run dev
```
La aplicación iniciará por defecto en `http://localhost:5173`.

### 3. Compilar para producción
```bash
npm run build
```
Ejecuta la validación de tipos con `tsc -b` y genera el paquete optimizado en la carpeta `dist/`.

### 4. Validar código con el linter
```bash
npm run lint
```
Ejecuta Oxlint sobre todos los archivos del proyecto.
