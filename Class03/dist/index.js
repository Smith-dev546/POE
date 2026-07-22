"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Mostrar mensaje
console.log("Holiwis");
//Condicionales con operador ternario
let edad = 25;
let resultado = (edad >= 18) ? "Es mayor de edad" : "Es menor de edad";
console.log(resultado);
//Array => Lista de datos
let materias = ["POE", "Servidores", "Estructura de Datos", "Mate"];
console.log(materias);
//Mostrar elementos del array por elementos por uno. forEach() => Sirve para recorrer un arreglo
materias.forEach((materia) => {
    console.log(`La materia es: ${materia}`);
});
//Mostrar los datos del array separados por "," sin mostrar todo el array
console.log(`Las materias de este Array son: ${materias.join(", ")}`);
//Funciones
//FUncion para sumar
function sumar(a, b) {
    return a + b;
}
console.log(`La Suma es: ${sumar(5, 8)}`);
//Funcion para restar
function restar(a, b) {
    return a - b;
}
console.log(`La resta es: ${restar(10, 5)}`);
//Funcion para multiplicar
function multiplicar(a, b) {
    return a * b;
}
console.log(`La Multiplicacion es: ${multiplicar(5, 5)}`);
//Funcion para dividir
function dividir(a, b) {
    return a / b;
}
console.log(`La division es: ${sumar(10, 5)}`);
let NAlumno = {
    nombre: "Pepito Fuentes",
    edad: 20,
    activo: true
};
console.log(NAlumno);
//Mostar las cosas por separdo
console.log(`El nombre del estudiante es: ${NAlumno.nombre}`);
console.log(`La edad del estudiante es: ${NAlumno.edad}`);
console.log(`El status del estudiante es: ${NAlumno.activo}`);
let OAlumno = {
    nombre: "Pepito Fuentes",
    edad: 20,
    activo: true,
    telefono: 1234567
};
console.log(`El nombre del estudiante es: ${OAlumno.nombre}`);
console.log(`La edad del estudiante es: ${OAlumno.edad}`);
console.log(`El status del estudiante es: ${OAlumno.activo}`);
console.log(`El telefono del estudiante es: ${OAlumno.telefono}`);
//# sourceMappingURL=index.js.map