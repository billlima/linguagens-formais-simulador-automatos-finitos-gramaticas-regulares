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
}
