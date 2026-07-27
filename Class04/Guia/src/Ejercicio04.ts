//Ejercicio 4

//Enunciado: Define un enum llamado EstadoUsuario con los valores: ACTIVO, INACTIVO, SUSPENDIDO. Luego crea una 
//variable que use este enum.

enum EstadoUsuario {
  ACTIVO = "ACTIVO",
  INACTIVO = "INACTIVO",
  SUSPENDIDO = "SUSPENDIDO"
}

const usuarioEstado: EstadoUsuario = EstadoUsuario.ACTIVO;

console.log(`El estado actual del usuario es: ${usuarioEstado}`);

// TODO: Definir enum EstadoUsuario
// TODO: Crear variable con estado ACTIVO