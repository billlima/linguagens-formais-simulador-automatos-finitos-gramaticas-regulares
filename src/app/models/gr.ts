import { Producao } from './producao';
import { SituacaoRegra } from './situacao-regra';
import { ComponentFactoryResolver } from '@angular/core';
import { SituacaoGramatica } from './situacao-gramatica';

export class GR {
    constructor(
        public terminais: string[],
        public naoTerminais: string[],
        public simboloInicial: string,
        public producoes: Producao[],
        public simboloProducao: string
    ) { }

    private VAZIO = "e";

    validarRegrasDeProducao(): SituacaoGramatica {
        return new SituacaoGramatica(this.validarLadoDireito(), this.validarLadoEsquerdo());
    }

    private validarLadoDireito(): SituacaoRegra {
        let situacaoRegra = new SituacaoRegra(true, []);

        if (this.terminais.filter(v => v.includes(this.VAZIO)).length >= 1) {
            situacaoRegra.mensagens.push("Possui o elemento vazio nos terminais.");
            situacaoRegra.valido = false;
            return situacaoRegra;
        }

        this.producoes.forEach(producao => {
            producao.producoes.forEach(p => {
                let valores = p.split("");

                if (valores.length == 1) {
                    if (situacaoRegra.valido && this.terminais.filter(v => v.includes(valores[0])).length != 1) {
                        if (valores[0] != this.VAZIO) {
                            situacaoRegra.valido = false;
                            situacaoRegra.mensagens.push("LADO DIREITO: Não possui um terminal.");
                        }
                    }
                } else if (valores.length == 2) {
                    let possuiTerminal: boolean = this.terminais.filter(v => v.includes(valores[0])).length == 1;
                    let possuiNaoTerminal: boolean = this.naoTerminais.filter(v => v.includes(valores[1])).length == 1;
                    let possuiVazioAcompanhado: boolean = valores.filter(v => v.includes(this.VAZIO)).length == 1;

                    if (situacaoRegra.valido && !(possuiTerminal && possuiNaoTerminal) && possuiVazioAcompanhado) {
                        situacaoRegra.valido = false;
                        situacaoRegra.mensagens.push("LADO DIREITO: Não possui um terminal seguido de um não terminal.")
                    }
                } else {
                    situacaoRegra.valido = false;
                    situacaoRegra.mensagens.push("LADO DIREITO: Entrada inválida.")
                }
            });

        });

        return situacaoRegra;
    }

    private validarLadoEsquerdo(): SituacaoRegra {
        const NUMERO_PERMITIDO_NAO_TERMINAL: number = 1;
        let situacaoRegra = new SituacaoRegra(true, []);

        this.producoes.forEach(producao => {
            if (!situacaoRegra.valido) {
                return;
            }

            if (situacaoRegra.valido && producao.simbolo.split("").length > NUMERO_PERMITIDO_NAO_TERMINAL) {
                situacaoRegra.valido = false;
                situacaoRegra.mensagens.push("LADO ESQUERDO: Possui mais de um símbolo.");
            }

            if (situacaoRegra.valido && this.naoTerminais.filter(v => v.includes(producao.simbolo)).length != NUMERO_PERMITIDO_NAO_TERMINAL) {
                situacaoRegra.valido = false;
                situacaoRegra.mensagens.push("LADO ESQUERDO: Não possui um valor não terminal.");
            }
        });

        return situacaoRegra;
    }
}