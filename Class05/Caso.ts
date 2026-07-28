// ==========================================================
// IMPORTACIÓN
// ==========================================================

// Importamos la clase EventEmitter desde el módulo "events" de Node.js.
// EventEmitter nos permite crear eventos personalizados y hacer que
// otros objetos escuchen esos eventos.
import { EventEmitter } from 'events';

// ==========================================================
// INTERFAZ
// ==========================================================

// Una interfaz NO crea objetos.
// Solo define cómo deben estar estructurados los datos.
//
// En este caso, cualquier reporte vecinal deberá contener:
//
// - ubicacion
// - tipoIncidente
// - descripcion
// - urgencia
//
interface ReporteVecinal {
  // Lugar donde ocurre el incidente
  ubicacion: string; // ej: "Calle 23 con Avenida 5"
  
  // Categoría del problema
  tipoIncidente: 'Sospechoso' | 'Emergencia' | 'Accidente' | 'Incidencia';
  
  // Detalles del reporte
  descripcion: string; // ej: "Persona sospechosa merodeando"
  
  // Nivel de prioridad
  urgencia: 'Alta' | 'Media' | 'Baja';
}

// ==========================================================
// CLASE EMISORA
// ==========================================================

// La Central Vecinal HEREDA de EventEmitter.
//
// Gracias a "extends EventEmitter"
// esta clase obtiene métodos como:
//
// emit()
// on()
// once()
// removeListener()
//
class CentralVecinal extends EventEmitter {
  
  // --------------------------------------------------------
  // Método para reportar un incidente.
  //
  // Recibe:
  // - ubicacion
  // - tipoIncidente
  // - descripcion
  // - urgencia
  //
  // Luego crea un reporte y lo envía a todos los escuchadores.
  // --------------------------------------------------------
  public reportarIncidente(
    ubicacion: string,
    tipoIncidente: ReporteVecinal['tipoIncidente'],
    descripcion: string,
    urgencia: ReporteVecinal['urgencia']
  ): void {
    
    // Mostrar un mensaje en consola.
    // Esto NO es un evento.
    // Solo informa que ocurrió un reporte.
    console.log(
      `\n📢 [CENTRAL VECINAL]: ¡Alerta vecinal! ${ubicacion} - ${tipoIncidente} - Urgencia: ${urgencia}`
    );
    
    // Crear un objeto siguiendo la interfaz ReporteVecinal.
    const detallesReporte: ReporteVecinal = {
      ubicacion,
      tipoIncidente,
      descripcion,
      urgencia
    };
    
    // =====================================================
    // EMITIR EL EVENTO
    // =====================================================
    //
    // emit(nombreEvento, datos)
    //
    // nombreEvento -> "alertaVecinal"
    //
    // datos -> detallesReporte
    //
    // Todos los objetos que estén escuchando este evento
    // recibirán automáticamente la información.
    //
    this.emit("alertaVecinal", detallesReporte);
  }
}

// ==========================================================
// PATRULLA
// ==========================================================

// Esta clase representa un escuchador.
//
// La Patrulla reacciona cuando recibe un evento.
//
class Patrulla {
  // Método movilizarEquipo
  // Si urgencia es 'Alta': Movilizando equipo completo con Spider-Man
  // Si no: Enviando patrulla de reconocimiento
  public movilizarEquipo(alerta: ReporteVecinal): void {
    if (alerta.urgencia === 'Alta') {
      console.log(
        `🕷️ [Patrulla Spider]: Movilizando equipo completo con Spider-Man`
      );
    } else {
      console.log(
        `🕷️ [Patrulla Spider]: Enviando patrulla de reconocimiento`
      );
    }
  }
}

// ==========================================================
// AMBULANCIA
// ==========================================================

// Otro escuchador.
//
// La Ambulancia SOLO responde si el incidente es
// 'Emergencia' o 'Accidente'
//
class Ambulancia {
  // Método enviarEmergencia
  // Solo responde si tipoIncidente es 'Emergencia' o 'Accidente'
  // Imprime: 'Unidad médica en camino a [ubicación]'
  public enviarEmergencia(alerta: ReporteVecinal): void {
    if (alerta.tipoIncidente === 'Emergencia' || alerta.tipoIncidente === 'Accidente') {
      console.log(
        `🚑 [Ambulancia Comunitaria]: Unidad médica en camino a ${alerta.ubicacion}`
      );
    }
  }
}

// ==========================================================
// VECINOS VIGILANTES
// ==========================================================

// Otro escuchador.
//
// Los Vecinos Vigilantes responden a TODOS los incidentes.
//
class VecinosVigilantes {
  // Método activarVigilancia
  // Responde a todas los incidentes
  // Imprime: 'Vecinos alertados en [ubicacion] - Mantener vigilancia'
  public activarVigilancia(alerta: ReporteVecinal): void {
    console.log(
      `👀 [Vecinos Vigilantes]: Vecinos alertados en ${alerta.ubicacion} - Mantener vigilancia`
    );
  }
}

// ==========================================================
// CONSEJO DEL BARRIO
// ==========================================================

// Otro escuchador.
//
// El Consejo del Barrio evalúa el incidente según la urgencia.
//
class ConsejoBarrio {
  // Método evaluarIncidente
  // Si urgencia es 'Alta' o 'Media': Convocando reunión de emergencia
  // Si no: Registrando incidente para informe mensual
  public evaluarIncidente(alerta: ReporteVecinal): void {
    if (alerta.urgencia === 'Alta' || alerta.urgencia === 'Media') {
      console.log(
        `🏛️ [Consejo del Barrio]: Convocando reunión de emergencia`
      );
    } else {
      console.log(
        `📋 [Consejo del Barrio]: Registrando incidente para informe mensual`
      );
    }
  }
}

// ==========================================================
// CREAR OBJETOS
// ==========================================================

// Crear la Central Vecinal.
const centralVecinal = new CentralVecinal();

// Crear los grupos de respuesta.
const patrulla = new Patrulla();
const ambulancia = new Ambulancia();
const vigilantes = new VecinosVigilantes();
const consejo = new ConsejoBarrio();

// ==========================================================
// SUSCRIPCIÓN AL EVENTO
// ==========================================================

// on()
// significa:
//
// "Cuando ocurra este evento,
// ejecuta esta función."
//
// Aquí la Patrulla comienza a escuchar el evento.
//
centralVecinal.on(
  // Nombre del evento que queremos escuchar.
  "alertaVecinal",
  
  // Callback.
  //
  // Esta función será ejecutada automáticamente
  // cuando ocurra el evento.
  (alerta: ReporteVecinal) => {
    // Patrulla responde.
    patrulla.movilizarEquipo(alerta);
  }
);

// ==========================================================
// SEGUNDO ESCUCHADOR - AMBULANCIA
// ==========================================================

// La Ambulancia también escucha el mismo evento.
//
centralVecinal.on(
  "alertaVecinal",
  (alerta: ReporteVecinal) => {
    ambulancia.enviarEmergencia(alerta);
  }
);

// ==========================================================
// TERCER ESCUCHADOR - VECINOS VIGILANTES
// ==========================================================

// Los Vecinos Vigilantes también escuchan.
//
centralVecinal.on(
  "alertaVecinal",
  (alerta: ReporteVecinal) => {
    vigilantes.activarVigilancia(alerta);
  }
);

// ==========================================================
// CUARTO ESCUCHADOR - CONSEJO DEL BARRIO
// ==========================================================

// El Consejo del Barrio también escucha.
//
centralVecinal.on(
  "alertaVecinal",
  (alerta: ReporteVecinal) => {
    consejo.evaluarIncidente(alerta);
  }
);

// ==========================================================
// PRUEBAS DE INTEGRACIÓN
// ==========================================================

// Instanciar la CentralVecinal y las 4 entidades (ya creadas)
// Suscribir a todos los grupos al evento 'alertaVecinal' (ya suscritos)
// Disparar al menos tres incidentes diferentes

console.log('\n=== INICIANDO SISTEMA DE PATRULLAJE VECINAL ===');

// INCIDENTE 1: Sospechoso en Calle 23 (Urgencia: Alta, Tipo: Sospechoso)
centralVecinal.reportarIncidente(
  "Calle 23 con Avenida 5",
  "Sospechoso",
  "Persona sospechosa merodeando cerca de las casas",
  "Alta"
);

// INCIDENTE 2: Accidente en Avenida 7 (Urgencia: Media, Tipo: Accidente)
centralVecinal.reportarIncidente(
  "Avenida 7",
  "Accidente",
  "Colisión entre dos vehículos, hay heridos",
  "Media"
);

// INCIDENTE 3: Incidencia menor en Parque Central (Urgencia: Baja, Tipo: Incidencia)
centralVecinal.reportarIncidente(
  "Parque Central",
  "Incidencia",
  "Grupo de jóvenes haciendo ruido después del toque de queda",
  "Baja"
);

console.log('\n=== FIN DE LAS PRUEBAS ===');