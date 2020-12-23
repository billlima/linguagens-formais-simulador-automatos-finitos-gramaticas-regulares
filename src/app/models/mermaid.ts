import { MermaidEstado } from './mermaid-estado';

export class Mermaid {
    public orientacao: string = "LR";
    public tipo: string;
    public estados: MermaidEstado[];
    public estilos: string[];

    ESTILO_ESTADO_FINAL = "style <ELEMENTO> stroke:#333,stroke-width:4px"
    ESTILO_ESTADO_INICIAL = "style <ELEMENTO> fill:#ccc"
    ESPACO = " ";
    QUEBRA_LINHA = "\n";
    ATRIBUI = "--> ";
    ATRIBUI_ENTRADA = "|";
    TAB = "\t";

    constructor() {
        this.orientacao = "LR";
        this.tipo = "graph";
        this.estados = [];
        this.estilos = [];
    }

    public adicionarEstiloEstadoInicial(estado: string) {
        this.adicionarEstilo(this.ESTILO_ESTADO_INICIAL.replace("<ELEMENTO>", estado));
    }

    public adicionarEstiloEstadoFinal(estado: string) {
        this.adicionarEstilo(this.ESTILO_ESTADO_FINAL.replace("<ELEMENTO>", estado));
    }

    public adicionarEstilo(estilo) {
        if (this.estilos.filter(v => v.includes(estilo)).length == 0) 
            this.estilos.push(estilo);
    }

    public toString() : string {
        let retorno = this.tipo + this.ESPACO + this.orientacao + this.QUEBRA_LINHA;

        this.estilos.forEach(estilo => {
            retorno += this.TAB + estilo + this.QUEBRA_LINHA;
        })
        
        this.estados.forEach(estado => {
            retorno += this.TAB 
                    + estado.estado
                    + this.ATRIBUI
                    + estado.terminal
                    + this.ESPACO + estado.transicao + this.QUEBRA_LINHA;
        });

        return retorno;
    }
}