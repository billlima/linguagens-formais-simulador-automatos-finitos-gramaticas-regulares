import { Injectable } from '@angular/core';
import { AutomatoFinito } from '../models/automato-finito';
import { EstadoAF } from '../models/estado-af';
import { GramaticaRegular } from '../models/gramatica-regular';
import { Producao } from '../models/producao';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class GrToAfndService {

  private automatoFinito: AutomatoFinito;

  constructor(private utils: UtilsService) { }

  private iniciar() {
    this.automatoFinito = new AutomatoFinito([], [])
  }

  converter(gr: GramaticaRegular): AutomatoFinito {
    this.iniciar();

    gr.naoTerminais.forEach(naoTerminal => {
      gr.terminais.forEach(terminal => {
        this.automatoFinito.estados.push(this.buildEstadoAF(terminal, naoTerminal, gr.producoes));
      });
    });

    return this.automatoFinito;
  }

  /**
   * Cria os estados do automato finito para o terminal e não terminal informado
   * 
   * @param terminal 
   * @param naoTerminal 
   * @param producoes 
   */
  private buildEstadoAF(terminal: string, naoTerminal: string, producoes: Producao[]): EstadoAF {
    let estado: EstadoAF = new EstadoAF(naoTerminal, terminal, [], false);

    let valorProducao: string[] = this.buscarValorProducao(naoTerminal, terminal, producoes);    
    if (valorProducao != null) {
      valorProducao.forEach(valor => this.addVaiPara(estado, valor));
    }
    
    let prodPalavraVazia = this.buscarValorProducao(naoTerminal, 'e', producoes);
    if (prodPalavraVazia && prodPalavraVazia.length) {
      this.automatoFinito.estadosFinais.push(estado.estado);
    }
    this.automatoFinito.estadosFinais = this.utils.removerDuplicados(this.automatoFinito.estadosFinais); 

    return estado;
  }

  /**
   * Adiciona o campo vai para de acordo com o valor informado
   * 
   * @param estado 
   * @param valor 
   */
  private addVaiPara(estado: EstadoAF, valor: string) {
    if (valor.length == 1) {
      estado.vaiPara.push("X");
      this.automatoFinito.estadosFinais.push("X");
    } else {
      estado.vaiPara.push(valor.charAt(1));
    }
    return estado;
  }

  /**
   * Busca as produções do [símbolo] que iniciem com o [terminal]
   * 
   * @param simbolo 
   * @param terminal 
   * @param producoes 
   */
  private buscarValorProducao(simbolo: string, terminal: string, producoes: Producao[]): string[] {
    let p: Producao[] = producoes.filter((p: Producao) => {
      return p.simbolo == simbolo;
    });

    if (p.length) {
      let valor: string[] = p[0].producoes.filter(v => v.includes(terminal));
      if (valor.length) {
        return valor;
      }
    }

    return null;
  }
}
