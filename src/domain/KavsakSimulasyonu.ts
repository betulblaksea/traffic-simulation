import { aracOlustur, type Arac } from "./Arac";
import type { IsikRengi } from "./IsikRengi";
import { TrafikIsigi } from "./TrafikIsigi";
import { FAZ_CIFTLERI, YONLER, type Yon } from "./Yon";

export class KavsakSimulasyonu {
  isiklar = new Map<Yon, TrafikIsigi>();
  kuyruklar = new Map<Yon, Arac[]>();

  private fazIndeksi = 0;
  private fazZamanlayici = 0;
  private gecen = 0;

  constructor() {
    for (const yon of YONLER) {
      this.isiklar.set(yon, new TrafikIsigi(yon));
      this.kuyruklar.set(yon, []);
    }
    this.fazBaslat();
  }

  aracEkle(yon: Yon): void {
    const k = this.kuyruklar.get(yon)!;
    if (k.length >= 6) return;
    k.push(aracOlustur(yon));
  }

  adim(dt: number): void {
    this.fazZamanlayici += dt;
    this.fazGuncelle();

    for (const yon of YONLER) {
      const isik = this.isiklar.get(yon)!;
      isik.yesilSuresi = 7;
      isik.sariSuresi = 2;
      isik.guncelle(dt);

      const k = this.kuyruklar.get(yon)!;
      if (k.length === 0) continue;
      const bas = k[0]!;
      const gecebilir =
        isik.renk === "yesil" || (isik.renk === "sari" && bas.ilerleme > 0.2);
      if (!gecebilir) {
        bas.bekliyor = true;
        continue;
      }
      bas.bekliyor = false;
      bas.ilerleme += dt;
      if (bas.ilerleme >= 2) {
        k.shift();
        this.gecen += 1;
      }
    }
  }

  anlik() {
    const renkler: Record<string, string> = {};
    const kuyruklar: Record<string, number> = {};
    for (const yon of YONLER) {
      renkler[yon] = this.isiklar.get(yon)!.renk;
      kuyruklar[yon] = this.kuyruklar.get(yon)!.length;
    }
    return {
      faz: FAZ_CIFTLERI[this.fazIndeksi]!.join("-"),
      renkler,
      kuyruklar,
      gecen: this.gecen,
    };
  }

  private fazBaslat(): void {
    const aktif = new Set(FAZ_CIFTLERI[this.fazIndeksi]);
    for (const yon of YONLER) {
      const isik = this.isiklar.get(yon)!;
      isik.yesileIzin = aktif.has(yon);
      if (aktif.has(yon) && isik.renk === "kirmizi") isik.zamanlayici = 1;
    }
    this.fazZamanlayici = 0;
  }

  private fazGuncelle(): void {
    const aktif = FAZ_CIFTLERI[this.fazIndeksi]!;
    const hepsiKirmizi = aktif.every((y) => this.isiklar.get(y)!.renk === "kirmizi");
    if (this.fazZamanlayici > 4 && hepsiKirmizi) {
      this.fazIndeksi = (this.fazIndeksi + 1) % FAZ_CIFTLERI.length;
      this.fazBaslat();
      return;
    }
    if (this.fazZamanlayici > 14) {
      for (const yon of aktif) this.isiklar.get(yon)!.yesileIzin = false;
    }
  }
}
