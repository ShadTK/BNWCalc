import { Component } from '@angular/core';
import { BattleService } from './battle.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  PlayerTwoDefenseReady: boolean;
  PlayerTwoOffenseReady: boolean;
  PlayerOneDefenseReady: boolean;
  PlayerOneOffenseReady: boolean;
  result = 'Bem vinda(o) ao simulador de combate BNW! \n' +
  'Preencha os campos com os atributos dos personagens que você deseja simular.\n' +
  'Uma vez que os campos necessários forem preenchidos, os botões ficarão disponiveis para uso.\n' +
  'Os resultados do combate irão aparecer nesta caixa!\n' +
  'V0.0,1';

  title = 'app';

  constructor( private battleService: BattleService ) {
    this.battleService.results.subscribe((results) => {
      this.result = results.message;
    });
  }

  setPlayerOneOffenseReady(ready: boolean) {
    this.PlayerOneOffenseReady = ready;
  }

  setPlayerOneDefenseReady(ready: boolean) {
    this.PlayerOneDefenseReady = ready;
  }


  setPlayerTwoOffenseReady(ready: boolean) {
    this.PlayerTwoOffenseReady = ready;
  }

  setPlayerTwoDefenseReady(ready: boolean) {
    this.PlayerTwoDefenseReady = ready;
  }

  InitiateAttack(player: string) {
    this.battleService.attack(player);
  }

}

