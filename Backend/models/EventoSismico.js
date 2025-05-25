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
        this.alcance = alcance; // ✅ Nuevo atributo
        this.clasificacion = clasificacion; // ✅ Nuevo atributo
        this.origenGeneracion = origenGeneracion; // ✅ Nuevo atributo
    }

    agregarCambioEstado(cambioEstado) {
        this.cambiosDeEstado.push(cambioEstado);
        this.estado = cambioEstado.estado;
    }
    getDatosCompletos() {
        return {
            id: this.idEvento,
            fechaHora: this.fechaHoraOcurrencia,
            ubicacion: {
                epicentro: { lat: this.latitudEpicentro, lon: this.longitudEpicentro },
                hipocentro: { lat: this.latitudHipocentro, lon: this.longitudHipocentro }
            },
            magnitud: this.valorMagnitud,
            estado: this.estado.nombreEstado,
            alcance: this.alcance ? this.alcance.nombre : 'No definido',
            clasificacion: this.clasificacion ? this.clasificacion.nombre : 'No definido',
            origen: this.origenGeneracion ? this.origenGeneracion.nombre : 'No definido',
            seriesTemporales: this.seriesTemporales.map(st => st.getDatos())
        };
    }
}

export default EventoSismico;