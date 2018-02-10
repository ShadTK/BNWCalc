import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BattleService } from '../battle.service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html'
})

export class HeaderComponent implements OnInit {

  headerGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private battleService: BattleService) { }

  ngOnInit() {
    this.buildForm();
    this.observeForm();
   }

   buildForm(): any {
    this.headerGroup = this.fb.group({
      healthPenaltyOff: false
    });
  }

  observeForm() {
    this.headerGroup.valueChanges.subscribe((res) => {
      this.battleService.healthPenaltyOff = res.healthPenaltyOff;
      console.log(this.battleService.healthPenaltyOff, res.healthPenaltyOff);
    });
  }

}
