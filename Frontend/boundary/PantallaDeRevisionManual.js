class PantallaDeRevisionManual {
    constructor() {
        this.gestor = null;
        this.visualizacionSeleccionada = false;
        this.modificacionSeleccionada = false;
        this.accionSeleccionada = null;
    }

    setGestor(gestor) {
        this.gestor = gestor;
    }

    // Mantener iniciarCU para compatibilidad pero que llame al método correcto
    iniciarCU() {
        this.opRegistrarResultadoDeRevisionManual();
    }

    // Método inicial del CU
    opRegistrarResultadoDeRevisionManual() {
        this.habilitarPantalla();
        const eventos = this.gestor.registrarResultadosDeRevisionManual();
        this.mostrarEventosSismicosAutodetectados(eventos);
    }

    habilitarPantalla() {
        // Limpiar contenedores existentes
        const container = document.getElementById("eventos-lista");
        if (container) container.innerHTML = "<h2>Eventos Sísmicos</h2>";
    }

    mostrarEventosSismicosAutodetectados(eventos) {
        const container = document.getElementById("eventos-lista");
        if (!container) return;

        if (!eventos || eventos.length === 0) {
            container.innerHTML += "<p class='text-center text-white'>No hay eventos sísmicos autodetectados disponibles.</p>";
            return;
        }

        const table = document.createElement("table");
        table.className = "table table-dark table-hover";
        table.innerHTML = `
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Fecha y Hora</th>
                    <th scope="col">Magnitud</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${eventos.map(evento => `
                    <tr>
                        <td>${evento.id}</td>
                        <td>${new Date(evento.fechaHora).toLocaleString()}</td>
                        <td>${evento.magnitud}</td>
                        <td>${evento.estado}</td>
                        <td>
                            <button class="btn btn-primary btn-sm btn-revisar" data-id="${evento.id}">
                                Revisar
                            </button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        `;

        container.appendChild(table);
        this.solicitarSeleccionDeEvento();
    }

    solicitarSeleccionDeEvento() {
        document.querySelectorAll(".btn-revisar").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const eventoId = e.target.getAttribute("data-id");
                this.tomarSeleccionEvento(eventoId);
            });
        });
    }

    tomarSeleccionEvento(eventoId) {
        const datosEvento = this.gestor.seleccionarEvento(eventoId);
        if (datosEvento) {
            window.location.href = `datosSismo.html?id=${eventoId}`;
        }
    }

    mostrarDatosDelEventoSismico(evento) {
        const container = document.getElementById("datos-sismo-container");
        if (!container) return;

        container.innerHTML = `
            <h2 class="titulo-principal">Detalles del Evento Sísmico ${evento.idEvento}</h2>
            
            <div class="datos-container">
                <h3 class="subtitulo">Información General</h3>
                <table class="tabla-datos">
                    <tr>
                        <th>ID:</th>
                        <td>${evento.idEvento}</td>
                    </tr>
                    <tr>
                        <th>Fecha y Hora:</th>
                        <td>${evento.formatearFecha(evento.getFechaHoraOcurrencia())}</td>
                    </tr>
                    <tr>
                        <th>Magnitud:</th>
                        <td>${evento.getValorMagnitud()}</td>
                    </tr>
                    <tr>
                        <th>Estado:</th>
                        <td>${evento.getEstadoActual().nombreEstado}</td>
                    </tr>
                </table>
            </div>

            <div class="datos-container">
                <h3 class="subtitulo">Ubicación</h3>
                <table class="tabla-datos">
                    <tr>
                        <th>Epicentro:</th>
                        <td>Lat: ${evento.getLatitudEpicentro()}, Lon: ${evento.getLongitudEpicentro()}</td>
                    </tr>
                    <tr>
                        <th>Hipocentro:</th>
                        <td>Lat: ${evento.getLatitudHipocentro()}, Lon: ${evento.getLongitudHipocentro()}</td>
                    </tr>
                </table>
            </div>

            <div class="datos-container">
                <h3 class="subtitulo">Clasificación</h3>
                <table class="tabla-datos">
                    <tr>
                        <th>Alcance:</th>
                        <td>${evento.getAlcance()?.nombre || 'No definido'}</td>
                    </tr>
                    <tr>
                        <th>Clasificación:</th>
                        <td>${evento.getClasificacion()?.nombre || 'No definido'}</td>
                    </tr>
                    <tr>
                        <th>Origen:</th>
                        <td>${evento.getOrigen()?.nombre || 'No definido'}</td>
                    </tr>
                </table>
            </div>

            <div class="panel-acciones">
                <button id="btn-modificar" class="boton accion-primaria">Modificar</button>
            </div>

            ${this.generarHTMLSeriesTemporales(evento.obtenerSeriesYMuestrasDeEvento())}

            <div class="panel-acciones">
                <button id="btn-generar-sismograma" class="boton accion-primaria">Generar Sismograma</button>
                <button id="btn-confirmar" class="boton accion-confirmar">Confirmar</button>
                <button id="btn-rechazar" class="boton accion-rechazar">Rechazar</button>
                <button id="btn-revision" class="boton accion-revision">Solicitar revisión a Experto</button>
                <button id="btn-volver" class="boton volver">Volver</button>
            </div>
        `;

        this.configurarEventosUI();
    }

    generarHTMLSeriesTemporales(series) {
        if (!series || series.length === 0) {
            return '<div class="no-data">No hay series temporales disponibles</div>';
        }

        return `
            <div class="datos-container">
                <h3 class="subtitulo">Series Temporales</h3>
                ${series.map(serie => `
                    <div class="serie-temporal">
                        <h4>Estación: ${serie.estacion?.nombre || 'Estación no definida'}</h4>
                        <div class="serie-info">
                            <p>Inicio: ${this.formatearFecha(serie.fechaHoraInicioRegistroMuestras)}</p>
                            <p>Fin: ${this.formatearFecha(serie.fechaHoraRegistro)}</p>
                            <p>Frecuencia de muestreo: ${serie.frecuenciaMuestreo} Hz</p>
                        </div>
                        <table class="tabla-series">
                            <thead>
                                <tr>
                                    <th>Fecha/Hora</th>
                                    <th>Velocidad</th>
                                    <th>Frecuencia</th>
                                    <th>Longitud</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${serie.muestras.map(m => {
                                    const detallesPorTipo = {};
                                    m.detalles.forEach(d => {
                                        if (d?.tipoDato) {
                                            detallesPorTipo[d.tipoDato.denominacion] = {
                                                valor: d.valor,
                                                unidad: d.tipoDato.nombreUnidadMedida
                                            };
                                        }
                                    });

                                    return `
                                        <tr>
                                            <td>${this.formatearFecha(m.fechaHoraMuestra)}</td>
                                            <td>${detallesPorTipo['Velocidad'] ? 
                                                `${detallesPorTipo['Velocidad'].valor} ${detallesPorTipo['Velocidad'].unidad}` : 'N/D'}</td>
                                            <td>${detallesPorTipo['Frecuencia'] ? 
                                                `${detallesPorTipo['Frecuencia'].valor} ${detallesPorTipo['Frecuencia'].unidad}` : 'N/D'}</td>
                                            <td>${detallesPorTipo['Longitud'] ? 
                                                `${detallesPorTipo['Longitud'].valor} ${detallesPorTipo['Longitud'].unidad}` : 'N/D'}</td>
                                        </tr>
                                    `;
                                }).join("")}
                            </tbody>
                        </table>
                    </div>
                `).join("")}
            </div>
        `;
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

    configurarEventosUI() {
        document.getElementById("btn-generar-sismograma")?.addEventListener("click", () => {
            this.solicitarSeleccionOpcionVisualizacion();
        });

        document.getElementById("btn-rechazar")?.addEventListener("click", () => {
            this.tomarSeleccionRechazarEvento();
        });

        document.getElementById("btn-volver")?.addEventListener("click", () => {
            window.location.href = "eventos.html";
        });

        document.getElementById("btn-confirmar")?.addEventListener("click", () => {
            // TODO: Implementar lógica de confirmación
            this.mostrarMensaje("Funcionalidad de confirmación no implementada");
        });

        document.getElementById("btn-modificar")?.addEventListener("click", () => {
            this.tomarSeleccionNoModificar();
        });

        document.getElementById("btn-revision")?.addEventListener("click", () => {
            this.mostrarMensaje("No se implementa en el Caso de Uso");
        });
    }

    solicitarSeleccionOpcionVisualizacion() {
        if (this.gestor.generarSismograma()) {
            this.mostrarMensaje("Sismograma generado correctamente");
            this.mostrarOpVisualizacion();
        }
    }

    mostrarOpVisualizacion() {
        const container = document.getElementById("datos-sismo-container");
        if (!container) return;

        // Verificar si ya existe el botón de visualizar
        if (!document.getElementById("btn-visualizar-sismograma")) {
            const botonContainer = document.createElement("div");
            botonContainer.className = "panel-acciones mt-3";
            botonContainer.innerHTML = `
                <button id="btn-visualizar-sismograma" class="boton accion-primaria">
                    Visualizar Sismograma
                </button>
            `;
            
            // Insertar el botón después del botón de generar sismograma
            const btnGenerar = document.getElementById("btn-generar-sismograma");
            if (btnGenerar) {
                btnGenerar.parentNode.insertBefore(botonContainer, btnGenerar.nextSibling);
                
                // Agregar el evento click al nuevo botón
                document.getElementById("btn-visualizar-sismograma").addEventListener("click", () => {
                    this.tomarSeleccionNoVisualizar();
                });
            }
        }
        this.mostrarMensaje("Se habilitó la opción de visualización del sismograma");
    }

    tomarSeleccionNoVisualizar() {
        // No hace nada, solo muestra el mensaje
        this.mostrarMensaje("No se implementa en el Caso de Uso");
    }

    tomarSeleccionNoModificar() {
        if (this.gestor.tomarSeleccionNoModificar()) {
            this.mostrarMensaje("No se implementa en el Caso de Uso");
        }
    }

    tomarSeleccionRechazarEvento() {
        // Primero mostramos los datos validados
        const datosEvento = this.gestor.eventoSeleccionado;
        this.mostrarMensaje(
            "Datos validados:\n" +
            `- Magnitud: ${datosEvento.valorMagnitud}\n` +
            `- Alcance: ${datosEvento.alcance.nombre}\n` +
            `- Origen de generación: ${datosEvento.origenGeneracion.nombre}`
        );

        // Ejecutamos el rechazo
        this.gestor.tomarSeleccionRechazarEvento();

        // Mostramos el resultado del cambio de estado
        const fechaActual = new Date().toLocaleString();
        const usuarioLogeado = this.gestor.sesionActual.usuario.empleado;
        
        this.mostrarMensaje(
            "Evento actualizado:\n" +
            "- Estado: Rechazado\n" +
            `- Fecha y hora de revisión: ${fechaActual}\n` +
            `- Analista responsable: ${usuarioLogeado.nombre} ${usuarioLogeado.apellido}`
        );

        this.gestor.finCU();
        window.location.href = "eventos.html";
    }

    mostrarMensaje(mensaje) {
        alert(mensaje);
    }

    mostrarOpcionesDeAccion() {
        const container = document.querySelector('.panel-acciones');
        if (container) {
            container.style.display = 'block';
        }
    }

    mostrarOpcionModificar() {
        const btnModificar = document.getElementById('btn-modificar');
        if (btnModificar) {
            btnModificar.style.display = 'block';
        }
    }
}

export default PantallaDeRevisionManual; 