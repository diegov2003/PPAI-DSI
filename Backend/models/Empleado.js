class Empleado {
    constructor(apellido, nombre, mail, telefono) {
        this.apellido = apellido;
        this.nombre = nombre;
        this.mail = mail;
        this.telefono = telefono;
        this.usuario = null;
    }

    getApellido() {
        return this.apellido;
    }

    getNombre() {
        return this.nombre;
    }

    getMail() {
        return this.mail;
    }

    getTelefono() {
        return this.telefono;
    }

    getUsuario() {
        return this.usuario;
    }

    setUsuario(usuario) {
        this.usuario = usuario;
    }

    esTuUsuario(usuario) {
        return this === usuario.getEmpleado();
    }
}

export default Empleado;
