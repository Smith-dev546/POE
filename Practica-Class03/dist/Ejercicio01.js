"use strict";
//Registro de Asistencia a Eventos
Object.defineProperty(exports, "__esModule", { value: true });
// Asistente con datos completos
const asistenteCompleto = {
    nombre: "Pepito Fuentes",
    carrera: "Ingeniería de Software",
    email: "Pepito@kapo.com",
    asiento: 20
};
// Asistente sin los datos opcionales
const asistenteLimitado = {
    nombre: "Santos Fuentes",
    carrera: "Licenciatura en Derecho"
};
// 3. Función con condicionales para imprimir de forma limpia
function mostrarAsistente(asistente) {
    console.log(`=== Registro de Asistente ===`);
    console.log(`Nombre: ${asistente.nombre}`);
    console.log(`Carrera: ${asistente.carrera}`);
    // Condicional para el correo electrónico
    if (asistente.email) {
        console.log(`Correo: ${asistente.email}`);
    }
    else {
        console.log(`Correo: No proporcionado`);
    }
    // Condicional para el asiento (evaluación segura por si el asiento es 0)
    if (asistente.asiento !== undefined) {
        console.log(`Asiento Asignado: ${asistente.asiento}`);
    }
    else {
        console.log(`Asiento Asignado: Por asignar`);
    }
    console.log(`-----------------------------\n`);
}
// 4. Ejecución del código
mostrarAsistente(asistenteCompleto);
mostrarAsistente(asistenteLimitado);
//# sourceMappingURL=Ejercicio01.js.map