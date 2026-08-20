declare class EventEmitter {
    private oyentes;
    on(evento: string, callback: Function): void;
    emit(evento: string, ...args: any[]): void;
}
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
declare class Biblioteca extends EventEmitter {
    private libros;
    private _idCounter;
    agregarLibro(libroData: Omit<Libro, 'id' | 'disponible' | 'esFavorito'>): void;
    solicitarPrestamo(id: number): void;
    devolverLibro(id: number): void;
    obtenerTodos(): Libro[];
    conmutarFavorito(id: number): void;
}
declare class NotificadorBiblioteca {
    notificarNuevoLibro(libro: Libro): void;
    notificarPrestamo(libro: Libro): void;
    notificarNoDisponible(libro: Libro): void;
    notificarDevolucion(libro: Libro): void;
}
declare class GestorUIBiblioteca {
    renderizarLibros(libros: Libro[]): void;
    actualizarContador(libros: Libro[]): void;
    mostrarMensaje(mensaje: string, tipo: 'exito' | 'error' | 'info'): void;
}
declare const DOM: {
    formLibro: HTMLFormElement;
    txtTitulo: HTMLInputElement;
    txtAutor: HTMLInputElement;
    selectCategoria: HTMLSelectElement;
    numAnio: HTMLInputElement;
    numEjemplares: HTMLInputElement;
    btnLimpiar: HTMLButtonElement;
    areaMensajes: HTMLElement;
    contadorTotal: HTMLElement;
    contadorDisponibles: HTMLElement;
    filtroCategoria: HTMLSelectElement;
    btnOrdenarTitulo: HTMLButtonElement;
    btnOrdenarAutor: HTMLButtonElement;
    contenedorLibros: HTMLElement;
    emptyState: HTMLElement;
};
declare let filtroActual: string;
declare let ordenActual: 'ninguno' | 'titulo' | 'autor';
declare const biblioteca: Biblioteca;
declare const notificador: NotificadorBiblioteca;
declare const gestorUI: GestorUIBiblioteca;
//# sourceMappingURL=app.d.ts.map