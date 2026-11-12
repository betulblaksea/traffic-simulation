import type { ZamanlamaStratejisi } from "./ZamanlamaStratejisi";

export class UyarlanabilirZamanlama implements ZamanlamaStratejisi {
  ad = "uyarlanabilir";
  yesilSuresi(kuyrukBoyutu: number): number {
    return Math.min(12, 5 + kuyrukBoyutu);
  }
  sariSuresi(): number {
    return 2;
  }
}
