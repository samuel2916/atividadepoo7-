class Pessoa {
    nome: string;
    sobrenome: string;

    constructor(n: string, s: string) {
        this.nome = n;
        this.sobrenome = s;
    }

    nomeCompleto() {
        return this.nome + " " + this.sobrenome;
    }
}

class Funcionario extends Pessoa {
    cod: string;
    salario: number;

    constructor(n: string, s: string, cod: string, sal: number) {
        super(n, s);
        this.cod = cod;
        this.salario = sal > 0 ? sal : 0;
    }

    primeiraParcela() {
        return this.salario * 0.6;
    }

    segundaParcela() {
        return this.salario * 0.4;
    }
}

class Professor extends Funcionario {
    formacao: string;

    constructor(n: string, s: string, cod: string, sal: number, formacao: string) {
        super(n, s, cod, sal);
        this.formacao = formacao;
    }

    primeiraParcela() {
        return this.salario;
    }

    segundaParcela() {
        return 0;
    }
}

class FolhaPagamento {
    pessoas: Pessoa[];

    constructor(lista: Pessoa[]) {
        this.pessoas = lista;
    }

    total() {
        let soma = 0;
        for (let p of this.pessoas) {
            if (p instanceof Funcionario) {
                soma += p.primeiraParcela();
                soma += p.segundaParcela();
            }
        }
        return soma;
    }
}

const x1 = new Pessoa("Leo", "Nogueira");
const x2 = new Pessoa("Mariana", "Pinto");

const f1 = new Funcionario("Joana", "Silva", "F12", 2000);
const f2 = new Funcionario("Paulo", "Moraes", "F13", 3100);
const f3 = new Funcionario("Tiago", "Lira", "F14", 1500);

const pr1 = new Professor("Helder", "Brito", "P01", 5000, "Mestre");
const pr2 = new Professor("Bianca", "Fonseca", "P02", 4200, "Doutora");

const folha = new FolhaPagamento([
    x1, x2, f1, f2, f3, pr1, pr2
]);

console.log(folha.total());