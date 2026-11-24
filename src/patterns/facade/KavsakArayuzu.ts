import { KavsakSimulasyonu } from "../../domain/KavsakSimulasyonu";
import type { Yon } from "../../domain/Yon";

export class KavsakArayuzu {
  private readonly sim = new KavsakSimulasyonu();

  get kuyruklar() {
    return this.sim.kuyruklar;
  }

  aracEkle(yon: Yon): void {
    this.sim.aracEkle(yon);
  }

  adim(dt: number): void {
    this.sim.adim(dt);
  }

  anlik() {
    return this.sim.anlik();
  }
}
