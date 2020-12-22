export class EtapaSimulador {
    constructor(
        public estadoAtual: string,
        public lendo: string,
        public transicao: string,
        public vaiPara: string
    ) {}
}