import PantallaRegistrarResultadoRevision from './boundary/PantallaRegistrarResultadoRevision.js';
import GestorRegistrarResultadoRevision from '../Backend/controllers/GestorRegistrarResultadoRevision.js';
import Sesion from '../Backend/models/Sesion.js';
import Usuario from '../Backend/models/Usuario.js';
import Empleado from '../Backend/models/Empleado.js';

document.addEventListener("DOMContentLoaded", function () {
    const pantalla = new PantallaRegistrarResultadoRevision();
    const gestor = new GestorRegistrarResultadoRevision();

    // Crear usuario y empleado de prueba
    const empleadoPrueba = new Empleado(
        "Pérez",
        "Juan",
        "juan.perez@sismos.com",
        "123456789"
    );
    const usuarioPrueba = new Usuario("analista", "123456", empleadoPrueba);
    empleadoPrueba.usuario = usuarioPrueba;

    // Crear sesión de prueba
    const sesionPrueba = new Sesion(
        new Date().toISOString(), // fecha hora desde
        null, // fecha hora hasta (null porque está activa)
        usuarioPrueba
    );

    // Configurar la relación entre pantalla y gestor
    pantalla.setGestor(gestor);
    gestor.setPantalla(pantalla);
    
    // Establecer la sesión en el gestor
    gestor.setSesion(sesionPrueba);

    // Verificar si estamos en la página de eventos
    if (window.location.pathname.includes("eventos.html")) {
        pantalla.iniciarCU();
    }
    // Verificar si estamos en la página de datos del sismo
    else if (window.location.pathname.includes("datosSismo.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const eventoId = urlParams.get("id");
        if (eventoId) {
            gestor.seleccionarEvento(eventoId);
        }
    }
});
