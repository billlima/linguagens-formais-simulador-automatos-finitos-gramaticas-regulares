import { strict } from 'assert';

export class MermaidEstado {
    CRIAR_CIRCULO_LE = "((";
    CRIAR_CIRCULO_LD = "))";
    ADICIONAR_TEXTO_SETA = "|";
    ESPACO = " ";

    constructor(
        public estado: string,
        public terminal: string,
        public transicao: string
    ) {
        this.estado = this.adicionarCirculo(estado);
        this.terminal = this.adicionarTextoSeta(terminal);
        this.transicao = this.adicionarCirculo(transicao);
    }

    private adicionarTextoSeta(terminal: string): string {
        return this.ADICIONAR_TEXTO_SETA + terminal + this.ADICIONAR_TEXTO_SETA;
    }

    private adicionarCirculo(estado: string): string {
        return estado + this.CRIAR_CIRCULO_LE + estado + this.CRIAR_CIRCULO_LD;
    }
}   