"use strict";
/**
 * ================================================================
 * SPIDER-VERSE: REGISTRO DE HÉROES
 * Sistema de reclutamiento multiversal
 * ================================================================
 *
 * Este script maneja el registro de héroes del Spider-Verse,
 * permitiendo agregar, listar y eliminar reclutas del multiverso.
 * ================================================================
 */
// ================================================================
// PASO 2: REFERENCIAS A LOS ELEMENTOS DEL DOM
// ================================================================
// Explicar: en vez de escribir document.getElementById(...) una y otra
// vez por todo el archivo, lo hacemos UNA sola vez aquí y lo guardamos
// en un objeto llamado DOM. Así, si el HTML cambia, solo tocamos este bloque.
const DOM = {
    // Input donde se escribe el nombre del héroe
    txtNombre: document.getElementById('txtNombre'),
    // Select para elegir el universo de origen
    selectUniverso: document.getElementById('selectCarrera'),
    // Botón para reclutar un nuevo héroe
    btnAgregar: document.getElementById('btnAgregar'),
    // Botón para limpiar los campos del formulario
    btnLimpiar: document.getElementById('btnLimpiar'),
    // Contenedor (grid) donde se muestran las tarjetas de héroes
    listaHeroes: document.getElementById('listaEstudiantes'),
    // Párrafo que muestra el estado actual del sistema
    estado: document.getElementById('estado'),
    // Número que muestra cuántos héroes hay reclutados
    contadorHeroes: document.getElementById('contadorHeroes'),
    // Bloque que se muestra solo cuando NO hay héroes reclutados
    emptyState: document.getElementById('emptyState'),
    // Texto del footer que muestra el último universo reclutado
    dimensionFooter: document.getElementById('dimensionFooter'),
    filtroUniverso: document.getElementById('filtroUniverso'),
    btnOrdenar: document.getElementById('btnOrdenar')
};
// ================================================================
// PASO 3: ESTADO GLOBAL DE LA APLICACIÓN
// ================================================================
// Explicar: estas dos variables representan "la memoria" del programa.
// heroes guarda la lista completa; idCounter genera un id distinto
// para cada héroe nuevo (nunca se repite, siempre sube).
let heroes = []; // Arreglo con todos los héroes reclutados
let idCounter = 1; // Contador para asignar IDs únicos
const MAX_HEROES = 6; // Límite máximo de héroes
let filtroActual = 'todos'; // Guarda el filtro seleccionado
let ordenAlfabetico = false; // Indica si está ordenado
// ================================================================
// PASO 4: ACTUALIZAR EL CONTADOR EN PANTALLA
// ================================================================
// Explicar: esta función NO agrega ni elimina nada, solo actualiza
// lo que se VE en pantalla según el estado actual del arreglo "heroes".
function actualizarContador() {
    const total = heroes.length;
    DOM.contadorHeroes.textContent = total.toString();
    // Si hay al menos un héroe, mostramos su universo en el footer
    if (heroes.length > 0) {
        const ultimoHeroe = heroes[heroes.length - 1];
        //Verificamos que el heroe existe antes de acceder
        if (ultimoHeroe) {
            DOM.dimensionFooter.textContent = ultimoHeroe.universo;
        }
    }
}
// ================================================================
// PASO 5: ACTUALIZAR EL MENSAJE DE ESTADO
// ================================================================
// Explicar: el parámetro "mensaje?" es OPCIONAL (el "?" lo indica).
// Si se lo pasamos, mostramos ese mensaje específico.
// Si NO se lo pasamos, calculamos un mensaje genérico según cuántos
// héroes hay en total.
// ================================================================
// PASO 5: ACTUALIZAR EL MENSAJE DE ESTADO
// ================================================================
// Explicar: el parámetro "mensaje?" es OPCIONAL (el "?" lo indica).
// Si se lo pasamos, mostramos ese mensaje específico.
// Si NO se lo pasamos, calculamos un mensaje genérico según cuántos
// héroes hay en total.
function actualizarEstado(mensaje) {
    // Log del arreglo heroes completo para seguimiento
    console.log(' Estado actual del Spider-Verse:');
    console.log('Héroes:', heroes);
    console.log('Total:', heroes.length);
    // Si hay un mensaje específico, lo mostramos
    if (mensaje) {
        DOM.estado.textContent = mensaje;
        // Si el mensaje contiene "Error", lo mostramos en rojo
        if (mensaje.includes('Error') || mensaje.includes('❌')) {
            DOM.estado.style.color = '#E62429';
            DOM.estado.style.fontWeight = '700';
        }
        else {
            DOM.estado.style.color = 'rgba(255, 255, 255, 0.6)';
            DOM.estado.style.fontWeight = '400';
        }
        return;
    }
    // Si no hay mensaje, calculamos el estado automático
    const total = heroes.length;
    if (total === 0) {
        DOM.estado.textContent = 'Estado: Esperando reclutas del multiverso...';
    }
    else {
        // Usamos un operador ternario para agregar la "s" de plural
        const plural = total > 1 ? 's' : '';
        DOM.estado.textContent = `Estado: ${total} héroe${plural} reclutado${plural} en el Spider-Verse`;
    }
    // Restauramos el color por defecto
    DOM.estado.style.color = 'rgba(255, 255, 255, 0.6)';
    DOM.estado.style.fontWeight = '400';
}
// ================================================================
// PASO 6: MOSTRAR U OCULTAR EL "ESTADO VACÍO"
// ================================================================
// Explicar: classList.add/remove permite agregar o quitar una clase
// CSS desde TypeScript. La clase "hidden" (definida en el CSS) es la
// que hace que el bloque desaparezca.
function toggleEmptyState() {
    if (heroes.length === 0) {
        DOM.emptyState.classList.remove('hidden');
    }
    else {
        DOM.emptyState.classList.add('hidden');
    }
}
// ================================================================
// PASO 7: RENDERIZAR (DIBUJAR) LA LISTA DE HÉROES
// ================================================================
// Explicar: "renderizar" significa tomar los datos (el arreglo heroes)
// y convertirlos en HTML real dentro de la página. Esta función se
// vuelve a llamar CADA VEZ que el arreglo heroes cambia.
// ================================================================
// PASO 7: RENDERIZAR (DIBUJAR) LA LISTA DE HÉROES
// ================================================================
// ================================================================
// PASO 7: RENDERIZAR (DIBUJAR) LA LISTA DE HÉROES
// ================================================================
function renderizarHeroes() {
    const filtro = DOM.filtroUniverso.value;
    //  FILTRAR PRIMERO
    let heroesFiltrados = [];
    switch (filtro) {
        case 'todos':
            heroesFiltrados = heroes;
            break;
        case 'favoritos':
            heroesFiltrados = heroes.filter(heroe => heroe.esFavorito);
            break;
        case 'Tierra-616 (Peter Parker)':
            heroesFiltrados = heroes.filter(heroe => heroe.universo === 'Tierra-616 (Peter Parker)');
            break;
        case 'Tierra-1610 (Miles Morales)':
            heroesFiltrados = heroes.filter(heroe => heroe.universo === 'Tierra-1610 (Miles Morales)');
            break;
        case 'Tierra-65 (Gwen Stacy)':
            heroesFiltrados = heroes.filter(heroe => heroe.universo === 'Tierra-65 (Gwen Stacy)');
            break;
        default:
            heroesFiltrados = heroes;
            break;
    }
    // LOS HÉROES FILTRADOS YA ESTÁN ORDENADOS POR EL ARREGLO ORIGINAL
    if (heroesFiltrados.length === 0) {
        DOM.listaHeroes.innerHTML = '';
        toggleEmptyState();
        actualizarContador();
        actualizarEstado();
        return;
    }
    toggleEmptyState();
    DOM.listaHeroes.innerHTML = heroesFiltrados.map(heroe => `
        <div class="hero-card ${heroe.esFavorito ? 'favorito' : ''}" data-id="${heroe.id}">
            <div class="hero-info">
                <span class="hero-name">
                    ${heroe.nombre}
                    ${heroe.esFavorito ? '⭐' : ''}
                </span>
                <span class="hero-universe">
                    Origen: <span class="dimension-badge">${heroe.universo}</span>
                </span>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
                <button class="btn-favorito" data-id="${heroe.id}">
                    ${heroe.esFavorito ? '⭐ Quitar de favoritos' : '☆ Marcar como favorito'}
                </button>
                <button class="btn-eliminar" data-id="${heroe.id}">
                    Expulsar
                </button>
            </div>
        </div>
    `).join('');
    const total = heroesFiltrados.length;
    DOM.contadorHeroes.textContent = total.toString();
    // Actualizar estado
    let mensajeEstado = '';
    if (filtro === 'todos') {
        mensajeEstado = `Estado: ${total} héroe${total > 1 ? 's' : ''} reclutado${total > 1 ? 's' : ''} en el Spider-Verse`;
    }
    else if (filtro === 'favoritos') {
        mensajeEstado = `⭐ Mostrando ${total} héroe${total > 1 ? 's' : ''} favorito${total > 1 ? 's' : ''}`;
    }
    else {
        mensajeEstado = ` Mostrando ${total} héroe${total > 1 ? 's' : ''} del universo: ${filtro}`;
    }
    // Agregar información del orden si está activo
    if (ordenAlfabetico) {
        mensajeEstado += '  (Ordenado A-Z)';
    }
    DOM.estado.textContent = mensajeEstado;
    DOM.estado.style.color = 'rgba(255, 255, 255, 0.6)';
    DOM.estado.style.fontWeight = '400';
    // IMPORTANTE: los botones "Expulsar" que acabamos de crear con
    // innerHTML NO tienen todavía ningún addEventListener propio.
    // Por eso usamos DELEGACIÓN DE EVENTOS (ver setupEliminarHeroes).
}
// ================================================================
// PASO 8: DELEGACIÓN DE EVENTOS PARA LOS BOTONES "EXPULSAR"
// ================================================================
// Explicar: en vez de poner un addEventListener en CADA botón nuevo
// (que además se borran y se vuelven a crear todo el tiempo), ponemos
// UN SOLO listener en el contenedor padre (listaHeroes). Cuando se hace
// clic en cualquier parte adentro, revisamos si el clic fue sobre un
// botón "Expulsar" usando closest().
function setupEliminarHeroes() {
    DOM.listaHeroes.addEventListener('click', (event) => {
        const target = event.target;
        // Manejar clic en botón de favorito
        const btnFavorito = target.closest('.btn-favorito');
        if (btnFavorito) {
            const id = parseInt(btnFavorito.getAttribute('data-id') || '0');
            if (id > 0) {
                toggleFavorito(id);
            }
            return; // Salir para no procesar otros botones
        }
        // closest() busca hacia "arriba" en el HTML hasta encontrar
        // un elemento con la clase .btn-eliminar (o devuelve null si no hay)
        const btnEliminar = target.closest('.btn-eliminar');
        if (btnEliminar) {
            const id = parseInt(btnEliminar.getAttribute('data-id') || '0');
            if (id > 0) {
                eliminarHeroe(id);
            }
        }
    });
}
// ================================================================
// PASO 9: ELIMINAR UN HÉROE POR SU ID
// ================================================================
// Explicar: find() busca UN elemento que cumpla la condición (para
// poder mostrar su nombre en el mensaje). filter() crea un arreglo
// NUEVO con todos los héroes MENOS el que tiene ese id.
function eliminarHeroe(id) {
    const heroeEliminado = heroes.find(h => h.id === id);
    heroes = heroes.filter(heroe => heroe.id !== id);
    // GUARDAR EN LOCALSTORAGE DESPUÉS DE ELIMINAR
    guardarHeroes();
    // Si el orden alfabético estaba activo, reordenar
    if (ordenAlfabetico) {
        heroes.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    renderizarHeroes();
    actualizarBotonReclutar();
    if (heroeEliminado) {
        actualizarEstado(`${heroeEliminado.nombre} ha sido expulsado del Spider-Verse`);
    }
}
// ================================================================
// PASO 9.5: TOGGLE FAVORITO (CON classList.toggle)
// ================================================================
function toggleFavorito(id) {
    const heroe = heroes.find(h => h.id === id);
    if (heroe) {
        heroe.esFavorito = !heroe.esFavorito;
        // GUARDAR EN LOCALSTORAGE DESPUÉS DE CAMBIAR FAVORITO
        guardarHeroes();
        // Actualizar visualmente sin re-renderizar todo
        const tarjeta = document.querySelector(`.hero-card[data-id="${id}"]`);
        if (tarjeta) {
            tarjeta.classList.toggle('favorito', heroe.esFavorito);
        }
        const btnFavorito = document.querySelector(`.btn-favorito[data-id="${id}"]`);
        if (btnFavorito) {
            btnFavorito.textContent = heroe.esFavorito
                ? '⭐ Quitar de favoritos'
                : '☆ Marcar como favorito';
        }
        const heroName = document.querySelector(`.hero-card[data-id="${id}"] .hero-name`);
        if (heroName) {
            heroName.innerHTML = heroe.esFavorito
                ? `${heroe.nombre} ⭐`
                : heroe.nombre;
        }
        actualizarContador();
        const mensaje = heroe.esFavorito
            ? `⭐ ${heroe.nombre} marcado como favorito`
            : `☆ ${heroe.nombre} removido de favoritos`;
        actualizarEstado(mensaje);
        console.log(`⭐ Estado de favorito actualizado para ${heroe.nombre}: ${heroe.esFavorito}`);
        console.table(heroes);
    }
    else {
        console.error(` Héroe con ID ${id} no encontrado`);
    }
}
// ================================================================
// PASO 10: AGREGAR UN NUEVO HÉROE
// ================================================================
// Explicar: esta es la función principal del formulario. Primero VALIDA
// que el nombre no esté vacío; si está vacío, avisa y se detiene con
// "return" (no sigue ejecutando el resto de la función).
function agregarHeroe() {
    // Validación de límite máximo de héroes
    if (heroes.length >= MAX_HEROES) {
        const mensajeError = ` Error: Equipo completo. Límite máximo de ${MAX_HEROES} héroes alcanzado.`;
        actualizarEstado(mensajeError);
        console.error(mensajeError);
        console.log(` Estado actual: ${heroes.length}/${MAX_HEROES} héroes`);
        return;
    }
    let nombre = DOM.txtNombre.value.trim();
    const universo = DOM.selectUniverso.value;
    // Validación: si el campo nombre está vacío
    if (nombre === '') {
        actualizarEstado(' Ingresa un alias o nombre para el héroe');
        DOM.txtNombre.focus();
        DOM.txtNombre.style.borderColor = 'var(--spider-red)';
        setTimeout(() => {
            DOM.txtNombre.style.borderColor = '';
        }, 2000);
        return;
    }
    // Validación de límite de caracteres (máximo 20)
    const MAX_CARACTERES = 20;
    if (nombre.length > MAX_CARACTERES) {
        const nombreOriginal = nombre;
        nombre = nombre.substring(0, MAX_CARACTERES);
        console.log(` Nombre acortado: "${nombreOriginal}" → "${nombre}" (${nombreOriginal.length} → ${nombre.length} caracteres)`);
        console.log(`Límite máximo: ${MAX_CARACTERES} caracteres`);
        actualizarEstado(` El nombre "${nombreOriginal}" ha sido acortado a "${nombre}" (máximo ${MAX_CARACTERES} caracteres)`);
        DOM.txtNombre.value = nombre;
        DOM.txtNombre.style.borderColor = '#FFD700';
        setTimeout(() => {
            DOM.txtNombre.style.borderColor = '';
        }, 2000);
    }
    // Validación de nombres duplicados
    const existeHeroe = heroes.some(heroe => heroe.nombre.toLowerCase() === nombre.toLowerCase());
    if (existeHeroe) {
        const mensajeError = ` Error: "${nombre}" ya está reclutado en el Spider-Verse`;
        actualizarEstado(mensajeError);
        console.error(mensajeError);
        DOM.txtNombre.focus();
        DOM.txtNombre.style.borderColor = 'var(--spider-red)';
        setTimeout(() => {
            DOM.txtNombre.style.borderColor = '';
            actualizarEstado();
        }, 3000);
        return;
    }
    // Crear el objeto héroe
    const nuevoHeroe = {
        id: idCounter++,
        nombre: nombre,
        universo: universo,
        esFavorito: false
    };
    heroes.push(nuevoHeroe);
    // GUARDAR EN LOCALSTORAGE DESPUÉS DE AGREGAR
    guardarHeroes();
    DOM.txtNombre.value = '';
    DOM.txtNombre.focus();
    renderizarHeroes();
    actualizarEstado(`${nombre} ha sido reclutado en el Spider-Verse`);
    actualizarBotonReclutar();
    console.log(`Héroes actuales: ${heroes.length}/${MAX_HEROES}`);
}
// ================================================================
// PASO 11: LIMPIAR LOS CAMPOS DEL FORMULARIO
// ================================================================
// Explicar: esta función NO toca el arreglo heroes, solo resetea
// lo que el usuario ve en el formulario (sin agregar ni eliminar nada).
function limpiarCampos() {
    DOM.txtNombre.value = '';
    DOM.selectUniverso.selectedIndex = 0;
    DOM.txtNombre.focus();
    actualizarEstado('Campos limpiados. Listo para nuevo recluta');
}
// ================================================================
// PASO 12: INICIALIZACIÓN — CONECTAR TODOS LOS EVENTOS
// ================================================================
// Explicar: esta función es la que "arma" toda la aplicación,
// conectando cada botón/input con la función que le corresponde.
// Se ejecuta una sola vez, cuando la página termina de cargar.
function init() {
    console.log('🕷️ Iniciando sistema de reclutamiento Spider-Verse...');
    // Mensaje de bienvenida con fecha y hora
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    console.log(`Fecha y hora: ${fechaFormateada}`);
    console.log(`Preparado para reclutar héroes multiversales`);
    // CARGAR HÉROES DESDE LOCALSTORAGE AL INICIAR
    const heroesCargados = cargarHeroes();
    if (heroesCargados.length > 0) {
        heroes = heroesCargados;
        actualizarIdCounter();
        console.log(` ${heroes.length} héroes cargados desde localStorage`);
        console.table(heroes);
    }
    else {
        heroes = [];
        idCounter = 1;
        console.log('Comenzando con lista vacía');
    }
    // Event Listeners
    DOM.btnAgregar.addEventListener('click', agregarHeroe);
    DOM.btnLimpiar.addEventListener('click', limpiarCampos);
    DOM.txtNombre.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            agregarHeroe();
        }
    });
    setupEliminarHeroes();
    DOM.filtroUniverso.addEventListener('change', () => {
        console.log(` Filtro cambiado a: ${DOM.filtroUniverso.value}`);
        renderizarHeroes();
    });
    DOM.btnOrdenar.addEventListener('click', ordenarAlfabeticamente);
    // Renderizar estado inicial
    renderizarHeroes();
    actualizarEstado();
    toggleEmptyState();
    actualizarBotonReclutar();
    console.log('Sistema Spider-Verse listo para reclutar héroes multiversales');
    console.log(`${DOM.selectUniverso.options.length} universos disponibles para reclutamiento`);
}
// ================================================================
// PASO 13: PUNTO DE ENTRADA DEL PROGRAMA
// ================================================================
// Explicar: 'DOMContentLoaded' es un evento del navegador que se
// dispara cuando TODO el HTML ya terminó de cargar. Es importante
// esperar a este evento, porque si init() se ejecutara antes, los
// document.getElementById(...) del Paso 2 devolverían null
// (el HTML todavía no existiría).
document.addEventListener('DOMContentLoaded', init);
// ================================================================
// PASO 14: ACTUALIZAR ESTADO DEL BOTÓN RECLUTAR
// ================================================================
function actualizarBotonReclutar() {
    if (heroes.length >= MAX_HEROES) {
        DOM.btnAgregar.disabled = true;
        DOM.btnAgregar.textContent = `🚫 Equipo Completo (${MAX_HEROES}/${MAX_HEROES})`;
        DOM.btnAgregar.style.opacity = '0.5';
        DOM.btnAgregar.style.cursor = 'not-allowed';
    }
    else {
        DOM.btnAgregar.disabled = false;
        DOM.btnAgregar.textContent = 'Reclutar Héroe';
        DOM.btnAgregar.style.opacity = '1';
        DOM.btnAgregar.style.cursor = 'pointer';
    }
}
// ================================================================
// PASO: OBTENER HÉROES FILTRADOS (NUEVO)
// ================================================================
function obtenerHeroesFiltrados() {
    if (filtroActual === 'todos') {
        return heroes;
    }
    if (filtroActual === 'favoritos') {
        return heroes.filter(heroe => heroe.esFavorito);
    }
    // Filtrar por universo específico
    return heroes.filter(heroe => heroe.universo === filtroActual);
}
// ================================================================
// PASO: CAMBIAR FILTRO (NUEVO)
// ================================================================
function cambiarFiltro() {
    filtroActual = DOM.filtroUniverso.value;
    console.log(`Filtro cambiado a: ${filtroActual}`);
    renderizarHeroes();
}
// ================================================================
// PASO: ORDENAR ALFABÉTICAMENTE (NUEVO)
// ================================================================
function ordenarAlfabeticamente() {
    ordenAlfabetico = !ordenAlfabetico;
    if (ordenAlfabetico) {
        heroes.sort((a, b) => a.nombre.localeCompare(b.nombre));
        DOM.btnOrdenar.textContent = ' Ordenar alfabéticamente (A-Z)';
        DOM.btnOrdenar.classList.add('ordenado');
        actualizarEstado(' Héroes ordenados alfabéticamente (A-Z)');
        console.log(' Héroes ordenados alfabéticamente (A-Z)');
    }
    else {
        heroes.sort((a, b) => b.nombre.localeCompare(a.nombre));
        DOM.btnOrdenar.textContent = 'Ordenar alfabéticamente (Z-A)';
        DOM.btnOrdenar.classList.remove('ordenado');
        actualizarEstado('Héroes ordenados alfabéticamente (Z-A)');
        console.log('Héroes ordenados alfabéticamente (Z-A)');
    }
    // GUARDAR EN LOCALSTORAGE DESPUÉS DE ORDENAR
    guardarHeroes();
    console.table(heroes);
    renderizarHeroes();
}
// ================================================================
// PASO: PERSISTENCIA CON LOCALSTORAGE (NUEVO)
// ================================================================
// Clave para guardar en localStorage
const STORAGE_KEY = 'spiderverse_heroes';
// Función para guardar los héroes en localStorage
function guardarHeroes() {
    try {
        // Convertir el arreglo de héroes a JSON
        const heroesJSON = JSON.stringify(heroes);
        // Guardar en localStorage
        localStorage.setItem(STORAGE_KEY, heroesJSON);
        console.log(' Héroes guardados en localStorage');
    }
    catch (error) {
        console.error(' Error al guardar héroes:', error);
    }
}
// Función para cargar los héroes desde localStorage
function cargarHeroes() {
    try {
        // Obtener el JSON guardado
        const heroesJSON = localStorage.getItem(STORAGE_KEY);
        if (heroesJSON) {
            // Convertir JSON a arreglo de objetos
            const heroesGuardados = JSON.parse(heroesJSON);
            console.log(' Héroes cargados desde localStorage:', heroesGuardados.length);
            return heroesGuardados;
        }
        else {
            console.log('No hay datos guardados, comenzando desde cero');
            return [];
        }
    }
    catch (error) {
        console.error('Error al cargar héroes:', error);
        return [];
    }
}
// Función para actualizar el idCounter basado en los héroes cargados
function actualizarIdCounter() {
    if (heroes.length > 0) {
        // Encontrar el id más alto y sumar 1
        const maxId = Math.max(...heroes.map(h => h.id));
        idCounter = maxId + 1;
        console.log(`ID Counter actualizado a: ${idCounter}`);
    }
    else {
        idCounter = 1;
    }
}
//# sourceMappingURL=script.js.map