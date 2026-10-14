import {
  CATEGORIAS, Movimiento,
  type ErroresValidacion, type MovimientoDatos, type TipoMovimiento,
} from '../models/Movimiento';

export interface Filtros {
  tipo: TipoMovimiento | 'todos';
  categoria: string; // '' = todas
  busqueda: string;
}

export interface Resumen {
  ingresos: number;
  gastos: number;
  balance: number;
}

const moneda = new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' });
const fechaCorta = new Intl.DateTimeFormat('es-SV', { day: '2-digit', month: 'short', year: 'numeric' });

/** Vista: solo manipula el DOM y notifica al controlador mediante callbacks. */
export class MovimientoView {
  private readonly form = this.el<HTMLFormElement>('form-movimiento');
  private readonly monto = this.el<HTMLInputElement>('monto');
  private readonly categoria = this.el<HTMLSelectElement>('categoria');
  private readonly descripcion = this.el<HTMLInputElement>('descripcion');
  private readonly fecha = this.el<HTMLInputElement>('fecha');
  private readonly btnGuardar = this.el<HTMLButtonElement>('btn-guardar');
  private readonly btnCancelar = this.el<HTMLButtonElement>('btn-cancelar');
  private readonly formTitulo = this.el<HTMLElement>('form-titulo');
  private readonly tbody = this.el<HTMLTableSectionElement>('lista-movimientos');
  private readonly vacio = this.el<HTMLElement>('vacio');
  private readonly contador = this.el<HTMLElement>('contador');
  private readonly fBusqueda = this.el<HTMLInputElement>('filtro-busqueda');
  private readonly fTipo = this.el<HTMLSelectElement>('filtro-tipo');
  private readonly fCategoria = this.el<HTMLSelectElement>('filtro-categoria');
  private readonly dialogo = this.el<HTMLDialogElement>('dlg-confirmar');

  constructor() {
    const cats = CATEGORIAS.map((c): [string, string] => [c, c]);
    this.llenarSelect(this.categoria, [['', 'Selecciona…'], ...cats]);
    this.llenarSelect(this.fCategoria, [['', 'Todas las categorías'], ...cats]);
    this.resetearFormulario();
  }

  // ---------- Enlace de eventos (los maneja el controlador) ----------

  alEnviar(cb: (datos: MovimientoDatos) => void): void {
    this.form.addEventListener('submit', (e) => { e.preventDefault(); cb(this.leerFormulario()); });
  }

  alCancelarEdicion(cb: () => void): void {
    this.btnCancelar.addEventListener('click', cb);
  }

  alCambiarFiltros(cb: (f: Filtros) => void): void {
    const emitir = () => cb(this.leerFiltros());
    this.fBusqueda.addEventListener('input', emitir);
    this.fTipo.addEventListener('change', emitir);
    this.fCategoria.addEventListener('change', emitir);
  }

  /** Delegación de eventos: un solo listener para editar/eliminar en toda la tabla. */
  alAccionarFila(cb: (accion: 'editar' | 'eliminar', id: string) => void): void {
    this.tbody.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-accion]');
      if (!btn?.dataset.id) return;
      cb(btn.dataset.accion as 'editar' | 'eliminar', btn.dataset.id);
    });
  }

  // ---------- Formulario ----------

  private leerFormulario(): MovimientoDatos {
    const tipo = this.form.querySelector<HTMLInputElement>('input[name="tipo"]:checked')?.value;
    return {
      tipo: tipo as TipoMovimiento,
      monto: this.monto.value === '' ? NaN : Number(this.monto.value),
      categoria: this.categoria.value,
      descripcion: this.descripcion.value.trim(),
      fecha: this.fecha.value,
    };
  }

  mostrarErrores(errores: ErroresValidacion): void {
    this.form.querySelectorAll<HTMLElement>('[data-error]').forEach((s) => {
      const campo = s.dataset.error as keyof ErroresValidacion;
      const mensaje = errores[campo] ?? '';
      s.textContent = mensaje;
      const input = s.previousElementSibling as HTMLElement | null;
      if (mensaje) input?.setAttribute('aria-invalid', 'true');
      else input?.removeAttribute('aria-invalid');
    });
    this.form.querySelector<HTMLElement>('[aria-invalid]')?.focus();
  }

  cargarEnFormulario(m: Movimiento): void {
    this.mostrarErrores({});
    this.form.querySelector<HTMLInputElement>(`input[name="tipo"][value="${m.tipo}"]`)!.checked = true;
    this.monto.value = String(m.monto);
    this.categoria.value = m.categoria;
    this.descripcion.value = m.descripcion;
    this.fecha.value = m.fecha;
    this.formTitulo.textContent = 'Editar movimiento';
    this.btnGuardar.textContent = 'Guardar cambios';
    this.btnCancelar.hidden = false;
    this.monto.focus();
    this.form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  resetearFormulario(): void {
    this.form.reset();
    this.fecha.value = Movimiento.hoy();
    this.fecha.max = Movimiento.hoy();
    this.mostrarErrores({});
    this.formTitulo.textContent = 'Nuevo movimiento';
    this.btnGuardar.textContent = 'Agregar movimiento';
    this.btnCancelar.hidden = true;
  }

  // ---------- Filtros ----------

  private leerFiltros(): Filtros {
    return {
      tipo: this.fTipo.value as Filtros['tipo'],
      categoria: this.fCategoria.value,
      busqueda: this.fBusqueda.value.trim().toLowerCase(),
    };
  }

  // ---------- Resumen y lista ----------

  renderizarResumen(r: Resumen): void {
    this.el('resumen-ingresos').textContent = moneda.format(r.ingresos);
    this.el('resumen-gastos').textContent = moneda.format(r.gastos);
    const balance = this.el('resumen-balance');
    balance.textContent = moneda.format(r.balance);
    balance.classList.toggle('es-gasto', r.balance < 0);
  }

  renderizarLista(movimientos: Movimiento[], total: number, hayFiltros: boolean): void {
    this.tbody.replaceChildren(...movimientos.map((m) => this.crearFila(m)));
    this.contador.textContent = total ? `(${movimientos.length} de ${total})` : '';
    this.vacio.hidden = movimientos.length > 0;
    this.vacio.textContent = total === 0
      ? 'Aún no hay movimientos. Registra el primero en el formulario.'
      : hayFiltros ? 'Ningún movimiento coincide con los filtros.' : '';
  }

  private crearFila(m: Movimiento): HTMLTableRowElement {
    const tr = document.createElement('tr');
    const celda = (texto: string, clase?: string) => {
      const td = document.createElement('td');
      td.textContent = texto;
      if (clase) td.className = clase;
      tr.append(td);
      return td;
    };
    celda(fechaCorta.format(new Date(`${m.fecha}T00:00:00`)), 'fecha');
    celda(m.descripcion || '—', 'detalle');
    const cat = celda('', 'categoria');
    const chip = document.createElement('span');
    chip.className = `chip chip--${m.tipo}`;
    chip.textContent = m.categoria;
    cat.append(chip);
    celda(`${m.tipo === 'ingreso' ? '+' : '−'}${moneda.format(m.monto)}`, `num es-${m.tipo}`);

    const acciones = document.createElement('td');
    acciones.className = 'fila-acciones';
    for (const [accion, texto] of [['editar', 'Editar'], ['eliminar', 'Eliminar']] as const) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `btn btn--mini${accion === 'eliminar' ? ' btn--mini-peligro' : ''}`;
      b.dataset.accion = accion;
      b.dataset.id = m.id;
      b.textContent = texto;
      b.setAttribute('aria-label', `${texto} movimiento: ${m.descripcion || m.categoria}`);
      acciones.append(b);
    }
    tr.append(acciones);
    return tr;
  }

  // ---------- Confirmación ----------

  confirmarEliminacion(mensaje: string): Promise<boolean> {
    this.el('dlg-mensaje').textContent = mensaje;
    return new Promise((resolver) => {
      this.dialogo.addEventListener('close', () => resolver(this.dialogo.returnValue === 'ok'), { once: true });
      this.dialogo.showModal();
    });
  }

  // ---------- Utilidades ----------

  private llenarSelect(select: HTMLSelectElement, opciones: [string, string][]): void {
    select.replaceChildren(...opciones.map(([valor, texto]) => new Option(texto, valor)));
  }

  private el<T extends HTMLElement = HTMLElement>(id: string): T {
    const nodo = document.getElementById(id);
    if (!nodo) throw new Error(`No se encontró el elemento #${id}`);
    return nodo as T;
  }
}
