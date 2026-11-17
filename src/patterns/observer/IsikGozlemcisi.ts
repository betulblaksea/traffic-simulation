import type { IsikRengi } from "../../domain/IsikRengi";
import type { Yon } from "../../domain/Yon";

export interface IsikGozlemcisi {
  isikDegisti(yon: Yon, onceki: IsikRengi, sonraki: IsikRengi, zaman: number): void;
}
