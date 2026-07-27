//Ejercicio 1

//Enunciado: Dado un arreglo de productos con nombre y precio, usa .map() para crear un nuevo arreglo que incluya
//un descuento del 10% a cada precio.

// Datos de entrada
const productos = [
  { nombre: "Laptop", precio: 800 },
  { nombre: "Mouse", precio: 25 },
  { nombre: "Teclado", precio: 60 }
];

const resultado = productos.map(producto => {
  const desc = producto.precio * 0.10; 
  
  return {
    nombre: producto.nombre,
    precio: producto.precio - desc, 
    Descuento: desc 
  };
});

console.log(resultado)