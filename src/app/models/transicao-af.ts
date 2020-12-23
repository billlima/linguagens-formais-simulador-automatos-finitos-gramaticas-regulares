export class TransicaoAF {
    constructor(
        public estado: string,
        public transicoes: any[],
        public estadoInicial: boolean,
        public estadoFinal: boolean,
        public visitado: boolean
    ) {}
}