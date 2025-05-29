class Empleado {
    constructor(apellido, nombre, mail, telefono) {
        this.apellido = apellido;
        this.nombre = nombre;
        this.mail = mail;
        this.telefono = telefono;
    }

    esTuUsuario(usuario) {
        return this === usuario.empleado;
    }
}

export default Empleado;
