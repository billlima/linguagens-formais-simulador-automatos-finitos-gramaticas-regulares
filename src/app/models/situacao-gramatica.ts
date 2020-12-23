import { SituacaoRegra } from './situacao-regra';

export class SituacaoGramatica {
    constructor(
        public direito: SituacaoRegra,
        public esquerdo: SituacaoRegra
    ) { }
}