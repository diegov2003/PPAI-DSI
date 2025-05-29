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
        this.mostrarEventosSismicosAutodetectados();
    }

    // Habilita la pantalla para interacción
    habilitarPantalla() {
        // La lógica de habilitación ya está implícita en la carga de la página
        console.log("Pantalla habilitada para interacción");
    }

    // Muestra la lista de eventos sísmicos autodetectados
    mostrarEventosSismicosAutodetectados() {
        const eventos = this.gestor.buscarEventosAutodetectados();
        
        const eventosLista = document.getElementById("eventos-lista");
        if (!eventosLista) return;
        
        eventosLista.innerHTML = "";

        if (eventos.length === 0) {
            eventosLista.innerHTML = "<p>No hay eventos auto detectados para mostrar.</p>";
            return;
        }

        let html = `
            <table border="1" style="width:100%; color:white; border-collapse:collapse;">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha y Hora</th>
                        <th>Ubicación</th>
                        <th>Magnitud</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
        `;

        eventos.forEach((evento) => {
            const fechaHora = new Date(evento.fechaHoraOcurrencia);
            const fechaStr = fechaHora.toLocaleDateString();
            const horaStr = fechaHora.toLocaleTimeString();
            const estadoNombre = evento.estado?.nombreEstado || "Desconocido";
            const botonHabilitado = evento.estado.esAutoDetectado();

            html += `
                <tr>
                    <td>${evento.idEvento}</td>
                    <td>${fechaStr} ${horaStr}</td>
                    <td>Lat: ${evento.latitudEpicentro.toFixed(4)}, Lon: ${evento.longitudEpicentro.toFixed(4)}</td>
                    <td>${evento.valorMagnitud}</td>
                    <td>${estadoNombre}</td>
                    <td>
                        <button class="boton btn-revisar" data-id="${evento.idEvento}" ${botonHabilitado ? "" : "disabled"}>
                            Revisar
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        eventosLista.innerHTML = html;

        this.solicitarSeleccionDeEvento();
    }

    // Configura los listeners para la selección de evento
    solicitarSeleccionDeEvento() {
        document.querySelectorAll(".btn-revisar").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const eventoId = e.target.getAttribute("data-id");
                this.iniciarSeleccionDeEvento(eventoId);
            });
        });
    }

    // Inicia el proceso de selección de un evento
    iniciarSeleccionDeEvento(eventoId) {
        this.gestor.seleccionarEvento(eventoId);
        window.location.href = `datosSismo.html?id=${eventoId}`;
    }

    // Muestra los datos detallados del evento sísmico
    mostrarDatosDelEventoSismico(datosEvento) {
        const container = document.getElementById("datos-sismo-container");
        if (!container) return;

        container.innerHTML = `
            <div class="datos-container">
                <h2 class="titulo-principal">Detalles del Evento Sísmico</h2>
                
                <table class="tabla-datos">
                    <caption>Información Básica</caption>
                    <tbody>
                        <tr>
                            <th>ID Evento</th>
                            <td>${datosEvento.id}</td>
                            <th>Fecha y Hora</th>
                            <td>${datosEvento.fechaHora}</td>
                        </tr>
                        <tr>
                            <th>Magnitud</th>
                            <td>${datosEvento.magnitud} Richter</td>
                            <th>Estado</th>
                            <td class="estado-${datosEvento.estado.toLowerCase().replace(/\s/g, '-')}">
                                ${datosEvento.estado}
                            </td>
                        </tr>
                        <tr>
                            <th>Alcance</th>
                            <td>${datosEvento.alcance}</td>
                            <th>Clasificación</th>
                            <td>${datosEvento.clasificacion}</td>
                        </tr>
                        <tr>
                            <th>Origen</th>
                            <td colspan="3">${datosEvento.origen}</td>
                        </tr>
                        <tr>
                            <th>Ubicación Epicentro</th>
                            <td colspan="3">
                                Lat: ${datosEvento.ubicacion.epicentro.lat.toFixed(4)}, 
                                Lon: ${datosEvento.ubicacion.epicentro.lon.toFixed(4)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="seccion-series">
                    <h3 class="subtitulo">Datos de Series Temporales</h3>
                    ${this.generarTablaSeriesTemporales(datosEvento.seriesTemporales)}
                </div>

                <div class="panel-acciones">
                    <div class="grupo-botones">
                        <button id="btn-generar-sismograma" class="boton accion-primaria">
                            <span class="icono"></span> Generar Sismograma
                        </button>
                        <button id="btn-visualizar-sismograma" class="boton accion-primaria" disabled style="display: none;">
                            <span class="icono"></span> Visualizar Sismograma
                        </button>
                    </div>

                    <div class="grupo-botones">
                        <h3 class="subtitulo">Acciones de Revisión</h3>
                        <div class="botones-accion">
                            <button id="btn-confirmar" class="boton accion-confirmar" disabled>
                                <span class="icono"></span> Confirmar
                            </button>
                            <button id="btn-rechazar" class="boton accion-rechazar">
                                <span class="icono"></span> Rechazar evento
                            </button>
                            <button id="btn-revision" class="boton accion-revision">
                                <span class="icono"></span> Revisión por experto
                            </button>
                        </div>
                    </div>

                    <button id="btn-volver" class="boton volver">
                        <span class="icono">←</span> Volver al listado
                    </button>
                </div>
            </div>
        `;

        this.configurarEventosUI();
    }

    // Configura todos los eventos de la UI
    configurarEventosUI() {
        // Configurar botón de generar sismograma
        document.getElementById("btn-generar-sismograma")?.addEventListener("click", () => {
            this.solicitarSeleccionOpcionVisualizacion();
        });

        // Configurar botón de rechazar
        document.getElementById("btn-rechazar")?.addEventListener("click", () => {
            this.tomarSeleccionRechazarEvento();
        });

        // Configurar botón de volver
        document.getElementById("btn-volver")?.addEventListener("click", () => {
            this.tomarSeleccionNoVisualizar();
        });

        // Configurar botón de confirmar
        document.getElementById("btn-confirmar")?.addEventListener("click", () => {
            this.tomarSeleccionNoModificar();
        });

        // Configurar botón de revisión
        document.getElementById("btn-revision")?.addEventListener("click", () => {
            this.tomarSeleccionReclamarEvento();
        });
    }

    // Solicita al usuario que seleccione si desea visualizar el sismograma
    solicitarSeleccionOpcionVisualizacion() {
        this.visualizacionSeleccionada = true;
        if (this.gestor.generarSismograma()) {
            this.mostrarBotonVisualizarSismograma();
        }
    }

    // Maneja la selección de no visualizar el sismograma
    tomarSeleccionNoVisualizar() {
        window.location.href = "eventos.html";
    }

    // Solicita al usuario que seleccione una acción
    solicitarSeleccionDeAccion() {
        // Esta funcionalidad está implícita en los botones de acción
        console.log("Esperando selección de acción del usuario");
    }

    // Maneja la selección de no modificar el evento
    tomarSeleccionNoModificar() {
        this.accionSeleccionada = "confirmar";
        // Implementar lógica de confirmación
        this.mostrarMensaje("Funcionalidad de confirmación pendiente de implementar");
    }

    // Maneja la selección de rechazar el evento
    tomarSeleccionRechazarEvento() {
        this.accionSeleccionada = "rechazar";
        this.gestor.rechazarEvento();
    }

    // Maneja la selección de reclamar el evento
    tomarSeleccionReclamarEvento() {
        this.accionSeleccionada = "reclamar";
        this.mostrarMensaje("Funcionalidad de reclamo pendiente de implementar");
    }

    // Métodos auxiliares
    mostrarBotonVisualizarSismograma() {
        const btnVisualizar = document.getElementById("btn-visualizar-sismograma");
        if (btnVisualizar) {
            btnVisualizar.style.display = "block";
            btnVisualizar.disabled = false;
        }
    }

    generarTablaSeriesTemporales(series) {
        if (!series || series.length === 0) {
            return '<div class="no-data">No hay datos de series temporales disponibles</div>';
        }

        return series.map(serie => `
            <div class="serie-temporal">
                <h4>${serie.estacion}</h4>
                <p>Período: ${serie.fechaInicio} - ${serie.fechaFin}</p>
                <p>Frecuencia de muestreo: ${serie.frecuenciaMuestreo} Hz</p>
                <table>
                    <thead>
                        <tr>
                            <th>Fecha/Hora</th>
                            <th>Velocidad</th>
                            <th>Frecuencia</th>
                            <th>Longitud</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${serie.muestras?.map(muestra => `
                            <tr>
                                <td>${muestra.fechaHora}</td>
                                <td>${muestra.velocidad}</td>
                                <td>${muestra.frecuencia}</td>
                                <td>${muestra.longitud}</td>
                            </tr>
                        `).join('') || '<tr><td colspan="4">No hay muestras</td></tr>'}
                    </tbody>
                </table>
            </div>
        `).join('');
    }

    mostrarMensaje(mensaje) {
        alert(mensaje);
    }
}

export default PantallaDeRevisionManual; 