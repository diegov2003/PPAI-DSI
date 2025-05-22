class EventoSismico {
    constructor(fechaHoraOcurrencia, fechaHoraFin, latitudEpicentro, longitudEpicentro, latitudHipocentro, longitudHipocentro, valorMagnitud) {
        this.fechaHoraOcurrencia = fechaHoraOcurrencia;
        this.fechaHoraFin = fechaHoraFin;
        this.latitudEpicentro = latitudEpicentro;
        this.longitudEpicentro = longitudEpicentro;
        this.latitudHipocentro = latitudHipocentro;
        this.longitudHipocentro = longitudHipocentro;
        this.valorMagnitud = valorMagnitud;
        this.cambiosDeEstado = [];
        this.seriesTemporales = [];
    }
}
module.exports = EventoSismico;