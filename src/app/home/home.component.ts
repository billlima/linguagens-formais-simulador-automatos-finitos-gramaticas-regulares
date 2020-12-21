import { Component, OnInit } from '@angular/core';
import { GR } from '../models/gr';
import { Producao } from '../models/producao';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GrToAfndService } from '../utils/gr-to-afnd.service';
import { GRLadosValidator } from '../models/gr-lados.validator';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  sentenca: string;

	form: FormGroup;
	EXP_REMOVER_ESPACO = /\ /gi;
	EXP_BUSCAR_TERMINAIS_NAO_TERMINAIS = /\{(.*?)\},\{(.*?)\}/;
	QUEBRA_DE_LINHA = "\n";
	SEPARADOR_ENTRADA = ",";
	SEPARADOR_PRODUCOES = "|";
	IGUALDADE="="
	ATRIBUICAO_REGRA="->"
	retornoValidacaoDasRegras : GRLadosValidator;
	gramaticaFinal: GR;

	constructor(
		public grToAfndService: GrToAfndService,
		private toastr: ToastrService,
		private fb: FormBuilder) { }

	ngOnInit(): void {
		this.gerarForm();
	}

	buscarProducoes(entrada: string[]): string[] {
		entrada.shift();
		return entrada;
	}

	buscarPrimeiraLinha(entrada: string[]): string {
		return entrada[0];
	}

	gerarArrayEntrada(entrada: string): string[] {
		if (entrada == null) {
			return null;
		}

		let arrayEntrada: string[] = [];

		entrada.trim().split(this.QUEBRA_DE_LINHA).forEach(linha => {
			if (linha.length > 0 )
				arrayEntrada.push(linha.trim().replace(this.EXP_REMOVER_ESPACO, ""));
		});

		return arrayEntrada.length > 0 ? arrayEntrada : null;
	}

	gerarGramaticaRegularZerada(): GR {
		return new GR([], [], '', [], '');
	}

	getSimboloProducao(info: string[]): string {
		return info[info.length -2];
	}

	getSimboloInicial(info: string[]): string {
		return info[info.length -1];
	}

	converterPrimeiraLinha(dados: string) :GR {
		let gr : GR = this.gerarGramaticaRegularZerada();

		if (dados != null) {
			dados = dados.substr(1, dados.length - 2);
			
			let m : RegExpExecArray;
			if ((m = this.EXP_BUSCAR_TERMINAIS_NAO_TERMINAIS.exec(dados)) !== null) {
				gr.naoTerminais = gr.naoTerminais.concat(m[1].split(this.SEPARADOR_ENTRADA));
				gr.terminais = gr.terminais.concat(m[2].split(this.SEPARADOR_ENTRADA))
			}

			let info = dados.split(this.SEPARADOR_ENTRADA);
			gr.simboloProducao = this.getSimboloProducao(info);
			gr.simboloInicial = this.getSimboloInicial(info);
		} else {
			return null;
		}

		return gr;
	} 

	gerarArrayProducao(producoes: string[], simboloProducao: string) : Producao[] {
		let objetos : Producao[] = [];

		producoes.forEach(linha => {
			if (linha.length > 0 && linha != (simboloProducao + this.IGUALDADE)) {
				let producoes = linha.split(this.ATRIBUICAO_REGRA);
				objetos.push(new Producao(producoes[0], producoes[1].split(this.SEPARADOR_PRODUCOES)));
			}
		});

		return objetos;
	}

	validarEntrada() {
		let entrada: string = this.form.get('gramatica').value;

		let entradaArray: string[] = this.gerarArrayEntrada(entrada);

		if (entradaArray == null) {
			this.toastr.error("Entrada inválida.");
			return false;;
		}

		let dados : string = this.buscarPrimeiraLinha(entradaArray);
		let producoes = this.buscarProducoes(entradaArray);
		let objeto = this.converterPrimeiraLinha(dados);
		objeto.producoes = this.gerarArrayProducao(producoes, objeto.simboloProducao);

		this.gramaticaFinal = objeto;
		this.retornoValidacaoDasRegras = objeto.validarRegrasDeProducao();

		if (this.retornoValidacaoDasRegras.direito.valido && this.retornoValidacaoDasRegras.esquerdo.valido) {
			this.toastr.success("Entrada válida.");
		} else {
			
			this.retornoValidacaoDasRegras.direito.mensagens.forEach(mensagem => {
				this.toastr.error(mensagem);
			});

			this.retornoValidacaoDasRegras.esquerdo.mensagens.forEach(mensagem => {
				this.toastr.error(mensagem);
			});
			
		}
	}

	gerarForm() {
		this.form = this.fb.group({
			gramatica: ['G = ({S, A}, {a, b, c}, P, S)\nP =\nS -> aS | bA\nA -> c', [Validators.required]]
		});
	}


}
