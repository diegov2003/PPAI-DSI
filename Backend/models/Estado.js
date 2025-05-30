class Estado {
    constructor(ambito, nombreEstado) {
        this.ambito = ambito;
        this.nombreEstado = nombreEstado;
    }
    esBloqueadoEnRevision() {
        return this.nombreEstado === "Bloqueado en revision";
    }

    esAutoDetectado() {
        return this.nombreEstado === "Auto detectado";
    }
    esPendienteDeRevision() {
        return this.nombreEstado === "Pendiente de revision";
    }
    esAmbitoSismico() {
        return this.ambito === "Sismico";
    }
    esRechazado() {
        return this.nombreEstado === "Rechazado";
    }
}
export default Estado;
