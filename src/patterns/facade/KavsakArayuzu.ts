import { KavsakSimulasyonu } from "../../domain/KavsakSimulasyonu";
import { RENK_ETIKET, type IsikRengi } from "../../domain/IsikRengi";
import { YON_ETIKET, YONLER, type Yon } from "../../domain/Yon";

export class KavsakArayuzu {
  private readonly sim = new KavsakSimulasyonu();

  yonGecerli(deger: string): deger is Yon {
    return YONLER.includes(deger as Yon);
  }

  yonEtiket(yon: Yon): string {
    return YON_ETIKET[yon];
  }

  aracEkle(yon: Yon): void {
    this.sim.aracEkle(yon);
  }

  ilerlet(adet: number, dt = 0.2): void {
    this.sim.ilerlet(adet, dt);
  }

  anlik() {
    return this.sim.anlik();
  }

  durumSatirlari(): string[] {
    const s = this.sim.anlik();
    const [a, b] = s.faz.split("-") as Yon[];
    const satirlar = [
      `Faz: ${YON_ETIKET[a!]} – ${YON_ETIKET[b!]} | Strateji: ${s.strateji} | Geçen: ${s.gecen}`,
    ];
    for (const yon of YONLER) {
      satirlar.push(
        `  ${YON_ETIKET[yon]}: ${RENK_ETIKET[s.renkler[yon] as IsikRengi]} · kuyruk ${s.kuyruklar[yon]}`,
      );
    }
    return satirlar;
  }

  olayMesajlari(limit = 8): string[] {
    return this.sim.anlik().olaylar.slice(0, limit).map((o) => o.mesaj);
  }
}
