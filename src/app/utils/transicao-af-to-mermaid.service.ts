import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Mermaid } from '../models/mermaid';
import { UtilsService } from './utils.service';
import { TransicaoAF } from './../models/transicao-af'
import { GR } from './../models/gr'
import { MermaidEstado } from '../models/mermaid-estado';

@Injectable({
  providedIn: 'root'
})
export class TransicaoAFtoMermaidService {

  constructor(private utils: UtilsService, private toastr: ToastrService) { }

  converter(tabelaAFD: TransicaoAF[], gramaticaFinal: GR): Mermaid {
    let mermaid: Mermaid = new Mermaid();

    tabelaAFD.forEach(value => {
        let transicoes = value.transicoes;

        transicoes.forEach((transicao, indice) => {
            if (transicao != null && transicao.length > 0) {
                mermaid.estados.push(new MermaidEstado(value.estado, gramaticaFinal.terminais[indice], transicao));
                if (value.estadoInicial) mermaid.adicionarEstiloEstadoInicial(value.estado);
                if (value.estadoFinal) mermaid.adicionarEstiloEstadoFinal(value.estado);
            }
        });
    });

    return mermaid;
  }
}
