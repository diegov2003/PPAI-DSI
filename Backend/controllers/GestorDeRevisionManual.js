import Estado from "../models/Estado.js";
import CambioDeEstado from "../models/CambioDeEstado.js";
import Datos from "../data.js";

class GestorDeRevisionManual {
    constructor() {
        this.pantalla = null;
        this.eventoSeleccionado = null;
        this.sesionActual = null;
        this.eventosAutodetectados = [];
    }

    getPantalla() {
        return this.pantalla;
    }

    setPantalla(pantalla) {
        this.pantalla = pantalla;
    }

    getSesionActual() {
        return this.sesionActual;
    }

    setSesion(sesion) {
        this.sesionActual = sesion;
        console.log("Sesión establecida:", this.sesionActual);
    }

    getEventoSeleccionado() {
        return this.eventoSeleccionado;
    }

    // Método principal que inicia el caso de uso
    registrarResultadosDeRevisionManual() {
        this.eventosAutodetectados = this.buscarEventosAutodetectado();
        const eventosOrdenados = this.ordenarListadoDeEventosXFechaHora(this.eventosAutodetectados);
        return this.obtenerDatosDeEventos(eventosOrdenados);
    }

    // Busca todos los eventos en estado "Auto detectado"
    buscarEventosAutodetectado() {
        return Datos.eventos.filter(
            (evento) =>
                evento.getEstado() instanceof Estado &&
                evento.getEstado().esAmbitoSismico() &&
                evento.getEstado().esAutoDetectado()
        );
    }

    // Obtiene los datos necesarios para mostrar de cada evento
    obtenerDatosDeEventos(eventos) {
        return eventos.map(evento => ({
            id: evento.getIdEvento(),
            fechaHora: evento.getFechaHoraOcurrencia(),
            magnitud: evento.getValorMagnitud(),
            estado: evento.getEstado().getNombreEstado()
        }));
    }

    // Ordena los eventos por fecha y hora
    ordenarListadoDeEventosXFechaHora(eventos) {
        return eventos.sort((a, b) => 
            new Date(a.getFechaHoraOcurrencia()) - new Date(b.getFechaHoraOcurrencia())
        );
    }

    // Maneja la selección de un evento específico
    seleccionarEvento(eventoId) {
        const evento = Datos.eventos.find(e => e.getIdEvento() === eventoId);
        if (!evento) {
            this.getPantalla().mostrarMensaje("Evento no encontrado");
            return null;
        }
        this.eventoSeleccionado = evento;
        this.buscarBloqueadoEnRevision();
        return this.buscarDatosDeEventoSismico();
    }

    buscarEstadoBloqueadoEnRevision() {
        return Datos.estados.find(
            e => e.getNombreEstado() === "Bloqueado en revision" && e.esAmbitoSismico()
        );
    }

    // Busca y aplica el estado "Bloqueado en revision"
    buscarBloqueadoEnRevision() {
        const evento = this.getEventoSeleccionado();
        if (!evento) return;

        // Buscar el estado actual y finalizarlo
        const cambiosDeEstado = evento.getCambiosDeEstado();
        if (cambiosDeEstado.length > 0) {
            const estadoActual = cambiosDeEstado.find(ce => ce.esEstadoActual());
            if (estadoActual) {
                estadoActual.setFechaHoraFin(this.obtenerFechaHoraActual());
            }
        }

        // Usar el método de Evento sismico para crear el estado bloqueado y no lo creamos directamente
        const nuevoCambioEstado = evento.crearCambioEstadoBloqueadoEnRevision();
        evento.agregarCambioEstado(nuevoCambioEstado);
    }

    // Obtiene la fecha y hora actual en formato ISO
    obtenerFechaHoraActual() {
        return new Date().toISOString();
    }

    // Obtiene todos los datos relevantes del evento seleccionado
    buscarDatosDeEventoSismico() {
        if (!this.getEventoSeleccionado()) return null;
        return this.getEventoSeleccionado();
    }

    // Obtiene y clasifica las series temporales del evento
    obtenerSeriesYMuestrasDeEvento() {
        const evento = this.getEventoSeleccionado();
        if (!evento?.getSeriesTemporales()) return [];
        return evento.clasificarPorEstacionSismologica();
    }

    // Genera el sismograma (simulado en esta implementación)
    llamarCUGenerarSismograma() {
        if (!this.validarDatosEvento()) return false;
        return true;
    }

    // Muestra el botón para visualizar el sismograma
    mostrarBotonVisualizarSismograma() {
        this.getPantalla().mostrarBotonVisualizarSismograma();
    }

    // Maneja la decisión de no visualizar
    tomarSeleccionNoVisualizar() {
        return true;
    }

    // Maneja la decisión de no modificar
    tomarSeleccionNoModificar() {
        return true;
    }

    // Inicia el proceso de rechazo del evento
    tomarSeleccionRechazarEvento() {
        if (!this.validarDatosEvento()) {
            console.error("Datos del evento no válidos para rechazar");
            return false;
        }

        const usuarioLogeado = this.buscarUsuarioLogeado();
        if (!usuarioLogeado) {
            console.error("No hay usuario logueado");
            return false;
        }

        const estadoRechazado = this.buscarEstadoRechazado();
        if (!estadoRechazado) {
            console.error("No se encontró el estado Rechazado");
            return false;
        }

        this.rechazarEvento(estadoRechazado, usuarioLogeado);
        return true;
    }

    // Valida que el evento tenga todos los datos necesarios
    validarDatosEvento() {
        const evento = this.getEventoSeleccionado();
        if (!evento) {
            console.error("No hay evento seleccionado");
            return false;
        }

        const datosRequeridos = [
            evento.getValorMagnitud(),
            evento.getAlcance(),
            evento.getOrigen()
        ];

        const todosLosDatosPresentes = datosRequeridos.every(dato => dato !== null && dato !== undefined);
        if (!todosLosDatosPresentes) {
            console.error("Faltan datos requeridos del evento");
            return false;
        }

        return true;
    }

    // Obtiene el usuario actualmente logueado
    buscarUsuarioLogeado() {
        const sesion = this.getSesionActual();
        if (!sesion) {
            console.error("No hay sesión activa");
            return null;
        }

        const empleado = sesion.conocerUsuario();
        if (!empleado) {
            console.error("No hay empleado asociado a la sesión");
            return null;
        }

        const usuario = empleado.getUsuario();
        if (!usuario) {
            console.error("No hay usuario asociado al empleado");
            return null;
        }

        return usuario;
    }

    // Busca el estado "Rechazado" en el sistema
    buscarEstadoRechazado() {
        return Datos.estados.find(
            e => e.getNombreEstado() === "Rechazado" && e.esAmbitoSismico()
        );
    }

    // Realiza el rechazo efectivo del evento
    rechazarEvento(estadoRechazado, usuarioLogeado) {
        const evento = this.getEventoSeleccionado();
        if (!evento) return;

        // Buscar el estado actual y finalizarlo
        const cambiosDeEstado = evento.getCambiosDeEstado();
        const estadoActual = cambiosDeEstado.find(ce => ce.esEstadoActual());
        
        if (estadoActual) {
            estadoActual.setFechaHoraFin(this.obtenerFechaHoraActual());
        }

        // Usar el método de EventoSismico para rechazar el evento y no creamos el cambio de estado directamente
        evento.rechazar();

        // Asignar el empleado al último cambio de estado
        const ultimoCambio = evento.getCambiosDeEstado()[evento.getCambiosDeEstado().length - 1];
        ultimoCambio.setEmpleado(usuarioLogeado.getEmpleado());

        console.log("Evento rechazado exitosamente:", {
            id: evento.getIdEvento(),
            nuevoEstado: evento.getEstado().getNombreEstado(),
            empleado: usuarioLogeado.getEmpleado().getNombre()
        });
    }

    // Finaliza el caso de uso
    finCU() {
        this.eventoSeleccionado = null;
        return true;
    }
}

export default GestorDeRevisionManual; 