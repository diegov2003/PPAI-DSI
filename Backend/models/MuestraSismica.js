class MuestraSismica {
    constructor(fechaHoraMuestra) {
        this.fechaHoraMuestra = fechaHoraMuestra;
        this.detalles = [];
    }

    getFechaHoraMuestra() {
        return this.fechaHoraMuestra;
    }

    getDetalles() {
        return this.detalles;
    }

    addDetalle(detalle) {
        this.detalles.push(detalle);
    }

    crearDetalleMuestra() {
        const detalle = new DetalleMuestraSismica();
        this.addDetalle(detalle);
        return detalle;
    }

    getDatos() {
        return {
            fechaHoraMuestra: this.getFechaHoraMuestra(),
            detalles: this.getDetalles()
        }
    }
}
export default MuestraSismica;
