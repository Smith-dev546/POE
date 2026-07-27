// //Lista de precios para ser modificados con .map y .filter
// let PrecioBase: number[] = [100, 200, 250, 80, 550];

// //Utilizando .map vamos a tomar cadda elemento y los vamos a modificar
// //IVA del 13% a cadaa precio base
// let PrecioConIVA: number[] = PrecioBase.map((precio) => precio * 1.13);

// console.log(`Precios Base: ${PrecioBase}`);
// console.log(`Precios con IVA: ${PrecioConIVA}`)

// //Mostrar los Precios por separado

// PrecioBase.forEach((Precio) => {
//     //console.log(`El Precio Base es: ${Precio}`)
// });

// PrecioConIVA.forEach((precio) => {
//     //console.log(`El Precio con IVa incluido es: ${precio}`)
// });

// //Mostrando ambos precios a la par

// PrecioBase.forEach((PrecioBase, index) => {
//     console.log(`EL precio base es: ${PrecioBase}, Precio con IVA: ${PrecioConIVA[index]?.toFixed(2)}`)
// });

// //Metodo Filter
// //Filtar preciuos arriba de $200 dolares

// let PreciosAltos: number[] = PrecioBase.filter((precioA) => precioA > 200);
// console.log(`Los precios altos son: $${PreciosAltos}`)



type Usuario = {
    username: string;
    rol: string;
    experiencia: number;
}

let Desarrollador : Usuario ={
    username: "PepitoDev",
    rol: "Backend",
    experiencia: 2
}

//Forma tradicional
// let nombre = Desarrollador.username;
// let rol = Desarrollador.rol;
// console.log(`Nombre: ${nombre}, Rol: ${rol}`);

const {username, rol} = Desarrollador;
console.log(`Nombre: ${username}, Rol: ${rol}`);

let coord: [number, number]= [146.45, -87.56];
const [latitud, longitud] = coord;
console.log(`La latitud es: ${latitud}, Longitud: ${longitud}`)
