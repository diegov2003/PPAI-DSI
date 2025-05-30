import Estado from './Estado.js';
import CambioDeEstado from './CambioDeEstado.js';

class EventoSismico {
    autoIncrementalId = (id) => {
        return String(id).padStart(3, '0');
    };

    constructor(id, fechaHoraOcurrencia, fechaHoraFin, latitudEpicentro, longitudEpicentro, latitudHipocentro, longitudHipocentro, valorMagnitud, estado, alcance, clasificacion, origenGeneracion) {
        this.idEvento = this.autoIncrementalId(id);
        this.fechaHoraOcurrencia = fechaHoraOcurrencia;
        this.fechaHoraFin = fechaHoraFin;
        this.latitudEpicentro = latitudEpicentro;
        this.longitudEpicentro = longitudEpicentro;
        this.latitudHipocentro = latitudHipocentro;
        this.longitudHipocentro = longitudHipocentro;
        this.valorMagnitud = valorMagnitud;
        this.estado = estado;
        this.seriesTemporales = [];
        this.cambiosDeEstado = [];
        this.alcance = alcance;
        this.clasificacion = clasificacion;
        this.origenGeneracion = origenGeneracion;
    }

    agregarCambioEstado(cambioEstado) {
        this.cambiosDeEstado.push(cambioEstado);
        this.estado = cambioEstado.estado;
    }

    formatearFecha(fechaStr) {
        try {
            if (!fechaStr) return "Fecha no disponible";
            
            const fecha = new Date(fechaStr);
            if (isNaN(fecha.getTime())) {
                return "Fecha no válida";
            }

            const opciones = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };

            return fecha.toLocaleString('es-AR', opciones);
        } catch (error) {
            return "Error en fecha";
        }
    }

    getFechaHoraOcurrencia() {
        return this.fechaHoraOcurrencia;
    }

    getLatitudEpicentro() {
        return this.latitudEpicentro;
    }

    getLongitudEpicentro() {
        return this.longitudEpicentro;
    }

    getLatitudHipocentro() {
        return this.latitudHipocentro;
    }

    getLongitudHipocentro() {
        return this.longitudHipocentro;
    }

    getValorMagnitud() {
        return this.valorMagnitud;
    }

    getAlcance() {
        return this.alcance;
    }

    getClasificacion() {
        return this.clasificacion;
    }

    getOrigen() {
        return this.origenGeneracion;
    }

    obtenerSeriesYMuestrasDeEvento() {
        return this.seriesTemporales;
    }

    esAutodetectado() {
        return this.estado.esAutoDetectado();
    }

    esRechazado() {
        return this.estado.nombreEstado === "Rechazado";
    }

    crearCambioEstadoBloqueadoEnRevision() {
        const nuevoEstado = new Estado("Sismico", "Bloqueado en revision");
        return new CambioDeEstado(new Date().toISOString(), null, nuevoEstado);
    }

    crearCambioEstadoRechazado() {
        const nuevoEstado = new Estado("Sismico", "Rechazado");
        return new CambioDeEstado(new Date().toISOString(), null, nuevoEstado);
    }

    rechazar() {
        const cambioEstado = this.crearCambioEstadoRechazado();
        this.agregarCambioEstado(cambioEstado);
    }

    esEstadoActual() {
        return this.cambiosDeEstado.length > 0 && 
               this.cambiosDeEstado[this.cambiosDeEstado.length - 1].esEstadoActual();
    }

    getEstadoActual() {
        return this.estado;
    }

    clasificarPorEstacionSismologica() {
        return this.seriesTemporales.reduce((clasificadas, serie) => {
            const nombreEstacion = serie.estacion?.getNombre() || 'Sin estación';
            if (!clasificadas[nombreEstacion]) {
                clasificadas[nombreEstacion] = [];
            }
            clasificadas[nombreEstacion].push(serie);
            return clasificadas;
        }, {});
    }
}

export default EventoSismico;