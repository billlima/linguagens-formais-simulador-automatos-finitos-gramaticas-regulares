import { Component, OnInit } from '@angular/core';
import { GramaticaRegular } from '../models/gramatica-regular';
import { Producao } from '../models/producao';
import { GrToAfndService } from '../utils/gr-to-afnd.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public grToAfndService: GrToAfndService) { }

  gramatica = `G = ({S, A}, {a, b, c}, P, S)\nP =\nS -> aS | bA\nA -> c`;

  ngOnInit(): void {
    // this.testeGrToAfnd1();
    // this.testeGrToAfnd2();
    // this.testeGrToAfnd3();
  }

  testeGrToAfnd1() {
    let gr = new GramaticaRegular(['a','b','c'], ['S','A'], 'S', [
      new Producao('S', ['aS', 'bA']),
      new Producao('A', ['c'])
    ]);

    console.log(this.grToAfndService.converter(gr));
  }

  testeGrToAfnd2() {
    let gr = new GramaticaRegular(['0', '1'], ['S','B'], 'S', [
      new Producao('S', ['0B']),
      new Producao('B', ['0B', '1S', '0'])
    ]);

    console.log(this.grToAfndService.converter(gr));
  }

  testeGrToAfnd3() {
    let gr = new GramaticaRegular(['a','b','c'], ['S','A','B'], 'S', [
      new Producao('S', ['aA', 'bB', 'e']),
      new Producao('A', ['aA', 'bB']),
      new Producao('B', ['bB', 'b'])      
    ]);

    console.log(this.grToAfndService.converter(gr));
  }



}
