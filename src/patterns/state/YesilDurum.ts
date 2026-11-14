import type { IsikBag, IsikDurumu } from "./IsikDurumu";
import { SariDurum } from "./SariDurum";

export class YesilDurum implements IsikDurumu {
  renk = "yesil" as const;

  guncelle(isik: IsikBag, dt: number): void {
    isik.zamanlayici -= dt;
    if (isik.zamanlayici <= 0 || !isik.yesileIzin) {
      isik.durumDegistir(new SariDurum());
    }
  }
}
