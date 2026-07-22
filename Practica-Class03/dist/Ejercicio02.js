"use strict";
//El Carrito de Compras
Object.defineProperty(exports, "__esModule", { value: true });
//Creación de la lista de productos de tecnología
const carrito = [
    { nombre: "Laptop Gamer", precio: 1200, descuento: 0.10 },
    { nombre: "Mouse Inalámbrico", precio: 45 },
    { nombre: "Monitor 4K", precio: 350, descuento: 0.20 },
    { nombre: "Teclado Mecánico", precio: 80 }
];
// Variable para acumular el total general de la compra
let totalCarrito = 0;
console.log("=== DETALLE DE TU CARRITO ===");
// Recorrido con forEach y cálculo con operador ternario
carrito.forEach((producto) => {
    const descuentoAplicado = producto.descuento ? producto.precio * producto.descuento : 0;
    const precioFinal = producto.precio - descuentoAplicado;
    totalCarrito += precioFinal;
    const mensajeDescuento = producto.descuento ? `(Ahorro: $${descuentoAplicado})` : "(Sin descuento)";
    console.log(`- ${producto.nombre}: $${precioFinal.toFixed(2)} ${mensajeDescuento}`);
});
console.log("-----------------------------");
console.log(`TOTAL A PAGAR: $${totalCarrito.toFixed(2)}`);
//# sourceMappingURL=Ejercicio02.js.map