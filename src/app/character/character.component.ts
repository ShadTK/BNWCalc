import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BattleService } from '../battle.service';
import { Character } from './character.model';
import { DefensiveManeouversList, OffensiveManeouversList, StatusList } from '../constants';
import { Multiplier } from '../multipliers.model';



@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit {

  @Input() playerSelected: string;
  @Output() offenseReady = new EventEmitter();
  @Output() defenseReady = new EventEmitter();
  playerForms: FormGroup;

  offensiveManeouversList: Multiplier[] = OffensiveManeouversList;
  defensiveManeouversList: Multiplier[] = DefensiveManeouversList;
  statusList = StatusList;


  character = new Character();

  constructor(private battleService: BattleService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.observeForm();
    this.observeResults();
  }

  buildForm() {
    this.playerForms = this.fb.group({
      name: '',
      currentHP: '',
      maxHP: '',
      damage: 0,
      bonusDamage: 0,
      surpriseAttack: false,
      surpriseTech: false,
      precision: 0,
      bonusPrecision: 0,
      ND: 0,
      bonusND: 0,
      resistence: 0,
      bonusResistence: 0,
      OffensiveManeouver: 0,
      DefensiveManeouver: 0,
      status: 0,
      painfulTraining: false,
      burnResist: false,
      coldResist: false,
      poisonResist: false,
      superEvasion: false,
      offenseRoll: '',
      defenseRoll: ''
    });
  }

  observeResults() {
    this.battleService.results.subscribe((res) => {
      if (res.offender === this.playerSelected) {
        this.playerForms.controls['currentHP'].patchValue(res.offenderHP);
      } else {
        this.playerForms.controls['currentHP'].patchValue(res.defenderHP);
      }
    });
  }

  observeForm(): any {
    this.playerForms.valueChanges.subscribe((form) => {
      this.setFormValidValues(form);
      this.setCharacter(form);
      if (this.playerSelected === 'PlayerOne') {
        this.PopulatePlayerOne(form);
      } else {
        this.PopulatePlayerTwo(form);
      }
    });
  }

  setFormValidValues(form: any) {
      this.validateOffense(form);
      this.validateDefense(form);
  }

  validateOffense(form) {
    if ((form.name
        && form.currentHP
        && form.maxHP
        && form.damage
        && form.precision) ? true : false) {
          this.offenseReady.emit(true);
    } else {
      this.offenseReady.emit(false);
    }
  }

  validateDefense(form) {
    if ((form.name
      && form.currentHP
      && form.maxHP
      && form.ND
      && form.resistence) ? true : false) {
        this.defenseReady.emit(true);
    } else {
      this.defenseReady.emit(false);
    }
  }

  setCharacter(form) {

    this.character.name = form.name;
    this.character.currentHP = form.currentHP;
    this.character.maxHP = form.maxHP;
    this.character.damage = form.damage;
    this.character.bonusDamage = form.bonusDamage;
    this.character.precision = form.precision;
    this.character.bonusPrecision = form.bonusPrecision;
    this.character.surpriseAttack = form.surpriseAttack;
    this.character.surpriseTech = form.surpriseTech;
    this.character.ND = form.ND;
    this.character.bonusND = form.bonusND;
    this.character.resistence = form.resistence;
    this.character.bonusResistence = form.bonusResistence;
    this.character.OffensiveManeouver = this.offensiveManeouversList[form.OffensiveManeouver];
    this.character.DefensiveManeouver = this.defensiveManeouversList[form.DefensiveManeouver];
    this.character.status = this.statusList[form.status];
    this.character.PainfulTraining = form.painfulTraining;
    this.character.offenseRoll = form.offenseRoll;
    this.character.defenseRoll = form.defenseRoll;
    this.character.burnResist = form.burnResist;
    this.character.coldResist = form.coldResist;
    this.character.poisonResist = form.poisonResist;
    this.character.superEvasion = form.superEvasion;

  }

  getColor() {
     if ((this.character.currentHP / this.character.maxHP) > 0.7) {return '#28a745'; } else if
     ((this.character.currentHP / this.character.maxHP) > 0.5) { return '#17a2b8'; } else if
     ((this.character.currentHP / this.character.maxHP) > 0.3) { return '#ffc107'; } else if
     ((this.character.currentHP / this.character.maxHP) > 0.1) { return '#dc3545'; } else {
       return '#343a40';
      }
    }
  PopulatePlayerOne(form: any): any {
    this.battleService.playerOne = this.character;
  }

  PopulatePlayerTwo(form: any): any {
    this.battleService.playerTwo = this.character;
  }
}
