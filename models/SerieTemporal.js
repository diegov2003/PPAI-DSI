class SerieTemporal {
    constructor(condicionAlarma, fechaHoraInicioRegistroMuestras, fechaHoraRegistro, frecuenciaMuestreo) {
        this.condicionAlarma = condicionAlarma;
        this.fechaHoraInicioRegistroMuestras = fechaHoraInicioRegistroMuestras;
        this.fechaHoraRegistro = fechaHoraRegistro;
        this.frecuenciaMuestreo = frecuenciaMuestreo;
        this.muestras = [];
    }
}
module.exports = SerieTemporal;
