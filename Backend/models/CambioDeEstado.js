class CambioDeEstado {
    constructor(fechaHoraInicio, fechaHoraFin, estado) {
        this.fechaHoraInicio = fechaHoraInicio;
        this.fechaHoraFin = fechaHoraFin;
        this.estado = estado;
        this.empleado = null;
    }
    esEstadoActual() {
        return this.fechaHoraFin === null || this.fechaHoraFin === undefined;
    }
    setFechaHoraFin(fechaHoraFin) {
        this.fechaHoraFin = fechaHoraFin;
    }
    new() {
        return new CambioDeEstado(this.fechaHoraInicio, this.fechaHoraFin, this.estado);
    }
}
export default CambioDeEstado;
