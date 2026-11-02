import { Doctor, Paciente, TratamientoCatalogo, ReporteItem, Insumo, EventoAuditoria, OdontogramaData } from '../types/dental.types';

export const INITIAL_DOCS: Doctor[] = [
  { id: 'D1', nombre: 'Dr. Diego Mendoza', esp: 'Rehabilitación Oral', cop: 'COP 24510', pac: 214, citas: 6, años: 12, av: 'grad-blue', box: 'Box 01 (Principal)', turno: '08:00 - 14:00', rating: 4.9, reviews: 124, tel: '987 234 567', mail: 'diego.mendoza@dentalfc.pe', estado: 'Disponible' },
  { id: 'D2', nombre: 'Dra. Camila Torres', esp: 'Odontología General', cop: 'COP 31877', pac: 342, citas: 8, años: 8, av: 'grad-teal', box: 'Box 02', turno: '09:00 - 16:00', rating: 4.8, reviews: 98, tel: '981 345 678', mail: 'camila.torres@dentalfc.pe', estado: 'En Consulta' },
  { id: 'D3', nombre: 'Dr. Andrés Salazar', esp: 'Endodoncia', cop: 'COP 28104', pac: 167, citas: 5, años: 10, av: 'grad-indigo', box: 'Box 03', turno: '14:00 - 20:00', rating: 5.0, reviews: 76, tel: '982 456 789', mail: 'andres.salazar@dentalfc.pe', estado: 'Disponible' },
  { id: 'D4', nombre: 'Dra. Valeria Ríos', esp: 'Ortodoncia', cop: 'COP 33620', pac: 198, citas: 7, años: 7, av: 'grad-purple', box: 'Box 04 (Ortodoncia)', turno: '08:30 - 15:30', rating: 4.9, reviews: 142, tel: '983 567 890', mail: 'valeria.rios@dentalfc.pe', estado: 'En Consulta' },
  { id: 'D5', nombre: 'Dr. Mateo Paredes', esp: 'Implantología', cop: 'COP 22941', pac: 121, citas: 3, años: 15, av: 'grad-amber', box: 'Box Quirúrgico 1', turno: '08:00 - 13:00', rating: 5.0, reviews: 110, tel: '984 678 901', mail: 'mateo.paredes@dentalfc.pe', estado: 'En Cirugía' },
  { id: 'D6', nombre: 'Dra. Lucía Quiroz', esp: 'Odontopediatría', cop: 'COP 35012', pac: 256, citas: 9, años: 6, av: 'grad-rose', box: 'Box Pediátrico', turno: '10:00 - 18:00', rating: 4.9, reviews: 88, tel: '985 789 012', mail: 'lucia.quiroz@dentalfc.pe', estado: 'Disponible' },
  { id: 'D7', nombre: 'Dr. Sebastián Cano', esp: 'Cirugía Maxilofacial', cop: 'COP 20388', pac: 88, citas: 2, años: 18, av: 'grad-cyan', box: 'Box Quirúrgico 2', turno: '14:00 - 19:00', rating: 5.0, reviews: 65, tel: '986 890 123', mail: 'sebastian.cano@dentalfc.pe', estado: 'En Pausa' },
  { id: 'D8', nombre: 'Dra. Renata Vidal', esp: 'Periodoncia', cop: 'COP 30275', pac: 143, citas: 4, años: 9, av: 'grad-emerald', box: 'Box 02', turno: '15:00 - 20:00', rating: 4.8, reviews: 71, tel: '987 901 234', mail: 'renata.vidal@dentalfc.pe', estado: 'Disponible' }
];

export const INITIAL_PACIENTES: Paciente[] = [
  { id: 1, nom: 'Ana María Quispe Rojas', tipo: 'DNI', doc: '72345678', edad: 34, sex: 'F', tel: '987 654 321', mail: 'ana.quispe@gmail.com', dir: 'Av. Larco 456, Apt. 201, Miraflores', tags: ['VIP', 'Ortodoncia'], est: 'Activo', fav: true },
  { id: 2, nom: 'Rosa Huamán Díaz', tipo: 'DNI', doc: '71234567', edad: 40, sex: 'F', tel: '912 345 678', mail: 'rosa.huaman@hotmail.com', dir: 'Calle Los Jazmines 789, San Isidro', tags: ['Sensibilidad'], est: 'Activo', fav: false },
  { id: 3, nom: 'Carlos Ruiz Huamán', tipo: 'CEX', doc: '00456789', edad: 56, sex: 'M', tel: '945 678 123', mail: 'carlos.ruiz.h@gmail.com', dir: 'Av. Arequipa 3210, Dpto. 402, San Isidro', tags: ['Implante'], est: 'Moroso', fav: false },
  { id: 4, nom: 'Juan Pérez López', tipo: 'DNI', doc: '73567890', edad: 34, sex: 'M', tel: '956 789 012', mail: 'juan.perez@dentalfc.com', dir: 'Jr. Puno 543, Magdalena del Mar', tags: ['VIP', 'Periodoncia'], est: 'Activo', fav: true },
  { id: 5, nom: 'Lucía Fernández Ramos', tipo: 'PAS', doc: 'AA890123', edad: 27, sex: 'F', tel: '967 890 123', mail: 'lucia.f.ramos@outlook.com', dir: 'Calle Tacna 120, Barranco', tags: ['Control'], est: 'Inactivo', fav: false },
  { id: 6, nom: 'Pedro Sánchez Flores', tipo: 'DNI', doc: '75789012', edad: 47, sex: 'M', tel: '978 901 234', mail: 'pedro.sanchez@yahoo.com', dir: 'Av. Javier Prado Este 4500, Surco', tags: ['Implante'], est: 'Moroso', fav: false }
];

export const INITIAL_TRATAMIENTOS: TratamientoCatalogo[] = [
  { id: 'T-001', n: 'Consulta y diagnóstico', c: 'Preventiva', d: 30, p: 60 },
  { id: 'T-002', n: 'Profilaxis y destartraje', c: 'Preventiva', d: 45, p: 120 },
  { id: 'T-003', n: 'Aplicación de flúor', c: 'Preventiva', d: 20, p: 70 },
  { id: 'T-004', n: 'Sellante de fosas y fisuras', c: 'Preventiva', d: 25, p: 80 },
  { id: 'T-005', n: 'Obturación con resina simple', c: 'Restauradora', d: 40, p: 150 },
  { id: 'T-006', n: 'Obturación con resina compuesta', c: 'Restauradora', d: 60, p: 220 },
  { id: 'T-007', n: 'Reconstrucción con poste de fibra', c: 'Restauradora', d: 60, p: 260 },
  { id: 'T-008', n: 'Endodoncia unirradicular', c: 'Endodoncia', d: 60, p: 380 },
  { id: 'T-009', n: 'Endodoncia multirradicular', c: 'Endodoncia', d: 90, p: 620 },
  { id: 'T-010', n: 'Retratamiento endodóntico', c: 'Endodoncia', d: 90, p: 750 },
  { id: 'T-011', n: 'Raspado y alisado radicular', c: 'Periodoncia', d: 60, p: 300 },
  { id: 'T-012', n: 'Cirugía periodontal', c: 'Periodoncia', d: 90, p: 900 },
  { id: 'T-013', n: 'Exodoncia simple', c: 'Cirugía', d: 30, p: 130 },
  { id: 'T-014', n: 'Exodoncia de tercer molar', c: 'Cirugía', d: 60, p: 480 },
  { id: 'T-016', n: 'Brackets metálicos (instalación)', c: 'Ortodoncia', d: 90, p: 1800 },
  { id: 'T-017', n: 'Control mensual de ortodoncia', c: 'Ortodoncia', d: 30, p: 120 },
  { id: 'T-019', n: 'Implante dental unitario', c: 'Implantología', d: 90, p: 2600 },
  { id: 'T-021', n: 'Corona de porcelana sobre metal', c: 'Rehabilitación', d: 60, p: 750 },
  { id: 'T-022', n: 'Corona de zirconio', c: 'Rehabilitación', d: 60, p: 1100 },
  { id: 'T-024', n: 'Blanqueamiento dental en consultorio', c: 'Estética', d: 75, p: 450 }
];

export const INITIAL_INSUMOS: Insumo[] = [
  { id: 'INS-01', nombre: 'Anestesia Lidocaína 2% c/ Epinefrina', categoria: 'Anestésicos', stockActual: 6, stockMinimo: 30, unidad: 'tubos', estado: 'Crítico', porcentaje: 20 },
  { id: 'INS-02', nombre: 'Resina Compuesta Filtek Z250 (A2)', categoria: 'Restauración', stockActual: 1, stockMinimo: 5, unidad: 'jeringa', estado: 'Crítico', porcentaje: 20 },
  { id: 'INS-03', nombre: 'Guantes de Nitrilo Quirúrgico (M)', categoria: 'Bioseguridad', stockActual: 2, stockMinimo: 8, unidad: 'cajas', estado: 'Bajo', porcentaje: 25 },
  { id: 'INS-04', nombre: 'Agujas Desechables 30G Cortas', categoria: 'Inyectables', stockActual: 1, stockMinimo: 4, unidad: 'cajas', estado: 'Bajo', porcentaje: 25 },
  { id: 'INS-05', nombre: 'Ácido Grabador Ortofosfórico 37%', categoria: 'Restauración', stockActual: 4, stockMinimo: 6, unidad: 'jeringas', estado: 'Normal', porcentaje: 66 },
  { id: 'INS-06', nombre: 'Baberos Desechables Impermeables', categoria: 'Bioseguridad', stockActual: 350, stockMinimo: 500, unidad: 'unidades', estado: 'Normal', porcentaje: 70 }
];

export const INITIAL_REPORTES: ReporteItem[] = [
  { f: '2026-10-24', h: '09:12', comp: 'Boleta', nro: 'B001-000425', pac: 'Ana María Quispe Rojas', con: 'Control mensual de ortodoncia', doc: 'D4', met: 'Efectivo', est: 'Pagado', m: 120 },
  { f: '2026-10-24', h: '10:05', comp: 'Boleta', nro: 'B001-000426', pac: 'Juan Pérez López', con: 'Raspado y alisado radicular', doc: 'D8', met: 'Tarjeta', est: 'Pagado', m: 300 },
  { f: '2026-10-24', h: '11:40', comp: 'Boleta', nro: 'B001-000427', pac: 'Rosa Huamán Díaz', con: 'Obturación con resina compuesta', doc: 'D2', met: 'Yape / Plin', est: 'Pagado', m: 220 },
  { f: '2026-10-24', h: '12:25', comp: 'Recibo', nro: 'R-000078', pac: 'Carlos Ruiz Huamán', con: 'Implante dental (cuota 3 de 6)', doc: 'D5', met: 'Transferencia', est: 'Pagado', m: 433.33 },
  { f: '2026-10-24', h: '14:10', comp: 'Boleta', nro: 'B001-000428', pac: 'Pedro Sánchez Flores', con: 'Evaluación de implante', doc: 'D5', met: 'Tarjeta', est: 'Pagado', m: 60 },
  { f: '2026-10-23', h: '17:20', comp: 'Boleta', nro: 'B001-000420', pac: 'Ana María Quispe Rojas', con: 'Obturación en pieza 26 con resina A2', doc: 'D1', met: 'Tarjeta', est: 'Pagado', m: 280 },
  { f: '2026-10-23', h: '16:15', comp: 'Factura', nro: 'F001-000045', pac: 'Marco Díaz Vargas', con: 'Instalación de brackets metálicos', doc: 'D4', met: 'Transferencia', est: 'Pagado', m: 1800 },
  { f: '2026-10-23', h: '14:30', comp: 'Boleta', nro: 'B001-000421', pac: 'Lucía Fernández Ramos', con: 'Profilaxis y destartraje', doc: 'D2', met: 'Efectivo', est: 'Pagado', m: 120 },
  { f: '2026-10-22', h: '18:00', comp: 'Boleta', nro: 'B001-000415', pac: 'Mateo Quispe Vera', con: 'Pulpotomía pediátrica', doc: 'D6', met: 'Yape / Plin', est: 'Pagado', m: 180 },
  { f: '2026-10-22', h: '15:10', comp: 'Boleta', nro: 'B001-000416', pac: 'Rosa Huamán Díaz', con: 'Endodoncia multirradicular pieza 46', doc: 'D3', met: 'Tarjeta', est: 'Pagado', m: 620 },
  { f: '2026-10-21', h: '16:40', comp: 'Boleta', nro: 'B001-000410', pac: 'Carlos Ruiz Huamán', con: 'Exodoncia de tercer molar', doc: 'D7', met: 'Efectivo', est: 'Pagado', m: 480 },
  { f: '2026-10-21', h: '11:20', comp: 'Boleta', nro: 'B001-000411', pac: 'Camila Soto Ibáñez', con: 'Blanqueamiento dental en consultorio', doc: 'D1', met: 'Tarjeta', est: 'Pagado', m: 450 },
  { f: '2026-10-20', h: '17:00', comp: 'Factura', nro: 'F001-000042', pac: 'Juan Pérez López', con: 'Corona de porcelana sobre metal', doc: 'D1', met: 'Tarjeta', est: 'Pagado', m: 750 },
  { f: '2026-10-20', h: '10:30', comp: 'Boleta', nro: 'B001-000405', pac: 'Pedro Sánchez Flores', con: 'Consulta y diagnóstico general', doc: 'D2', met: 'Efectivo', est: 'Pagado', m: 60 },
  { f: '2026-10-19', h: '16:00', comp: 'Boleta', nro: 'B001-000400', pac: 'Ana María Quispe Rojas', con: 'Sellantes en piezas 36 y 46', doc: 'D2', met: 'Yape / Plin', est: 'Pagado', m: 160 },
  { f: '2026-10-19', h: '11:15', comp: 'Boleta', nro: 'B001-000401', pac: 'Marco Díaz Vargas', con: 'Consulta general y radiografía', doc: 'D4', met: 'Efectivo', est: 'Pagado', m: 80 }
];

export const INITIAL_ODONTOGRAMA: OdontogramaData = {
  16: { f: { O: 'caries', D: 'caries' } },
  26: { f: { O: 'obtur', M: 'obtur' } },
  36: { whole: 'endo', f: {} },
  46: { whole: 'corona', f: {} },
  18: { whole: 'ausente', f: {} },
  11: { f: { M: 'fractura' } },
  24: { f: { O: 'sellante' } },
  37: { whole: 'implante', f: {} },
  21: { f: { V: 'obtur' } },
  47: { f: { O: 'caries' } }
};

export const INITIAL_AUDITORIA: EventoAuditoria[] = [
  { id: 1, fecha: '2026-10-24', hora: '10:12', usuario: 'Dr. Diego Mendoza', rol: 'Administrador', accion: 'Creó', modulo: 'Tratamiento', paciente: 'Ana María Quispe', detalle: 'Registró obturación en pieza 26 con resina A2', ip: '192.168.1.24', dispositivo: 'Escritorio - Chrome' },
  { id: 2, fecha: '2026-10-24', hora: '09:48', usuario: 'Jorge Linares', rol: 'Caja', accion: 'Creó', modulo: 'Pagos', paciente: 'Juan Pérez López', detalle: 'Cobro de S/ 300.00 con tarjeta, boleta B001-000426', ip: '192.168.1.12', dispositivo: 'Escritorio - Edge' },
  { id: 3, fecha: '2026-10-24', hora: '09:02', usuario: 'Dr. Diego Mendoza', rol: 'Administrador', accion: 'Acceso', modulo: 'Seguridad', paciente: '-', detalle: 'Inicio de sesión exitoso', ip: '192.168.1.24', dispositivo: 'Escritorio - Chrome' }
];

export const formatMoney = (val: number): string =>
  'S/ ' + Number(val).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
