import Estado from "./models/Estado.js";
import AlcanceSismo from "./models/AlcanseSismo.js";
import OrigenGeneracion from "./models/OrigenGeneracion.js";
import Clasificacion from "./models/Clasificacion.js";
import EstacionSismologica from "./models/EstacionSismologica.js";
import Empleado from "./models/Empleado.js";
import EventoSismico from "./models/EventoSismico.js";
import CambioDeEstado from "./models/CambioDeEstado.js";
import MuestraSismica from "./models/MuestraSismica.js";
import DetalleMuestraSismica from "./models/DetalleMuestraSismica.js";
import TipoDato from "./models/TipoDato.js";
import MagnitudRichter from "./models/MagnitudRichter.js";
import SerieTemporal from "./models/SerieTemporal.js";
import Sismografo from "./models/Sismografo.js";
import Usuario from "./models/Usuario.js";

// 1. Datos básicos
const magnitudes = [
  new MagnitudRichter("Micro", 1.0),
  new MagnitudRichter("Menor", 3.0),
  new MagnitudRichter("Ligero", 4.0),
  new MagnitudRichter("Moderado", 5.0),
  new MagnitudRichter("Fuerte", 6.0),
  new MagnitudRichter("Mayor", 7.0),
  new MagnitudRichter("Gran terremoto", 8.0),
];

const tiposDato = [
  new TipoDato("Velocidad", "km/s", 8.0),
  new TipoDato("Frecuencia", "Hz", 15.0),
  new TipoDato("Longitud", "km/ciclo", 1.0),
  new TipoDato("Magnitud", "Richter", 4.0),
];

const estados = [
  new Estado("Sismico", "Auto detectado"),
  new Estado("Sismico", "Pendiente de revision"),
  new Estado("Sismico", "Bloqueado en revision"),
  new Estado("Sismico", "Confirmado"),
  new Estado("Sismico", "Rechazado"),
];

// 2. Estaciones y sismógrafos
const estaciones = [
  new EstacionSismologica(
    "EST001",
    "DOC-CERT-001",
    "2023-01-15",
    -34.6037,
    -58.3816,
    "Estación Buenos Aires",
    "CERT-001"
  ),
  new EstacionSismologica(
    "EST002",
    "DOC-CERT-002",
    "2023-02-20",
    -31.4167,
    -64.1833,
    "Estación Córdoba",
    "CERT-002"
  ),
];

const sismografos = [
  new Sismografo("2022-12-10", "ZET 7156 VER.2", "SN-001-2022", estaciones[0]),
  new Sismografo(
    "2023-01-05",
    "ZET 7152-N VER.3",
    "SN-002-2023",
    estaciones[1]
  ),
];

// 3. Series temporales y muestras
const seriesTemporales = [
  new SerieTemporal(
    false,
    "2023-11-15T14:30:00",
    "2023-11-15T14:35:00",
    50 // Hz
  ),
  new SerieTemporal(
    true,
    "2023-11-16T08:15:00",
    "2023-11-16T08:20:00",
    50 // Hz
  ),
  new SerieTemporal(
    true,
    "2023-11-17T10:00:00",
    "2023-11-17T10:05:00",
    50 // Hz
  )
];

const alcances = [
  new AlcanceSismo("Sismo que afecta una zona limitada", "Local"),
  new AlcanceSismo("Sismo que afecta múltiples regiones", "Regional"),
];

const clasificaciones = [
  new Clasificacion("Superficial", 0, 70),
  new Clasificacion("Intermedia", 70, 300),
  new Clasificacion("Profunda", 300, 700),
];

const origenes = [
  new OrigenGeneracion("Choque de placas tectónicas", "Interplaca"),
  new OrigenGeneracion("Actividad volcánica", "Volcánico"),
  new OrigenGeneracion("Falla interna de placa", "Intraplaca"),
];

// 4. Eventos sísmicos
const eventos = [
  new EventoSismico(
    "1",
    "2020-11-15T14:30:00",
    "2023-11-15T14:35:00",
    -34.6037,
    -58.3816,
    -34.6037,
    -58.3816,
    9.0,
    estados.find((e) => e.nombreEstado === "Auto detectado"),
    alcances[0],
    clasificaciones[0],
    origenes[0]
  ),
  new EventoSismico(
    "2",
    "2022-11-15T14:30:00",
    "2023-11-15T14:35:00",
    -49.6037,
    -58.3816,
    -23.6037,
    -58.3816,
    5.5,
    estados.find((e) => e.nombreEstado === "Auto detectado"),
    alcances[1],
    clasificaciones[1],
    origenes[1]    
  ),
  new EventoSismico(
    "3",
    "2025-11-15T14:30:00",
    "2023-11-15T14:35:00",
    -34.6037,
    -58.3816,
    -34.6037,
    -58.3816,
    4.5,
    estados.find((e) => e.nombreEstado === "Auto detectado"),
    alcances[0],
    clasificaciones[2],
    origenes[2]
  ),
];

// 5. Usuarios y empleados
const usuarios = [
  new Usuario("admin", "admin123"),
  new Usuario("analista", "analista123"),
];

const empleados = [
  new Empleado(
    "Gómez",
    "Juan",
    "juan.gomez@redsismica.com",
    "1122334455",
    usuarios[0]
  ),
  new Empleado(
    "Pérez",
    "María",
    "maria.perez@redsismica.com",
    "1155667788",
    usuarios[1]
  ),
];

// 6. Cambios de estado
const cambiosEstado = [
  new CambioDeEstado(
    "2023-11-15T14:30:00",
    null,
    estados.find((e) => e.nombreEstado === "Auto detectado")
  ),
];

// ESTABLECER RELACIONES

// 1. Relacionar estaciones con series temporales y configurar muestras
seriesTemporales.forEach((serie, index) => {
    // Asignar estación
    serie.estacion = estaciones[index % estaciones.length];
    
    // Crear muestras si no existen
    if (!serie.muestras || serie.muestras.length === 0) {
        serie.muestras = [];
        const fechaBase = new Date(serie.fechaHoraInicioRegistroMuestras);
        
        // Crear 3 muestras para cada serie
        for (let i = 0; i < 3; i++) {
            const muestra = new MuestraSismica(
                new Date(fechaBase.getTime() + (i * 60000)).toISOString()
            );
            
            muestra.detalles = [
                new DetalleMuestraSismica(
                    (7 + Math.random() * 3).toFixed(2),
                    tiposDato[0] // Velocidad
                ),
                new DetalleMuestraSismica(
                    (8 + Math.random() * 7).toFixed(2),
                    tiposDato[1] // Frecuencia
                ),
                new DetalleMuestraSismica(
                    (0.5 + Math.random() * 2).toFixed(2),
                    tiposDato[2] // Longitud
                )
            ];
            
            serie.muestras.push(muestra);
        }
    }
});

// 2. Relacionar eventos con series temporales
eventos.forEach((evento, index) => {
    evento.seriesTemporales = [seriesTemporales[index % seriesTemporales.length]];
});

// 3. Relacionar estaciones con sismógrafos
estaciones.forEach((estacion, index) => {
    if (index < sismografos.length) {
        estacion.sismografo = sismografos[index];
    }
});

// 4. Configurar cambios de estado iniciales
eventos.forEach((evento) => {
    if (!evento.getCambiosDeEstado() || evento.getCambiosDeEstado().length === 0) {
        evento.cambiosDeEstado = [
            new CambioDeEstado(
                evento.getFechaHoraOcurrencia(),
                null,
                evento.getEstado()
            )
        ];
    }
});

cambiosEstado[0].setEmpleado(empleados[0]);

const data = {
    magnitudes,
    tiposDato,
    estados,
    estaciones,
    sismografos,
    seriesTemporales,
    eventos,
    usuarios,
    empleados,
    cambiosEstado,
    alcances,
    clasificaciones,
    origenes
};

console.log("Datos inicializados:");
console.log("Series temporales:", data.seriesTemporales);
console.log("Eventos con sus series:", data.eventos.map(e => ({
    id: e.getIdEvento(),
    seriesCount: e.getSeriesTemporales().length
})));

export default data;

