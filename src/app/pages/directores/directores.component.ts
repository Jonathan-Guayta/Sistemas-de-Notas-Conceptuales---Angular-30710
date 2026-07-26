import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { SEDES, DEPARTAMENTOS } from '../../models/catalogos';

@Component({
  selector: 'app-directores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './directores.component.html',
  styleUrl: './directores.component.css',
})
export class DirectoresComponent {
  data = inject(DataService);
  private fb = inject(FormBuilder);

  sedes = SEDES;
  departamentos = DEPARTAMENTOS;

  mostrarFormulario = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    nombres: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    celular: ['', Validators.required],
    sede: [SEDES[0], Validators.required],
    departamento: [DEPARTAMENTOS[0], Validators.required],
  });

  abrirFormulario(): void {
    this.mostrarFormulario.set(true);
    this.error.set(null);
  }

  cancelar(): void {
    this.mostrarFormulario.set(false);
    this.form.reset({ sede: SEDES[0], departamento: DEPARTAMENTOS[0] });
    this.error.set(null);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    try {
      this.data.registrarDirector(v.nombres, v.correo, v.celular, v.sede, v.departamento);
      this.cancelar();
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }

  eliminar(id: string): void {
    try {
      this.data.eliminarDirector(id);
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }
}
