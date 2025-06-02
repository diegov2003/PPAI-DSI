import data from './data.js';
import MuestraSismica from './models/MuestraSismica.js';
import DetalleMuestraSismica from './models/DetalleMuestraSismica.js';

console.log("Iniciando configuración de relaciones...");

// 1. Relacionar estaciones con series temporales
console.log("Configurando relaciones de estaciones con series temporales...");
data.seriesTemporales.forEach((serie, index) => {
    serie.setEstacion(data.estaciones[index % data.estaciones.length]);
    console.log(`Serie ${index} asociada a estación ${serie.getEstacion().getNombre()}`);
});

// 2. Asegurar que las series temporales tengan muestras
console.log("Configurando muestras de series temporales...");
data.seriesTemporales.forEach((serie, serieIndex) => {
    // Limpiar muestras existentes para evitar duplicados
    serie.muestras = [];
    
    // Crear 3 muestras para cada serie
    const fechaBase = new Date(serie.getFechaHoraInicioRegistroMuestras());
    for (let i = 0; i < 3; i++) {
        const muestra = new MuestraSismica(
            new Date(fechaBase.getTime() + (i * 60000)).toISOString()
        );
        
        muestra.detalles = [
            new DetalleMuestraSismica(
                (7 + Math.random() * 3).toFixed(2),
                data.tiposDato.find(t => t.getDenominacion() === 'Velocidad')
            ),
            new DetalleMuestraSismica(
                (8 + Math.random() * 7).toFixed(2),
                data.tiposDato.find(t => t.getDenominacion() === 'Frecuencia')
            ),
            new DetalleMuestraSismica(
                (0.5 + Math.random() * 2).toFixed(2),
                data.tiposDato.find(t => t.getDenominacion() === 'Longitud')
            )
        ];
        
        serie.muestras.push(muestra);
    }
    console.log(`Serie ${serieIndex} configurada con ${serie.getMuestras().length} muestras`);
});

// 3. Relacionar eventos con series temporales
console.log("Configurando relaciones de eventos con series temporales...");
data.eventos.forEach((evento, index) => {
    evento.seriesTemporales = [data.seriesTemporales[index % data.seriesTemporales.length]];
    console.log(`Evento ${evento.getIdEvento()} asociado con ${evento.getSeriesTemporales().length} series temporales`);
});

// 4. Relacionar estaciones con sismógrafos
console.log("Configurando relaciones de estaciones con sismógrafos...");
data.estaciones.forEach((estacion, index) => {
    if (index < data.sismografos.length) {
        estacion.sismografo = data.sismografos[index];
        console.log(`Estación ${estacion.getNombre()} asociada con sismógrafo ${estacion.sismografo.getIdentificadorSismografo()}`);
    }
});

// 5. Configurar cambios de estado iniciales
console.log("Configurando cambios de estado iniciales...");
data.eventos.forEach((evento) => {
    if (!evento.getCambiosDeEstado() || evento.getCambiosDeEstado().length === 0) {
        evento.cambiosDeEstado = [
            new CambioDeEstado(
                evento.getFechaHoraOcurrencia(),
                null,
                evento.getEstado()
            )
        ];
        console.log(`Cambio de estado inicial configurado para evento ${evento.getIdEvento()}`);
    }
});

// 6. Relacionar datos adicionales de eventos
console.log("Configurando datos adicionales de eventos...");
data.eventos.forEach((evento, index) => {
    evento.alcance = data.alcances[index % data.alcances.length];
    evento.clasificacion = data.clasificaciones[index % data.clasificaciones.length];
    evento.origenGeneracion = data.origenes[index % data.origenes.length];
    console.log(`Datos adicionales configurados para evento ${evento.getIdEvento()}`);
});

console.log("Configuración de relaciones completada.");

export default data;