//El Carrito de Compras

/*
Crea una lista de productos de tecnología. Cada producto tiene un nombre y un precio, pero el descuento es
opcional. Recorre la lista con un bucle forEach y calcula el precio final que pagará el usuario usando un operador
ternario.
*/

interface Producto {
  nombre: string;
  precio: number;
  descuento?: number;
}

//Creación de la lista de productos de tecnología
const carrito: Producto[] = [
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
