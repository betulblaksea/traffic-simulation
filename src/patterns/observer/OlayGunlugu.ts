import { RENK_ETIKET, type IsikRengi } from "../../domain/IsikRengi";
import { YON_ETIKET, type Yon } from "../../domain/Yon";
import type { SimOlayi } from "./SimOlayi";

export class OlayGunlugu {
  olaylar: SimOlayi[] = [];

  kaydet(yon: Yon, onceki: IsikRengi, sonraki: IsikRengi, zaman: number): void {
    this.olaylar.unshift({
      zaman,
      mesaj: `${YON_ETIKET[yon]}: ${RENK_ETIKET[onceki]} → ${RENK_ETIKET[sonraki]}`,
    });
    if (this.olaylar.length > 30) this.olaylar.pop();
  }
}
