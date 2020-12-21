import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

    constructor(private utils: UtilsService,
        private toastr: ToastrService) { }

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
        let simboloProducao = info[info.length - 2];

        if (simboloProducao && simboloProducao.length > 0) {
            return simboloProducao;
        }

        throw { type: "error", message: "Erro ao validar o símbolo de produção." }; 
    }

    getSimboloInicial(info: string[]): string {
        let simboloInicial = info[info.length - 1];
        
        if (simboloInicial && simboloInicial.length > 0) {
            return simboloInicial;
        }

        throw { type: "error", message: "Erro ao validar o símbolo inicial." }; 
    }

    converterPrimeiraLinha(dados: string): GR {
        let gr: GR = this.gerarGramaticaRegularZerada();

        if (dados != null) {
            dados = dados.substr(1, dados.length - 2);

            let m: RegExpExecArray;
            if ((m = this.EXP_BUSCAR_TERMINAIS_NAO_TERMINAIS.exec(dados)) !== null) {
                gr.naoTerminais = gr.naoTerminais.concat(m[1].split(this.SEPARADOR_ENTRADA));
                gr.terminais = gr.terminais.concat(m[2].split(this.SEPARADOR_ENTRADA))
            } else {
                throw { type: "error", message: "Ocorreu um erro ao ler as informações referente aos terminais e não terminais." }; 
            }

            let info = dados.split(this.SEPARADOR_ENTRADA);
            try {
                gr.simboloProducao = this.getSimboloProducao(info);
            } catch (e) {
                throw e;
            }
            
            try {
                gr.simboloInicial = this.getSimboloInicial(info);
            } catch(e) {
                throw e;
            }
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

    validarEntrada(entrada: string): GR {
        try {
            let entradaArray: string[] = this.gerarArrayEntrada(entrada);

            if (entradaArray == null) {
                throw { type: "error", message: "Entrada vazia." }; 
            }

            let dados: string = this.buscarPrimeiraLinha(entradaArray);
            let producoes = this.buscarProducoes(entradaArray);
            let objeto = this.converterPrimeiraLinha(dados);
            objeto.producoes = this.gerarArrayProducao(producoes, objeto.simboloProducao);

            this.gramaticaFinal = objeto;

            this.retornoValidacaoDasRegras = objeto.validarRegrasDeProducao();

            if (this.retornoValidacaoDasRegras.direito.valido && this.retornoValidacaoDasRegras.esquerdo.valido) {
                this.toastr.success("Entrada válida.");
                return this.gramaticaFinal;
            } else {
                
                this.retornoValidacaoDasRegras.direito.mensagens.forEach(mensagem => {
                    this.toastr.error(mensagem);
                });
    
                this.retornoValidacaoDasRegras.esquerdo.mensagens.forEach(mensagem => {
                    this.toastr.error(mensagem);
                });

                return null;
            }
        } catch (e) {
            console.log(e);
            this.toastr.error(e.type == 'error' ? e.message : "Ocorreu um erro ao converter a gramática.");
            return null;
        }       
    }
}