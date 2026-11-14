import type { IsikRengi } from "../../domain/IsikRengi";

export interface IsikBag {
  yesileIzin: boolean;
  zamanlayici: number;
  durumDegistir(sonraki: IsikDurumu): void;
}

export interface IsikDurumu {
  renk: IsikRengi;
  guncelle(isik: IsikBag, dt: number): void;
}
