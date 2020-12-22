import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EtapaSimulador } from '../models/etapa-simulador';
import { GR } from '../models/gr';
import { Simulador } from '../models/simulador';
import { TransicaoAF } from '../models/transicao-af';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ReconhecimentoService {
  
  gr: GR;
  tabela: TransicaoAF[];
  simulador: Simulador[];
  
  constructor(private utils: UtilsService, private toastr: ToastrService) { }
  
  iniciar(gr: GR, tabela: TransicaoAF[]) {
    this.gr = gr;
    this.tabela = tabela;
    this.simulador = [];
  }

  simular(gr: GR, tabela: TransicaoAF[], sentenca: string): Simulador[] {
    this.iniciar(gr, tabela);

    try {
      this.validarSentenca(sentenca);
      
      this.buscarEstadosIniciais().forEach((t: TransicaoAF, index: number) => {
        this.simulador.push(new Simulador([], false));
        this.reconhecer(t, index, sentenca);
      });

      return this.simulador;
    } catch(e) {
      console.log(e);
      
      return null;
    }
  }

  buscarEstadosIniciais() {
    return this.tabela.filter((t: TransicaoAF) => t.estadoInicial);
  }

  reconhecer(t: TransicaoAF, idx: number, sentenca: string) {
    if (this.verificarReconhecimento(t, sentenca)) {
      this.simulador[idx].etapas.push(new EtapaSimulador(t.estado, '','',''));
      this.toastr.success("Reconheceu!");
      this.simulador[idx].reconheceu = true;
      return;
    }

    let lendo = sentenca.charAt(0);

    let proximoEstado: TransicaoAF = this.getProximoEstado(t, lendo);
    if (!proximoEstado) {
      this.simulador[idx].etapas.push(new EtapaSimulador(t.estado, lendo, '-', '-'));
      this.toastr.error("Não reconheceu!");
      return;
    }

    this.simulador[idx].etapas.push(new EtapaSimulador(t.estado, lendo, '-', proximoEstado.estado));    
    sentenca = sentenca.substring(1);
    return this.reconhecer(proximoEstado, idx, sentenca);
  }

  verificarReconhecimento = (t: TransicaoAF, sentenca: string) => !sentenca.length && t.estadoFinal;

  getProximoEstado(t: TransicaoAF, lendo: string) {
    let idxSimbolo = this.gr.terminais.findIndex((item) => item == lendo);
    let proximoEstado = t.transicoes[idxSimbolo];
    return !proximoEstado ? null : this.tabela.filter((t: TransicaoAF) => t.estado == proximoEstado)[0];
  }
  
  validarSentenca(sentenca: string) {
    for (let x=0; x<sentenca.length; x++) {
      let char = sentenca.charAt(x);
      if (!this.utils.contemIgual(this.gr.terminais, char)) {
        this.toastr.error("Sentença inválida");
        
        throw 'erro';
      }
    }
  }
}
