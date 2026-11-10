import { describe, expect, it } from "vitest";
import { KavsakSimulasyonu } from "./KavsakSimulasyonu";

describe("KavsakSimulasyonu", () => {
  it("araç eklenir", () => {
    const sim = new KavsakSimulasyonu();
    sim.aracEkle("kuzey");
    expect(sim.anlik().kuyruklar.kuzey).toBe(1);
  });

  it("ışıklar yeşile geçer", () => {
    const sim = new KavsakSimulasyonu();
    for (let i = 0; i < 30; i++) sim.adim(0.2);
    const yesiller = Object.values(sim.anlik().renkler).filter((c) => c === "yesil");
    expect(yesiller.length).toBeGreaterThanOrEqual(1);
  });

  it("yeşilde araç geçer", () => {
    const sim = new KavsakSimulasyonu();
    sim.aracEkle("kuzey");
    sim.aracEkle("guney");
    for (let i = 0; i < 100; i++) sim.adim(0.2);
    expect(sim.anlik().gecen).toBeGreaterThanOrEqual(1);
  });
});
