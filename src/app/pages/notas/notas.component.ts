import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { EstadoNota, presupuestoTotalNota } from '../../models/nota-conceptual.model';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './notas.component.html',
  styleUrl: './notas.component.css',
})
export class NotasComponent {
  data = inject(DataService);
  private route = inject(ActivatedRoute);

  EstadoNota = EstadoNota;
  presupuestoTotalNota = presupuestoTotalNota;
  estados = Object.values(EstadoNota);

  busqueda = signal('');
  filtroEstado = signal<string>('');
  filtroConvocatoria = signal<string>('');

  constructor() {
    const qp = this.route.snapshot.queryParamMap.get('convocatoria');
    if (qp) this.filtroConvocatoria.set(qp);
  }

  notasFiltradas = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const estado = this.filtroEstado();
    const conv = this.filtroConvocatoria();
    return this.data
      .notas()
      .filter((n) => !texto || n.codigo.toLowerCase().includes(texto) || n.datosGenerales.nombre.toLowerCase().includes(texto))
      .filter((n) => !estado || n.estado === estado)
      .filter((n) => !conv || n.convocatoriaId === conv)
      .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
  });

  directorNombre(id: string): string {
    return this.data.director(id)?.nombres ?? '—';
  }

  selloClase(estado: EstadoNota): string {
    switch (estado) {
      case EstadoNota.REGISTRADA: return 'registrada';
      case EstadoNota.EN_REVISION: return 'en-revision';
      case EstadoNota.APROBADA: return 'aprobada';
      default: return 'rechazada';
    }
  }
}
