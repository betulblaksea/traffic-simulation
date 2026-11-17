import type { IsikGozlemcisi } from "../patterns/observer/IsikGozlemcisi";
import type { IsikDurumu } from "../patterns/state/IsikDurumu";
import { KirmiziDurum } from "../patterns/state/KirmiziDurum";
import type { IsikRengi } from "./IsikRengi";
import type { Yon } from "./Yon";

export class TrafikIsigi {
  private durum: IsikDurumu = new KirmiziDurum();
  private gozlemciler: IsikGozlemcisi[] = [];
  private zaman = 0;

  yesileIzin = false;
  zamanlayici = 1;
  yesilSuresi = 7;
  sariSuresi = 2;

  constructor(readonly yon: Yon) {}

  get renk(): IsikRengi {
    return this.durum.renk;
  }

  ekle(g: IsikGozlemcisi): void {
    this.gozlemciler.push(g);
  }

  durumDegistir(sonraki: IsikDurumu): void {
    const onceki = this.durum.renk;
    this.durum = sonraki;
    if (sonraki.renk === "yesil") this.zamanlayici = this.yesilSuresi;
    else if (sonraki.renk === "sari") this.zamanlayici = this.sariSuresi;
    else this.zamanlayici = this.yesileIzin ? 1 : 999;
    for (const g of this.gozlemciler) g.isikDegisti(this.yon, onceki, sonraki.renk, this.zaman);
  }

  guncelle(dt: number, simZamani: number): void {
    this.zaman = simZamani;
    this.durum.guncelle(this, dt);
  }
}
