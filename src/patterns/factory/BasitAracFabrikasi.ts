import type { AracTuru } from "../../domain/AracTuru";
import type { Yon } from "../../domain/Yon";
import type { Arac } from "./Arac";
import type { AracFabrikasi } from "./AracFabrikasi";

let sonrakiId = 1;

export class BasitAracFabrikasi implements AracFabrikasi {
  olustur(yon: Yon): Arac {
    const tur: AracTuru = Math.random() < 0.2 ? "otobus" : "araba";
    return {
      id: `${tur}-${sonrakiId++}`,
      tur,
      yon,
      ilerleme: 0,
      bekliyor: true,
    };
  }
}
