import { EstadoAF } from './estado-af';

export class AutomatoFinito {
    constructor(
        public estados: EstadoAF[],
        public estadosFinais: string[]
    ) {}
}