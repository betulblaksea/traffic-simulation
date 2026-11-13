import { describe, expect, it } from "vitest";
import { KavsakSimulasyonu } from "./KavsakSimulasyonu";
import { KavsakArayuzu } from "../patterns/facade/KavsakArayuzu";

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
    sim.ilerlet(100);
    expect(sim.anlik().gecen).toBeGreaterThanOrEqual(1);
  });
});

describe("KavsakArayuzu", () => {
  it("durum satırları üretir", () => {
    const arayuz = new KavsakArayuzu();
    const satirlar = arayuz.durumSatirlari();
    expect(satirlar.length).toBeGreaterThanOrEqual(5);
    expect(satirlar[0]).toContain("Strateji:");
  });
});
