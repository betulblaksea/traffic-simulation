import type { IsikBag, IsikDurumu } from "./IsikDurumu";
import { YesilDurum } from "./YesilDurum";

export class KirmiziDurum implements IsikDurumu {
  renk = "kirmizi" as const;

  guncelle(isik: IsikBag, dt: number): void {
    if (!isik.yesileIzin) return;
    isik.zamanlayici -= dt;
    if (isik.zamanlayici <= 0) isik.durumDegistir(new YesilDurum());
  }
}
