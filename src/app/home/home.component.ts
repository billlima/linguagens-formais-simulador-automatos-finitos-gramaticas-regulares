import { Component, OnInit } from '@angular/core';
import { GR } from '../models/gr';
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
    
  }


}
