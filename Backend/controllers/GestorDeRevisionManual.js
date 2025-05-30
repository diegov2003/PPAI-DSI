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

    setPantalla(pantalla) {
        this.pantalla = pantalla;
    }

    setSesion(sesion) {
        this.sesionActual = sesion;
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
                evento.estado instanceof Estado &&
                evento.estado.esAmbitoSismico() &&
                evento.estado.esAutoDetectado()
        );
    }

    // Obtiene los datos necesarios para mostrar de cada evento
    obtenerDatosDeEventos(eventos) {
        return eventos.map(evento => ({
            id: evento.idEvento,
            fechaHora: evento.fechaHoraOcurrencia,
            magnitud: evento.valorMagnitud,
            estado: evento.estado.nombreEstado
        }));
    }

    // Ordena los eventos por fecha y hora
    ordenarListadoDeEventosXFechaHora(eventos) {
        return eventos.sort((a, b) => 
            new Date(b.fechaHoraOcurrencia) - new Date(a.fechaHoraOcurrencia)
        );
    }

    // Maneja la selección de un evento específico
    seleccionarEvento(eventoId) {
        const evento = Datos.eventos.find(e => e.idEvento === eventoId);
        if (!evento) {
            this.pantalla.mostrarMensaje("Evento no encontrado");
            return null;
        }
        this.eventoSeleccionado = evento;
        this.buscarBloqueadoEnRevision();
        return this.buscarDatosDeEventoSismico();
    }

    // Busca y aplica el estado "Bloqueado en revision"
    buscarBloqueadoEnRevision() {
        const estadoBloqueado = Datos.estados.find(
            e => e.esBloqueadoEnRevision() && e.esAmbitoSismico()
        );
        if (estadoBloqueado) {
            if (this.eventoSeleccionado.cambiosDeEstado.length > 0) {
                const estadoActual = this.eventoSeleccionado.cambiosDeEstado.find(ce => ce.esEstadoActual());
                if (estadoActual) {
                    estadoActual.setFechaHoraFin(this.obtenerFechaHoraActual());
                }
            }
            const nuevoCambioEstado = new CambioDeEstado(
                this.obtenerFechaHoraActual(),
                null,
                estadoBloqueado
            );
            this.eventoSeleccionado.cambiosDeEstado.push(nuevoCambioEstado);
            this.eventoSeleccionado.estado = estadoBloqueado;
        }
    }

    // Obtiene la fecha y hora actual en formato ISO
    obtenerFechaHoraActual() {
        return new Date().toISOString();
    }

    // Obtiene todos los datos relevantes del evento seleccionado
    buscarDatosDeEventoSismico() {
        if (!this.eventoSeleccionado) return null;
        return this.eventoSeleccionado;
    }

    // Obtiene y clasifica las series temporales del evento
    obtenerSeriesYMuestrasDeEvento() {
        if (!this.eventoSeleccionado?.seriesTemporales) return [];
        return this.clasificarPorEstacionSismologica(this.eventoSeleccionado.seriesTemporales);
    }

    // Clasifica las series temporales por estación y procesa sus detalles
    clasificarPorEstacionSismologica(series) {
        return series.map(serie => {
            const datosCompletos = {
                estacion: serie.estacion?.nombre || 'Sin estación',
                fechaInicio: serie.fechaHoraInicioRegistroMuestras,
                fechaFin: serie.fechaHoraRegistro,
                frecuenciaMuestreo: serie.frecuenciaMuestreo,
                muestras: serie.muestras.map(muestra => {
                    const detallesPorTipo = {};
                    muestra.detalles.forEach(detalle => {
                        if (detalle && detalle.tipoDato) {
                            detallesPorTipo[detalle.tipoDato.denominacion] = {
                                valor: detalle.valor,
                                unidad: detalle.tipoDato.nombreUnidadMedida
                            };
                        }
                    });

                    return {
                        fechaHora: muestra.fechaHoraMuestra,
                        velocidad: detallesPorTipo['Velocidad'] ? 
                            `${detallesPorTipo['Velocidad'].valor} ${detallesPorTipo['Velocidad'].unidad}` : 'N/D',
                        frecuencia: detallesPorTipo['Frecuencia'] ? 
                            `${detallesPorTipo['Frecuencia'].valor} ${detallesPorTipo['Frecuencia'].unidad}` : 'N/D',
                        longitud: detallesPorTipo['Longitud'] ? 
                            `${detallesPorTipo['Longitud'].valor} ${detallesPorTipo['Longitud'].unidad}` : 'N/D'
                    };
                })
            };
            return datosCompletos;
        });
    }

    // Genera el sismograma (simulado en esta implementación)
    llamarCUGenerarSismograma() {
        if (!this.validarDatosEvento()) return false;
        return true;
    }

    // Muestra el botón para visualizar el sismograma
    mostrarBotonVisualizarSismograma() {
        this.pantalla.mostrarBotonVisualizarSismograma();
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
        if (this.validarDatosEvento()) {
            const usuarioLogeado = this.buscarUsuarioLogeado();
            if (usuarioLogeado) {
                const estadoRechazado = this.buscarEstadoRechazado();
                if (estadoRechazado) {
                    this.rechazarEvento(estadoRechazado, usuarioLogeado);
                }
            }
        }
    }

    // Valida que el evento tenga todos los datos necesarios
    validarDatosEvento() {
        if (!this.eventoSeleccionado) return false;
        return !!(
            this.eventoSeleccionado.valorMagnitud &&
            this.eventoSeleccionado.alcance &&
            this.eventoSeleccionado.origenGeneracion
        );
    }

    // Obtiene el usuario actualmente logueado
    buscarUsuarioLogeado() {
        return this.sesionActual?.usuario;
    }

    // Busca el estado "Rechazado" en el sistema
    buscarEstadoRechazado() {
        return Datos.estados.find(
            e => e.nombreEstado === "Rechazado" && e.esAmbitoSismico()
        );
    }

    // Realiza el rechazo efectivo del evento
    rechazarEvento(estadoRechazado, usuarioLogeado) {
        const estadoActual = this.eventoSeleccionado.cambiosDeEstado.find(
            ce => ce.esEstadoActual()
        );
        if (estadoActual) {
            estadoActual.setFechaHoraFin(this.obtenerFechaHoraActual());
        }

        const nuevoCambioEstado = new CambioDeEstado(
            this.obtenerFechaHoraActual(),
            null,
            estadoRechazado
        );
        nuevoCambioEstado.empleado = usuarioLogeado.empleado;
        
        this.eventoSeleccionado.cambiosDeEstado.push(nuevoCambioEstado);
        this.eventoSeleccionado.estado = estadoRechazado;
    }

    // Finaliza el caso de uso
    finCU() {
        this.eventoSeleccionado = null;
        return true;
    }
}

export default GestorDeRevisionManual; 