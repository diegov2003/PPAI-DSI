class EstacionSismologica {
    constructor(codigoEstacion, documentoCertificacionAdq, fechaSolicitudCertificacion, longitud, latitud, nombre, nroCertificacionAdquisicion) {
        this.codigoEstacion = codigoEstacion;
        this.documentoCertificacionAdq = documentoCertificacionAdq;
        this.fechaSolicitudCertificacion = fechaSolicitudCertificacion;
        this.longitud = longitud;
        this.latitud = latitud;
        this.nombre = nombre;
        this.nroCertificacionAdquisicion = nroCertificacionAdquisicion;
    }
}
export default EstacionSismologica;
