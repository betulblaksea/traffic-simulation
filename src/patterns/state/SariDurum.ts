import type { IsikBag, IsikDurumu } from "./IsikDurumu";
import { KirmiziDurum } from "./KirmiziDurum";

export class SariDurum implements IsikDurumu {
  renk = "sari" as const;

  guncelle(isik: IsikBag, dt: number): void {
    isik.zamanlayici -= dt;
    if (isik.zamanlayici <= 0) isik.durumDegistir(new KirmiziDurum());
  }
}
