import data from './data.js';
import MuestraSismica from './models/MuestraSismica.js';
import DetalleMuestraSismica from './models/DetalleMuestraSismica.js';

console.log("Iniciando configuración de relaciones...");

// 1. Relacionar estaciones con series temporales
console.log("Configurando relaciones de estaciones con series temporales...");
data.seriesTemporales.forEach((serie, index) => {
    serie.estacion = data.estaciones[index % data.estaciones.length];
    console.log(`Serie ${index} asociada a estación ${serie.estacion.nombre}`);
});

// 2. Asegurar que las series temporales tengan muestras
console.log("Configurando muestras de series temporales...");
data.seriesTemporales.forEach((serie, serieIndex) => {
    // Limpiar muestras existentes para evitar duplicados
    serie.muestras = [];
    
    // Crear 3 muestras para cada serie
    const fechaBase = new Date(serie.fechaHoraInicioRegistroMuestras);
    for (let i = 0; i < 3; i++) {
        const muestra = new MuestraSismica(
            new Date(fechaBase.getTime() + (i * 60000)).toISOString()
        );
        
        muestra.detalles = [
            new DetalleMuestraSismica(
                (7 + Math.random() * 3).toFixed(2),
                data.tiposDato.find(t => t.denominacion === 'Velocidad')
            ),
            new DetalleMuestraSismica(
                (8 + Math.random() * 7).toFixed(2),
                data.tiposDato.find(t => t.denominacion === 'Frecuencia')
            ),
            new DetalleMuestraSismica(
                (0.5 + Math.random() * 2).toFixed(2),
                data.tiposDato.find(t => t.denominacion === 'Longitud')
            )
        ];
        
        serie.muestras.push(muestra);
    }
    console.log(`Serie ${serieIndex} configurada con ${serie.muestras.length} muestras`);
});

// 3. Relacionar eventos con series temporales
console.log("Configurando relaciones de eventos con series temporales...");
data.eventos.forEach((evento, index) => {
    // Asignar una serie temporal a cada evento
    evento.seriesTemporales = [data.seriesTemporales[index % data.seriesTemporales.length]];
    console.log(`Evento ${evento.idEvento} asociado con ${evento.seriesTemporales.length} series temporales`);
});

// 4. Relacionar estaciones con sismógrafos
console.log("Configurando relaciones de estaciones con sismógrafos...");
data.estaciones.forEach((estacion, index) => {
    if (index < data.sismografos.length) {
        estacion.sismografo = data.sismografos[index];
        console.log(`Estación ${estacion.nombre} asociada con sismógrafo ${estacion.sismografo.identificadorSismofrafo}`);
    }
});

// 5. Configurar cambios de estado iniciales
console.log("Configurando cambios de estado iniciales...");
data.eventos.forEach((evento) => {
    if (!evento.cambiosDeEstado || evento.cambiosDeEstado.length === 0) {
        evento.cambiosDeEstado = [
            new CambioDeEstado(
                evento.fechaHoraOcurrencia,
                null,
                evento.estado
            )
        ];
        console.log(`Cambio de estado inicial configurado para evento ${evento.idEvento}`);
    }
});

// 6. Relacionar datos adicionales de eventos
console.log("Configurando datos adicionales de eventos...");
data.eventos.forEach((evento, index) => {
    evento.alcance = data.alcances[index % data.alcances.length];
    evento.clasificacion = data.clasificaciones[index % data.clasificaciones.length];
    evento.origenGeneracion = data.origenes[index % data.origenes.length];
    console.log(`Datos adicionales configurados para evento ${evento.idEvento}`);
});

console.log("Configuración de relaciones completada.");

export default data;