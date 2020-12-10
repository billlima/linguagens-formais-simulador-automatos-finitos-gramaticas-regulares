import { Producao } from './producao';

export class GramaticaRegular {
    constructor(
        public terminais: string[],
        public naoTerminais: string[],
        public simboloInicial: string,
        public producoes: Producao[]
    ) {}
}