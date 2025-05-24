class EventoSismico {
    autoIncrementalId = (id) => {
        return String(id).padStart(1, '1');
    };

    constructor(id, fechaHoraOcurrencia, fechaHoraFin, latitudEpicentro, longitudEpicentro, latitudHipocentro, longitudHipocentro, valorMagnitud, estado) {
        this.idEvento = this.autoIncrementalId(id);
        this.fechaHoraOcurrencia = fechaHoraOcurrencia;
        this.fechaHoraFin = fechaHoraFin;
        this.latitudEpicentro = latitudEpicentro;
        this.longitudEpicentro = longitudEpicentro;
        this.latitudHipocentro = latitudHipocentro;
        this.longitudHipocentro = longitudHipocentro;
        this.valorMagnitud = valorMagnitud;
        this.estado = estado; // ✅ Esta línea es clave
        this.seriesTemporales = [];
        this.cambiosDeEstado = [];
    }

    agregarCambioEstado(cambioEstado) {
        this.cambiosDeEstado.push(cambioEstado);
        this.estado = cambioEstado.estado;
    }
}

export default EventoSismico;