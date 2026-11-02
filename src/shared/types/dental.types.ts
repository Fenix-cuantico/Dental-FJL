export type TipoDocumento = 'DNI' | 'CEX' | 'PAS';
export type EstadoPaciente = 'Activo' | 'Inactivo' | 'Moroso';
export type Sexo = 'F' | 'M';

export interface Paciente {
  id: number;
  nom: string;
  tipo: TipoDocumento;
  doc: string;
  edad: number;
  sex: Sexo;
  tel: string;
  mail: string;
  dir: string;
  tags: string[];
  est: EstadoPaciente;
  fav: boolean;
}

export type EstadoCita = 'Programada' | 'Confirmada' | 'Atendida' | 'Cancelada';
export type MetodoPago = 'Efectivo' | 'Tarjeta' | 'Yape / Plin' | 'Transferencia';
export type EstadoPago = 'Pagado' | 'Pendiente' | 'Parcial';

export interface Cita {
  id: string;
  fecha: string;
  hora: string;
  doc: string; // ID del doctor
  tipo: string;
  motivo: string;
  costo: number;
  metodo: MetodoPago;
  pago: EstadoPago;
  est: EstadoCita;
  obs?: string;
}

export interface Doctor {
  id: string;
  nombre: string;
  esp: string;
  cop: string;
  pac: number;
  citas: number;
  años: number;
  av?: string;
  box?: string;
  turno?: string;
  rating?: number;
  reviews?: number;
  tel?: string;
  mail?: string;
  estado?: 'Disponible' | 'En Consulta' | 'En Cirugía' | 'En Pausa';
}

export interface TratamientoCatalogo {
  id: string;
  n: string;
  c: string; // Categoría
  d: number; // Duración min
  p: number; // Precio
}

export interface TratamientoRealizado {
  id: string;
  fecha: string;
  hora: string;
  n: number | null; // Pieza dental (ej. 26)
  faces: string[]; // Caras (V, P, L, M, D, O)
  tid: string; // ID del catálogo
  doc: string;
  est: 'Realizado' | 'En curso' | 'Pendiente';
  costo: number;
  desc: string;
  mat?: string;
  ind?: string;
}

export interface Pago {
  id: string;
  fecha: string;
  concepto: string;
  monto: number;
  metodo: MetodoPago;
  comp: 'Boleta' | 'Factura' | 'Recibo';
  nro?: string;
  ref?: string;
  est: EstadoPago;
  obs?: string;
}

export interface Insumo {
  id: string;
  nombre: string;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
  unidad: string;
  estado: 'Normal' | 'Bajo' | 'Crítico';
  porcentaje: number;
}

export interface EventoAuditoria {
  id: number;
  fecha: string;
  hora: string;
  usuario: string;
  rol: string;
  accion: 'Creó' | 'Modificó' | 'Anuló' | 'Acceso' | 'Cierre';
  modulo: string;
  paciente: string;
  detalle: string;
  ip: string;
  dispositivo: string;
}

export interface ReporteItem {
  f: string;
  h: string;
  comp: string;
  nro: string;
  pac: string;
  con: string;
  doc: string;
  met: MetodoPago;
  est: string;
  m: number;
}

export type CaraDental = 'V' | 'P' | 'L' | 'M' | 'D' | 'O';
export type CondicionCara = 'caries' | 'obtur' | 'sellante' | 'fractura';
export type CondicionPieza = 'endo' | 'corona' | 'implante' | 'ausente';

export interface PiezaEstado {
  f?: Partial<Record<CaraDental, CondicionCara>>;
  whole?: CondicionPieza;
}

export type OdontogramaData = Record<number, PiezaEstado>;

export const formatMoney = (val: number): string =>
  'S/ ' + Number(val).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
