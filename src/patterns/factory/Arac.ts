import type { AracTuru } from "../../domain/AracTuru";
import type { Yon } from "../../domain/Yon";

export interface Arac {
  id: string;
  tur: AracTuru;
  yon: Yon;
  ilerleme: number;
  bekliyor: boolean;
}
