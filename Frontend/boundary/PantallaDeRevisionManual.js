class PantallaDeRevisionManual {
    constructor() {
        this.gestor = null;
        this.visualizacionSeleccionada = false;
        this.modificacionSeleccionada = false;
        this.accionSeleccionada = null;
    }

    getGestor() {
        return this.gestor;
    }

    setGestor(gestor) {
        this.gestor = gestor;
    }

    isVisualizacionSeleccionada() {
        return this.visualizacionSeleccionada;
    }

    setVisualizacionSeleccionada(value) {
        this.visualizacionSeleccionada = value;
    }

    isModificacionSeleccionada() {
        return this.modificacionSeleccionada;
    }

    setModificacionSeleccionada(value) {
        this.modificacionSeleccionada = value;
    }

    getAccionSeleccionada() {
        return this.accionSeleccionada;
    }

    setAccionSeleccionada(value) {
        this.accionSeleccionada = value;
    }

    // Mantener iniciarCU para compatibilidad pero que llame al método correcto
    iniciarCU() {
        this.opRegistrarResultadoDeRevisionManual();
    }

    // Método inicial del CU
    opRegistrarResultadoDeRevisionManual() {
        this.habilitarPantalla();
        const eventos = this.getGestor().registrarResultadosDeRevisionManual();
        this.mostrarEventosSismicosAutodetectados(eventos);
    }
    //Habilita la pantalla
    habilitarPantalla() {
        // Limpiar contenedores existentes
        const container = document.getElementById("eventos-lista");
        if (container) container.innerHTML = "<h2>Eventos Sísmicos</h2>";
    }
    //Muestra los eventos sismicos autodetectados
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
    //Solicita la selección de un evento
    solicitarSeleccionDeEvento() {
        document.querySelectorAll(".btn-revisar").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const eventoId = e.target.getAttribute("data-id");
                this.tomarSeleccionEvento(eventoId);
            });
        });
    }
    //Toma la selección de un evento
    tomarSeleccionEvento(eventoId) {
        const datosEvento = this.getGestor().seleccionarEvento(eventoId);
        if (datosEvento) {
            window.location.href = `datosSismo.html?id=${eventoId}`;
        }
    }
    //Muestra los datos del evento sísmico
    mostrarDatosDelEventoSismico(evento) {
        const container = document.getElementById("datos-sismo-container");
        if (!container) return;

        container.innerHTML = `
            <h2 class="titulo-principal">Detalles del Evento Sísmico</h2>
            
            <div class="datos-container">
                <h3 class="subtitulo">Información General</h3>
                <table class="tabla-datos">
                    <tr>
                        <th>ID:</th>
                        <td>${evento.getIdEvento()}</td>
                    </tr>
                    <tr>
                        <th>Fecha y Hora de Ocurrencia:</th>
                        <td>${this.formatearFecha(evento.getFechaHoraOcurrencia())}</td>
                    </tr>
                    <tr>
                        <th>Estado:</th>
                        <td>${evento.getEstado().getNombreEstado()}</td>
                    </tr>
                </table>
            </div>

            <div class="datos-container">
                <h3 class="subtitulo">Ubicación</h3>
                <table class="tabla-datos">
                    <tr>
                        <th>Latitud Epicentro:</th>
                        <td>${evento.getLatitudEpicentro()}</td>
                    </tr>
                    <tr>
                        <th>Longitud Epicentro:</th>
                        <td>${evento.getLongitudEpicentro()}</td>
                    </tr>
                    <tr>
                        <th>Latitud Hipocentro:</th>
                        <td>${evento.getLatitudHipocentro()}</td>
                    </tr>
                    <tr>
                        <th>Longitud Hipocentro:</th>
                        <td>${evento.getLongitudHipocentro()}</td>
                    </tr>
                    <tr>
                        <th>Magnitud:</th>
                        <td>${evento.getValorMagnitud()}</td>
                    </tr>
                </table>
            </div>

            <div class="datos-container">
                <h3 class="subtitulo">Clasificación</h3>
                <table class="tabla-datos">
                    <tr>
                        <th>Alcance:</th>
                        <td>${evento.getAlcance()?.getNombre() || 'No definido'}</td>
                    </tr>
                    <tr>
                        <th>Clasificación:</th>
                        <td>${evento.getClasificacion()?.getNombre() || 'No definido'}</td>
                    </tr>
                    <tr>
                        <th>Origen:</th>
                        <td>${evento.getOrigen()?.getNombre() || 'No definido'}</td>
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
    //Formatea la fecha
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
    //Configura los eventos de la UI
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
            this.mostrarMensaje("No se implementa en el Caso de Uso");
        });

        document.getElementById("btn-modificar")?.addEventListener("click", () => {
            this.tomarSeleccionNoModificar();
        });

        document.getElementById("btn-revision")?.addEventListener("click", () => {
            this.mostrarMensaje("No se implementa en el Caso de Uso");
        });
    }
    //Solicita la selección de una opción de visualización
    solicitarSeleccionOpcionVisualizacion() {
        if (this.getGestor().llamarCUGenerarSismograma()) {
            this.mostrarMensaje("Sismograma generado correctamente");
            this.mostrarBotonVisualizarSismograma();
        }
    }
    //Muestra el botón para visualizar sismograma
    mostrarBotonVisualizarSismograma() {
        // Crear el botón si no existe
        let btnVisualizar = document.getElementById("btn-visualizar-sismograma");
        if (!btnVisualizar) {
            btnVisualizar = document.createElement("button");
            btnVisualizar.id = "btn-visualizar-sismograma";
            btnVisualizar.className = "boton accion-primaria";
            btnVisualizar.textContent = "Visualizar Sismograma";
            
            // Agregar el evento click
            btnVisualizar.addEventListener("click", () => {
                this.mostrarMensaje("No se implementa en el Caso de Uso");
            });

            // Encontrar el contenedor donde insertar el botón
            const btnGenerarSismograma = document.getElementById("btn-generar-sismograma");
            if (btnGenerarSismograma && btnGenerarSismograma.parentNode) {
                btnGenerarSismograma.parentNode.insertBefore(btnVisualizar, btnGenerarSismograma.nextSibling);
            }
        }

        // Mostrar el botón
        btnVisualizar.style.display = "inline-block";
        btnVisualizar.style.marginLeft = "10px";
    }
    //Toma la selección de no visualizar
    tomarSeleccionNoVisualizar() {
        this.mostrarMensaje("No se implementa en el Caso de Uso");
    }
    //Toma la selección de no modificar
    tomarSeleccionNoModificar() {
        if (this.getGestor().tomarSeleccionNoModificar()) {
            this.mostrarMensaje("No se implementa en el Caso de Uso");
        }
    }
    //Toma la selección de rechazar evento
    tomarSeleccionRechazarEvento() {
        const gestor = this.getGestor();
        const evento = gestor.getEventoSeleccionado();
        
        if (!evento) {
            this.mostrarMensaje("No hay evento seleccionado para rechazar");
            return;
        }

        // Confirmación del usuario
        if (!confirm("¿Está seguro que desea rechazar este evento sísmico?")) {
            return;
        }

        // Primero mostramos los datos validados
        window.alert(
            "Datos validados:\n\n" +
            `Magnitud: ${evento.getValorMagnitud()}\n` +
            `Alcance: ${evento.getAlcance().getNombre()}\n` +
            `Origen de generación: ${evento.getOrigen().getNombre()}`
        );

        // Ejecutamos el rechazo
        if (gestor.tomarSeleccionRechazarEvento()) {
            const fechaActual = new Date().toLocaleString('es-AR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            
            const usuarioLogeado = gestor.getSesionActual().getUsuario().getEmpleado();
            
            window.alert(
                "Evento actualizado\n\n" +
                `Estado: ${evento.getEstado().getNombreEstado()}\n` +
                `Fecha y hora de revisión: ${fechaActual}\n` +
                `AS logueado: ${usuarioLogeado.getNombre()} ${usuarioLogeado.getApellido()}`
            );

            // Finalizamos el caso de uso
            gestor.finCU();
            
            // Redirigimos a la página de eventos
            window.location.href = "eventos.html";
        }
    }
    //Muestra un mensaje
    mostrarMensaje(mensaje) {
        alert(mensaje);
    }
    //Muestra las opciones de acción
    mostrarOpcionesDeAccion() {
        const container = document.querySelector('.panel-acciones');
        if (container) {
            container.style.display = 'block';
        }
    }
    //Muestra la opción de modificar
    mostrarOpcionModificar() {
        const btnModificar = document.getElementById('btn-modificar');
        if (btnModificar) {
            btnModificar.style.display = 'block';
        }
    }
    //Genera el HTML de las series temporales
    generarHTMLSeriesTemporales(series) {
        if (!series || series.length === 0) {
            return `
                <div class="datos-container">
                    <h3 class="subtitulo">Series Temporales</h3>
                    <p class="no-data">No hay datos de series temporales disponibles</p>
                </div>
            `;
        }

        return `
            <div class="datos-container">
                <h3 class="subtitulo">Series Temporales</h3>
                ${series.map(serie => {
                    const estacion = serie.getEstacion();
                    const muestras = serie.getMuestras();
                    return `
                    <div class="serie-temporal">
                        <div class="serie-info">
                            <p><strong>Estación:</strong> ${estacion ? estacion.getNombre() : 'Sin estación'}</p>
                            <p><strong>Fecha Inicio:</strong> ${this.formatearFecha(serie.getFechaHoraInicioRegistroMuestras())}</p>
                            <p><strong>Fecha Fin:</strong> ${this.formatearFecha(serie.getFechaHoraRegistro())}</p>
                            <p><strong>Frecuencia de Muestreo:</strong> ${serie.getFrecuenciaMuestreo()} Hz</p>
                        </div>
                        <table class="tabla-series">
                            <thead>
                                <tr>
                                    <th>Fecha y Hora</th>
                                    <th>Velocidad</th>
                                    <th>Frecuencia</th>
                                    <th>Longitud</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${muestras.map(muestra => {
                                    const detalles = muestra.detalles.reduce((acc, detalle) => {
                                        const tipoDato = detalle.tipoDato;
                                        if (tipoDato) {
                                            acc[tipoDato.getDenominacion()] = {
                                                valor: detalle.valor,
                                                unidad: tipoDato.getNombreUnidadMedida()
                                            };
                                        }
                                        return acc;
                                    }, {});

                                    return `
                                    <tr>
                                        <td>${this.formatearFecha(muestra.fechaHoraMuestra)}</td>
                                        <td>${detalles['Velocidad'] ? 
                                            `${detalles['Velocidad'].valor} ${detalles['Velocidad'].unidad}` : 'N/D'}</td>
                                        <td>${detalles['Frecuencia'] ? 
                                            `${detalles['Frecuencia'].valor} ${detalles['Frecuencia'].unidad}` : 'N/D'}</td>
                                        <td>${detalles['Longitud'] ? 
                                            `${detalles['Longitud'].valor} ${detalles['Longitud'].unidad}` : 'N/D'}</td>
                                    </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                    `;
                }).join('')}
            </div>
        `;
    }
}

export default PantallaDeRevisionManual; 