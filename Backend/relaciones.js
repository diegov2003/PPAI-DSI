import data from './data.js';

// Relacionar eventos con series temporales
data.eventos[0].seriesTemporales = [data.seriesTemporales[0]];

// Relacionar estaciones con sismógrafos
data.estaciones[0].sismografo = data.sismografos[0];
data.estaciones[1].sismografo = data.sismografos[1];

// Relacionar cambios de estado con eventos
data.eventos[0].cambiosDeEstado = [data.cambiosEstado[0]];
data.eventos[0].estado = data.estados[0];

export default data;