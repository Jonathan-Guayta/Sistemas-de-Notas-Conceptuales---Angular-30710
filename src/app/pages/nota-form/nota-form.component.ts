import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Validaciones, ValidationError } from '../../services/validaciones';
import {
  EstadoNota,
  NotaConceptual,
  ItemPresupuesto,
  AporteExternoItem,
  Actividad,
  DepartamentoParticipante,
  CarreraParticipante,
  totalItem,
  totalAporte,
} from '../../models/nota-conceptual.model';
import {
  SEDES,
  DEPARTAMENTOS,
  AMBITOS_PRIORITARIOS,
  COBERTURAS,
  ODS,
  CINE,
  PND,
  PLAN_ESTRATEGICO_INSTITUCIONAL,
  LINEAS_INVESTIGACION,
  DOMINIOS,
} from '../../models/catalogos';

interface PasoDef {
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-nota-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './nota-form.component.html',
  styleUrl: './nota-form.component.css',
})
export class NotaFormComponent {
  data = inject(DataService);
  private router = inject(Router);

  // ---- catálogos disponibles en la plantilla ----
  sedes = SEDES;
  departamentos = DEPARTAMENTOS;
  ambitosPrioritarios = AMBITOS_PRIORITARIOS;
  coberturas = COBERTURAS;
  odsKeys = Object.keys(ODS);
  cineAmplios = Object.keys(CINE);
  pndObjetivos = Object.keys(PND);
  peiObjetivos = Object.keys(PLAN_ESTRATEGICO_INSTITUCIONAL);
  lineasInvestigacion = LINEAS_INVESTIGACION;
  dominiosInstitucionales = Object.keys(DOMINIOS);

  pasos: PasoDef[] = [
    { titulo: 'Datos generales', descripcion: 'Identificación de la nota y su director' },
    { titulo: 'Localización', descripcion: 'Cobertura territorial y sector beneficiario' },
    { titulo: 'Alineamiento', descripcion: 'Ámbitos, ODS, CINE, PND y líneas institucionales' },
    { titulo: 'Equipo e impactos', descripcion: 'Departamentos, carreras e impactos esperados' },
    { titulo: 'Población', descripcion: 'Caracterización de la población objetivo' },
    { titulo: 'Presupuesto', descripcion: 'Ítems presupuestarios y aporte externo' },
    { titulo: 'Cronograma', descripcion: 'Actividades planificadas' },
    { titulo: 'Firmas', descripcion: 'Responsables del trámite' },
  ];

  paso = signal(0);
  error = signal<string | null>(null);

  // ---- estado del formulario (plano, editable con ngModel) ----
  convocatoriaId = '';
  directorId = '';

  nombre = '';
  sede = SEDES[0];
  departamento = DEPARTAMENTOS[0];
  fechaInicio = '';
  fechaFin = '';

  cobertura: string[] = [];
  provincia = '';
  canton = '';
  parroquia = '';
  barrio = '';
  sector = { urbanoMarginal: false, rural: false, grupoAtencionPrioritaria: false };

  ambitos = { desarrolloTerritorial: false, sostenibilidadAmbiental: false, innovacionSocial: false };
  odsObjetivo = '';
  odsMeta = '';
  cineCampoAmplio = '';
  cineCampoEspecifico = '';
  cineCampoDetallado = '';
  pndObjetivo = '';
  pndPolitica = '';
  gadProvincial = '';
  gadCantonal = '';
  gadParroquial = '';
  gadEntidadAuspiciante = '';
  peiObjetivo = '';
  peiEstrategia = '';
  lineaInvestigacion = '';
  dominioInstitucional = '';
  dominioAcademico = '';

  departamentosParticipantes: DepartamentoParticipante[] = [];
  carrerasParticipantes: CarreraParticipante[] = [];

  impactos = { economico: '', social: '', politico: '', cientifico: '', ambiental: '', otros: '' };

  poblacionReferencia: number | null = null;
  poblacionPotencial: number | null = null;
  poblacionObjetivo: number | null = null;

  itemsPresupuesto: ItemPresupuesto[] = [];
  nombreEntidadAuspiciante = '';
  aporteItems: AporteExternoItem[] = [];

  cronograma: Actividad[] = [];

  firmas = { elaboradoPor: '', revisadoPor: '', supervisadoPor: '', aprobadoPor: '' };

  // ---- catálogos dependientes de una selección previa ----
  get odsMetasDisponibles(): string[] {
    return this.odsObjetivo ? ODS[this.odsObjetivo] ?? [] : [];
  }
  get cineEspecificosDisponibles(): string[] {
    return this.cineCampoAmplio ? Object.keys(CINE[this.cineCampoAmplio] ?? {}) : [];
  }
  get cineDetalladosDisponibles(): string[] {
    if (!this.cineCampoAmplio || !this.cineCampoEspecifico) return [];
    return CINE[this.cineCampoAmplio]?.[this.cineCampoEspecifico] ?? [];
  }
  get pndPoliticasDisponibles(): string[] {
    return this.pndObjetivo ? PND[this.pndObjetivo] ?? [] : [];
  }
  get peiEstrategiasDisponibles(): string[] {
    return this.peiObjetivo ? PLAN_ESTRATEGICO_INSTITUCIONAL[this.peiObjetivo] ?? [] : [];
  }
  get dominiosAcademicosDisponibles(): string[] {
    return this.dominioInstitucional ? DOMINIOS[this.dominioInstitucional] ?? [] : [];
  }

  onOdsObjetivoChange(): void { this.odsMeta = ''; }
  onCineAmplioChange(): void { this.cineCampoEspecifico = ''; this.cineCampoDetallado = ''; }
  onCineEspecificoChange(): void { this.cineCampoDetallado = ''; }
  onPndObjetivoChange(): void { this.pndPolitica = ''; }
  onPeiObjetivoChange(): void { this.peiEstrategia = ''; }
  onDominioInstitucionalChange(): void { this.dominioAcademico = ''; }

  toggleCobertura(valor: string): void {
    this.cobertura = this.cobertura.includes(valor)
      ? this.cobertura.filter((c) => c !== valor)
      : [...this.cobertura, valor];
  }

  // ---- filas dinámicas ----
  agregarDepartamentoParticipante(): void {
    this.departamentosParticipantes.push({ sede: this.sedes[0], departamento: this.departamentos[0], objetivoNota: '', nroDocentes: 0 });
  }
  quitarDepartamentoParticipante(i: number): void {
    this.departamentosParticipantes.splice(i, 1);
  }

  agregarCarreraParticipante(): void {
    this.carrerasParticipantes.push({ sede: this.sedes[0], carrera: '', objetivoNota: '', nroEstudiantes: 0 });
  }
  quitarCarreraParticipante(i: number): void {
    this.carrerasParticipantes.splice(i, 1);
  }

  nuevoItem = { descripcion: '', nombreBienServicio: '', cantidad: 1, valorUnitario: 0 };
  agregarItem(): void {
    try {
      Validaciones.requerido(this.nuevoItem.descripcion, 'Descripción del ítem presupuestario');
      Validaciones.requerido(this.nuevoItem.nombreBienServicio, 'Nombre del bien o servicio');
      Validaciones.cantidadPositiva(this.nuevoItem.cantidad);
      Validaciones.valorUnitarioNoNegativo(this.nuevoItem.valorUnitario);
      const nuevoTotal = this.totalPresupuesto() + this.nuevoItem.cantidad * this.nuevoItem.valorUnitario;
      Validaciones.presupuestoDentroDelLimite(nuevoTotal);
      this.itemsPresupuesto.push({
        numeroItem: this.itemsPresupuesto.length + 1,
        descripcion: this.nuevoItem.descripcion,
        nombreBienServicio: this.nuevoItem.nombreBienServicio,
        cantidad: this.nuevoItem.cantidad,
        valorUnitario: this.nuevoItem.valorUnitario,
      });
      this.nuevoItem = { descripcion: '', nombreBienServicio: '', cantidad: 1, valorUnitario: 0 };
      this.error.set(null);
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }
  quitarItem(i: number): void {
    this.itemsPresupuesto.splice(i, 1);
    this.itemsPresupuesto.forEach((it, idx) => (it.numeroItem = idx + 1));
  }
  totalPresupuesto(): number {
    return this.itemsPresupuesto.reduce((acc, i) => acc + totalItem(i), 0);
  }

  nuevoAporte = { detalle: '', cantidad: 1, valorUnitario: 0 };
  agregarAporte(): void {
    if (!this.nuevoAporte.detalle.trim()) {
      this.error.set('Describe el bien o servicio del aporte externo.');
      return;
    }
    this.aporteItems.push({ ...this.nuevoAporte });
    this.nuevoAporte = { detalle: '', cantidad: 1, valorUnitario: 0 };
    this.error.set(null);
  }
  quitarAporte(i: number): void { this.aporteItems.splice(i, 1); }
  totalAporteExterno(): number {
    return this.aporteItems.reduce((acc, i) => acc + totalAporte(i), 0);
  }

  nuevaActividad = { nombre: '', fechaInicio: '', fechaFin: '' };
  agregarActividad(): void {
    try {
      Validaciones.requerido(this.nuevaActividad.nombre, 'Nombre de la actividad');
      Validaciones.rangoFechasValido(this.nuevaActividad.fechaInicio, this.nuevaActividad.fechaFin, `La fecha fin de la actividad "${this.nuevaActividad.nombre}"`);
      this.cronograma.push({ ...this.nuevaActividad });
      this.nuevaActividad = { nombre: '', fechaInicio: '', fechaFin: '' };
      this.error.set(null);
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }
  quitarActividad(i: number): void { this.cronograma.splice(i, 1); }

  // ---- navegación entre pasos ----
  siguiente(): void {
    const err = this.validarPaso(this.paso());
    if (err) { this.error.set(err); return; }
    this.error.set(null);
    this.paso.update((p) => Math.min(p + 1, this.pasos.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  anterior(): void {
    this.error.set(null);
    this.paso.update((p) => Math.max(p - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  irAPaso(i: number): void {
    if (i <= this.paso()) { this.paso.set(i); this.error.set(null); }
  }

  private validarPaso(i: number): string | null {
    try {
      if (i === 0) {
        Validaciones.requerido(this.convocatoriaId, 'Convocatoria');
        Validaciones.requerido(this.nombre, 'Nombre de la nota conceptual');
        Validaciones.requerido(this.directorId, 'Director del proyecto');
        Validaciones.requerido(this.sede, 'Sede/Unidad Académica Especial');
        Validaciones.requerido(this.departamento, 'Departamento');
        Validaciones.requerido(this.fechaInicio, 'Fecha de inicio planificada');
        Validaciones.requerido(this.fechaFin, 'Fecha de finalización planificada');
        Validaciones.rangoFechasValido(this.fechaInicio, this.fechaFin, 'La fecha de finalización planificada');
      }
      if (i === 2) {
        Validaciones.alMenosUnAmbito(this.ambitos);
      }
      if (i === 4) {
        if (this.poblacionReferencia === null || this.poblacionPotencial === null || this.poblacionObjetivo === null) {
          throw new ValidationError('Completa la caracterización de la población objetivo.');
        }
        Validaciones.poblacionCoherente(this.poblacionReferencia, this.poblacionPotencial, this.poblacionObjetivo);
      }
      if (i === 5) {
        Validaciones.tieneAlMenosUnItem(this.itemsPresupuesto.length);
      }
      if (i === 6) {
        Validaciones.tieneAlMenosUnaActividad(this.cronograma.length);
      }
      return null;
    } catch (e) {
      return (e as Error).message;
    }
  }

  guardar(): void {
    for (let i = 0; i <= 6; i++) {
      const err = this.validarPaso(i);
      if (err) { this.paso.set(i); this.error.set(err); return; }
    }
    try {
      Validaciones.requerido(this.firmas.elaboradoPor, 'Elaborado por');
      const nueva: Omit<NotaConceptual, 'id' | 'codigo' | 'creadoEn'> = {
        convocatoriaId: this.convocatoriaId,
        estado: EstadoNota.REGISTRADA,
        datosGenerales: {
          nombre: this.nombre,
          sede: this.sede,
          departamento: this.departamento,
          fechaInicio: this.fechaInicio,
          fechaFin: this.fechaFin,
          directorId: this.directorId,
        },
        localizacion: {
          cobertura: this.cobertura,
          provincia: this.provincia,
          canton: this.canton,
          parroquia: this.parroquia,
          barrio: this.barrio,
        },
        alineamiento: {
          ambitos: this.ambitos,
          odsObjetivo: this.odsObjetivo,
          odsMeta: this.odsMeta,
          cineCampoAmplio: this.cineCampoAmplio,
          cineCampoEspecifico: this.cineCampoEspecifico,
          cineCampoDetallado: this.cineCampoDetallado,
          pndObjetivo: this.pndObjetivo,
          pndPolitica: this.pndPolitica,
          gadProvincial: this.gadProvincial,
          gadCantonal: this.gadCantonal,
          gadParroquial: this.gadParroquial,
          gadEntidadAuspiciante: this.gadEntidadAuspiciante,
          peiObjetivo: this.peiObjetivo,
          peiEstrategia: this.peiEstrategia,
          lineaInvestigacion: this.lineaInvestigacion,
          dominioInstitucional: this.dominioInstitucional,
          dominioAcademico: this.dominioAcademico,
        },
        departamentosParticipantes: this.departamentosParticipantes,
        carrerasParticipantes: this.carrerasParticipantes,
        impactos: this.impactos,
        poblacion: {
          poblacionReferencia: this.poblacionReferencia ?? 0,
          poblacionPotencial: this.poblacionPotencial ?? 0,
          poblacionObjetivo: this.poblacionObjetivo ?? 0,
          sector: this.sector,
        },
        itemsPresupuesto: this.itemsPresupuesto,
        presupuestoAuspiciante: { nombreEntidad: this.nombreEntidadAuspiciante, items: this.aporteItems },
        cronograma: this.cronograma,
        firmas: this.firmas,
      };
      const creada = this.data.registrarNota(nueva);
      this.router.navigate(['/notas', creada.codigo]);
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }
}
