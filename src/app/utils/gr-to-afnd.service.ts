import { Injectable } from '@angular/core';
import { GramaticaRegular } from '../models/gramatica-regular';

@Injectable({
  providedIn: 'root'
})
export class GrToAfndService {

  constructor() { }

  converter(gr: GramaticaRegular) {

    let estados: any[] = [];

    gr.terminais.forEach(terminal => {
      gr.naoTerminais.forEach(naoTerminal => {
        estados.push({

        })
      })
    })
  }

  buscarProducao(producoes: any, search: string) {
    return producoes.forEach(p => {
    });
  }
}
