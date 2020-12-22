import { EtapaSimulador } from "./etapa-simulador";

export class Simulador {
    constructor(
        public etapas: EtapaSimulador[],
        public reconheceu: boolean,
    ) {}
}