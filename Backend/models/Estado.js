class Estado {
    constructor(ambito, nombreEstado) {
        this.ambito = ambito;  //?????? QUE ES AMBITO
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
}
export default Estado;
