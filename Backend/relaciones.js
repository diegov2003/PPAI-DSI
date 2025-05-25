import data from './data.js';
import MuestraSismica from './models/MuestraSismica.js'; // Añade esta línea
import DetalleMuestraSismica from './models/DetalleMuestraSismica.js'; // Y esta también

// 1. Relacionar estaciones con series temporales
data.seriesTemporales[0].estacion = data.estaciones[0]; // Estación Buenos Aires
data.seriesTemporales[1].estacion = data.estaciones[1]; // Estación Córdoba

// 2. Completar muestras para todas las series temporales
data.seriesTemporales.forEach((serie, index) => {
  if (!serie.muestras || serie.muestras.length === 0) {
    const fechaBase = new Date(serie.fechaHoraInicioRegistroMuestras);
    
    // Crear 3 muestras de ejemplo para cada serie
    serie.muestras = [];
    for (let i = 0; i < 3; i++) {
      const muestra = new MuestraSismica(
        new Date(fechaBase.getTime() + (i * 60000)).toISOString() // 1 minuto de diferencia
      );
      
      // Agregar todos los tipos de datos a cada muestra
      muestra.detalles = [
        new DetalleMuestraSismica(
          (7 + Math.random() * 3).toFixed(2), // Velocidad entre 7-10 km/s
          data.tiposDato.find(t => t.denominacion === 'Velocidad')
        ),
        new DetalleMuestraSismica(
          (8 + Math.random() * 7).toFixed(2), // Frecuencia entre 8-15 Hz
          data.tiposDato.find(t => t.denominacion === 'Frecuencia')
        ),
        new DetalleMuestraSismica(
          (0.5 + Math.random() * 2).toFixed(2), // Longitud entre 0.5-2.5 km/ciclo
          data.tiposDato.find(t => t.denominacion === 'Longitud')
        )
      ];
      
      serie.muestras.push(muestra);
    }
  }
});

// 3. Relacionar eventos con series temporales
data.eventos[0].seriesTemporales = [data.seriesTemporales[0]]; // Evento 1 con Serie 1
data.eventos[1].seriesTemporales = [data.seriesTemporales[1]]; // Evento 2 con Serie 2
data.eventos[2].seriesTemporales = []; // Evento 3 sin series (para demostración)

// 4. Relacionar estaciones con sismógrafos (ya lo tenías)
data.estaciones[0].sismografo = data.sismografos[0];
data.estaciones[1].sismografo = data.sismografos[1];

// 5. Relacionar cambios de estado con eventos
data.eventos[0].cambiosDeEstado = [data.cambiosEstado[0]];
data.eventos[0].estado = data.estados[0];

// 6. Relacionar datos adicionales de eventos
data.eventos.forEach((evento, index) => {
  evento.alcance = data.alcances[index % data.alcances.length];
  evento.clasificacion = data.clasificaciones[index % data.clasificaciones.length];
  evento.origenGeneracion = data.origenes[index % data.origenes.length];
});

export default data;