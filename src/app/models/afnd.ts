import { EstadoAF } from './estado-af';

export class AFND {
    constructor(
        public estados: EstadoAF[],
        public estadosFinais: string[],
    ) {}
}