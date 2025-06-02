class Sesion {
    constructor(fechaHoraDesde, fechaHoraHasta, usuario) {
        this.fechaHoraDesde = fechaHoraDesde;
        this.fechaHoraHasta = fechaHoraHasta;
        this.usuario = usuario;
    }

    getFechaHoraDesde() {
        return this.fechaHoraDesde;
    }

    getFechaHoraHasta() {
        return this.fechaHoraHasta;
    }

    getUsuario() {
        return this.usuario;
    }

    setUsuario(usuario) {
        this.usuario = usuario;
    }

    conocerUsuario() {
        return this.getUsuario()?.getEmpleado();
    }
}

export default Sesion;