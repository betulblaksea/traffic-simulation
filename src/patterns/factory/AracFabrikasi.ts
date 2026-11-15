import type { Yon } from "../../domain/Yon";
import type { Arac } from "./Arac";

export interface AracFabrikasi {
  olustur(yon: Yon): Arac;
}
