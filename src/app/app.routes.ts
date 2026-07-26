import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'convocatorias',
    loadComponent: () => import('./pages/convocatorias/convocatorias.component').then((m) => m.ConvocatoriasComponent),
  },
  {
    path: 'directores',
    loadComponent: () => import('./pages/directores/directores.component').then((m) => m.DirectoresComponent),
  },
  {
    path: 'notas',
    loadComponent: () => import('./pages/notas/notas.component').then((m) => m.NotasComponent),
  },
  {
    path: 'notas/nueva',
    loadComponent: () => import('./pages/nota-form/nota-form.component').then((m) => m.NotaFormComponent),
  },
  {
    path: 'notas/:codigo',
    loadComponent: () => import('./pages/nota-detalle/nota-detalle.component').then((m) => m.NotaDetalleComponent),
  },
  { path: '**', redirectTo: '' },
];
