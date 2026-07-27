"use strict";
// //Lista de precios para ser modificados con .map y .filter
// let PrecioBase: number[] = [100, 200, 250, 80, 550];
Object.defineProperty(exports, "__esModule", { value: true });
let Desarrollador = {
    username: "PepitoDev",
    rol: "Backend",
    experiencia: 2
};
//Forma tradicional
// let nombre = Desarrollador.username;
// let rol = Desarrollador.rol;
// console.log(`Nombre: ${nombre}, Rol: ${rol}`);
const { username, rol } = Desarrollador;
console.log(`Nombre: ${username}, Rol: ${rol}`);
let coord = [146.45, -87.56];
const [latitud, longitud] = coord;
console.log(`La latitud es: ${latitud}, Longitud: ${longitud}`);
//# sourceMappingURL=index.js.map