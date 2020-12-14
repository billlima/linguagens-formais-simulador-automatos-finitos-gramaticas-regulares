import { Injectable } from '@angular/core';
import { AFND } from '../models/afnd';
import { EstadoAF } from '../models/estado-af';
import { GR } from '../models/gr';
import { TransicaoAF } from '../models/transicao-af';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class AfndToAfdService {

  gr: GR;
  private afnd: AFND;

  tabelaAFND: TransicaoAF[];
  tabelaAFD: TransicaoAF[];

  private estadosAux: string[];

  constructor(private utils: UtilsService) { }

  iniciar(gr: GR, afnd: AFND) {
    this.gr = gr;
    this.afnd = afnd;
  }

  converter(gr: GR, afnd: AFND) {
    this.iniciar(gr, afnd);

    this.gerarTabelaTransicaoAFND();
    this.gerarTabelaTransicaoAFD();
    
  }

  // Tabela AFND ------------

  gerarTabelaTransicaoAFND(): TransicaoAF[] {
    let tabelaTransicaoAFND: TransicaoAF[] = this.getEstadosAFND().map((e) => new TransicaoAF(e, [], false, false));

    tabelaTransicaoAFND.forEach((transicaoAF: TransicaoAF) => {
      transicaoAF.estadoInicial = transicaoAF.estado == this.gr.simboloInicial;
      transicaoAF.estadoFinal = this.utils.contemIgual(this.afnd.estadosFinais, transicaoAF.estado);
      transicaoAF.transicoes = this.afnd.estados
        .filter((estadoAF: EstadoAF) => estadoAF.estado == transicaoAF.estado)
        .map((estadoAF: EstadoAF) => estadoAF.vaiPara);
    });

    return this.tabelaAFND = tabelaTransicaoAFND;
  }

  private getEstadosAFND() {
    let estados: String[] = this.afnd.estados.map((estado: EstadoAF) => estado.estado);
    return this.utils.removerDuplicados(estados);
  }

  // ------------------------
  // Tabela AFD ------------

  gerarTabelaTransicaoAFD(): TransicaoAF[] {
    let primeiraTransicaoND = this.buscarPrimeiroEstadoNaoDeterministico();

    if (primeiraTransicaoND) {
      this.estadosAux = [primeiraTransicaoND.estado];  
    } else {
      alert('Tabela AFND não possui transição não determinística, transições copiadas para tabela AFD');
      return this.tabelaAFD = this.tabelaAFND;
    }
    
    this.estadosAux = [primeiraTransicaoND ? primeiraTransicaoND.estado : this.tabelaAFND[0].estado];
    
    this.tabelaAFD = []
    return this.adicionarTransicoesAfd();    
  }  

  buscarPrimeiroEstadoNaoDeterministico(): TransicaoAF {
    let transicoesNaoDeterministicas = this.tabelaAFND.filter((transicao: TransicaoAF) => transicao.transicoes.filter((t: any[]) => t.length > 1).length);
    return transicoesNaoDeterministicas.length ? transicoesNaoDeterministicas[0] : null;
  }

  adicionarTransicoesAfd() {
    while(this.estadosAux.length && this.verificarEstadoExiste(this.tabelaAFD, this.estadosAux[0])) {
      this.estadosAux.shift();
    }
    
    if (!this.estadosAux.length) {
      return this.tabelaAFD;
    }    
    
    this.tabelaAFD.push(this.criarTransicaoAfd(this.estadosAux.shift()));
    
    return this.adicionarTransicoesAfd();
  }

  criarTransicaoAfd = (estado: string) => new TransicaoAF(
      estado, 
      this.getTransicoesAfd(estado),
      this.verificarEstadoInicial(),
      this.verificarEstadoFinal(estado) 
  );

  getTransicoesAfd(estado: string): any[] {
    return this.gr.terminais.map((_terminal: string, index: number) => {
      let t = estado
        .split(".")
        .map((estado: string) => this.buscarTransicaoAf(this.tabelaAFND, estado)[0].transicoes[index].join("."))
        .filter(item => item)
        .join('.');
        
      if (t && t !== '') {
        this.estadosAux.push(t);
        return t;
      } else {
        return null;
      }      
    });
  }

  verificarEstadoInicial(): boolean {
    return !this.tabelaAFND.length;
  }

  verificarEstadoFinal(estado: string): boolean {
    return estado.split(".")
      .map((e: string) => this.tabelaAFND.filter((t: TransicaoAF) => t.estado == e).length)
      .length > 0;
  }

  verificarEstadoExiste = (tabela: TransicaoAF[], estado: string) => this.buscarTransicaoAf(tabela, estado).length;

  buscarTransicaoAf(tabela: TransicaoAF[], estado: string): TransicaoAF[] {
    return tabela.filter((transicao: TransicaoAF) => transicao.estado == estado);
  }
}
