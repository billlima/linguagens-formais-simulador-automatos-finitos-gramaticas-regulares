import { GRValidator } from './gr.validator';

export class GRLadosValidator {
    constructor(
        public direito: GRValidator,
        public esquerdo: GRValidator
    ) { }
}