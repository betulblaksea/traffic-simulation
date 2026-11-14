import type { IsikDurumu } from "../patterns/state/IsikDurumu";
import { KirmiziDurum } from "../patterns/state/KirmiziDurum";
import type { IsikRengi } from "./IsikRengi";
import type { Yon } from "./Yon";

export class TrafikIsigi {
  private durum: IsikDurumu = new KirmiziDurum();

  yesileIzin = false;
  zamanlayici = 1;
  yesilSuresi = 7;
  sariSuresi = 2;

  constructor(readonly yon: Yon) {}

  get renk(): IsikRengi {
    return this.durum.renk;
  }

  durumDegistir(sonraki: IsikDurumu): void {
    this.durum = sonraki;
    if (sonraki.renk === "yesil") this.zamanlayici = this.yesilSuresi;
    else if (sonraki.renk === "sari") this.zamanlayici = this.sariSuresi;
    else this.zamanlayici = this.yesileIzin ? 1 : 999;
  }

  guncelle(dt: number): void {
    this.durum.guncelle(this, dt);
  }
}
