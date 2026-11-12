import type { ZamanlamaStratejisi } from "./ZamanlamaStratejisi";

export class SabitZamanlama implements ZamanlamaStratejisi {
  ad = "sabit";
  yesilSuresi(): number {
    return 7;
  }
  sariSuresi(): number {
    return 2;
  }
}
