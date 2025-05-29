class Usuario {
    constructor(nombreUsuario, contrasena, empleado) {
        this.nombreUsuario = nombreUsuario;
        this.contrasena = contrasena;
        this.empleado = empleado;
    }

    getRILogueado() {
        return this.empleado;
    }
}

export default Usuario;
