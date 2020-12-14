import { Producao } from './producao';

export class GR {
    constructor(
        public terminais: string[],
        public naoTerminais: string[],
        public simboloInicial: string,
        public producoes: Producao[]
    ) {}
}