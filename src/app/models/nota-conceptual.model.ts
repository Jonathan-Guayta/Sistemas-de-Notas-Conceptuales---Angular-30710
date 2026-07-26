export enum EstadoNota {
  REGISTRADA = 'Registrada',
  EN_REVISION = 'En revisión',
  APROBADA = 'Aprobada',
  RECHAZADA = 'Rechazada',
}

export interface Convocatoria {
  id: string;
  nombre: string;
  fechaInicio: string; // ISO date
  fechaFin: string;
  descripcion: string;
}

export interface Director {
  id: string;
  nombres: string;
  correo: string;
  celular: string;
  sede: string;
  departamento: string;
}

export interface DatosGenerales {
  nombre: string;
  sede: string;
  departamento: string;
  fechaInicio: string;
  fechaFin: string;
  directorId: string;
}

export interface Localizacion {
  cobertura: string[]; // una o varias: Internacional, Nacional, Provincial...
  provincia: string;
  canton: string;
  parroquia: string;
  barrio: string;
}

export interface SectorPoblacion {
  urbanoMarginal: boolean;
  rural: boolean;
  grupoAtencionPrioritaria: boolean;
}

export interface AmbitosSeleccionados {
  desarrolloTerritorial: boolean;
  sostenibilidadAmbiental: boolean;
  innovacionSocial: boolean;
}

export interface Alineamiento {
  ambitos: AmbitosSeleccionados;
  odsObjetivo: string;
  odsMeta: string;
  cineCampoAmplio: string;
  cineCampoEspecifico: string;
  cineCampoDetallado: string;
  pndObjetivo: string;
  pndPolitica: string;
  gadProvincial: string;
  gadCantonal: string;
  gadParroquial: string;
  gadEntidadAuspiciante: string;
  peiObjetivo: string;
  peiEstrategia: string;
  lineaInvestigacion: string;
  dominioInstitucional: string;
  dominioAcademico: string;
}

export interface DepartamentoParticipante {
  sede: string;
  departamento: string;
  objetivoNota: string;
  nroDocentes: number;
}

export interface CarreraParticipante {
  sede: string;
  carrera: string;
  objetivoNota: string;
  nroEstudiantes: number;
}

export interface ImpactosEsperados {
  economico: string;
  social: string;
  politico: string;
  cientifico: string;
  ambiental: string;
  otros: string;
}

export interface PoblacionBeneficiaria {
  poblacionReferencia: number;
  poblacionPotencial: number;
  poblacionObjetivo: number;
  sector: SectorPoblacion;
}

export interface ItemPresupuesto {
  numeroItem: number;
  descripcion: string;
  nombreBienServicio: string;
  cantidad: number;
  valorUnitario: number;
}

export interface AporteExternoItem {
  detalle: string;
  cantidad: number;
  valorUnitario: number;
}

export interface PresupuestoAuspiciante {
  nombreEntidad: string;
  items: AporteExternoItem[];
}

export interface Actividad {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface FirmasResponsabilidad {
  elaboradoPor: string; // Director/a de la nota conceptual
  revisadoPor: string; // Director/a de carrera
  supervisadoPor: string; // Coordinador/a de vinculación
  aprobadoPor: string; // Director/a de departamento
}

export interface NotaConceptual {
  id: string;
  codigo: string;
  convocatoriaId: string;
  estado: EstadoNota;
  datosGenerales: DatosGenerales;
  localizacion: Localizacion;
  alineamiento: Alineamiento;
  departamentosParticipantes: DepartamentoParticipante[];
  carrerasParticipantes: CarreraParticipante[];
  impactos: ImpactosEsperados;
  poblacion: PoblacionBeneficiaria;
  itemsPresupuesto: ItemPresupuesto[];
  presupuestoAuspiciante: PresupuestoAuspiciante;
  cronograma: Actividad[];
  firmas: FirmasResponsabilidad;
  creadoEn: string;
}

export const LIMITE_PRESUPUESTO = 20000;

export function totalItem(item: ItemPresupuesto): number {
  return item.cantidad * item.valorUnitario;
}

export function totalAporte(item: AporteExternoItem): number {
  return item.cantidad * item.valorUnitario;
}

export function presupuestoTotalNota(nota: NotaConceptual): number {
  return nota.itemsPresupuesto.reduce((acc, i) => acc + totalItem(i), 0);
}

export function aportePresupuestoExterno(nota: NotaConceptual): number {
  return nota.presupuestoAuspiciante.items.reduce((acc, i) => acc + totalAporte(i), 0);
}
