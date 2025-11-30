class Veiculo {
    placa: string;
    ano: number;

    constructor(placa: string, ano: number) {
        this.placa = placa;
        this.ano = ano;
    }
}

class Carro extends Veiculo {
    modelo: string;

    constructor(placa: string, ano: number, modelo: string) {
        super(placa, ano);
        this.modelo = modelo;
    }
}

class CarroEletrico extends Carro {
    bateriaKm: number;

    constructor(placa: string, ano: number, modelo: string, bateriaKm: number) {
        super(placa, ano, modelo);
        this.bateriaKm = bateriaKm;
    }
}