import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  removerDuplicados(array: any[]) {
    return Array.from(new Set(array))
  }
}
