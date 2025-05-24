class SerieTemporal {
    constructor(condicionAlarma, fechaHoraInicioRegistroMuestras, fechaHoraRegistro, frecuenciaMuestreo) {
        this.condicionAlarma = condicionAlarma;
        this.fechaHoraInicioRegistroMuestras = fechaHoraInicioRegistroMuestras;
        this.fechaHoraRegistro = fechaHoraRegistro;
        this.frecuenciaMuestreo = frecuenciaMuestreo;
        this.muestras = [];
    }
    getDatos() {
        return {
            condicionAlarma: this.condicionAlarma,
            fechaHoraInicioRegistroMuestras: this.fechaHoraInicioRegistroMuestras,
            fechaHoraRegistro: this.fechaHoraRegistro,
            frecuenciaMuestreo: this.frecuenciaMuestreo,
            muestras: this.muestras
        };
    }
}
export default SerieTemporal;
