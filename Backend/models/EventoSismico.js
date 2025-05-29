class EventoSismico {
    autoIncrementalId = (id) => {
        return String(id).padStart(3, '0');
    };

    constructor(id, fechaHoraOcurrencia, fechaHoraFin, latitudEpicentro, longitudEpicentro, latitudHipocentro, longitudHipocentro, valorMagnitud, estado, alcance, clasificacion, origenGeneracion) {
        this.idEvento = this.autoIncrementalId(id);
        this.fechaHoraOcurrencia = fechaHoraOcurrencia;
        this.fechaHoraFin = fechaHoraFin;
        this.latitudEpicentro = latitudEpicentro;
        this.longitudEpicentro = longitudEpicentro;
        this.latitudHipocentro = latitudHipocentro;
        this.longitudHipocentro = longitudHipocentro;
        this.valorMagnitud = valorMagnitud;
        this.estado = estado;
        this.seriesTemporales = [];
        this.cambiosDeEstado = [];
        this.alcance = alcance;
        this.clasificacion = clasificacion;
        this.origenGeneracion = origenGeneracion;
    }

    agregarCambioEstado(cambioEstado) {
        this.cambiosDeEstado.push(cambioEstado);
        this.estado = cambioEstado.estado;
    }

    formatearFecha(fechaStr) {
        try {
            if (!fechaStr) return "Fecha no disponible";
            
            const fecha = new Date(fechaStr);
            if (isNaN(fecha.getTime())) {
                return "Fecha no válida";
            }

            const opciones = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };

            return fecha.toLocaleString('es-AR', opciones);
        } catch (error) {
            return "Error en fecha";
        }
    }

    getDatosCompletos() {
        console.log("DEBUG - Fecha original:", this.fechaHoraOcurrencia);
        const fechaFormateada = this.formatearFecha(this.fechaHoraOcurrencia);
        console.log("DEBUG - Fecha formateada:", fechaFormateada);
        
        const datos = {
            id: this.idEvento,
            fechaHora: fechaFormateada,
            ubicacion: {
                epicentro: { lat: this.latitudEpicentro, lon: this.longitudEpicentro },
                hipocentro: { lat: this.latitudHipocentro, lon: this.longitudHipocentro }
            },
            magnitud: this.valorMagnitud,
            estado: this.estado.nombreEstado,
            alcance: this.alcance ? this.alcance.nombre : 'No definido',
            clasificacion: this.clasificacion ? this.clasificacion.nombre : 'No definido',
            origen: this.origenGeneracion ? this.origenGeneracion.nombre : 'No definido',
            seriesTemporales: this.seriesTemporales.map(st => {
                console.log("DEBUG - Fecha inicio serie:", st.fechaHoraInicioRegistroMuestras);
                console.log("DEBUG - Fecha fin serie:", st.fechaHoraRegistro);
                
                return {
                    estacion: st.estacion ? st.estacion.nombre : 'Estación no definida',
                    fechaInicio: this.formatearFecha(st.fechaHoraInicioRegistroMuestras),
                    fechaFin: this.formatearFecha(st.fechaHoraRegistro),
                    frecuenciaMuestreo: st.frecuenciaMuestreo,
                    muestras: st.muestras.map(m => {
                        console.log("DEBUG - Fecha muestra:", m.fechaHoraMuestra);
                        
                        const detallesPorTipo = {};
                        m.detalles.forEach(d => {
                            if (d && d.tipoDato) {
                                detallesPorTipo[d.tipoDato.denominacion] = {
                                    valor: d.valor,
                                    unidad: d.tipoDato.nombreUnidadMedida
                                };
                            }
                        });

                        return {
                            fechaHora: this.formatearFecha(m.fechaHoraMuestra),
                            velocidad: detallesPorTipo['Velocidad'] ? 
                                `${detallesPorTipo['Velocidad'].valor} ${detallesPorTipo['Velocidad'].unidad}` : 'N/D',
                            frecuencia: detallesPorTipo['Frecuencia'] ? 
                                `${detallesPorTipo['Frecuencia'].valor} ${detallesPorTipo['Frecuencia'].unidad}` : 'N/D',
                            longitud: detallesPorTipo['Longitud'] ? 
                                `${detallesPorTipo['Longitud'].valor} ${detallesPorTipo['Longitud'].unidad}` : 'N/D'
                        };
                    })
                };
            })
        };
        
        return datos;
    }
}

export default EventoSismico;