import { Component } from '@angular/core';
import { GrToAfndService } from './utils/gr-to-afnd.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'linguagens-formais-simulado-af-gr';

  constructor(_grToAfndService: GrToAfndService) {

  }

  
}
