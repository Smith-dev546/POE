
// IMPLEMENTACIÓN INTERNA DE EVENTEMITTER 

class EventEmitter {
    private oyentes: { [evento: string]: Function[] } = {};

    on(evento: string, callback: Function): void {
        if (!this.oyentes[evento]) {
            this.oyentes[evento] = [];
        }
        this.oyentes[evento].push(callback);
    }

    emit(evento: string, ...args: any[]): void {
        if (this.oyentes[evento]) {
            this.oyentes[evento].forEach(callback => callback(...args));
        }
    }
}

// PARTE 1: INTERFACES Y MODELOS

interface Libro {
    id: number;
    titulo: string;
    autor: string;
    categoria: CategoriaLibro;
    anio: number;
    disponible: boolean;
    ejemplares: number;
    esFavorito: boolean;
}

type CategoriaLibro = "CIENCIA" | "LITERATURA" | "HISTORIA" | "TECNOLOGIA" | "ARTE";


// PARTE 2: CLASE EMISORA DE EVENTOS
class Biblioteca extends EventEmitter {
    private libros: Libro[] = [];
    private _idCounter: number = 1;

    agregarLibro(libroData: Omit<Libro, 'id' | 'disponible' | 'esFavorito'>): void {
        const nuevoLibro: Libro = {
            ...libroData,
            id: this._idCounter++,
            disponible: libroData.ejemplares > 0,
            esFavorito: false
        };
        this.libros.push(nuevoLibro);
        this.emit("libroAgregado", nuevoLibro);
    }

    solicitarPrestamo(id: number): void {
        const libro = this.libros.find(l => l.id === id);
        if (!libro) return;

        if (libro.disponible && libro.ejemplares > 0) {
            libro.ejemplares--;
            if (libro.ejemplares === 0) {
                libro.disponible = false;
            }
            this.emit("prestamoExitoso", libro);
        } else {
            this.emit("noDisponible", libro);
        }
    }

    devolverLibro(id: number): void {
        const libro = this.libros.find(l => l.id === id);
        if (!libro) return;

        libro.ejemplares++;
        libro.disponible = true;
        this.emit("devolucionExitosa", libro);
    }

    
    obtenerTodos(): Libro[] {
        return this.libros;
    }

    conmutarFavorito(id: number): void {
        const libro = this.libros.find(l => l.id === id);
        if (libro) {
            libro.esFavorito = !libro.esFavorito;
            
            this.emit("libroAgregado", libro); 
        }
    }
}

// PARTE 3: CLASES OYENTES 


class NotificadorBiblioteca {
    notificarNuevoLibro(libro: Libro): void {
        gestorUI.mostrarMensaje(`[NUEVO] "${libro.titulo}" ha sido catalogado exitosamente.`, 'info');
    }
    notificarPrestamo(libro: Libro): void {
        gestorUI.mostrarMensaje(`[PRÉSTAMO] Un ejemplar de "${libro.titulo}" fue retirado. Quedan: ${libro.ejemplares}`, 'exito');
    }
    notificarNoDisponible(libro: Libro): void {
        gestorUI.mostrarMensaje(`[ERROR] Sin stock: "${libro.titulo}" no posee ejemplares libres.`, 'error');
    }
    notificarDevolucion(libro: Libro): void {
        gestorUI.mostrarMensaje(`[DEVOLUCIÓN] Un ejemplar de "${libro.titulo}" regresó. Total: ${libro.ejemplares}`, 'info');
    }
}

// Oyente encargado de manipular directamente las vistas del DOM
class GestorUIBiblioteca {
    renderizarLibros(libros: Libro[]): void {
        DOM.contenedorLibros.querySelectorAll('.libro-card').forEach(card => card.remove());

        // Filtrado previo según los controles activos del estado de la aplicación
        let librosFiltrados = [...libros];

        if (filtroActual === 'favoritos') {
            librosFiltrados = librosFiltrados.filter(l => l.esFavorito);
        } else if (filtroActual === 'disponibles') {
            librosFiltrados = librosFiltrados.filter(l => l.disponible);
        } else if (filtroActual !== 'todos') {
            librosFiltrados = librosFiltrados.filter(l => l.categoria === filtroActual);
        }

        // Aplicación de ordenación alfabética 
        if (ordenActual === 'titulo') {
            librosFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
        } else if (ordenActual === 'autor') {
            librosFiltrados.sort((a, b) => a.autor.localeCompare(b.autor));
        }

       
        this.actualizarContador(libros);

        if (librosFiltrados.length === 0) {
            DOM.emptyState.classList.remove('hidden');
            return;
        }
        DOM.emptyState.classList.add('hidden');

        // Construcción dinámica de tarjetas HTML 
        librosFiltrados.forEach(libro => {
            const card = document.createElement('div');
            card.className = 'libro-card';
            
            card.innerHTML = `
                <button class="btn-favorito ${libro.esFavorito ? 'activo' : ''}" data-id="${libro.id}">★</button>
                <span class="categoria-tag tag-${libro.categoria}">${libro.categoria}</span>
                <h4>${libro.titulo}</h4>
                <p class="autor">Por: ${libro.autor}</p>
                <div class="detalles">
                    <span>Año: ${libro.anio}</span>
                    <span class="status ${libro.disponible ? 'status-disponible' : 'status-agotado'}">
                        ${libro.disponible ? `Disponible (${libro.ejemplares})` : 'Agotado'}
                    </span>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary btn-prestar" data-id="${libro.id}" ${!libro.disponible ? 'disabled' : ''}>Prestar</button>
                    <button class="btn btn-secondary btn-devolver" data-id="${libro.id}">Devolver</button>
                </div>
            `;
            DOM.contenedorLibros.appendChild(card);
        });
    }

    actualizarContador(libros: Libro[]): void {
        DOM.contadorTotal.textContent = libros.length.toString();
        const disponibles = libros.filter(l => l.disponible).length;
        DOM.contadorDisponibles.textContent = disponibles.toString();
    }

    mostrarMensaje(mensaje: string, tipo: 'exito' | 'error' | 'info'): void {
        // Remover placeholder por defecto 
        const placeholder = DOM.areaMensajes.querySelector('.msg-placeholder');
        if (placeholder) placeholder.remove();

        const p = document.createElement('p');
        p.className = `msg-${tipo}`;
        p.textContent = `> ${mensaje}`;
        DOM.areaMensajes.appendChild(p);
        
        
        DOM.areaMensajes.scrollTop = DOM.areaMensajes.scrollHeight;
    }
}

// REFERENCIAS UNIFICADAS A LOS ELEMENTOS DEL DOM
const DOM = {
    // Campos del Formulario
    formLibro: document.getElementById('formLibro') as HTMLFormElement,
    txtTitulo: document.getElementById('txtTitulo') as HTMLInputElement,
    txtAutor: document.getElementById('txtAutor') as HTMLInputElement,
    selectCategoria: document.getElementById('selectCategoria') as HTMLSelectElement,
    numAnio: document.getElementById('numAnio') as HTMLInputElement,
    numEjemplares: document.getElementById('numEjemplares') as HTMLInputElement,
    btnLimpiar: document.getElementById('btnLimpiar') as HTMLButtonElement,

    // Notificaciones e Interfaz
    areaMensajes: document.getElementById('areaMensajes') as HTMLElement,
    contadorTotal: document.getElementById('contadorTotal') as HTMLElement,
    contadorDisponibles: document.getElementById('contadorDisponibles') as HTMLElement,
    
    // Filtros e Inyección de HTML
    filtroCategoria: document.getElementById('filtroCategoria') as HTMLSelectElement,
    btnOrdenarTitulo: document.getElementById('btnOrdenarTitulo') as HTMLButtonElement,
    btnOrdenarAutor: document.getElementById('btnOrdenarAutor') as HTMLButtonElement,
    contenedorLibros: document.getElementById('contenedorLibros') as HTMLElement,
    emptyState: document.getElementById('emptyState') as HTMLElement
};

// ESTADO GLOBAL DE LA APLICACIÓN 
let filtroActual: string = 'todos';
let ordenActual: 'ninguno' | 'titulo' | 'autor' = 'ninguno';


// PARTE 4: INSTANCIAS Y REGISTRO DE SUSCRIPCIONES 
const biblioteca = new Biblioteca();
const notificador = new NotificadorBiblioteca();
const gestorUI = new GestorUIBiblioteca();

// Registro cruzado de eventos hacia múltiples oyentes simultáneos
biblioteca.on("libroAgregado", (libro: Libro) => {
    notificador.notificarNuevoLibro(libro);
    gestorUI.renderizarLibros(biblioteca.obtenerTodos());
});

biblioteca.on("prestamoExitoso", (libro: Libro) => {
    notificador.notificarPrestamo(libro);gestorUI.renderizarLibros(biblioteca.obtenerTodos());});

biblioteca.on("noDisponible", (libro: Libro) => {
    notificador.notificarNoDisponible(libro);
    gestorUI.renderizarLibros(biblioteca.obtenerTodos());});
    
    biblioteca.on("devolucionExitosa", (libro: Libro) => {notificador.notificarDevolucion(libro);
    gestorUI.renderizarLibros(biblioteca.obtenerTodos());}); 
    
    //PARTE 5: CONTROLADORES DE EVENTOS DEL DOM
    
DOM.formLibro.addEventListener('submit', (e) => {e.preventDefault();
    const titulo = DOM.txtTitulo.value.trim();
    const autor = DOM.txtAutor.value.trim();
    const categoria = DOM.selectCategoria.value as CategoriaLibro;
    const anio = parseInt(DOM.numAnio.value);
    const ejemplares = parseInt(DOM.numEjemplares.value);
    
    // Validación defensiva básica de datos vacíos o inconsistentes
    
    if (!titulo || !autor || !categoria || isNaN(anio) || isNaN(ejemplares)) {gestorUI.mostrarMensaje("Por favor, rellene todos los campos obligatorios del formulario.", "error");
        return;
    }
    // Invocación delegada a la clase emisora
    biblioteca.agregarLibro({ titulo, autor, categoria, anio, ejemplares });
    
    DOM.formLibro.reset();});
    
    // Botón Limpiar
    DOM.btnLimpiar.addEventListener('click', () => {DOM.formLibro.reset();});
    // Escuchas reactivos para la barra de Filtros y Clasificación
    DOM.filtroCategoria.addEventListener('change', () => {
        filtroActual = DOM.filtroCategoria.value;
        gestorUI.renderizarLibros(biblioteca.obtenerTodos());});
        
        DOM.btnOrdenarTitulo.addEventListener('click', () => {ordenActual = 'titulo';gestorUI.renderizarLibros(biblioteca.obtenerTodos());});

        DOM.btnOrdenarAutor.addEventListener('click', () => {ordenActual = 'autor';gestorUI.renderizarLibros(biblioteca.obtenerTodos());});

        DOM.contenedorLibros.addEventListener('click', (e) => {
            const objetivo = e.target as HTMLElement;
            const boton = objetivo.closest('button');
            if (!boton) return;

            const id = Number(boton.dataset.id);
            if (boton.classList.contains('btn-favorito')) {
                biblioteca.conmutarFavorito(id);
            } else if (boton.classList.contains('btn-prestar')) {
                biblioteca.solicitarPrestamo(id);
            } else if (boton.classList.contains('btn-devolver')) {
                biblioteca.devolverLibro(id);
            }
        });