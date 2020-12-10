import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GrToAfndService {

  constructor() { }

  /**
   * 
   * @param terminais array com os terminais 
   * @param naoTerminais array com os não terminais
   * @param producoes array de maps com as produções de cada terminal. Ex.: S: [aS, bA]
   */
  converter(terminais: string[], naoTerminais: String[], producoes: any) {
    
  }
}
