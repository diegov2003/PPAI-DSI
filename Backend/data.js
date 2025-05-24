import Estado from './models/Estado.js';
import AlcanceSismo from './models/AlcanseSismo.js';
import OrigenGeneracion from './models/OrigenGeneracion.js';
import Clasificacion from './models/Clasificacion.js';
import EstacionSismologica from './models/EstacionSismologica.js';
import Empleado from './models/Empleado.js';
import EventoSismico from './models/EventoSismico.js';
import CambioDeEstado from './models/CambioDeEstado.js';
import MuestraSismica from './models/MuestraSismica.js';
import DetalleMuestraSismica from './models/DetalleMuestraSismica.js';
import TipoDato from './models/TipoDato.js';
import MagnitudRichter from './models/MagnitudRichter.js';
import SerieTemporal from './models/SerieTemporal.js';
import Sismografo from './models/Sismografo.js';
import Usuario from './models/Usuario.js';

// 1. Datos básicos
const magnitudes = [
    new MagnitudRichter('Micro', 1.0),
    new MagnitudRichter('Menor', 3.0),
    new MagnitudRichter('Ligero', 4.0),
    new MagnitudRichter('Moderado', 5.0),
    new MagnitudRichter('Fuerte', 6.0),
    new MagnitudRichter('Mayor', 7.0),
    new MagnitudRichter('Gran terremoto', 8.0)
];

const tiposDato = [
    new TipoDato('Velocidad', 'km/s', 8.0),
    new TipoDato('Frecuencia', 'Hz', 15.0),
    new TipoDato('Longitud', 'km/ciclo', 1.0),
    new TipoDato('Magnitud', 'Richter', 4.0)
];

const estados = [
    new Estado('Sismico', 'Auto detectado'),
    new Estado('Sismico', 'Pendiente de revision'),
    new Estado('Sismico', 'Bloqueado en revision'),
    new Estado('Sismico', 'Confirmado'),
    new Estado('Sismico', 'Rechazado')
];

// 2. Estaciones y sismógrafos
const estaciones = [
    new EstacionSismologica(
        'EST001',
        'DOC-CERT-001',
        '2023-01-15',
        -34.6037, -58.3816,
        'Estación Buenos Aires',
        'CERT-001'
    ),
    new EstacionSismologica(
        'EST002',
        'DOC-CERT-002',
        '2023-02-20',
        -31.4167, -64.1833,
        'Estación Córdoba',
        'CERT-002'
    )
];

const sismografos = [
    new Sismografo(
        '2022-12-10',
        'ZET 7156 VER.2',
        'SN-001-2022',
        estaciones[0]
    ),
    new Sismografo(
        '2023-01-05',
        'ZET 7152-N VER.3',
        'SN-002-2023',
        estaciones[1]
    )
];

// 3. Series temporales y muestras
const seriesTemporales = [
    new SerieTemporal(
        false,
        '2023-11-15T14:30:00',
        '2023-11-15T14:35:00',
        50 // Hz
    ),
    new SerieTemporal(
        true,
        '2023-11-16T08:15:00',
        '2023-11-16T08:20:00',
        50 // Hz
    )
];

// Agregar muestras a series temporales
const muestra1 = new MuestraSismica('2023-11-15T14:30:00');
muestra1.detalles.push(
    new DetalleMuestraSismica(7.0, tiposDato[0]), // Velocidad
    new DetalleMuestraSismica(10.0, tiposDato[1]) // Frecuencia
);
seriesTemporales[0].muestras.push(muestra1);

// 4. Eventos sísmicos
const eventos = [
    new EventoSismico(
        '1',
        '2020-11-15T14:30:00',
        '2023-11-15T14:35:00',
        -34.6037, -58.3816,
        -34.6037, -58.3816,
        9.0,
        estados.find(e => e.nombreEstado === 'Auto detectado') // ✅ Instancia de Estado
    ),
    new EventoSismico(
        '2',
        '2022-11-15T14:30:00',
        '2023-11-15T14:35:00',
        -49.6037, -58.3816,
        -23.6037, -58.3816,
        5.5,
        estados.find(e => e.nombreEstado === 'Auto detectado')
    ),
    new EventoSismico(
        '3',
        '2025-11-15T14:30:00',
        '2023-11-15T14:35:00',
        -34.6037, -58.3816,
        -34.6037, -58.3816,
        4.5,
        estados.find(e => e.nombreEstado === 'Pendiente de revision')
    )
];

eventos.forEach(evento => {
    if (!evento.cambiosDeEstado) {
        evento.cambiosDeEstado = [
            new CambioDeEstado(
                evento.fechaHoraOcurrencia,
                null, // Estado actual
                evento.estado
            )
        ];
    }
});


// 5. Usuarios y empleados
const usuarios = [
    new Usuario('admin', 'admin123'),
    new Usuario('analista', 'analista123')
];

const empleados = [
    new Empleado('Gómez', 'Juan', 'juan.gomez@redsismica.com', '1122334455', usuarios[0]),
    new Empleado('Pérez', 'María', 'maria.perez@redsismica.com', '1155667788', usuarios[1])
];

// 6. Cambios de estado
const cambiosEstado = [
    new CambioDeEstado(
        '2023-11-15T14:30:00',
        null, // Estado actual
        estados.find(e => e.nombreEstado === 'Auto detectado')
    )
];
cambiosEstado[0].empleado = empleados[0];
cambiosEstado[0].evento = eventos[0];

export default {
    magnitudes,
    tiposDato,
    estados,
    estaciones,
    sismografos,
    seriesTemporales,
    eventos,
    usuarios,
    empleados,
    cambiosEstado
};

//FALTAN CLASIFICACION Y ORIGEN DE GENERACION