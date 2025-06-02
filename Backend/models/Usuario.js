class Usuario {
    constructor(nombreUsuario, contrasena, empleado) {
        this.nombreUsuario = nombreUsuario;
        this.contrasena = contrasena;
        this.empleado = empleado;
    }

    getNombreUsuario() {
        return this.nombreUsuario;
    }

    getContrasena() {
        return this.contrasena;
    }

    getEmpleado() {
        return this.empleado;
    }

    setEmpleado(empleado) {
        this.empleado = empleado;
    }

    getRILogueado() {
        return this.getEmpleado();
    }
}

export default Usuario;
