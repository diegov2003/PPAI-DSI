import Estado from "../models/Estado.js";
import CambioDeEstado from "../models/CambioDeEstado.js";
import Datos from "../data.js";

class GestorRegistrarResultadoRevision {
    constructor() {
        this.pantalla = null;
        this.eventoSeleccionado = null;
        this.sesionActual = null;
    }

    setPantalla(pantalla) {
        this.pantalla = pantalla;
    }

    setSesion(sesion) {
        this.sesionActual = sesion;
    }

    buscarEventosAutodetectados() {
        const eventos = Datos.eventos.filter(
            (evento) =>
                evento.estado instanceof Estado &&
                evento.estado.esAmbitoSismico() &&
                evento.estado.esAutoDetectado()
        );
        return eventos;
    }

    seleccionarEvento(eventoId) {
        const evento = Datos.eventos.find(e => e.idEvento === eventoId);
        
        if (!evento) {
            this.pantalla.mostrarMensaje("Evento no encontrado");
            return;
        }

        this.eventoSeleccionado = evento;
        
        // Finalizar estado actual
        if (evento.cambiosDeEstado && evento.cambiosDeEstado.length > 0) {
            const estadoActual = evento.cambiosDeEstado.find(ce => ce.esEstadoActual());
            if (estadoActual) {
                estadoActual.setFechaHoraFin(new Date().toISOString());
            }
        }

        // Crear nuevo cambio de estado "bloqueado en revision"
        const nuevoEstado = Datos.estados.find(
            e => e.esBloqueadoEnRevision() && e.esAmbitoSismico()
        );

        if (!nuevoEstado) {
            this.pantalla.mostrarMensaje("Error: No se encontró el estado 'bloqueado en revision'");
            return;
        }

        const nuevoCambioEstado = new CambioDeEstado(
            new Date().toISOString(),
            null,
            nuevoEstado
        );

        // Actualizar el estado del evento
        if (!evento.cambiosDeEstado) {
            evento.cambiosDeEstado = [];
        }
        evento.cambiosDeEstado.push(nuevoCambioEstado);
        evento.estado = nuevoEstado;

        // Notificar el cambio de estado
        this.pantalla.mostrarMensaje("El evento ha cambiado a estado: Bloqueado en revisión");
        
        // Mostrar datos del evento
        const datosCompletos = evento.getDatosCompletos();
        this.pantalla.mostrarDatosSismo(datosCompletos);
    }

    validarDatosEvento() {
        if (!this.eventoSeleccionado) {
            return false;
        }
        
        const esValido = (
            this.eventoSeleccionado.valorMagnitud &&
            this.eventoSeleccionado.alcance &&
            this.eventoSeleccionado.origenGeneracion
        );

        let esValidoString = "No";

        if (esValido) {
            esValidoString = "Si"};

        // Log específico del CU para validación
        window.alert(`Validación de datos del evento 
            Magnitud: ${this.eventoSeleccionado.valorMagnitud}
            Alcance: ${this.eventoSeleccionado.alcance?.nombre}
            Origen: ${this.eventoSeleccionado.origenGeneracion?.nombre}
            Resultado validación: ${esValidoString}`);
        
        return esValido;
    }

    generarSismograma() {
        this.pantalla.mostrarMensaje("Caso de uso Generar sismograma exitosamente ejecutado");
        this.pantalla.mostrarBotonVisualizarSismograma();
        return true;
    }

    rechazarEvento() {
        // Paso 16: Validar datos del evento
        if (!this.validarDatosEvento()) {
            this.pantalla.mostrarMensaje("Error: Faltan datos requeridos del evento");
            return;
        }

        // Paso 17: Actualizar estado a rechazado
        const estadoRechazado = Datos.estados.find(
            e => e.nombreEstado === "Rechazado" && e.esAmbitoSismico()
        );

        if (!estadoRechazado) {
            this.pantalla.mostrarMensaje("Error: No se encontró el estado 'Rechazado'");
            return;
        }

        // Finalizar estado actual
        const estadoActual = this.eventoSeleccionado.cambiosDeEstado.find(
            ce => ce.esEstadoActual()
        );
        if (estadoActual) {
            estadoActual.setFechaHoraFin(new Date().toISOString());
            console.log("CU - Estado actual finalizado:", estadoActual.estado.nombreEstado);
        }

        // Crear nuevo cambio de estado
        const nuevoCambioEstado = new CambioDeEstado(
            new Date().toISOString(),
            null,
            estadoRechazado
        );

        // Asignar el empleado que realiza el cambio (AS logueado)
        if (this.sesionActual) {
            const empleado = this.sesionActual.conocerUsuario();
            nuevoCambioEstado.empleado = empleado;
            console.log("CU - Empleado asignado al cambio de estado:", empleado.nombre, empleado.apellido);
        } else {
            this.pantalla.mostrarMensaje("Error: No hay sesión activa");
            return;
        }

        // Actualizar el evento
        this.eventoSeleccionado.cambiosDeEstado.push(nuevoCambioEstado);
        this.eventoSeleccionado.estado = estadoRechazado;
        console.log("CU - Evento actualizado a estado:", estadoRechazado.nombreEstado);

        this.pantalla.mostrarMensaje("Evento rechazado exitosamente");
        window.location.href = "eventos.html";
    }
}

export default GestorRegistrarResultadoRevision; 