import * as readline from "node:readline";
import { KavsakSimulasyonu } from "./domain/KavsakSimulasyonu";
import { RENK_ETIKET, type IsikRengi } from "./domain/IsikRengi";
import { YON_ETIKET, YONLER, type Yon } from "./domain/Yon";

const sim = new KavsakSimulasyonu();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Trafik Işığı Simülasyonu");
console.log("Komutlar: kuzey | guney | dogu | bati | durum | olay | tick | cikis");
console.log("");

function durumYaz(): void {
  const s = sim.anlik();
  const [a, b] = s.faz.split("-") as Yon[];
  console.log(`Faz: ${YON_ETIKET[a!]} – ${YON_ETIKET[b!]} | Strateji: ${s.strateji} | Geçen: ${s.gecen}`);
  for (const yon of YONLER) {
    console.log(
      `  ${YON_ETIKET[yon]}: ${RENK_ETIKET[s.renkler[yon] as IsikRengi]} · kuyruk ${s.kuyruklar[yon]}`,
    );
  }
}

function prompt(): void {
  rl.question("> ", (satir) => {
    const komut = satir.trim().toLowerCase();

    if (komut === "cikis" || komut === "exit" || komut === "q") {
      rl.close();
      return;
    }

    if (YONLER.includes(komut as Yon)) {
      sim.aracEkle(komut as Yon);
      console.log(`${YON_ETIKET[komut as Yon]} yönüne araç eklendi.`);
      durumYaz();
    } else if (komut === "durum") {
      durumYaz();
    } else if (komut === "olay") {
      const olaylar = sim.anlik().olaylar.slice(0, 8);
      if (olaylar.length === 0) console.log("Henüz olay yok.");
      else for (const o of olaylar) console.log(`  ${o.mesaj}`);
    } else if (komut === "tick" || komut === "") {
      for (let i = 0; i < 10; i++) sim.adim(0.2);
      durumYaz();
    } else {
      console.log("Bilinmeyen komut. Örnek: kuzey, durum, olay, tick, cikis");
    }

    prompt();
  });
}

durumYaz();
prompt();
