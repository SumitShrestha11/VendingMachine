export class Balance {
  public cash: number;
  public coins: number;
  constructor(balance: { cash: number; coins: number }) {
    this.cash = balance.cash;
    this.coins = balance.coins;
  }
}
