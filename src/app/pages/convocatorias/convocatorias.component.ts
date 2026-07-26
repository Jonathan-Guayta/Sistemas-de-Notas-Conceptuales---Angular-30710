import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-convocatorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './convocatorias.component.html',
  styleUrl: './convocatorias.component.css',
})
export class ConvocatoriasComponent {
  data = inject(DataService);
  private fb = inject(FormBuilder);

  mostrarFormulario = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    descripcion: [''],
  });

  abrirFormulario(): void {
    this.mostrarFormulario.set(true);
    this.error.set(null);
  }

  cancelar(): void {
    this.mostrarFormulario.set(false);
    this.form.reset();
    this.error.set(null);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    try {
      this.data.crearConvocatoria(v.nombre, v.fechaInicio, v.fechaFin, v.descripcion);
      this.cancelar();
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }

  eliminar(id: string): void {
    try {
      this.data.eliminarConvocatoria(id);
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }
}
