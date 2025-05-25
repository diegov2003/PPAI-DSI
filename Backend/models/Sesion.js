import Usuario from "./Usuario.js";

class Sesion {
    constructor(fechaHoraDesde, fechaHoraHasta, usuario){
        this.fechaHoraDesde = fechaHoraDesde;
        this.fechaHoraHasta = fechaHoraHasta;
        this.usuario = usuario; // 👈 esta es la instancia del usuario logueado
    }

    conocerUsuario(){
        return this.usuario;
    }
}

export default Sesion;