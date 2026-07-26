import { Injectable, computed, signal } from '@angular/core';
import {
  Convocatoria,
  Director,
  NotaConceptual,
  EstadoNota,
  presupuestoTotalNota,
} from '../models/nota-conceptual.model';
import { Validaciones } from './validaciones';

@Injectable({ providedIn: 'root' })
export class DataService {
  private convocatoriasSig = signal<Convocatoria[]>([]);
  private directoresSig = signal<Director[]>([]);
  private notasSig = signal<NotaConceptual[]>([]);

  readonly convocatorias = this.convocatoriasSig.asReadonly();
  readonly directores = this.directoresSig.asReadonly();
  readonly notas = this.notasSig.asReadonly();

  readonly presupuestoGeneral = computed(() =>
    this.notasSig().reduce((acc, n) => acc + presupuestoTotalNota(n), 0)
  );

  private contadorConv = 1;
  private contadorDir = 1;
  private contadorNota = 1;

  // ---------- Convocatorias ----------
  crearConvocatoria(nombre: string, fechaInicio: string, fechaFin: string, descripcion: string): Convocatoria {
    Validaciones.requerido(nombre, 'Nombre de la convocatoria');
    Validaciones.rangoFechasValido(fechaInicio, fechaFin, 'La fecha de finalización de la convocatoria');
    const conv: Convocatoria = {
      id: `CONV-${String(this.contadorConv++).padStart(3, '0')}`,
      nombre,
      fechaInicio,
      fechaFin,
      descripcion,
    };
    this.convocatoriasSig.update((arr) => [...arr, conv]);
    return conv;
  }

  eliminarConvocatoria(id: string): void {
    const enUso = this.notasSig().some((n) => n.convocatoriaId === id);
    if (enUso) {
      throw new Error('No se puede eliminar la convocatoria: tiene notas conceptuales registradas.');
    }
    this.convocatoriasSig.update((arr) => arr.filter((c) => c.id !== id));
  }

  presupuestoGeneralPorConvocatoria(convocatoriaId: string): number {
    return this.notasSig()
      .filter((n) => n.convocatoriaId === convocatoriaId)
      .reduce((acc, n) => acc + presupuestoTotalNota(n), 0);
  }

  notasPorConvocatoria(convocatoriaId: string): NotaConceptual[] {
    return this.notasSig().filter((n) => n.convocatoriaId === convocatoriaId);
  }

  // ---------- Directores ----------
  registrarDirector(nombres: string, correo: string, celular: string, sede: string, departamento: string): Director {
    Validaciones.requerido(nombres, 'Nombre del docente responsable');
    Validaciones.correoValido(correo);
    Validaciones.requerido(sede, 'Sede/Unidad Académica Especial');
    Validaciones.requerido(departamento, 'Departamento');
    const director: Director = {
      id: `DIR-${String(this.contadorDir++).padStart(3, '0')}`,
      nombres,
      correo,
      celular,
      sede,
      departamento,
    };
    this.directoresSig.update((arr) => [...arr, director]);
    return director;
  }

  eliminarDirector(id: string): void {
    const enUso = this.notasSig().some((n) => n.datosGenerales.directorId === id);
    if (enUso) {
      throw new Error('No se puede eliminar el director: dirige al menos una nota conceptual.');
    }
    this.directoresSig.update((arr) => arr.filter((d) => d.id !== id));
  }

  director(id: string): Director | undefined {
    return this.directoresSig().find((d) => d.id === id);
  }

  // ---------- Notas conceptuales ----------
  registrarNota(nota: Omit<NotaConceptual, 'id' | 'codigo' | 'creadoEn'>): NotaConceptual {
    const nueva: NotaConceptual = {
      ...nota,
      id: crypto.randomUUID(),
      codigo: `NC-${new Date().getFullYear()}-${String(this.contadorNota++).padStart(4, '0')}`,
      creadoEn: new Date().toISOString(),
    };
    this.notasSig.update((arr) => [...arr, nueva]);
    return nueva;
  }

  actualizarNota(codigo: string, cambios: Partial<NotaConceptual>): void {
    this.notasSig.update((arr) =>
      arr.map((n) => (n.codigo === codigo ? { ...n, ...cambios } : n))
    );
  }

  buscarPorCodigo(codigo: string): NotaConceptual | undefined {
    return this.notasSig().find((n) => n.codigo === codigo);
  }

  eliminarNota(codigo: string): void {
    this.notasSig.update((arr) => arr.filter((n) => n.codigo !== codigo));
  }

  cambiarEstado(codigo: string, nuevoEstado: EstadoNota): void {
    const nota = this.buscarPorCodigo(codigo);
    if (!nota) throw new Error(`No existe una nota con el código "${codigo}".`);

    if (nuevoEstado === EstadoNota.EN_REVISION || nuevoEstado === EstadoNota.APROBADA) {
      Validaciones.tieneAlMenosUnaActividad(nota.cronograma.length);
      Validaciones.tieneAlMenosUnItem(nota.itemsPresupuesto.length);
      Validaciones.presupuestoDentroDelLimite(presupuestoTotalNota(nota));
    }
    this.actualizarNota(codigo, { estado: nuevoEstado });
  }

  agregarItemPresupuesto(codigo: string, descripcion: string, nombreBienServicio: string, cantidad: number, valorUnitario: number): void {
    const nota = this.buscarPorCodigo(codigo);
    if (!nota) throw new Error(`No existe una nota con el código "${codigo}".`);
    Validaciones.requerido(descripcion, 'Descripción del ítem presupuestario');
    Validaciones.requerido(nombreBienServicio, 'Nombre del bien o servicio');
    Validaciones.cantidadPositiva(cantidad);
    Validaciones.valorUnitarioNoNegativo(valorUnitario);

    const nuevoTotal = presupuestoTotalNota(nota) + cantidad * valorUnitario;
    Validaciones.presupuestoDentroDelLimite(nuevoTotal);

    const items = [
      ...nota.itemsPresupuesto,
      { numeroItem: nota.itemsPresupuesto.length + 1, descripcion, nombreBienServicio, cantidad, valorUnitario },
    ];
    this.actualizarNota(codigo, { itemsPresupuesto: items });
  }

  eliminarItemPresupuesto(codigo: string, numeroItem: number): void {
    const nota = this.buscarPorCodigo(codigo);
    if (!nota) return;
    const items = nota.itemsPresupuesto
      .filter((i) => i.numeroItem !== numeroItem)
      .map((i, idx) => ({ ...i, numeroItem: idx + 1 }));
    this.actualizarNota(codigo, { itemsPresupuesto: items });
  }

  agregarActividad(codigo: string, nombre: string, fechaInicio: string, fechaFin: string): void {
    const nota = this.buscarPorCodigo(codigo);
    if (!nota) throw new Error(`No existe una nota con el código "${codigo}".`);
    Validaciones.requerido(nombre, 'Nombre de la actividad');
    Validaciones.rangoFechasValido(fechaInicio, fechaFin, `La fecha fin de la actividad "${nombre}"`);
    const actividades = [...nota.cronograma, { nombre, fechaInicio, fechaFin }];
    this.actualizarNota(codigo, { cronograma: actividades });
  }

  eliminarActividad(codigo: string, index: number): void {
    const nota = this.buscarPorCodigo(codigo);
    if (!nota) return;
    const actividades = nota.cronograma.filter((_, i) => i !== index);
    this.actualizarNota(codigo, { cronograma: actividades });
  }
}
