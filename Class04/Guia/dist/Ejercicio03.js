"use strict";
//Ejercicio 3
Object.defineProperty(exports, "__esModule", { value: true });
//Enunciado: Dado un objeto que representa un evento, usa desestructuración para extraer sus propiedades en
//variables individuales.
// Objeto de evento
const evento = {
    tipo: "CLICK",
    coordenadas: { x: 100, y: 200 },
    usuario: "Ana"
};
const { tipo, coordenadas, usuario } = evento;
console.log(`El tipo es: ${tipo}.`, "Las coordenadas son: ", coordenadas, `. Usuario: ${usuario}`);
// TODO: Desestructurar en: tipo, x, y, usuario
//# sourceMappingURL=Ejercicio03.js.map