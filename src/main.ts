import { RENK_ETIKET, type IsikRengi } from "./domain/IsikRengi";
import { YON_ETIKET, type Yon } from "./domain/Yon";
import { KavsakArayuzu } from "./patterns/facade/KavsakArayuzu";
import { KavsakSahnesi } from "./view/KavsakSahnesi";

const canvas = document.querySelector<HTMLCanvasElement>("#scene")!;
const durumEl = document.querySelector<HTMLPreElement>("#status")!;
const olaylarEl = document.querySelector<HTMLUListElement>("#events")!;

const kavsak = new KavsakArayuzu();
const sahne = new KavsakSahnesi(canvas);

document.querySelector("#add-vehicle")!.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest("button[data-dir]");
  if (btn) kavsak.aracEkle(btn.getAttribute("data-dir") as Yon);
});

let onceki = performance.now();

function kare(simdi: number): void {
  const dt = Math.min(0.05, (simdi - onceki) / 1000);
  onceki = simdi;
  kavsak.adim(dt);
  sahne.senkronizeEt(kavsak);
  sahne.ciz();

  const s = kavsak.anlik();
  const [a, b] = s.faz.split("-") as Yon[];
  durumEl.textContent = [
    `Faz: ${YON_ETIKET[a!]} – ${YON_ETIKET[b!]}`,
    `Geçen: ${s.gecen}`,
    "",
    ...Object.entries(s.renkler).map(
      ([d, c]) => `${YON_ETIKET[d as Yon]}: ${RENK_ETIKET[c as IsikRengi]} · kuyruk ${s.kuyruklar[d]}`,
    ),
  ].join("\n");

  olaylarEl.innerHTML = s.olaylar
    .slice(0, 12)
    .map((e) => `<li>${e.mesaj}</li>`)
    .join("");

  requestAnimationFrame(kare);
}

requestAnimationFrame(kare);
