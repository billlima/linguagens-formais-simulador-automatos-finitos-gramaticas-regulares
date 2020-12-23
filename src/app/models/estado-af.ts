export class EstadoAF {
    constructor(
        public estado: string,
        public lendo: string,
        public vaiPara: string[],
        public estadoFinal: boolean,
    ) {}
}