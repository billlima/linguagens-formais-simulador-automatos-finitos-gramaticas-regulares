import { Component, OnInit } from '@angular/core';
import { GR } from '../models/gr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GrToAfndService } from '../utils/gr-to-afnd.service';
import { StringToGrService } from '../utils/string-to-gr.service';
import { AFND } from '../models/afnd';
import { AfndToAfdService } from '../utils/afnd-to-afd.service';
import { TransicaoAF } from '../models/transicao-af';
import { Simulador } from '../models/simulador';
import { ReconhecimentoService } from '../utils/reconhecimento.service';
import { GeradorSentencaService } from '../utils/gerador-sentenca.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	sentenca: string;

	form: FormGroup;
	gramaticaFinal: GR;
	afnd: AFND;
	tabelaAFND: TransicaoAF[];
	tabelaAFD: TransicaoAF[];
	simulador: Simulador[];

	constructor(
		private grToAfndService: GrToAfndService,
		private stringToGrService: StringToGrService,	
		private afndToAfdService: AfndToAfdService,
		private reconhecimentoService: ReconhecimentoService,
		private geradorSentencaService: GeradorSentencaService,
		private fb: FormBuilder) { }

	ngOnInit(): void {
		this.gerarForm();
		// this.converter();
		// this.gerarSentenca();
		// this.simular();
	}

	converter() {
		this.gramaticaFinal = this.stringToGrService.validarEntrada(this.form.get('gramatica').value);
		if (!this.gramaticaFinal) return;

		this.afnd = this.grToAfndService.converter(this.gramaticaFinal);
		if (!this.afnd) return;

		let tabelas = this.afndToAfdService.converter(this.gramaticaFinal, this.afnd);
		this.tabelaAFND = tabelas[0];
		this.tabelaAFD = tabelas[1];	
		
		console.log('this.afnd', this.afnd);		
		console.log('this.tabelaAFND', this.tabelaAFND);
		console.log('this.tabelaAFD', this.tabelaAFD);
		
	}

	gerarForm() {
		this.form = this.fb.group({
			gramatica: ['', [Validators.required]]
		});
	}

	gerarSentenca() {
		this.sentenca = this.geradorSentencaService.gerar(this.gramaticaFinal);
	}

	simular() {
		this.simulador = this.reconhecimentoService.simular(this.gramaticaFinal, this.tabelaAFD, this.sentenca);
		console.log('this.simulador', this.simulador);		
	}

	setEx1 = () => this.form.controls['gramatica'].setValue('G = ({S, A}, {a, b, c}, P, S)\nP =\nS -> aS | bA\nA -> c');
	setEx2 = () => this.form.controls['gramatica'].setValue('G = ({S, B}, {0, 1}, P, S)\nP =\nS -> 0B\nB -> 0B | 1S | 0');
	setEx3 = () => this.form.controls['gramatica'].setValue('G = ({S, A, B}, {a, b}, P, S)\nP =\nS -> aA | bB | e\nA -> aA | bB\nB -> bB | b');
}
