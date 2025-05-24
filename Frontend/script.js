import Estado from '/PPAI-DSI/Backend/models/Estado.js';
import Datos from '/PPAI-DSI/Backend/data.js'; // Asegúrate que la ruta sea correcta
import Relaciones from '/PPAI-DSI/Backend/relaciones.js'; // Asegúrate que la ruta sea correcta
import CambioDeEstado from '/PPAI-DSI/Backend/models/CambioDeEstado.js';
// 
document.addEventListener('DOMContentLoaded', function() {
  // Verificar si estamos en la página de eventos
  if (window.location.pathname.includes('eventos.html')) {
    mostrarEventos(Datos.eventos);
  }
});


function mostrarEventos(eventos) {
  const eventosLista = document.getElementById('eventos-lista');
  if (!eventosLista) return;
  eventosLista.innerHTML = ''; // Limpiar la lista antes de agregar nuevos eventos

  const eventosAutoDetectados = eventos.filter(evento =>
  evento.estado instanceof Estado &&
  evento.estado.esAutoDetectado()
  );
  
  
  console.log("Todos los eventos:", eventos);
  console.log("Filtrados:", (eventosAutoDetectados));

  if (eventosAutoDetectados.length === 0) {
    eventosLista.innerHTML = '<p>No hay eventos auto detectados para mostrar.</p>';
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
    const estadoNombre = evento.estado?.nombreEstado || 'Desconocido';

  html += `
    <tr>
      <td>${eventoId}</td>
      <td>${fechaStr} ${horaStr}</td>
      <td>Lat: ${evento.latitudEpicentro.toFixed(4)}, Lon: ${evento.longitudEpicentro.toFixed(4)}</td>
      <td>${evento.valorMagnitud}</td>
      <td>${estadoNombre}</td>
      <td><button class="boton btn-revisar" data-id="${index}">Revisar</button></td>
    </tr>
  `;
});

  
  html += `</tbody></table>`;
  eventosLista.innerHTML = html;

  // Event listeners para botones
  document.querySelectorAll('.btn-revisar').forEach(btn => {
    btn.addEventListener('click', function() { 
      const eventoId = parseInt(this.getAttribute('data-id'));
      const evento = Datos.eventos[eventoId];  
      // mensajes de depuracion
      console.log('Evento seleccionado:', evento);
      //Hasta aca anda
      //1. finalizar el estado actual
      if (evento.cambioDeEstado && evento.cambiosDeEstado.length > 0){
        const estadoActual = evento.cambiosDeEstado.find(ce => ce.esEstadoActual());
        if (estadoActual){
          estadoActual.setFechaHoraFin(new Date().toISOString());
        }
      }
      //2. crear nuevo cambio de estado "bloqueado en revision"
      const nuevoEstado = Datos.estados.find(e => e.esBloqueadoEnRevision());
      const nuevoCambioEstado = new CambioDeEstado(
        new Date().toISOString(),
        null,
        nuevoEstado
      );
      //3. actualizar el estado del evento
      if (!evento.cambiosDeEstado){
        evento.cambioDeEstado = [];
      }
      evento.cambiosDeEstado.push(nuevoCambioEstado);
      evento.estado = nuevoEstado;
      console.log('Estado actualizado:', evento.estado);
      window.alert(`El evento con ID: ${eventoId + 1} cambió de estado a Bloqueado en revision.`);
      
      mostrarEventos(Datos.eventos);
      //mostrar todos los eventos
      console.log("Todos los eventos:", Datos.eventos);
    });
  });
}

export default {
    mostrarEventos
    };
