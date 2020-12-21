import { Injectable } from '@angular/core';
import { GR } from '../models/gr';
import { GRLadosValidator } from '../models/gr-lados.validator';
import { Producao } from '../models/producao';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root'
})
export class StringToGrService {
    EXP_REMOVER_ESPACO = /\ /gi;
    EXP_BUSCAR_TERMINAIS_NAO_TERMINAIS = /\{(.*?)\},\{(.*?)\}/;
    QUEBRA_DE_LINHA = "\n";
    SEPARADOR_ENTRADA = ",";
    SEPARADOR_PRODUCOES = "|";
    IGUALDADE = "="
    ATRIBUICAO_REGRA = "->"
    retornoValidacaoDasRegras: GRLadosValidator;
    gramaticaFinal: GR;

    constructor(private utils: UtilsService) { }

    buscarPrimeiraLinha(entrada: string[]): string {
        return entrada[0];
    }

    buscarProducoes(entrada: string[]): string[] {
        entrada.shift();
        return entrada;
    }

    gerarArrayEntrada(entrada: string): string[] {
        if (entrada == null) {
            return null;
        }

        let arrayEntrada: string[] = [];

        entrada.trim().split(this.QUEBRA_DE_LINHA).forEach(linha => {
            if (linha.length > 0)
                arrayEntrada.push(linha.trim().replace(this.EXP_REMOVER_ESPACO, ""));
        });

        return arrayEntrada.length > 0 ? arrayEntrada : null;
    }

    gerarGramaticaRegularZerada(): GR {
        return new GR([], [], '', [], '');
    }

    getSimboloProducao(info: string[]): string {
        return info[info.length - 2];
    }

    getSimboloInicial(info: string[]): string {
        return info[info.length - 1];
    }

    converterPrimeiraLinha(dados: string): GR {
        let gr: GR = this.gerarGramaticaRegularZerada();

        if (dados != null) {
            dados = dados.substr(1, dados.length - 2);

            let m: RegExpExecArray;
            if ((m = this.EXP_BUSCAR_TERMINAIS_NAO_TERMINAIS.exec(dados)) !== null) {
                gr.naoTerminais = gr.naoTerminais.concat(m[1].split(this.SEPARADOR_ENTRADA));
                gr.terminais = gr.terminais.concat(m[2].split(this.SEPARADOR_ENTRADA))
            }

            let info = dados.split(this.SEPARADOR_ENTRADA);
            gr.simboloProducao = this.getSimboloProducao(info);
            gr.simboloInicial = this.getSimboloInicial(info);
        } else {
            return null;
        }

        return gr;
    }

    gerarArrayProducao(producoes: string[], simboloProducao: string): Producao[] {
        let objetos: Producao[] = [];

        producoes.forEach(linha => {
            if (linha.length > 0 && linha != (simboloProducao + this.IGUALDADE)) {
                let producoes = linha.split(this.ATRIBUICAO_REGRA);
                objetos.push(new Producao(producoes[0], producoes[1].split(this.SEPARADOR_PRODUCOES)));
            }
        });

        return objetos;
    }

    validarEntrada(entrada: string) : GR {
        let entradaArray: string[] = this.gerarArrayEntrada(entrada);

        if (entradaArray == null) {
            return null;
        }

        let dados: string = this.buscarPrimeiraLinha(entradaArray);
        let producoes = this.buscarProducoes(entradaArray);
        let objeto = this.converterPrimeiraLinha(dados);
        objeto.producoes = this.gerarArrayProducao(producoes, objeto.simboloProducao);

        this.gramaticaFinal = objeto;
        this.retornoValidacaoDasRegras = objeto.validarRegrasDeProducao();

        return this.gramaticaFinal;
    }
}