import { Injectable, EventEmitter } from '@angular/core';
import { Character } from './character/character.model';

@Injectable()
export class BattleService {
  defenderBonusResistence: number;
  defenderBonusND: number;
  offenderBonusDamage: number;
  offenderBonusPrecision: number;
  defenderStatus: any;
  offenderStatus: any;
  offenderManeouver: any;
  defenderManeouver: any;

  defenderMaxHP: number;
  offenderMaxHP: number;

  public offender: string;

  playerOne: Character;
  playerTwo: Character;

  offenderName: string;
  offenderPrecision: number;
  offenderDamage: number;
  offenderRoll: number;
  offenderManualRoll: number;
  offenderHP: number;
  offenderPainfulTraining: boolean;

  damageMultiplier = 1;
  NDMultiplier = 1;
  precisionMultiplier = 1;
  resistenceMultiplier = 1;

  defenderName: string;
  defenderND: number;
  defenderResistence: number;
  defenderRoll: number;
  defenderManualRoll: number;
  defenderHP: number;
  defenderPainfulTraining: boolean;

  saudavel: number;
  escoriado: number;
  machucado: number;
  ferido: number;
  grave: number;

  defenderHealthPenalty: number;
  offenderHealthPenalty: number;

  healthPenaltyOff: boolean;

  results = new EventEmitter();

  constructor() {
    this.playerOne = new Character();
    this.playerTwo = new Character();
   }

  attack(offender) {
    this.offender = offender;

    this.resetMultipliers();
    if (this.offender === 'PlayerOne') {
      this.setOffenderPlayerOne();
    } else {
      this.setOffenderPlayerTwo();
    }
    this.setMultipliers();

  }

  setMultipliers() {
    if (!this.healthPenaltyOff) {
      this.setOffenderHealthMultiplier();
      this.setDefenderHealthMultiplier();
    }
    this.setStatusMultipliers();
    this.setManeouverMultipliers();
    this.rollDice();
  }


  setManeouverMultipliers() {
    const multipliers = {
     DamageMultiplier: this.offenderManeouver.DamageMultiplier,
     PrecisionMultiplier: this.offenderManeouver.PrecisionMultiplier,
     NDMultiplier: this.defenderManeouver.NDMultiplier,
     ResistenceMultiplier: this.defenderManeouver.ResistenceMultiplier };
    console.log("Maneouver multipliers", multipliers);
     this.applyMultipliers(multipliers);
  }

  setStatusMultipliers() {
    const multipliers = {
      DamageMultiplier: this.offenderStatus.DamageMultiplier,
      PrecisionMultiplier: this.offenderStatus.PrecisionMultiplier,
      NDMultiplier: this.defenderStatus.NDMultiplier,
      ResistenceMultiplier: this.defenderStatus.ResistenceMultiplier };
      this.applyMultipliers(multipliers);
  }

  applyMultipliers({DamageMultiplier , PrecisionMultiplier , NDMultiplier, ResistenceMultiplier}) {
    this.damageMultiplier = this.damageMultiplier * DamageMultiplier;
    this.precisionMultiplier = this.precisionMultiplier * PrecisionMultiplier;
    this.NDMultiplier = this.NDMultiplier * NDMultiplier;
    this.resistenceMultiplier = this.resistenceMultiplier * ResistenceMultiplier;
  }


  setOffenderHealthMultiplier() {

    const status = this.setHealthMultiplierValues(this.offenderPainfulTraining);
    const PercentHP = this.offenderHP / this.offenderMaxHP;
    if ( PercentHP > 0.7) {
      this.debuffAttackStats(status.saudavel);
    } else if ( PercentHP > 0.5) {
      this.debuffAttackStats(status.escoriado);
    } else if ( PercentHP > 0.3) {
      this.debuffAttackStats(status.machucado);
    } else if ( PercentHP > 0.1) {
      this.debuffAttackStats(status.ferido);
    } else {
      this.debuffAttackStats(status.grave);
    }
  }

  setDefenderHealthMultiplier() {
    const status = this.setHealthMultiplierValues(this.defenderPainfulTraining);
    const PercentHP = this.defenderHP / this.defenderMaxHP;
    if ( PercentHP > 0.7) {
      this.debuffDefenseStats(status.saudavel);
    } else if ( PercentHP > 0.5) {
      this.debuffDefenseStats(status.escoriado);
    } else if ( PercentHP > 0.3) {
      this.debuffDefenseStats(status.machucado);
    } else if ( PercentHP > 0.1) {
      this.debuffDefenseStats(status.ferido);
    } else {
      this.debuffDefenseStats(status.grave);
    }
  }


  setHealthMultiplierValues (hasPainfulTraining: Boolean) {
    let saudavel, escoriado, machucado, ferido, grave;

    if (hasPainfulTraining) {
      saudavel = 1;
      escoriado = 0.95;
      machucado = 0.85;
      ferido = 0.75;
      grave = 0.55;
    } else {
      saudavel = 1;
      escoriado = 0.9;
      machucado = 0.8;
      ferido = 0.7;
      grave = 0.5;
    }
    return { saudavel: saudavel, escoriado: escoriado, machucado: machucado, ferido: ferido, grave: grave };

  }


  debuffAttackStats(multiplier: number) {
    this.offenderHealthPenalty = multiplier;
    this.damageMultiplier = this.damageMultiplier * multiplier;
    this.precisionMultiplier = this.precisionMultiplier * multiplier;
  }
  debuffDefenseStats(multiplier: number) {
    this.defenderHealthPenalty = multiplier;
    this.NDMultiplier = this.NDMultiplier * multiplier;
    this.resistenceMultiplier = this.resistenceMultiplier * multiplier;
  }

    resetMultipliers() {
      this.damageMultiplier = 1;
      this.NDMultiplier = 1;
      this.precisionMultiplier = 1;
      this.resistenceMultiplier = 1;
      this.defenderHealthPenalty = 1;
      this.offenderHealthPenalty = 1;
    }

    private setOffenderPlayerOne() {
      this.offenderName = this.playerOne.name;
      this.offenderDamage = this.playerOne.damage;
      this.offenderPrecision = this.playerOne.precision;
      this.offenderBonusDamage = this.playerOne.bonusDamage;
      this.offenderBonusPrecision = this.playerOne.bonusPrecision;
      this.offenderHP = this.playerOne.currentHP;
      this.offenderMaxHP = this.playerOne.maxHP;
      this.offenderManeouver = this.playerOne.OffensiveManeouver;
      this.offenderStatus = this.playerOne.status;
      this.offenderPainfulTraining = this.playerOne.PainfulTraining;
      this.offenderManualRoll = this.playerOne.offenseRoll;

      this.defenderName = this.playerTwo.name;
      this.defenderND = this.playerTwo.ND;
      this.defenderResistence = this.playerTwo.resistence;
      this.defenderBonusND = this.playerTwo.bonusND;
      this.defenderBonusResistence = this.playerTwo.bonusResistence;
      this.defenderHP = this.playerTwo.currentHP;
      this.defenderMaxHP = this.playerTwo.maxHP;
      this.defenderStatus = this.playerTwo.status;
      this.defenderManeouver = this.playerTwo.DefensiveManeouver;
      this.defenderPainfulTraining = this.playerTwo.PainfulTraining;
      this.defenderManualRoll = this.playerTwo.defenseRoll;
    }

    private setOffenderPlayerTwo() {
      this.offenderName = this.playerTwo.name;
      this.offenderDamage = this.playerTwo.damage;
      this.offenderPrecision = this.playerTwo.precision;
      this.offenderBonusDamage = this.playerTwo.bonusDamage;
      this.offenderBonusPrecision = this.playerTwo.bonusPrecision;
      this.offenderHP = this.playerTwo.currentHP;
      this.offenderMaxHP = this.playerTwo.maxHP;
      this.offenderStatus = this.playerTwo.status;
      this.offenderManeouver = this.playerTwo.OffensiveManeouver;
      this.offenderPainfulTraining = this.playerTwo.PainfulTraining;
      this.offenderManualRoll = this.playerTwo.offenseRoll;

      this.defenderName = this.playerOne.name;
      this.defenderND = this.playerOne.ND;
      this.defenderResistence = this.playerOne.resistence;
      this.defenderBonusND = this.playerOne.bonusND;
      this.defenderBonusResistence = this.playerOne.bonusResistence;
      this.defenderHP = this.playerOne.currentHP;
      this.defenderMaxHP = this.playerOne.maxHP;
      this.defenderManeouver = this.playerOne.DefensiveManeouver;
      this.defenderStatus = this.playerOne.status;
      this.defenderPainfulTraining = this.playerOne.PainfulTraining;
      this.defenderManualRoll = this.playerOne.defenseRoll;
    }

    rollDice() {
      this.offenderRoll = (this.offenderManualRoll > 0) ? this.offenderManualRoll : this.d20();
      this.defenderRoll = (this.defenderManualRoll > 0) ? this.defenderManualRoll : this.d20();
      this.checkCrit();
    }

      d20() {
        return Math.round((Math.random() * (19)) + 1 );
      }

      checkCrit() {
        const offenderTotal = Math.floor((this.offenderPrecision * this.precisionMultiplier) + this.offenderRoll);
        const defenderTotal = Math.floor((this.defenderND * this.NDMultiplier) + this.defenderRoll);

        if (this.offenderRoll === 20 && this.defenderRoll !== 20) {
          this.calculateCriticalDamage(offenderTotal, defenderTotal);
        } else if (this.offenderRoll === 1 && this.defenderRoll !== 1) {
          this.showCriticalHitFailureMessage(offenderTotal, defenderTotal);
        } else if (this.defenderRoll === 20 && this.offenderRoll !== 20 ) {
          this.showCriticalSuccessMessage(offenderTotal, defenderTotal);
        } else if (this.defenderRoll === 1 && this.offenderRoll !== 1 ) {
          this.showCriticalFailureMessage(offenderTotal, defenderTotal, this.calculateDamage());
        } else {
          this.testAttackSuccess(offenderTotal, defenderTotal);
        }
      }

  private calculateCriticalDamage(offenderTotal: number, defenderTotal: number) {
    this.damageMultiplier = this.damageMultiplier * 2;
    const damage = this.calculateDamage();
    this.showCriticalHitMessage(offenderTotal, defenderTotal, damage);
  }

      testAttackSuccess(offenderTotal, defenderTotal) {

        if (offenderTotal > defenderTotal) {
          const damage = this.calculateDamage();
          this.showAttackSuccessMessage(offenderTotal, defenderTotal, damage);
        } else {
          this.showAttackFailedMessage(offenderTotal, defenderTotal);
        }
      }

      calculateDamage() {
        const damage = Math.floor(
          Math.max(0,
            ((this.offenderDamage * this.damageMultiplier) - (this.defenderResistence * this.resistenceMultiplier))
          )
        );
        this.defenderHP = Math.max(0, this.defenderHP - damage);
        return damage;
      }

        showAttackSuccessMessage(offenderTotal, defenderTotal, damage) {
          const message = '[b]' + this.offenderName + ' [/b]ataca! 1d20('
                                + this.offenderRoll
                                + ') + ('
                                + ((this.offenderHealthPenalty !== 1
                                    || this.offenderStatus.PrecisionMultiplier !== 1
                                    || this.offenderManeouver.PrecisionMultiplier !== 1 )
                                    ? '(' : '')
                                + this.offenderPrecision
                                + ((this.offenderBonusPrecision !== 0)
                                  ? ' + ' + this.offenderBonusPrecision + ')'
                                  : ')')
                                + ((this.offenderHealthPenalty !== 1)
                                  ? ' * ' + this.offenderHealthPenalty
                                  : '')
                                + ((this.offenderStatus.PrecisionMultiplier !== 1)
                                  ? ' * ' + this.offenderStatus.PrecisionMultiplier
                                  : '')
                                + ((this.offenderManeouver.PrecisionMultiplier !== 1)
                                  ? ' * ' + this.offenderManeouver.PrecisionMultiplier
                                  : '')
                                + ((this.offenderHealthPenalty !== 1
                                  || this.offenderStatus.PrecisionMultiplier !== 1
                                  || this.offenderManeouver.PrecisionMultiplier !== 1 )
                                  ? ')' : '')
                                + ' = [b]' + offenderTotal + '[/b]\n'

                                + '[b]' + this.defenderName + ' [/b]tenta evitar! 1d20('
                                + this.defenderRoll + ') + ('
                                + ((this.defenderHealthPenalty !== 1
                                    || this.defenderStatus.NDMultiplier !== 1
                                    || this.defenderManeouver.NDMultiplier !== 1 )
                                    ? '(' : '')
                                + this.defenderND
                                + ((this.defenderBonusND !== 0)
                                  ? ' + ' + this.defenderBonusND + ')'
                                  : ')')
                                + ((this.defenderHealthPenalty !== 1)
                                  ? ' * ' + this.defenderHealthPenalty
                                  : '')
                                + ((this.defenderStatus.NDMultiplier !== 1)
                                  ? ' * ' + this.defenderStatus.NDMultiplier
                                  : '')
                                + ((this.defenderManeouver.NDMultiplier !== 1)
                                  ? ' * ' + this.defenderManeouver.NDMultiplier
                                  : '')
                                + ((this.defenderHealthPenalty !== 1
                                  || this.defenderStatus.NDMultiplier !== 1
                                  || this.defenderManeouver.NDMultiplier !== 1  )
                                  ? ')' : '')
                                + ' = [b]'  + defenderTotal + '[/b]\n'

                                + 'Ataque [b][color=green]ACERTOU! [/color].'

                                + this.offenderName + ' [/b] causou [b][color=red]' + damage + '[/color][/b](('
                                + ((this.offenderHealthPenalty !== 1
                                  || this.offenderStatus.DamageMultiplier !== 1
                                  || this.offenderManeouver.DamageMultiplier !== 1 )
                                  ? '(' : '')

                                + this.offenderDamage

                                + (this.offenderBonusDamage
                                  ? + ' + ' + this.offenderBonusDamage + ')'
                                  : ')' )

                                + (this.offenderHealthPenalty !== 1
                                  ? ' * ' + this.offenderHealthPenalty
                                  : '')
                                + (this.offenderStatus.DamageMultiplier !== 1
                                  ? ' * ' + this.offenderStatus.DamageMultiplier
                                  : '')
                                + (this.offenderManeouver.DamageMultiplier !== 1
                                  ? ' * ' + this.offenderManeouver.DamageMultiplier
                                  : '')
                                + ((this.offenderHealthPenalty !== 1
                                  || this.offenderStatus.DamageMultiplier !== 1
                                  || this.offenderManeouver.DamageMultiplier !== 1 )
                                  ? ')' : '')

                                + ' - ('

                                + ((this.defenderHealthPenalty !== 1
                                  || this.defenderStatus.ResistenceMultiplier !== 1
                                  || this.defenderManeouver.ResistenceMultiplier !== 1 )
                                  ? '(' : '')

                                + this.defenderResistence

                                + (this.defenderBonusResistence
                                  ? + ' + ' + this.defenderBonusResistence + ')'
                                  : ')' )

                                + (this.defenderHealthPenalty !== 1
                                  ? ' * ' + this.defenderHealthPenalty
                                  : '')
                                + (this.defenderStatus.ResistenceMultiplier !== 1
                                  ? ' * ' + this.defenderStatus.ResistenceMultiplier
                                  : '')
                                + (this.defenderManeouver.ResistenceMultiplier !== 1
                                  ? ' * ' + this.defenderManeouver.ResistenceMultiplier
                                  : '')

                                + ((this.defenderHealthPenalty !== 1
                                  || this.defenderStatus.ResistenceMultiplier !== 1
                                  || this.defenderManeouver.ResistenceMultiplier !== 1 )
                                  ? ')' : '')

                                + ')' + 'de dano!\n'
                                + '[b]' + this.offenderName + ':[/b]' + this.offenderHP + '/' + this.offenderMaxHP + '\n'
                                + '[b]' + this.defenderName + ':[/b]' + this.defenderHP + '/' + this.defenderMaxHP + '\n';

                this.results.emit({message: message, offender: this.offender, damage: damage});
              }

              showAttackFailedMessage(offenderTotal, defenderTotal) {
                const message = '[b]' + this.offenderName + ' [/b]ataca! 1d20('
                                + this.offenderRoll
                                + ') + ('
                                + ((this.offenderHealthPenalty !== 1
                                    || this.offenderStatus.PrecisionMultiplier !== 1
                                    || this.offenderManeouver.PrecisionMultiplier !== 1 )
                                    ? '(' : '')
                                + this.offenderPrecision
                                + ((this.offenderBonusPrecision !== 0)
                                  ? ' + ' + this.offenderBonusPrecision + ')'
                                  : ')')
                                + ((this.offenderHealthPenalty !== 1)
                                  ? ' * ' + this.offenderHealthPenalty
                                  : '')
                                + ((this.offenderStatus.PrecisionMultiplier !== 1)
                                  ? ' * ' + this.offenderStatus.PrecisionMultiplier
                                  : '')
                                + ((this.offenderManeouver.PrecisionMultiplier !== 1)
                                  ? ' * ' + this.offenderManeouver.PrecisionMultiplier
                                  : '')
                                + ((this.offenderHealthPenalty !== 1
                                  || this.offenderStatus.PrecisionMultiplier !== 1
                                  || this.offenderManeouver.PrecisionMultiplier !== 1 )
                                  ? ')' : '')
                                + ' = [b]' + offenderTotal + '[/b]\n'

                                + '[b]' + this.defenderName + ' [/b]tenta evitar! 1d20('
                                + this.defenderRoll + ') + ('
                                + ((this.defenderHealthPenalty !== 1
                                    || this.defenderStatus.NDMultiplier !== 1
                                    || this.defenderManeouver.NDMultiplier !== 1 )
                                    ? '(' : '')
                                + this.defenderND
                                + ((this.defenderBonusND !== 0)
                                  ? ' + ' + this.defenderBonusND + ')'
                                  : ')')
                                + ((this.defenderHealthPenalty !== 1)
                                  ? ' * ' + this.defenderHealthPenalty
                                  : '')
                                + ((this.defenderStatus.NDMultiplier !== 1)
                                  ? ' * ' + this.defenderStatus.NDMultiplier
                                  : '')
                                + ((this.defenderManeouver.NDMultiplier !== 1)
                                  ? ' * ' + this.defenderManeouver.NDMultiplier
                                  : '')
                                + ((this.defenderHealthPenalty !== 1
                                  || this.defenderStatus.NDMultiplier !== 1
                                  || this.defenderManeouver.NDMultiplier !== 1  )
                                  ? ')' : '')
                                + ' = [b]'  + defenderTotal + '[/b]\n'

                                + 'Ataque [b][color=red]FALHOU[/color].'

                                + this.defenderName + ' [/b]evitou o dano!\n'

                                + '[b]' + this.offenderName + ':[/b]' + this.offenderHP + '/' + this.offenderMaxHP + '\n'
                                + '[b]' + this.defenderName + ':[/b]' + this.defenderHP + '/' + this.defenderMaxHP + '\n';

                this.results.emit({message: message, offender: this.offender, damage: 0});
              }

      showCriticalHitMessage(offenderTotal, defenderTotal, damage): any {
        const message = '[b]' + this.offenderName + ' [/b]ataca! 1d20('
        + this.offenderRoll
        + ') + ('
        + ((this.offenderHealthPenalty !== 1
            || this.offenderStatus.PrecisionMultiplier !== 1
            || this.offenderManeouver.PrecisionMultiplier !== 1 )
            ? '(' : '')
        + this.offenderPrecision
        + ((this.offenderBonusPrecision !== 0)
          ? ' + ' + this.offenderBonusPrecision + ')'
          : ')')
        + ((this.offenderHealthPenalty !== 1)
          ? ' * ' + this.offenderHealthPenalty
          : '')
        + ((this.offenderStatus.PrecisionMultiplier !== 1)
          ? ' * ' + this.offenderStatus.PrecisionMultiplier
          : '')
        + ((this.offenderManeouver.PrecisionMultiplier !== 1)
          ? ' * ' + this.offenderManeouver.PrecisionMultiplier
          : '')
        + ((this.offenderHealthPenalty !== 1
          || this.offenderStatus.PrecisionMultiplier !== 1
          || this.offenderManeouver.PrecisionMultiplier !== 1 )
          ? ')' : '')
        + ' = [b][color=green]ACERTO CRITICO![/color][/b]\n'

        + 'Ataque [b][color=green]ACERTOU! [/color].'

        + this.offenderName + ' [/b] causou [b][color=red]' + damage + '[/color][/b]((('
        + ((this.offenderHealthPenalty !== 1
          || this.offenderStatus.DamageMultiplier !== 1
          || this.offenderManeouver.DamageMultiplier !== 1 )
          ? '(' : '')

        + this.offenderDamage

        + (this.offenderBonusDamage
          ? + ' + ' + this.offenderBonusDamage + ')'
          : ')' )

        + (this.offenderHealthPenalty !== 1
          ? ' * ' + this.offenderHealthPenalty
          : '')
        + (this.offenderStatus.DamageMultiplier !== 1
          ? ' * ' + this.offenderStatus.DamageMultiplier
          : '')
        + (this.offenderManeouver.DamageMultiplier !== 1
          ? ' * ' + this.offenderManeouver.DamageMultiplier
          : '')
        + ((this.offenderHealthPenalty !== 1
          || this.offenderStatus.DamageMultiplier !== 1
          || this.offenderManeouver.DamageMultiplier !== 1 )
          ? ')' : '')

        + '* 2 ) - ('

        + ((this.defenderHealthPenalty !== 1
          || this.defenderStatus.ResistenceMultiplier !== 1
          || this.defenderManeouver.ResistenceMultiplier !== 1 )
          ? '(' : '')

        + this.defenderResistence

        + (this.defenderBonusResistence
          ? + ' + ' + this.defenderBonusResistence + ')'
          : ')' )

        + (this.defenderHealthPenalty !== 1
          ? ' * ' + this.defenderHealthPenalty
          : '')
        + (this.defenderStatus.ResistenceMultiplier !== 1
          ? ' * ' + this.defenderStatus.ResistenceMultiplier
          : '')
        + (this.defenderManeouver.ResistenceMultiplier !== 1
          ? ' * ' + this.defenderManeouver.ResistenceMultiplier
          : '')

        + ((this.defenderHealthPenalty !== 1
          || this.defenderStatus.ResistenceMultiplier !== 1
          || this.defenderManeouver.ResistenceMultiplier !== 1 )
          ? ')' : '')

        + ')' + 'de dano massivo!\n'
        + '[b]' + this.offenderName + ':[/b]' + this.offenderHP + '/' + this.offenderMaxHP + '\n'
        + '[b]' + this.defenderName + ':[/b]' + this.defenderHP + '/' + this.defenderMaxHP + '\n';

        this.results.emit({message: message, offender: this.offender, damage: damage});
      }
      showCriticalHitFailureMessage(offenderTotal, defenderTotal): any {

        const message = '[b]' + this.offenderName + ' [/b]ataca! 1d20('
                                + this.offenderRoll
                                + ') + ('
                                + ((this.offenderHealthPenalty !== 1
                                    || this.offenderStatus.PrecisionMultiplier !== 1
                                    || this.offenderManeouver.PrecisionMultiplier !== 1 )
                                    ? '(' : '')
                                + this.offenderPrecision
                                + ((this.offenderBonusPrecision !== 0)
                                  ? ' + ' + this.offenderBonusPrecision + ')'
                                  : ')')
                                + ((this.offenderHealthPenalty !== 1)
                                  ? ' * ' + this.offenderHealthPenalty
                                  : '')
                                + ((this.offenderStatus.PrecisionMultiplier !== 1)
                                  ? ' * ' + this.offenderStatus.PrecisionMultiplier
                                  : '')
                                + ((this.offenderManeouver.PrecisionMultiplier !== 1)
                                  ? ' * ' + this.offenderManeouver.PrecisionMultiplier
                                  : '')
                                + ((this.offenderHealthPenalty !== 1
                                  || this.offenderStatus.PrecisionMultiplier !== 1
                                  || this.offenderManeouver.PrecisionMultiplier !== 1 )
                                  ? ')' : '')
                                + ' = [b][color=red] FALHA CRÍTICA[/color][/b]\n'

                                + 'Ataque [b][color=red]FALHOU[/color].'

                                + this.offenderName + ' [/b]errou o ataque!\n'

                                + '[b]' + this.offenderName + ':[/b]' + this.offenderHP + '/' + this.offenderMaxHP + '\n'
                                + '[b]' + this.defenderName + ':[/b]' + this.defenderHP + '/' + this.defenderMaxHP + '\n';

                this.results.emit({message: message, offender: this.offender, damage: 0});

      }
      showCriticalSuccessMessage(offenderTotal, defenderTotal): any {

          const message = '[b]' + this.offenderName + ' [/b]ataca! 1d20('
                                + this.offenderRoll
                                + ') + ('
                                + ((this.offenderHealthPenalty !== 1
                                    || this.offenderStatus.PrecisionMultiplier !== 1
                                    || this.offenderManeouver.PrecisionMultiplier !== 1 )
                                    ? '(' : '')
                                + this.offenderPrecision
                                + ((this.offenderBonusPrecision !== 0)
                                  ? ' + ' + this.offenderBonusPrecision + ')'
                                  : ')')
                                + ((this.offenderHealthPenalty !== 1)
                                  ? ' * ' + this.offenderHealthPenalty
                                  : '')
                                + ((this.offenderStatus.PrecisionMultiplier !== 1)
                                  ? ' * ' + this.offenderStatus.PrecisionMultiplier
                                  : '')
                                + ((this.offenderManeouver.PrecisionMultiplier !== 1)
                                  ? ' * ' + this.offenderManeouver.PrecisionMultiplier
                                  : '')
                                + ((this.offenderHealthPenalty !== 1
                                  || this.offenderStatus.PrecisionMultiplier !== 1
                                  || this.offenderManeouver.PrecisionMultiplier !== 1 )
                                  ? ')' : '')
                                + ' = [b]' + offenderTotal + '[/b]\n'

                                + '[b]' + this.defenderName + ' [/b]tenta evitar! 1d20('
                                + this.defenderRoll + ') + ('
                                + ((this.defenderHealthPenalty !== 1
                                    || this.defenderStatus.NDMultiplier !== 1
                                    || this.defenderManeouver.NDMultiplier !== 1 )
                                    ? '(' : '')
                                + this.defenderND
                                + ((this.defenderBonusND !== 0)
                                  ? ' + ' + this.defenderBonusND + ')'
                                  : ')')
                                + ((this.defenderHealthPenalty !== 1)
                                  ? ' * ' + this.defenderHealthPenalty
                                  : '')
                                + ((this.defenderStatus.NDMultiplier !== 1)
                                  ? ' * ' + this.defenderStatus.NDMultiplier
                                  : '')
                                + ((this.defenderManeouver.NDMultiplier !== 1)
                                  ? ' * ' + this.defenderManeouver.NDMultiplier
                                  : '')
                                + ((this.defenderHealthPenalty !== 1
                                  || this.defenderStatus.NDMultiplier !== 1
                                  || this.defenderManeouver.NDMultiplier !== 1  )
                                  ? ')' : '')
                                + ' = [b][color=green]SUCESSO CRITICO[/color][/b]\n'

                                + 'Ataque [b][color=red]FALHOU[/color].'

                                + this.defenderName + ' [/b]evitou o dano com maestria!\n'

                                + '[b]' + this.offenderName + ':[/b]' + this.offenderHP + '/' + this.offenderMaxHP + '\n'
                                + '[b]' + this.defenderName + ':[/b]' + this.defenderHP + '/' + this.defenderMaxHP + '\n';

        this.results.emit({message: message, offender: this.offender, damage: 0});
      }

      showCriticalFailureMessage(offenderTotal, defenderTotal, damage): any {
        const message = '[b]' + this.offenderName + ' [/b]ataca! 1d20('
                              + this.offenderRoll
                              + ') + ('
                              + ((this.offenderHealthPenalty !== 1
                                  || this.offenderStatus.PrecisionMultiplier !== 1
                                  || this.offenderManeouver.PrecisionMultiplier !== 1 )
                                  ? '(' : '')
                              + this.offenderPrecision
                              + ((this.offenderBonusPrecision !== 0)
                                ? ' + ' + this.offenderBonusPrecision + ')'
                                : ')')
                              + ((this.offenderHealthPenalty !== 1)
                                ? ' * ' + this.offenderHealthPenalty
                                : '')
                              + ((this.offenderStatus.PrecisionMultiplier !== 1)
                                ? ' * ' + this.offenderStatus.PrecisionMultiplier
                                : '')
                              + ((this.offenderManeouver.PrecisionMultiplier !== 1)
                                ? ' * ' + this.offenderManeouver.PrecisionMultiplier
                                : '')
                              + ((this.offenderHealthPenalty !== 1
                                || this.offenderStatus.PrecisionMultiplier !== 1
                                || this.offenderManeouver.PrecisionMultiplier !== 1 )
                                ? ')' : '')
                              + ' = [b]' + offenderTotal + '[/b]\n'

                              + '[b]' + this.defenderName + ' [/b]tenta evitar! 1d20('
                              + this.defenderRoll + ') + ('
                              + ((this.defenderHealthPenalty !== 1
                                  || this.defenderStatus.NDMultiplier !== 1
                                  || this.defenderManeouver.NDMultiplier !== 1 )
                                  ? '(' : '')
                              + this.defenderND
                              + ((this.defenderBonusND !== 0)
                                ? ' + ' + this.defenderBonusND + ')'
                                : ')')
                              + ((this.defenderHealthPenalty !== 1)
                                ? ' * ' + this.defenderHealthPenalty
                                : '')
                              + ((this.defenderStatus.NDMultiplier !== 1)
                                ? ' * ' + this.defenderStatus.NDMultiplier
                                : '')
                              + ((this.defenderManeouver.NDMultiplier !== 1)
                                ? ' * ' + this.defenderManeouver.NDMultiplier
                                : '')
                              + ((this.defenderHealthPenalty !== 1
                                || this.defenderStatus.NDMultiplier !== 1
                                || this.defenderManeouver.NDMultiplier !== 1  )
                                ? ')' : '')
                              + ' = [b][color=red]FALHA CRITICA![/color][/b]\n'

                              + 'Ataque [b][color=green]ACERTOU! [/color].'

                              + this.offenderName + ' [/b] causou [b][color=red]' + damage + '[/color][/b](('
                              + ((this.offenderHealthPenalty !== 1
                                || this.offenderStatus.DamageMultiplier !== 1
                                || this.offenderManeouver.DamageMultiplier !== 1 )
                                ? '(' : '')

                              + this.offenderDamage

                              + (this.offenderBonusDamage
                                ? + ' + ' + this.offenderBonusDamage + ')'
                                : ')' )

                              + (this.offenderHealthPenalty !== 1
                                ? ' * ' + this.offenderHealthPenalty
                                : '')
                              + (this.offenderStatus.DamageMultiplier !== 1
                                ? ' * ' + this.offenderStatus.DamageMultiplier
                                : '')
                              + (this.offenderManeouver.DamageMultiplier !== 1
                                ? ' * ' + this.offenderManeouver.DamageMultiplier
                                : '')
                              + ((this.offenderHealthPenalty !== 1
                                || this.offenderStatus.DamageMultiplier !== 1
                                || this.offenderManeouver.DamageMultiplier !== 1 )
                                ? ')' : '')

                              + ' - ('

                              + ((this.defenderHealthPenalty !== 1
                                || this.defenderStatus.ResistenceMultiplier !== 1
                                || this.defenderManeouver.ResistenceMultiplier !== 1 )
                                ? '(' : '')

                              + this.defenderResistence

                              + (this.defenderBonusResistence
                                ? + ' + ' + this.defenderBonusResistence + ')'
                                : ')' )

                              + (this.defenderHealthPenalty !== 1
                                ? ' * ' + this.defenderHealthPenalty
                                : '')
                              + (this.defenderStatus.ResistenceMultiplier !== 1
                                ? ' * ' + this.defenderStatus.ResistenceMultiplier
                                : '')
                              + (this.defenderManeouver.ResistenceMultiplier !== 1
                                ? ' * ' + this.defenderManeouver.ResistenceMultiplier
                                : '')

                              + ((this.defenderHealthPenalty !== 1
                                || this.defenderStatus.ResistenceMultiplier !== 1
                                || this.defenderManeouver.ResistenceMultiplier !== 1 )
                                ? ')' : '')

                              + ')' + 'de dano!\n'
                              + '[b]' + this.offenderName + ':[/b]' + this.offenderHP + '/' + this.offenderMaxHP + '\n'
                              + '[b]' + this.defenderName + ':[/b]' + this.defenderHP + '/' + this.defenderMaxHP + '\n';

        this.results.emit({message: message, offender: this.offender, damage: damage});
      }



}
