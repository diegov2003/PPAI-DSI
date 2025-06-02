import PantallaDeRevisionManual from './boundary/PantallaDeRevisionManual.js';
import GestorDeRevisionManual from '../Backend/controllers/GestorDeRevisionManual.js';
import Sesion from '../Backend/models/Sesion.js';
import Usuario from '../Backend/models/Usuario.js';
import Empleado from '../Backend/models/Empleado.js';

document.addEventListener("DOMContentLoaded", function () {
    const pantalla = new PantallaDeRevisionManual();
    const gestor = new GestorDeRevisionManual();

    // Configurar el botón de cancelar en todas las páginas
    document.getElementById("btn-cancelar")?.addEventListener("click", () => {
        window.alert("Se canceló la revisión manual");
        window.location.href = "index.html";
    });

    // Crear empleado y usuario de prueba
    const empleadoPrueba = new Empleado(
        "Pérez",
        "Juan",
        "juan.perez@sismos.com",
        "123456789"
    );

    const usuarioPrueba = new Usuario("analista", "123456", empleadoPrueba);
    // Asignar el usuario al empleado y viceversa
    empleadoPrueba.usuario = usuarioPrueba;
    usuarioPrueba.empleado = empleadoPrueba;

    console.log("- Empleado:", empleadoPrueba);
    console.log("- Usuario:", usuarioPrueba);
    console.log("- Usuario del empleado:", empleadoPrueba.usuario);
    console.log("- Empleado del usuario:", usuarioPrueba.empleado);

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
            const datosEvento = gestor.seleccionarEvento(eventoId);
            if (datosEvento) {
                pantalla.mostrarDatosDelEventoSismico(datosEvento);
            }
        }
    }
});
