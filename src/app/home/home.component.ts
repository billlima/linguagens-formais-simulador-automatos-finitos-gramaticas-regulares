import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GR } from '../models/gr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GrToAfndService } from '../utils/gr-to-afnd.service';
import { StringToGrService } from '../utils/string-to-gr.service';
import { AFND } from '../models/afnd';
import { AfndToAfdService } from '../utils/afnd-to-afd.service';
import { TransicaoAF } from '../models/transicao-af';
import { Mermaid } from '../models/mermaid';
import { Simulador } from '../models/simulador';
import { GeradorSentencaService } from '../utils/gerador-sentenca.service';
import { SimuladorService } from '../utils/simulador.service';
import { TransicaoAFtoMermaidService } from '../utils/transicao-af-to-mermaid.service';
import * as mermaid from 'mermaid';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
	@ViewChild('mermaidDiv') mermaidDiv: ElementRef;
	element: any

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
		private simuladorService: SimuladorService,
		private geradorSentencaService: GeradorSentencaService,
		private transicaoAFtoMermaidService: TransicaoAFtoMermaidService,
		private fb: FormBuilder) { }

	ngOnInit(): void {
		this.gerarForm();
	}

	ngAfterViewInit(): void {
		mermaid.initialize({
			theme: "default"
		});
	}

	converter() {
		this.gramaticaFinal = this.stringToGrService.validarEntrada(this.form.get('gramatica').value);
		if (!this.gramaticaFinal) return;

		this.afnd = this.grToAfndService.converter(this.gramaticaFinal);
		if (!this.afnd) return;

		let tabelas = this.afndToAfdService.converter(this.gramaticaFinal, this.afnd);
		this.tabelaAFND = tabelas[0];
		this.tabelaAFD = tabelas[1];

		this.gerarAutomato();
	}

	gerarAutomato() {
		this.element = this.mermaidDiv.nativeElement;
		let sintaxeMermaid = this.transicaoAFtoMermaidService.converter(this.tabelaAFD, this.gramaticaFinal).toString();
		mermaid.render("graphDiv", sintaxeMermaid,
			(svgCode, bindFunctions) => {
				this.element.innerHTML = svgCode;
				bindFunctions(this.element);
			});
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
		this.simulador = this.simuladorService.simular(this.gramaticaFinal, this.tabelaAFD, this.sentenca);
	}

	setEx1 = () => this.form.controls['gramatica'].setValue('G = ({S, A}, {a, b, c}, P, S)\nP =\nS -> aS | bA\nA -> c');
	setEx2 = () => this.form.controls['gramatica'].setValue('G = ({S, B}, {0, 1}, P, S)\nP =\nS -> 0B\nB -> 0B | 1S | 0');
	setEx3 = () => this.form.controls['gramatica'].setValue('G = ({S, A, B}, {a, b}, P, S)\nP =\nS -> aA | bB | e\nA -> aA | bB\nB -> bB | b');
}
