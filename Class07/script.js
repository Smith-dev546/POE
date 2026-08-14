//Buscar elementos o componentes de HTML
var boton = document.getElementById("btnAgregar");
var cajaTexto = document.getElementById("txtNombre");
var etiqueta = document.getElementById("lblEstado");
var lista = document.getElementById("lista");
//Registro de los eventos
boton.addEventListener("click", AgregarNombre);
function AgregarNombre() {
    //Verificar si hay un nombre
    if (cajaTexto.value.trim() === "") {
        alert("Debe de escribir un nombre");
        return;
    }
    //Cambiar estado de etiqueta
    etiqueta.textContent = "Ultimo Registro: " + cajaTexto.value;
    //Crear nuevo elemento para la lista
    var elemento = document.createElement("li");
    //Agregar texto a los elementos
    elemento.textContent = cajaTexto.value;
    //Insertar elementos a la lsita
    lista.appendChild(elemento);
    //Limpiar el texto
    cajaTexto.value = "";
    //Colocar nuevamente el cursor en la caja de texto
    cajaTexto.focus();
}
