//Buscar elementos o componentes de HTML
const boton = document.getElementById("btnAgregar") as HTMLButtonElement;
const cajaTexto = document.getElementById("txtNombre") as HTMLInputElement;
const etiqueta = document.getElementById("lblEstado") as HTMLHeadingElement;
const lista = document.getElementById("lista") as HTMLUListElement;

//Registro de los eventos
boton.addEventListener("click", AgregarNombre);

function AgregarNombre():void{
    //Verificar si hay un nombre
    if(cajaTexto.value.trim()==="") {
        alert("Debe de escribir un nombre");
        return;
    }
    //Cambiar estado de etiqueta
    etiqueta.textContent = "Ultimo Registro: "+cajaTexto.value

    //Crear nuevo elemento para la lista
    const elemento = document.createElement("li");

    //Agregar texto a los elementos
    elemento.textContent = cajaTexto.value;

    //Insertar elementos a la lsita
    lista.appendChild(elemento);

    //Limpiar el texto
    cajaTexto.value = "";

    //Colocar nuevamente el cursor en la caja de texto
    cajaTexto.focus();
}