//Registro de Asistencia a Eventos

/*
Crea un molde para registrar a los asistentes de un seminario de la universidad. El nombre y la
carrera son obligatorios, pero el correo electrónico y el número de asiento asignado son opcionales. Crea dos
asistentes (uno con datos completos y otro sin los opcionales) y usa condicionales para imprimirlos de forma
limpia.
*/

interface Asistente {
  nombre: string;
  carrera: string;
  email?: string;
  asiento?: number;
}

// Asistente con datos completos
const asistenteCompleto: Asistente = {
  nombre: "Pepito Fuentes",
  carrera: "Ingeniería de Software",
  email: "Pepito@kapo.com",
  asiento: 20
};

// Asistente sin los datos opcionales
const asistenteLimitado: Asistente = {
  nombre: "Santos Fuentes",
  carrera: "Licenciatura en Derecho"
};

// 3. Función con condicionales para imprimir de forma limpia
function mostrarAsistente(asistente: Asistente): void {
  console.log(`=== Registro de Asistente ===`);
  console.log(`Nombre: ${asistente.nombre}`);
  console.log(`Carrera: ${asistente.carrera}`);
  
  // Condicional para el correo electrónico
  if (asistente.email) {
    console.log(`Correo: ${asistente.email}`);
  } else {
    console.log(`Correo: No proporcionado`);
  }
  
  // Condicional para el asiento (evaluación segura por si el asiento es 0)
  if (asistente.asiento !== undefined) {
    console.log(`Asiento Asignado: ${asistente.asiento}`);
  } else {
    console.log(`Asiento Asignado: Por asignar`);
  }
  console.log(`-----------------------------\n`);
}

// 4. Ejecución del código
mostrarAsistente(asistenteCompleto);
mostrarAsistente(asistenteLimitado);