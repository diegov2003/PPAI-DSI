class Clasificacion {
    constructor(nombre, kmProfundidadDesde, kmProfundidadHasta) {
        this.nombre = nombre;
        this.kmProfundidadDesde = kmProfundidadDesde;
        this.kmProfundidadHasta = kmProfundidadHasta;
    }

    getNombre() {
        return this.nombre;
    }
}
export default Clasificacion;
