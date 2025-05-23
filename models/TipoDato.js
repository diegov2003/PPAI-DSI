class TipoDato {
    constructor(denominacion, nombreUnidadMedida, valorUmbral) {
        this.denominacion = denominacion;
        this.nombreUnidadMedida = nombreUnidadMedida;
        this.valorUmbral = valorUmbral;
    }

    esTuDenominacion(denominacion) {
        return this.denominacion === denominacion;
    }

    getDenominacion() {
        return this.denominacion;
    }
    getNombreUnidadMedida() {
        return this.nombreUnidadMedida;
    }
    getValorUmbral() {
        return this.valorUmbral;
    }
    getDatos () {
        return {
            denominacion: this.denominacion,
            nombreUnidadMedida: this.nombreUnidadMedida,
            valorUmbral: this.valorUmbral
        };
    }
}


let unDato = new TipoDato("Magnitud", "Richter", 5.0);
console.log(unDato.getDatos());
console.log(unDato.getDenominacion());  
console.log(unDato.getNombreUnidadMedida());
console.log(unDato.getValorUmbral());
console.log(unDato.esTuDenominacion("Magnitud"));
console.log(unDato.esTuDenominacion("Intensidad"));

export default TipoDato;
