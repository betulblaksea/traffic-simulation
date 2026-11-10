import type { Yon } from "./Yon";

export type AracTuru = "araba" | "otobus";

export interface Arac {
  id: string;
  tur: AracTuru;
  yon: Yon;
  ilerleme: number;
  bekliyor: boolean;
}

let sonrakiId = 1;

export function aracOlustur(yon: Yon): Arac {
  const tur: AracTuru = Math.random() < 0.2 ? "otobus" : "araba";
  return {
    id: `${tur}-${sonrakiId++}`,
    tur,
    yon,
    ilerleme: 0,
    bekliyor: true,
  };
}
