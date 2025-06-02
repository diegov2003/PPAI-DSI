class CambioDeEstado {
    constructor(fechaHoraInicio, fechaHoraFin, estado) {
        this.fechaHoraInicio = fechaHoraInicio;
        this.fechaHoraFin = fechaHoraFin;
        this.estado = estado;
        this.empleado = null;
    }

    getFechaHoraInicio() {
        return this.fechaHoraInicio;
    }

    getFechaHoraFin() {
        return this.fechaHoraFin;
    }

    getEstado() {
        return this.estado;
    }

    getEmpleado() {
        return this.empleado;
    }

    setEmpleado(empleado) {
        this.empleado = empleado;
    }

    esEstadoActual() {
        return this.getFechaHoraFin() === null || this.getFechaHoraFin() === undefined;
    }

    setFechaHoraFin(fechaHoraFin) {
        this.fechaHoraFin = fechaHoraFin;
    }

    new() {
        return new CambioDeEstado(
            this.getFechaHoraInicio(), 
            this.getFechaHoraFin(), 
            this.getEstado()
        );
    }
}
export default CambioDeEstado;
