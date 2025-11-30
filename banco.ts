class Conta {
    private _id: number;
    private _numero: string;
    private _saldo: number;
    private _cliente?: Cliente;
    private _dataAbertura: Date;

    constructor(numero: string, saldo: number) {
        this._id = 0;
        this._numero = numero;
        this._saldo = saldo;
        this._dataAbertura = new Date();
    }

    sacar(valor: number): void {
        this._saldo = this._saldo - valor;
    }

    depositar(valor: number): void {
        this._saldo = this._saldo + valor;
    }

    get saldo(): number {
        return this._saldo;
    }

    transferir(destino: Conta, valor: number): void {
        this.sacar(valor);
        destino.depositar(valor);
    }

    get numero(): string {
        return this._numero;
    }

    set id(umId: number) {
        this._id = umId;
    }

    get cliente(): Cliente | undefined {
        return this._cliente;
    }

    set cliente(umCliente: Cliente | undefined) {
        if (umCliente) {
            this._cliente = umCliente;
        }
    }
}

class Poupanca extends Conta {
    private _taxaJuros: number;

    constructor(numero: string, saldo: number, taxaJuros: number) {
        super(numero, saldo);
        this._taxaJuros = taxaJuros;
    }

    renderJuros(): void {
        let juros = this.saldo * this._taxaJuros / 100;
        this.depositar(juros);
    }
}

class ContaImposto extends Conta {
    private _taxaDesconto: number;

    constructor(numero: string, saldo: number, taxaDesconto: number) {
        super(numero, saldo);
        this._taxaDesconto = taxaDesconto;
    }

    sacar(valor: number): void {
        let desconto = this.saldo * this._taxaDesconto / 100;
        let total = valor + desconto;
        super.sacar(total);
    }
}

class Cliente {
    private _id: number;
    private _nome: string;
    private _cpf: string;
    private _dataNascimento: Date;
    private _contas: Conta[];

    constructor(nome: string, cpf: string, dataNascimento: Date) {
        this._id = 0;
        this._nome = nome;
        this._cpf = cpf;
        this._dataNascimento = dataNascimento;
        this._contas = [];
    }

    set id(umId: number) {
        this._id = umId;
    }

    get cpf(): string {
        return this._cpf;
    }

    get nome(): string {
        return this._nome;
    }

    get contas(): Conta[] {
        return this._contas;
    }
}

class Banco {
    private _contas: Conta[];
    private _clientes: Cliente[];
    private _idClienteAtual: number;
    private _idContaAtual: number;

    constructor() {
        this._contas = [];
        this._clientes = [];
        this._idClienteAtual = 1;
        this._idContaAtual = 1;
    }

    inserirConta(conta: Conta) {
        conta.id = this._idContaAtual++;
        if (!this.consultarConta(conta.numero)) {
            this._contas.push(conta);
        }
    }

    consultarConta(numero: string): Conta | undefined {
        for (let c of this._contas) {
            if (c.numero == numero) return c;
        }
        return undefined;
    }

    private consultarContaPorIndice(numero: string): number {
        for (let i = 0; i < this._contas.length; i++) {
            if (this._contas[i].numero == numero) return i;
        }
        return -1;
    }

    excluir(numero: string): void {
        let idx = this.consultarContaPorIndice(numero);
        if (idx != -1) {
            let conta = this._contas[idx];
            if (conta.cliente) return;
            for (let i = idx; i < this._contas.length - 1; i++) {
                this._contas[i] = this._contas[i + 1];
            }
            this._contas.pop();
        }
    }

    alterar(conta: Conta): void {
        let c = this.consultarConta(conta.numero);
        if (c) {
            let idx = this.consultarContaPorIndice(conta.numero);
            if (idx != -1) this._contas[idx] = conta;
        }
    }

    inserirCliente(cliente: Cliente): void {
        cliente.id = this._idClienteAtual++;
        if (!this.consultarCliente(cliente.cpf)) {
            this._clientes.push(cliente);
        }
    }

    consultarCliente(cpf: string): Cliente | undefined {
        for (let cli of this._clientes) {
            if (cli.cpf == cpf) return cli;
        }
        return undefined;
    }

    excluirCliente(cpf: string) {
        let indice = this._clientes.findIndex(c => c.cpf == cpf);
        if (indice >= 0 && this._clientes[indice].contas.length == 0) {
            this._clientes.splice(indice, 1);
        }
    }

    sacar(numero: string, valor: number): void {
        let conta = this.consultarConta(numero);
        if (conta) conta.sacar(valor);
    }

    depositar(numero: string, valor: number): void {
        let conta = this.consultarConta(numero);
        if (conta) conta.depositar(valor);
    }

    transferir(numeroOrigem: string, numeroDestino: string, valor: number): void {
        let origem = this.consultarConta(numeroOrigem);
        let destino = this.consultarConta(numeroDestino);
        if (origem && destino) origem.transferir(destino, valor);
    }

    associarContaCliente(numeroConta: string, cpfCliente: string): void {
        let conta = this.consultarConta(numeroConta);
        let cliente = this.consultarCliente(cpfCliente);
        if (conta && cliente && !this.jaExisteContaParaCliente(cliente.cpf, conta.numero)) {
            conta.cliente = cliente;
            cliente.contas.push(conta);
        }
    }

    jaExisteContaParaCliente(cpf: string, numero: string): boolean {
        let conta = this.consultarConta(numero);
        let cliente = this.consultarCliente(cpf);
        if (!conta || !cliente) return false;
        if (!conta.cliente) return false;
        if (conta.cliente.cpf == cliente.cpf) return true;
        for (let c of cliente.contas) {
            if (c.numero == conta.numero) return true;
        }
        return false;
    }

    pesquisarContaPorCPF(cpf: string): Conta | undefined {
        for (let c of this._contas) {
            if (c.cliente && c.cliente.cpf == cpf) return c;
        }
        return undefined;
    }

    listarContasSemCliente(): Conta[] {
        let lista: Conta[] = [];
        for (let c of this._contas) if (!c.cliente) lista.push(c);
        return lista;
    }

    listarContasCliente(cpf: string): Conta[] {
        let cliente = this.consultarCliente(cpf);
        if (cliente) return cliente.contas;
        return [];
    }

    totalizarSaldoCliente(cpf: string): number {
        let cliente = this.consultarCliente(cpf);
        let total = 0;
        if (cliente) {
            for (let c of cliente.contas) total += c.saldo;
        }
        return total;
    }

    obterQuantidadeDeContas(): number {
        return this._contas.length;
    }

    obterTotalDinheiroDepositado(): number {
        let total = 0;
        for (let c of this._contas) total += c.saldo;
        return total;
    }

    calcularMediaSaldoContas(): number {
        let qtd = this.obterQuantidadeDeContas();
        if (qtd == 0) return 0;
        return this.obterTotalDinheiroDepositado() / qtd;
    }

    realizarOrdemBancaria(numeroContaOrigem: string, numerosContasDestino: string[], valor: number): void {
        let origem = this.consultarConta(numeroContaOrigem);
        if (!origem) return;
        for (let numeroDestino of numerosContasDestino) {
            let destino = this.consultarConta(numeroDestino);
            if (destino) {
                origem.sacar(valor);
                destino.depositar(valor);
            }
        }
    }

    transferirTitularidade(numeroConta: string, cpf: string): void {
        let conta = this.consultarConta(numeroConta);
        let cliente = this.consultarCliente(cpf);
        if (!conta || !cliente) return;
        if (this.jaExisteContaParaCliente(cliente.cpf, conta.numero)) return;
        this.associarContaCliente(conta.numero, cliente.cpf);
    }

    carregarDados() {
        let conta1 = new Conta("111-1", 300);
        let conta2 = new Conta("222-2", 0);
        let conta3 = new Conta("333-3", 0);
        let conta4 = new Conta("444-4", 0);

        this.inserirConta(conta1);
        this.inserirConta(conta2);
        this.inserirConta(conta3);
        this.inserirConta(conta4);

        let cliente1 = new Cliente("Ely", "825", new Date(1979, 6, 29));
        let cliente2 = new Cliente("Nicolas", "999", new Date(2004, 4, 24));

        this.inserirCliente(cliente1);
        this.inserirCliente(cliente2);

        this.associarContaCliente("111-1", "825");
        this.associarContaCliente("222-2", "999");
        this.associarContaCliente("333-3", "825");
    }

    renderJuros(numeroConta: string): void {
        let conta = this.consultarConta(numeroConta);
        if (conta && conta instanceof Poupanca) {
            conta.renderJuros();
        }
    }
}

let conta1 = new Conta("111", 100);
let poupanca1 = new Poupanca("222", 100, 3);
let contaImposto = new ContaImposto("333", 100, 1);

let banco = new Banco();
banco.inserirConta(conta1);
banco.inserirConta(poupanca1);
banco.inserirConta(contaImposto);
banco.transferir("111", "222", 10);
banco.sacar("333", 10);
console.log(banco.consultarConta("333")?.saldo);

export { Conta, Cliente, Banco, Poupanca };