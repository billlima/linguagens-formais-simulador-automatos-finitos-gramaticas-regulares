import { Injectable } from '@angular/core';
import { AFND } from '../models/afnd';
import { EstadoAF } from '../models/estado-af';
import { GR } from '../models/gr';
import { Producao } from '../models/producao';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class GrToAfndService {

  private afnd: AFND;

  constructor(private utils: UtilsService) { }

  private iniciar() {
    this.afnd = new AFND([], [])
  }

  converter(gr: GR): AFND {
    this.iniciar();

    gr.naoTerminais.forEach(naoTerminal => {
      gr.terminais.forEach(terminal => {
        this.afnd.estados.push(this.buildEstadoAF(terminal, naoTerminal, gr.producoes));
      });
    });

    if (this.utils.contemIgual(this.afnd.estadosFinais, "X")) {
      this.criarEstadoX(gr);
    }

    return this.afnd;
  }

  private criarEstadoX(gr: GR) {
    gr.naoTerminais.forEach(naoTerminal => {
      this.afnd.estados.push(new EstadoAF('X', naoTerminal, [], true));
    });
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
      this.afnd.estadosFinais.push(estado.estado);
    }
    this.afnd.estadosFinais = this.utils.removerDuplicados(this.afnd.estadosFinais); 

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
      this.afnd.estadosFinais.push("X");
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
