export type TipoMovimiento = 'ingreso' | 'gasto';

/** Datos planos de un movimiento (lo que se guarda en localStorage). */
export interface MovimientoDTO {
  id: string;
  tipo: TipoMovimiento;
  monto: number;
  categoria: string;
  descripcion: string;
  fecha: string; // formato ISO: YYYY-MM-DD
}

/** Datos que llegan del formulario, sin id. */
export type MovimientoDatos = Omit<MovimientoDTO, 'id'>;

/** Errores de validación indexados por campo. */
export type ErroresValidacion = Partial<Record<keyof MovimientoDatos, string>>;

export const CATEGORIAS: readonly string[] = [
  'Alimentación', 'Transporte', 'Vivienda', 'Servicios', 'Salud',
  'Educación', 'Ocio', 'Salario', 'Otros ingresos', 'Otros',
];

export class Movimiento {
  private static readonly MONTO_MAXIMO = 1_000_000_000;

  constructor(
    public readonly id: string,
    public readonly tipo: TipoMovimiento,
    public readonly monto: number,
    public readonly categoria: string,
    public readonly descripcion: string,
    public readonly fecha: string,
  ) {
    const errores = Movimiento.validar({ tipo, monto, categoria, descripcion, fecha });
    const primero = Object.values(errores)[0];
    if (primero) throw new Error(primero);
  }

  /** Valida los datos y devuelve los errores encontrados (vacío si todo es correcto). */
  static validar(datos: MovimientoDatos): ErroresValidacion {
    const errores: ErroresValidacion = {};

    if (datos.tipo !== 'ingreso' && datos.tipo !== 'gasto') {
      errores.tipo = 'Selecciona un tipo válido.';
    }
    if (!Number.isFinite(datos.monto) || datos.monto <= 0) {
      errores.monto = 'Ingresa un monto mayor a cero.';
    } else if (datos.monto > Movimiento.MONTO_MAXIMO) {
      errores.monto = 'El monto es demasiado grande.';
    }
    if (!CATEGORIAS.includes(datos.categoria)) {
      errores.categoria = 'Selecciona una categoría.';
    }
    if (datos.descripcion.length > 80) {
      errores.descripcion = 'Máximo 80 caracteres.';
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha) || Number.isNaN(Date.parse(datos.fecha))) {
      errores.fecha = 'Ingresa una fecha válida.';
    } else if (datos.fecha > Movimiento.hoy()) {
      errores.fecha = 'La fecha no puede ser futura.';
    }
    return errores;
  }

  /** Fecha de hoy en formato YYYY-MM-DD (zona horaria local). */
  static hoy(): string {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
  }

  static crear(datos: MovimientoDatos): Movimiento {
    const id = crypto.randomUUID();
    return new Movimiento(id, datos.tipo, datos.monto, datos.categoria, datos.descripcion, datos.fecha);
  }

  /** Reconstruye un movimiento desde datos guardados; devuelve null si están corruptos. */
  static desdeDTO(dto: MovimientoDTO): Movimiento | null {
    try {
      return new Movimiento(dto.id, dto.tipo, dto.monto, dto.categoria, dto.descripcion ?? '', dto.fecha);
    } catch {
      return null;
    }
  }

  toDTO(): MovimientoDTO {
    return {
      id: this.id, tipo: this.tipo, monto: this.monto,
      categoria: this.categoria, descripcion: this.descripcion, fecha: this.fecha,
    };
  }
}
