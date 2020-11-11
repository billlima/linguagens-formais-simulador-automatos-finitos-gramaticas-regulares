import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  gramatica = `G = ({S, A}, {a, b, c}, P, S)\nP =\nS -> aS | bA\nA -> c`;

  ngOnInit(): void {
  }

}
