class Sismografo {
    constructor(fechaAdquisicion, identificadorSismofrafo, nroSerie, estacionSismologica) {
        this.fechaAdquisicion = fechaAdquisicion;
        this.identificadorSismofrafo = identificadorSismofrafo;
        this.nroSerie = nroSerie;
        this.estacionSismologica = estacionSismologica;
    }
    getIdentificadorSismografo() {
        return this.identificadorSismofrafo;
    }
    setEstadoActual() {
        if (this.cambioDeEstadoActual) {
            this.cambioDeEstadoActual.finalizar();
        }
    }
}
export default Sismografo;

