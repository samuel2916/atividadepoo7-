class Calculadora {
    num1: number;
    num2: number;

    constructor(num1: number, num2: number) {
        this.num1 = num1;
        this.num2 = num2;
    }

    somar(): number {
        return this.num1 + this.num2;
    }
}

class CalcCientifica extends Calculadora {

    potencia(): number {
        return this.num1 ** this.num2;
    }
}

const calc = new Calculadora(3, 3);
const calcCient = new CalcCientifica(3, 3);

console.log(calc.somar());
console.log(calcCient.potencia());