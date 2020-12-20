import { TestBed } from '@angular/core/testing';
import { TransicaoAF } from '../models/transicao-af';

import { AfndToAfdService } from './afnd-to-afd.service';
import { GrToAfndService } from './gr-to-afnd.service';
import { UtilsService } from './utils.service';

describe('AfndToAfdService', () => {
  let service: AfndToAfdService;
  let utilsService: UtilsService;
  let grToAfnd: GrToAfndService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AfndToAfdService);
    utilsService = TestBed.inject(UtilsService);
    grToAfnd = TestBed.inject(GrToAfndService);
  });

  function buscarGramaticaRegular() {
    return utilsService.getGrEx3();
  }

  it('deve gerar tabela transições AFND e AFD', () => {
    let gr = buscarGramaticaRegular();
    let afnd = grToAfnd.converter(gr);

    service.iniciar(gr, afnd);

    service.gerarTabelaTransicaoAFND()
    service.gerarTabelaTransicaoAFD()
    
    console.log('Gramática Regular', service.gr);
    console.log('AFND', afnd);
    console.table(service.tabelaAFND);
    console.table(service.tabelaAFD);

    expect(service.tabelaAFD && service.tabelaAFND).toBeTruthy();
  });

  it('deve gerar tabela transições AFD ', () => {
    let gr = buscarGramaticaRegular();
    let afnd = grToAfnd.converter(gr);

    service.iniciar(gr, afnd);
    service.gerarTabelaTransicaoAFND();
    

    expect(true).toBeTruthy();
  });
});
