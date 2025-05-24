class MuestraSismica {
    constructor(fechaHoraMuestra) {
        this.fechaHoraMuestra = fechaHoraMuestra;
        this.detalles = [];
    }
    crearDetalleMuestra() {
        const detalle = new DetalleMuestraSismica();
        this.detalles.push(detalle);
        return detalle;
    }
    getDatos() {
        return {
            fechaHoraMuestra: this.fechaHoraMuestra,
            detalles: this.detalles
        }
    }
}
export default MuestraSismica;
