import { Component, OnInit } from '@angular/core';
import { GR } from '../models/gr';
import { Producao } from '../models/producao';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GrToAfndService } from '../utils/gr-to-afnd.service';
import { GRLadosValidator } from '../models/gr-lados.validator';
import { StringToGrService } from '../utils/string-to-gr.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	form: FormGroup;
	gramaticaFinal: GR;

	constructor(
		public grToAfndService: GrToAfndService,
		private stringToGrService: StringToGrService,
		private toastr: ToastrService,
		private fb: FormBuilder) { }

	ngOnInit(): void {
		this.gerarForm();
	}

	validarEntrada() {
		this.gramaticaFinal = this.stringToGrService.validarEntrada(this.form.get('gramatica').value);
		console.log(this.gramaticaFinal)
	}

	gerarForm() {
		this.form = this.fb.group({
			gramatica: ['G = ({S, A}, {a, b, c}, P, S)\nP =\nS -> aS | bA\nA -> c', [Validators.required]]
		});
	}


}
