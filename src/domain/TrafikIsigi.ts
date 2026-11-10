import { RENK_ETIKET, type IsikRengi } from "./IsikRengi";
import { YON_ETIKET, type Yon } from "./Yon";

export class TrafikIsigi {
  renk: IsikRengi = "kirmizi";
  yesileIzin = false;
  zamanlayici = 1;
  yesilSuresi = 7;
  sariSuresi = 2;

  constructor(readonly yon: Yon) {}

  private renkDegistir(sonraki: IsikRengi): void {
    this.renk = sonraki;
    if (sonraki === "yesil") this.zamanlayici = this.yesilSuresi;
    else if (sonraki === "sari") this.zamanlayici = this.sariSuresi;
    else this.zamanlayici = this.yesileIzin ? 1 : 999;
  }

  guncelle(dt: number): void {
    if (this.renk === "kirmizi") {
      if (!this.yesileIzin) return;
      this.zamanlayici -= dt;
      if (this.zamanlayici <= 0) this.renkDegistir("yesil");
      return;
    }

    if (this.renk === "yesil") {
      this.zamanlayici -= dt;
      if (this.zamanlayici <= 0 || !this.yesileIzin) this.renkDegistir("sari");
      return;
    }

    this.zamanlayici -= dt;
    if (this.zamanlayici <= 0) this.renkDegistir("kirmizi");
  }

  ozet(): string {
    return `${YON_ETIKET[this.yon]}: ${RENK_ETIKET[this.renk]}`;
  }
}
