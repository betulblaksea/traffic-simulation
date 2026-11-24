import type { IsikGozlemcisi } from "../patterns/observer/IsikGozlemcisi";
import type { IsikDurumu } from "../patterns/state/IsikDurumu";
import { KirmiziDurum } from "../patterns/state/KirmiziDurum";
import type { ZamanlamaStratejisi } from "../patterns/strategy/ZamanlamaStratejisi";
import type { IsikRengi } from "./IsikRengi";
import type { Yon } from "./Yon";

export class TrafikIsigi {
  private durum: IsikDurumu = new KirmiziDurum();
  private gozlemciler: IsikGozlemcisi[] = [];
  private zaman = 0;

  yesileIzin = false;
  zamanlayici = 1;
  kuyrukBoyutu = 0;

  constructor(
    readonly yon: Yon,
    public zamanlama: ZamanlamaStratejisi,
  ) {}

  get renk(): IsikRengi {
    return this.durum.renk;
  }

  ekle(g: IsikGozlemcisi): void {
    this.gozlemciler.push(g);
  }

  durumDegistir(sonraki: IsikDurumu): void {
    const onceki = this.durum.renk;
    this.durum = sonraki;
    this.zamanlayici =
      sonraki.renk === "yesil"
        ? this.zamanlama.yesilSuresi(this.kuyrukBoyutu)
        : sonraki.renk === "sari"
          ? this.zamanlama.sariSuresi()
          : this.yesileIzin
            ? 1
            : 999;
    for (const g of this.gozlemciler) g.isikDegisti(this.yon, onceki, sonraki.renk, this.zaman);
  }

  guncelle(dt: number, simZamani: number): void {
    this.zaman = simZamani;
    this.durum.guncelle(this, dt);
  }
}
