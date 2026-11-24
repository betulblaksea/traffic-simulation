import * as THREE from "three";
import type { AracTuru } from "../domain/AracTuru";
import type { IsikRengi } from "../domain/IsikRengi";
import { YONLER, type Yon } from "../domain/Yon";
import type { KavsakArayuzu } from "../patterns/facade/KavsakArayuzu";
import {
  arabaRengiSec,
  boyutaSigdir,
  gltfYukle,
  lambaMeshleriniBul,
  sablonKopyala,
} from "./modelAraclari";
import { kavsakKur, yolParcalariniYukle } from "./yolKiti";

const ACIK: Record<IsikRengi, number> = {
  kirmizi: 0xff2222,
  sari: 0xffcc00,
  yesil: 0x22cc55,
};

const RENKLER = ["blue", "red", "yellow", "black", "silver", "white"];

const SERIT = 1.2;
const POZ: Record<Yon, (a: number) => [number, number, number]> = {
  kuzey: (a) => [-SERIT, -a, 0],
  guney: (a) => [SERIT, a, Math.PI],
  dogu: (a) => [a, -SERIT, -Math.PI / 2],
  bati: (a) => [-a, SERIT, Math.PI / 2],
};

type Lambalar = Record<IsikRengi, THREE.MeshStandardMaterial>;

export class KavsakSahnesi {
  readonly renderer: THREE.WebGLRenderer;
  private sahne = new THREE.Scene();
  private kamera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  private isiklar = new Map<Yon, Lambalar>();
  private araclar = new Map<string, THREE.Group>();
  private aracGrubu = new THREE.Group();
  private arabalar: THREE.Group[] = [];
  private otobus: THREE.Group | null = null;
  private isikSablon: THREE.Group | null = null;
  private hazir = false;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setClearColor(0x87a0b8);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.kamera.position.set(15.5, 17, 15.5);
    this.kamera.lookAt(0, 0, 0);

    this.sahne.add(new THREE.AmbientLight(0xffffff, 0.55));
    this.sahne.add(new THREE.HemisphereLight(0xdbeafe, 0x556677, 0.7));
    const gunes = new THREE.DirectionalLight(0xffffff, 1.4);
    gunes.position.set(10, 20, 8);
    this.sahne.add(gunes, this.aracGrubu);

    this.boyutlandir();
    window.addEventListener("resize", () => this.boyutlandir());
    void this.yukle();
  }

  senkronizeEt(kavsak: KavsakArayuzu): void {
    if (!this.hazir) return;
    const an = kavsak.anlik();

    for (const yon of YONLER) {
      const l = this.isiklar.get(yon);
      const renk = an.renkler[yon] as IsikRengi;
      if (!l || !renk) continue;
      for (const r of ["kirmizi", "sari", "yesil"] as IsikRengi[]) {
        this.lamba(l[r], renk === r, ACIK[r]);
      }
    }

    const gorulen = new Set<string>();
    for (const v of an.araclar) {
      gorulen.add(v.id);
      let mesh = this.araclar.get(v.id);
      if (!mesh) {
        mesh = this.aracOlustur(v.tur);
        this.araclar.set(v.id, mesh);
        this.aracGrubu.add(mesh);
      }
      const i = kavsak.kuyruklar.get(v.yon)!.indexOf(v);
      const boyunca = v.bekliyor ? 7.5 + i * 3 : 7.5 - v.ilerleme * 5;
      const [x, z, rot] = POZ[v.yon](boyunca);
      mesh.position.set(x, 0.05, z);
      mesh.rotation.y = rot;
    }

    for (const [id, mesh] of this.araclar) {
      if (gorulen.has(id)) continue;
      this.aracGrubu.remove(mesh);
      this.araclar.delete(id);
    }
  }

  ciz(): void {
    this.renderer.render(this.sahne, this.kamera);
  }

  private async yukle(): Promise<void> {
    try {
      this.sahne.add(kavsakKur(await yolParcalariniYukle()));
    } catch (e) {
      console.error(e);
    }

    for (const url of ["/models/car.glb", "/models/car2.glb"]) {
      try {
        const a = await gltfYukle(url);
        boyutaSigdir(a, 2.6);
        this.arabalar.push(a);
      } catch (e) {
        console.error(e);
      }
    }

    try {
      this.otobus = await gltfYukle("/models/bus.glb");
      boyutaSigdir(this.otobus, 4);
    } catch (e) {
      console.error(e);
    }

    try {
      this.isikSablon = await gltfYukle("/models/traffic_light__animation.glb");
      boyutaSigdir(this.isikSablon, 3.5);
      this.isiklariKoy();
    } catch (e) {
      console.error(e);
    }

    this.zeminKoy();
    await this.agaclariKoy();
    this.hazir = true;
  }

  private isiklariKoy(): void {
    if (!this.isikSablon) return;
    const d = 3.2;
    const yerler: Array<[Yon, number, number, number]> = [
      ["kuzey", -d, -d, Math.PI],
      ["guney", d, d, 0],
      ["dogu", d, -d, Math.PI / 2],
      ["bati", -d, d, -Math.PI / 2],
    ];
    for (const [yon, x, z, rot] of yerler) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      g.rotation.y = rot;
      g.add(sablonKopyala(this.isikSablon));
      const m = lambaMeshleriniBul(g);
      const { kirmizi, sari, yesil } = m;
      if (!kirmizi || !sari || !yesil) continue;
      const lambalar: Lambalar = {
        kirmizi: kirmizi.material as THREE.MeshStandardMaterial,
        sari: sari.material as THREE.MeshStandardMaterial,
        yesil: yesil.material as THREE.MeshStandardMaterial,
      };
      for (const r of ["kirmizi", "sari", "yesil"] as IsikRengi[]) {
        this.lamba(lambalar[r], false, ACIK[r]);
      }
      this.sahne.add(g);
      this.isiklar.set(yon, lambalar);
    }
  }

  private zeminKoy(): void {
    const z = new THREE.Mesh(
      new THREE.CircleGeometry(70, 48),
      new THREE.MeshStandardMaterial({ color: 0x5f8f55, roughness: 0.92 }),
    );
    z.rotation.x = -Math.PI / 2;
    z.position.y = -0.08;
    this.sahne.add(z);
  }

  private async agaclariKoy(): Promise<void> {
    try {
      const sablon = await gltfYukle("/models/oak_trees.glb");
      boyutaSigdir(sablon, 5);
      sablon.traverse((o) => {
        if (!(o instanceof THREE.Mesh)) return;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) {
          m.side = THREE.DoubleSide;
          if (o.name.toLowerCase().includes("leaf")) {
            m.transparent = true;
            m.alphaTest = 0.4;
          }
        }
      });
      for (let a = 0; a < Math.PI * 2; a += 0.9) {
        for (const r of [12, 22, 32]) {
          const x = Math.cos(a) * r;
          const z = Math.sin(a) * r;
          if (Math.abs(x) < 7 || Math.abs(z) < 7) continue;
          const t = sablon.clone(true);
          t.position.set(x, t.position.y, z);
          t.rotation.y = a;
          this.sahne.add(t);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  private aracOlustur(tur: AracTuru): THREE.Group {
    if (tur === "otobus" && this.otobus) return sablonKopyala(this.otobus);
    if (this.arabalar.length) {
      const a = sablonKopyala(this.arabalar[Math.floor(Math.random() * this.arabalar.length)]!);
      arabaRengiSec(a, RENKLER[Math.floor(Math.random() * RENKLER.length)]!);
      return a;
    }
    return new THREE.Group().add(
      new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 1.4), new THREE.MeshStandardMaterial({ color: 0x3b82f6 })),
    );
  }

  private lamba(mat: THREE.MeshStandardMaterial, acik: boolean, renk: number): void {
    mat.color.setHex(acik ? renk : 0x111111);
    mat.emissive.setHex(acik ? renk : 0x000000);
    mat.emissiveIntensity = acik ? 2 : 0;
    mat.toneMapped = false;
  }

  private boyutlandir(): void {
    const c = this.renderer.domElement;
    this.renderer.setSize(c.clientWidth, c.clientHeight, false);
    this.kamera.aspect = c.clientWidth / Math.max(c.clientHeight, 1);
    this.kamera.updateProjectionMatrix();
  }
}
