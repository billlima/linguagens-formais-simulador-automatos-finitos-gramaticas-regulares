import { TestBed } from '@angular/core/testing';

import { ReconhecimentoService } from './reconhecimento.service';

describe('ReconhecimentoService', () => {
  let service: ReconhecimentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReconhecimentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
