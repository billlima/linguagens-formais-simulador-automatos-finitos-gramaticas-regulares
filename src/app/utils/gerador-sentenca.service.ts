import { Injectable } from '@angular/core';
import { GR } from '../models/gr';

@Injectable({
  providedIn: 'root'
})
export class GeradorSentencaService {

  constructor() { }

  gerar(gr: GR): string {

    let tamanhoSentenca = this.getRandom(3, 10);
    let sentenca = "";

    for (let x=0; x<tamanhoSentenca; x++) {
      sentenca += gr.terminais[this.getRandom(0, gr.terminais.length)]
    }

    return sentenca;
  }

  getRandom(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
