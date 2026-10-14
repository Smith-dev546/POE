import { Movimiento, type MovimientoDatos, type MovimientoDTO } from '../models/Movimiento';
import type { StorageService } from '../services/StorageService';
import type { Filtros, MovimientoView, Resumen } from '../views/MovimientoView';

/** Controlador: coordina modelo, vista y almacenamiento. */
export class MovimientoController {
  private movimientos: Movimiento[] = [];
  private filtros: Filtros = { tipo: 'todos', categoria: '', busqueda: '' };
  private editandoId: string | null = null;

  constructor(
    private readonly vista: MovimientoView,
    private readonly storage: StorageService<MovimientoDTO>,
  ) {}

  iniciar(): void {
    this.movimientos = this.storage
      .cargar()
      .map((dto) => Movimiento.desdeDTO(dto))
      .filter((m): m is Movimiento => m !== null);

    this.vista.alEnviar((datos) => this.guardar(datos));
    this.vista.alCancelarEdicion(() => this.cancelarEdicion());
    this.vista.alCambiarFiltros((f) => { this.filtros = f; this.renderizar(); });
    this.vista.alAccionarFila((accion, id) => {
      if (accion === 'editar') this.editar(id);
      else void this.eliminar(id);
    });

    this.renderizar();
  }

  // ---------- CRUD ----------

  private guardar(datos: MovimientoDatos): void {
    const errores = Movimiento.validar(datos);
    if (Object.keys(errores).length > 0) {
      this.vista.mostrarErrores(errores);
      return;
    }

    if (this.editandoId) {
      const id = this.editandoId;
      this.movimientos = this.movimientos.map((m) =>
        m.id === id
          ? new Movimiento(id, datos.tipo, datos.monto, datos.categoria, datos.descripcion, datos.fecha)
          : m);
    } else {
      this.movimientos.push(Movimiento.crear(datos));
    }

    this.editandoId = null;
    this.persistir();
    this.vista.resetearFormulario();
    this.renderizar();
  }

  private editar(id: string): void {
    const m = this.movimientos.find((x) => x.id === id);
    if (!m) return;
    this.editandoId = id;
    this.vista.cargarEnFormulario(m);
  }

  private cancelarEdicion(): void {
    this.editandoId = null;
    this.vista.resetearFormulario();
  }

  private async eliminar(id: string): Promise<void> {
    const m = this.movimientos.find((x) => x.id === id);
    if (!m) return;
    const detalle = m.descripcion || m.categoria;
    const confirmado = await this.vista.confirmarEliminacion(
      `¿Eliminar "${detalle}" por $${m.monto.toFixed(2)}? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    this.movimientos = this.movimientos.filter((x) => x.id !== id);
    if (this.editandoId === id) this.cancelarEdicion();
    this.persistir();
    this.renderizar();
  }

  // ---------- Cálculos ----------

  calcularResumen(lista: Movimiento[] = this.movimientos): Resumen {
    const suma = (tipo: Movimiento['tipo']) =>
      lista.filter((m) => m.tipo === tipo).reduce((s, m) => s + m.monto, 0);
    // Se redondea a centavos para evitar errores de coma flotante.
    const r = (n: number) => Math.round(n * 100) / 100;
    const ingresos = suma('ingreso');
    const gastos = suma('gasto');
    return { ingresos: r(ingresos), gastos: r(gastos), balance: r(ingresos - gastos) };
  }

  private filtrar(): Movimiento[] {
    const { tipo, categoria, busqueda } = this.filtros;
    return this.movimientos
      .filter((m) => tipo === 'todos' || m.tipo === tipo)
      .filter((m) => !categoria || m.categoria === categoria)
      .filter((m) => !busqueda
        || m.descripcion.toLowerCase().includes(busqueda)
        || m.categoria.toLowerCase().includes(busqueda))
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  // ---------- Soporte ----------

  private persistir(): void {
    if (!this.storage.guardar(this.movimientos.map((m) => m.toDTO()))) {
      alert('No se pudo guardar en el navegador. Revisa el espacio o los permisos de almacenamiento.');
    }
  }

  private renderizar(): void {
    const { tipo, categoria, busqueda } = this.filtros;
    const hayFiltros = tipo !== 'todos' || categoria !== '' || busqueda !== '';
    this.vista.renderizarLista(this.filtrar(), this.movimientos.length, hayFiltros);
    // El resumen siempre refleja TODOS los movimientos, no solo los filtrados.
    this.vista.renderizarResumen(this.calcularResumen());
  }
}
