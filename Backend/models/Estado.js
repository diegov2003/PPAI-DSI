class Estado {
    constructor(ambito, nombreEstado) {
        this.ambito = ambito;
        this.nombreEstado = nombreEstado;
    }

    getAmbito() {
        return this.ambito;
    }

    getNombreEstado() {
        return this.nombreEstado;
    }

    esBloqueadoEnRevision() {
        return this.getNombreEstado() === "Bloqueado en revision";
    }

    esAutoDetectado() {
        return this.getNombreEstado() === "Auto detectado";
    }

    esPendienteDeRevision() {
        return this.getNombreEstado() === "Pendiente de revision";
    }

    esAmbitoSismico() {
        return this.getAmbito() === "Sismico";
    }

    esRechazado() {
        return this.getNombreEstado() === "Rechazado";
    }
}
export default Estado;
