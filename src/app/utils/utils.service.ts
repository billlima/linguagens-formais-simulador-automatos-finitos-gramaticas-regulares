import { Injectable } from '@angular/core';
import { GR } from '../models/gr';
import { Producao } from '../models/producao';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  removerDuplicados(array: any[]) {
    return Array.from(new Set(array))
  }

  contemIgual(array: any[], valor: any) {
    return array.filter(e => e == valor).length > 0;
  }

  //----------------------------

  getGrEx1() {
    return new GR(['a','b','c'], ['S','A'], 'S', [
      new Producao('S', ['aS', 'bA']),
      new Producao('A', ['c'])
    ], 'P');
  }

  getGrEx2() {
    return new GR(['0', '1'], ['S','B'], 'S', [
      new Producao('S', ['0B']),
      new Producao('B', ['0B', '1S', '0'])
    ], 'P');
  }

  getGrEx3() {
    return new GR(['a','b'], ['S','A','B'], 'S', [
      new Producao('S', ['aA', 'bB', 'e']),
      new Producao('A', ['aA', 'bB']),
      new Producao('B', ['bB', 'b'])      
    ], 'P');
  }
}
