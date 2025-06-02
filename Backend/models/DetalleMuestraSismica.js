import TipoDato from './TipoDato.js';

class DetalleMuestraSismica {
    constructor(valor, tipoDato) {
        this.valor = valor;
        this.tipoDato = tipoDato;
    }

    getValor() {
        return this.valor;
    }

    getTipoDato() {
        return this.tipoDato;
    }

    getDatos() {
        return {
            valor: this.getValor(),
            tipoDato: this.getTipoDato().getDenominacion(),
            nombreUnidadMedida: this.getTipoDato().getNombreUnidadMedida(),
            valorUmbral: this.getTipoDato().getValorUmbral()
        };
    }
}
export default DetalleMuestraSismica;

let unDetalle = new DetalleMuestraSismica(5.0, new TipoDato("Magnitud", "Richter", 5.0));
console.log(unDetalle.getDatos());
console.log(unDetalle.valor);
console.log(unDetalle.tipoDato.getDenominacion());
console.log(unDetalle.tipoDato.nombreUnidadMedida);
console.log(unDetalle.tipoDato.valorUmbral);
console.log(unDetalle.tipoDato.esTuDenominacion("Magnitud"));
console.log(unDetalle.tipoDato.esTuDenominacion("Intensidad"));
