import { Producao } from './producao';
import { GRValidator } from './gr.validator';
import { ComponentFactoryResolver } from '@angular/core';
import { GRLadosValidator } from './gr-lados.validator';

export class GR {
    constructor(
        public terminais: string[],
        public naoTerminais: string[],
        public simboloInicial: string,
        public producoes: Producao[],
        public simboloProducao: string
    ) { }

    private VAZIO = "e";

    validarRegrasDeProducao(): GRLadosValidator {
        return new GRLadosValidator(this.validarLadoDireito(), this.validarLadoEsquerdo());
    }

    private validarLadoDireito(): GRValidator {
        let grValidator = new GRValidator(true, []);

        if (this.terminais.filter(v => v.includes(this.VAZIO)).length >= 1) {
            console.log(this.terminais);
            grValidator.mensagens.push("Possui o elemento vazio nos terminais.");
            grValidator.valido = false;
            return grValidator;
        }

        this.producoes.forEach(producao => {
            producao.producoes.forEach(p => {
                let valores = p.split("");

                if (valores.length == 1) {
                    if (grValidator.valido && this.terminais.filter(v => v.includes(valores[0])).length != 1) {
                        if (valores[0] != this.VAZIO) {
                            grValidator.valido = false;
                            grValidator.mensagens.push("LADO DIREITO: Não possui um terminal.");
                        }
                    }
                } else if (valores.length == 2) {
                    let possuiTerminal: boolean = this.terminais.filter(v => v.includes(valores[0])).length == 1;
                    let possuiNaoTerminal: boolean = this.naoTerminais.filter(v => v.includes(valores[1])).length == 1;
                    let possuiVazioAcompanhado: boolean = valores.filter(v => v.includes(this.VAZIO)).length == 1;

                    if (grValidator.valido && !(possuiTerminal && possuiNaoTerminal) && possuiVazioAcompanhado) {
                        grValidator.valido = false;
                        grValidator.mensagens.push("LADO DIREITO: Não possui um terminal seguido de um não terminal.")
                    }
                } else {
                    grValidator.valido = false;
                    grValidator.mensagens.push("LADO DIREITO: Entrada inválida.")
                }
            });

        });

        return grValidator;
    }

    private validarLadoEsquerdo(): GRValidator {
        const NUMERO_PERMITIDO_NAO_TERMINAL: number = 1;
        let grValidator = new GRValidator(true, []);

        this.producoes.forEach(producao => {
            if (!grValidator.valido) {
                return;
            }

            if (grValidator.valido && producao.simbolo.split("").length > NUMERO_PERMITIDO_NAO_TERMINAL) {
                grValidator.valido = false;
                grValidator.mensagens.push("LADO ESQUERDO: Possui mais de um símbolo.");
            }

            if (grValidator.valido && this.naoTerminais.filter(v => v.includes(producao.simbolo)).length != NUMERO_PERMITIDO_NAO_TERMINAL) {
                grValidator.valido = false;
                grValidator.mensagens.push("LADO ESQUERDO: Não possui um valor não terminal.");
            }
        });

        return grValidator;
    }
}