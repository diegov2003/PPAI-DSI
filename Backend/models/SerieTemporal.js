class SerieTemporal {
    constructor(condicionAlarma, fechaHoraInicioRegistroMuestras, fechaHoraRegistro, frecuenciaMuestreo) {
        this.condicionAlarma = condicionAlarma;
        this.fechaHoraInicioRegistroMuestras = fechaHoraInicioRegistroMuestras;
        this.fechaHoraRegistro = fechaHoraRegistro;
        this.frecuenciaMuestreo = frecuenciaMuestreo;
        this.muestras = [];
        this.estacion = null;
    }

    getCondicionAlarma() {
        return this.condicionAlarma;
    }

    getFechaHoraInicioRegistroMuestras() {
        return this.fechaHoraInicioRegistroMuestras;
    }

    getFechaHoraRegistro() {
        return this.fechaHoraRegistro;
    }

    getFrecuenciaMuestreo() {
        return this.frecuenciaMuestreo;
    }

    getMuestras() {
        return this.muestras;
    }

    getEstacion() {
        return this.estacion;
    }

    setEstacion(estacion) {
        this.estacion = estacion;
    }

    getDatos() {
        return {
            condicionAlarma: this.getCondicionAlarma(),
            fechaHoraInicioRegistroMuestras: this.getFechaHoraInicioRegistroMuestras(),
            fechaHoraRegistro: this.getFechaHoraRegistro(),
            frecuenciaMuestreo: this.getFrecuenciaMuestreo(),
            muestras: this.getMuestras()
        };
    }
}
export default SerieTemporal;
