"use strict";
//Ejercicio 4
Object.defineProperty(exports, "__esModule", { value: true });
//Enunciado: Define un enum llamado EstadoUsuario con los valores: ACTIVO, INACTIVO, SUSPENDIDO. Luego crea una 
//variable que use este enum.
var EstadoUsuario;
(function (EstadoUsuario) {
    EstadoUsuario["ACTIVO"] = "ACTIVO";
    EstadoUsuario["INACTIVO"] = "INACTIVO";
    EstadoUsuario["SUSPENDIDO"] = "SUSPENDIDO";
})(EstadoUsuario || (EstadoUsuario = {}));
const usuarioEstado = EstadoUsuario.ACTIVO;
console.log(`El estado actual del usuario es: ${usuarioEstado}`);
// TODO: Definir enum EstadoUsuario
// TODO: Crear variable con estado ACTIVO
//# sourceMappingURL=Ejercicio04.js.map