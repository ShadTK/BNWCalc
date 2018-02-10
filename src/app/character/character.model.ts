export class Character {

  public name: string;
  public maxHP: number;
  public currentHP: number;
  public damage: number;
  public resistence: number;
  public ND: number;
  public precision: number;
  public bonusDamage: number;
  public bonusResistence: number;
  public bonusND: number;
  public bonusPrecision: number;
  public OffensiveManeouver: any;
  public DefensiveManeouver: any;
  public status: any;
  public PainfulTraining: boolean;
  public offenseRoll: number;
  public defenseRoll: number;

  constructor() {
      this.name = 'Personagem';
      this.maxHP = 35;
      this.currentHP = 35;
      this.damage = 5;
      this.resistence = 2;
      this.ND = 5;
      this.precision = 5;
      this.bonusDamage = 0;
      this.bonusResistence = 0;
      this.bonusND = 0;
      this.bonusPrecision = 0;
      this.OffensiveManeouver = {};
      this.DefensiveManeouver = {};
      this.status = {};
      this.PainfulTraining = false;
  }
}
