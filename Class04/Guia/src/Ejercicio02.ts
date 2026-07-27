//Ejercicio 2
//Enunciado: Usando el mismo arreglo de productos, usa .filter() para crear un nuevo arreglo con los productos que
//cuesten más de $50.

// Datos de entrada
const productos = [
  { nombre: "Laptop", precio: 800 },
  { nombre: "Mouse", precio: 25 },
  { nombre: "Monitor", precio: 200 },
  { nombre: "USB", precio: 15 }
];

const productosAltos = productos.filter(producto => producto.precio > 50);

console.log("Los productos con precios mayor a $50 son:", productosAltos)

// TODO: Usar .filter() para productos > $50
// Resultado esperado: Laptop (800), Monitor (200)