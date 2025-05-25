import Estado from "../Backend/models/Estado.js";
import Datos from "../Backend/data.js"; // Asegúrate que la ruta sea correcta
import Relaciones from "../Backend/relaciones.js"; // Asegúrate que la ruta sea correcta
import CambioDeEstado from "../Backend/models/CambioDeEstado.js";

document.addEventListener("DOMContentLoaded", function () {
  // Verificar si estamos en la página de eventos
  if (window.location.pathname.includes("eventos.html")) {
    mostrarEventos(Datos.eventos);
  }
  // Verificar si estamos en la página de datos del sismo
  else if (window.location.pathname.includes("datosSismo.html")) {
    mostrarDetallesSismo();
  }
});

// Función para mostrar detalles del sismo
function mostrarDetallesSismo() {
  const container = document.getElementById("datos-sismo-container");
  if (!container) return;

  // Obtener el ID del evento desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const eventoId = urlParams.get("id");

  if (!eventoId) {
    container.innerHTML = "<p>No se especificó un evento</p>";
    return;
  }

  // Buscar el evento por ID
  const evento = Datos.eventos.find((e) => e.idEvento === eventoId);

  if (!evento) {
    container.innerHTML = "<p>No se encontró el evento solicitado</p>";
    return;
  }

  console.log("Evento completo:", evento);

  // Mostrar los detalles del evento
container.innerHTML = `
  <div class="datos-container">
    <h2 class="titulo-principal">Detalles del Evento Sísmico</h2>
    
    <!-- Tabla de datos principales -->
    <table class="tabla-datos">
      <caption>Información Básica</caption>
      <tbody>
        <tr>
          <th>ID Evento</th>
          <td>${evento.idEvento}</td>
          <th>Fecha y Hora</th>
          <td>${new Date(evento.fechaHoraOcurrencia).toLocaleString()}</td>
        </tr>
        <tr>
          <th>Magnitud</th>
          <td>${evento.valorMagnitud} Richter</td>
          <th>Estado</th>
          <td class="estado-${evento.estado.nombreEstado.toLowerCase().replace(/\s/g, '-')}">
            ${evento.estado.nombreEstado}
          </td>
        </tr>
        <tr>
          <th>Alcance</th>
          <td>${evento.alcance?.nombre || "No definido"}</td>
          <th>Clasificación</th>
          <td>${evento.clasificacion?.nombre || "No definido"}</td>
        </tr>
        <tr>
          <th>Origen</th>
          <td colspan="3">${evento.origenGeneracion?.nombre || "No definido"}</td>
        </tr>
        <tr>
          <th>Ubicación Epicentro</th>
          <td colspan="3">
            Lat: ${evento.latitudEpicentro.toFixed(4)}, 
            Lon: ${evento.longitudEpicentro.toFixed(4)}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Sección de series temporales -->
    <div class="seccion-series">
      <h3 class="subtitulo">Datos de Series Temporales</h3>
      ${generarTablaSeriesTemporales(evento)}
    </div>

    <!-- Panel de acciones -->
    <div class="panel-acciones" style="margin-top: 40px;">
      <div class="grupo-botones">
        <button id="btn-generar-sismograma" class="boton accion-primaria">
          <span class="icono"></span> Generar Sismograma
        </button>
        <div id="resultado-sismograma" class="resultado-sismograma"></div>
      </div>

      <div class="grupo-botones">
        <h3 class="subtitulo">Acciones de Revisión</h3>
        <div class="botones-accion">
          <button id="btn-confirmar" class="boton accion-confirmar">
            <span class="icono"></span> Confirmar
          </button>
          <button id="btn-rechazar" class="boton accion-rechazar">
            <span class="icono"></span> Rechazar
          </button>
          <button id="btn-revision" class="boton accion-revision">
            <span class="icono"></span> Revisión por experto
          </button>
        </div>
        <button class="boton accion-secundaria" disabled>
          <span class="icono"></span> Modificar datos
        </button>
      </div>

      <button id="btn-volver" class="boton volver">
        <span class="icono">←</span> Volver al listado
      </button>
    </div>
  </div>
`;
  // Event listeners
  document.getElementById("btn-generar-sismograma")?.addEventListener("click", function () {
    alert("Sismograma generado con éxito.");
    const resultado = document.getElementById("resultado-sismograma");
    resultado.innerHTML = `<button class="boton" disabled>Visualizar</button>`;
  });

  document.getElementById("btn-confirmar")?.addEventListener("click", () => {
    alert("Evento confirmado.");
    window.location.href = "eventos.html";
  });

  document.getElementById("btn-rechazar")?.addEventListener("click", () => {
    alert("Evento rechazado.");
    window.location.href = "eventos.html";
  });

  document.getElementById("btn-revision")?.addEventListener("click", () => {
    alert("Evento enviado a revisión por experto.");
    window.location.href = "eventos.html";
  });

  document.getElementById("btn-volver")?.addEventListener("click", () => {
    window.location.href = "eventos.html";
  });
}

// Función para generar la tabla de series temporales
function generarTablaSeriesTemporales(evento) {
  if (!evento.seriesTemporales || evento.seriesTemporales.length === 0) {
    return '<div class="no-data">No hay datos de series temporales disponibles</div>';
  }

  return evento.seriesTemporales.map(serie => `
    <div class="serie-temporal">
      <h4>${serie.estacion?.nombre || 'Estación Desconocida'}</h4>
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
              <td>${new Date(muestra.fechaHoraMuestra).toLocaleString()}</td>
              <td>${getValorDetalle(muestra, 'Velocidad')}</td>
              <td>${getValorDetalle(muestra, 'Frecuencia')}</td>
              <td>${getValorDetalle(muestra, 'Longitud')}</td>
            </tr>
          `).join('') || '<tr><td colspan="4">No hay muestras</td></tr>'}
        </tbody>
      </table>
    </div>
  `).join('');
}

// Función auxiliar para obtener valores
function getValorDetalle(muestra, tipo) {
  const detalle = muestra.detalles?.find(d => d.tipoDato?.denominacion === tipo);
  return detalle?.valor ?? 'N/D';
}
function mostrarEventos(eventos) {
  const eventosLista = document.getElementById("eventos-lista");
  if (!eventosLista) return;
  eventosLista.innerHTML = ""; // Limpiar la lista antes de agregar nuevos eventos

  const eventosAutoDetectados = eventos.filter(
    (evento) =>
      evento.estado instanceof Estado &&
      evento.estado.esAmbitoSismico() &&
      (evento.estado.esAutoDetectado() || evento.estado.esBloqueadoEnRevision())
  );

  console.log("Todos los eventos:", eventos);
  console.log("Filtrados:", eventosAutoDetectados);

  if (eventosAutoDetectados.length === 0) {
    eventosLista.innerHTML =
      "<p>No hay eventos auto detectados para mostrar.</p>";
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

  eventosAutoDetectados.forEach((evento, index) => {
    // Convertir fecha ISO a formato legible
    const eventoId = index + 1; // ID auto-incremental
    const fechaHora = new Date(evento.fechaHoraOcurrencia);
    const fechaStr = fechaHora.toLocaleDateString();
    const horaStr = fechaHora.toLocaleTimeString(); // Obtener el estado actual
    // mostrar el estado actual
    const estadoNombre = evento.estado?.nombreEstado || "Desconocido";
    const botonHabilitado = evento.estado.esAutoDetectado();

    html += `
    <tr>
      <td>${eventoId}</td>
      <td>${fechaStr} ${horaStr}</td>
      <td>Lat: ${evento.latitudEpicentro.toFixed(
        4
      )}, Lon: ${evento.longitudEpicentro.toFixed(4)}</td>
      <td>${evento.valorMagnitud}</td>
      <td>${estadoNombre}</td>
      <td>
        <button class="boton btn-revisar" data-id="${index}" ${
      botonHabilitado ? "" : "disabled"
    }>
        Bloquear
        </button>
      </td>
    </tr>

  `;
  });

  html += `</tbody></table>`;
  eventosLista.innerHTML = html;

  // Event listeners para botones
  document.querySelectorAll(".btn-revisar").forEach((btn) => {
    btn.addEventListener("click", function () {
      const eventoId = parseInt(this.getAttribute("data-id"));
      const evento = Datos.eventos[eventoId];
      // mensajes de depuracion
      console.log("Evento seleccionado:", evento);
      //Hasta aca anda
      //1. finalizar el estado actual
      if (evento.cambioDeEstado && evento.cambiosDeEstado.length > 0) {
        const estadoActual = evento.cambiosDeEstado.find((ce) =>
          ce.esEstadoActual()
        );
        if (estadoActual) {
          estadoActual.setFechaHoraFin(new Date().toISOString());
        }
      }
      //2. crear nuevo cambio de estado "bloqueado en revision"
      const nuevoEstado = Datos.estados.find(
        (e) => e.esBloqueadoEnRevision() && e.esAmbitoSismico()
      );

      const nuevoCambioEstado = new CambioDeEstado(
        new Date().toISOString(),
        null,
        nuevoEstado
      );
      //3. actualizar el estado del evento
      if (!evento.cambiosDeEstado) {
        evento.cambiosDeEstado = [];
      }
      evento.cambiosDeEstado.push(nuevoCambioEstado);
      evento.estado = nuevoEstado;
      console.log("Estado actualizado:", evento.estado);
      window.alert(
        `El evento con ID: ${
          eventoId + 1
        } cambió de estado a Bloqueado en revision.`
      );
      window.location.href = `datosSismo.html?id=${evento.idEvento}`;

      mostrarEventos(Datos.eventos);
      //mostrar todos los eventos
      console.log("Todos los eventos:", Datos.eventos);
    });
  });
}

export default {
  mostrarEventos,
};
