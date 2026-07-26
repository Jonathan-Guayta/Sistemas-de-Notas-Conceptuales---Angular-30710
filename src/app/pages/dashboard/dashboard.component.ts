import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { EstadoNota, presupuestoTotalNota } from '../../models/nota-conceptual.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  data = inject(DataService);
  EstadoNota = EstadoNota;
  presupuestoTotalNota = presupuestoTotalNota;

  totalNotas = computed(() => this.data.notas().length);
  totalConvocatorias = computed(() => this.data.convocatorias().length);
  totalDirectores = computed(() => this.data.directores().length);

  porEstado = computed(() => {
    const notas = this.data.notas();
    const resumen: Record<string, number> = {
      [EstadoNota.REGISTRADA]: 0,
      [EstadoNota.EN_REVISION]: 0,
      [EstadoNota.APROBADA]: 0,
      [EstadoNota.RECHAZADA]: 0,
    };
    notas.forEach((n) => (resumen[n.estado] = (resumen[n.estado] ?? 0) + 1));
    return resumen;
  });

  recientes = computed(() =>
    [...this.data.notas()].sort((a, b) => b.creadoEn.localeCompare(a.creadoEn)).slice(0, 5)
  );

  porcentajeLimite = computed(() => {
    const total = this.data.presupuestoGeneral();
    const limiteReferencial = Math.max(this.totalNotas(), 1) * 20000;
    return Math.min(100, Math.round((total / limiteReferencial) * 100));
  });
}
