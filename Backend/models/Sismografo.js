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
}
export default Sismografo;

