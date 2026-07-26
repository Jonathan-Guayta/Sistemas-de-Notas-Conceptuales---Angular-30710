import { LIMITE_PRESUPUESTO } from '../models/nota-conceptual.model';

export class ValidationError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'ValidationError';
  }
}

export class Validaciones {
  static requerido(valor: string | null | undefined, campo: string): void {
    if (!valor || valor.trim().length === 0) {
      throw new ValidationError(`El campo "${campo}" no puede estar vacío.`);
    }
  }

  static correoValido(correo: string): void {
    if (!correo || !correo.includes('@')) {
      throw new ValidationError(`El correo "${correo}" no es válido: debe contener "@".`);
    }
  }

  static poblacionCoherente(referencia: number, potencial: number, objetivo: number): void {
    if (potencial > referencia) {
      throw new ValidationError('La población potencial no puede ser mayor que la población de referencia.');
    }
    if (objetivo > potencial) {
      throw new ValidationError('La población objetivo no puede ser mayor que la población potencial.');
    }
  }

  static cantidadPositiva(cantidad: number): void {
    if (!(cantidad > 0)) {
      throw new ValidationError('La cantidad del ítem presupuestario debe ser mayor que cero.');
    }
  }

  static valorUnitarioNoNegativo(valorUnitario: number): void {
    if (valorUnitario < 0) {
      throw new ValidationError('El valor unitario no puede ser negativo.');
    }
  }

  static presupuestoDentroDelLimite(totalActual: number, limite: number = LIMITE_PRESUPUESTO): void {
    if (totalActual > limite) {
      throw new ValidationError(
        `El presupuesto total de la nota (USD ${totalActual.toFixed(2)}) supera el límite permitido de USD ${limite.toFixed(2)}.`
      );
    }
  }

  static tieneAlMenosUnaActividad(cantidadActividades: number): void {
    if (cantidadActividades < 1) {
      throw new ValidationError('La nota conceptual debe tener al menos una actividad registrada en el cronograma.');
    }
  }

  static tieneAlMenosUnItem(cantidadItems: number): void {
    if (cantidadItems < 1) {
      throw new ValidationError('La nota conceptual debe tener al menos un ítem presupuestario.');
    }
  }

  static rangoFechasValido(fechaInicio: string, fechaFin: string, etiqueta: string = 'La fecha de finalización'): void {
    if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
      throw new ValidationError(`${etiqueta} no puede ser anterior a la fecha de inicio.`);
    }
  }

  static alMenosUnAmbito(ambitos: { desarrolloTerritorial: boolean; sostenibilidadAmbiental: boolean; innovacionSocial: boolean }): void {
    if (!ambitos.desarrolloTerritorial && !ambitos.sostenibilidadAmbiental && !ambitos.innovacionSocial) {
      throw new ValidationError('Debe seleccionar al menos un ámbito prioritario de actuación.');
    }
  }
}
