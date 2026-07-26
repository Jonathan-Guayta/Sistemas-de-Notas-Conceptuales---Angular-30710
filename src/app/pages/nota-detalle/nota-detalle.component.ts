import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Validaciones } from '../../services/validaciones';
import { EstadoNota, presupuestoTotalNota, aportePresupuestoExterno } from '../../models/nota-conceptual.model';

@Component({
  selector: 'app-nota-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './nota-detalle.component.html',
  styleUrl: './nota-detalle.component.css',
})
export class NotaDetalleComponent {
  data = inject(DataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  EstadoNota = EstadoNota;
  presupuestoTotalNota = presupuestoTotalNota;
  aportePresupuestoExterno = aportePresupuestoExterno;

  codigo = signal(this.route.snapshot.paramMap.get('codigo') ?? '');
  error = signal<string | null>(null);
  mensaje = signal<string | null>(null);

  nota = computed(() => this.data.buscarPorCodigo(this.codigo()));
  director = computed(() => {
    const n = this.nota();
    return n ? this.data.director(n.datosGenerales.directorId) : undefined;
  });
  convocatoria = computed(() => {
    const n = this.nota();
    return n ? this.data.convocatorias().find((c) => c.id === n.convocatoriaId) : undefined;
  });

  selloClase(estado: EstadoNota): string {
    switch (estado) {
      case EstadoNota.REGISTRADA: return 'registrada';
      case EstadoNota.EN_REVISION: return 'en-revision';
      case EstadoNota.APROBADA: return 'aprobada';
      default: return 'rechazada';
    }
  }

  cambiarEstado(nuevo: EstadoNota): void {
    try {
      this.data.cambiarEstado(this.codigo(), nuevo);
      this.mensaje.set(`Estado actualizado a "${nuevo}".`);
      this.error.set(null);
    } catch (e) {
      this.error.set((e as Error).message);
      this.mensaje.set(null);
    }
  }

  // ---- agregar ítem presupuestario ----
  mostrarFormItem = signal(false);
  nuevoItem = { descripcion: '', nombreBienServicio: '', cantidad: 1, valorUnitario: 0 };
  agregarItem(): void {
    try {
      this.data.agregarItemPresupuesto(this.codigo(), this.nuevoItem.descripcion, this.nuevoItem.nombreBienServicio, this.nuevoItem.cantidad, this.nuevoItem.valorUnitario);
      this.nuevoItem = { descripcion: '', nombreBienServicio: '', cantidad: 1, valorUnitario: 0 };
      this.mostrarFormItem.set(false);
      this.error.set(null);
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }
  quitarItem(numeroItem: number): void {
    this.data.eliminarItemPresupuesto(this.codigo(), numeroItem);
  }

  // ---- agregar actividad ----
  mostrarFormActividad = signal(false);
  nuevaActividad = { nombre: '', fechaInicio: '', fechaFin: '' };
  agregarActividad(): void {
    try {
      this.data.agregarActividad(this.codigo(), this.nuevaActividad.nombre, this.nuevaActividad.fechaInicio, this.nuevaActividad.fechaFin);
      this.nuevaActividad = { nombre: '', fechaInicio: '', fechaFin: '' };
      this.mostrarFormActividad.set(false);
      this.error.set(null);
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }
  quitarActividad(index: number): void {
    this.data.eliminarActividad(this.codigo(), index);
  }

  eliminarNota(): void {
    this.data.eliminarNota(this.codigo());
    this.router.navigate(['/notas']);
  }
}
