import * as readline from "node:readline";
import { KavsakArayuzu } from "./patterns/facade/KavsakArayuzu";

const kavsak = new KavsakArayuzu();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Trafik Işığı Simülasyonu");
console.log("Komutlar: kuzey | guney | dogu | bati | durum | olay | tick | cikis");
console.log("");

function durumYaz(): void {
  for (const satir of kavsak.durumSatirlari()) console.log(satir);
}

function prompt(): void {
  rl.question("> ", (satir) => {
    const komut = satir.trim().toLowerCase();

    if (komut === "cikis" || komut === "exit" || komut === "q") {
      rl.close();
      return;
    }

    if (kavsak.yonGecerli(komut)) {
      kavsak.aracEkle(komut);
      console.log(`${kavsak.yonEtiket(komut)} yönüne araç eklendi.`);
      durumYaz();
    } else if (komut === "durum") {
      durumYaz();
    } else if (komut === "olay") {
      const olaylar = kavsak.olayMesajlari();
      if (olaylar.length === 0) console.log("Henüz olay yok.");
      else for (const mesaj of olaylar) console.log(`  ${mesaj}`);
    } else if (komut === "tick" || komut === "") {
      kavsak.ilerlet(10);
      durumYaz();
    } else {
      console.log("Bilinmeyen komut. Örnek: kuzey, durum, olay, tick, cikis");
    }

    prompt();
  });
}

durumYaz();
prompt();
