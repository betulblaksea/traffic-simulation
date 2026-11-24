import * as THREE from "three";
import { gltfYukle } from "./modelAraclari";

export type YolParcalari = {
  kavsak: THREE.Group;
  donus: THREE.Group;
  uzunDuz: THREE.Group;
};

function meshtenParca(mesh: THREE.Mesh): THREE.Group {
  const g = new THREE.Group();
  const geo = mesh.geometry.clone();
  geo.applyMatrix4(mesh.matrixWorld);
  geo.computeBoundingBox();
  const mat = Array.isArray(mesh.material)
    ? mesh.material.map((m) => m.clone())
    : mesh.material.clone();
  const m = new THREE.Mesh(geo, mat);
  g.add(m);

  const kutu = geo.boundingBox!;
  const merkez = new THREE.Vector3();
  kutu.getCenter(merkez);
  m.position.sub(merkez);
  m.position.y -= kutu.min.y - merkez.y;
  g.updateMatrixWorld(true);
  g.position.y -= new THREE.Box3().setFromObject(g).min.y;
  return g;
}

function meshBul(kok: THREE.Object3D, id: string): THREE.Mesh {
  let bulunan: THREE.Mesh | null = null;
  kok.traverse((o) => {
    if (bulunan || !(o instanceof THREE.Mesh)) return;
    if (`${o.name} ${o.parent?.name ?? ""}`.includes(id)) bulunan = o;
  });
  if (!bulunan) throw new Error(`Mesh yok: ${id}`);
  return bulunan;
}

function boyut(obj: THREE.Object3D): THREE.Vector3 {
  return new THREE.Box3().setFromObject(obj).getSize(new THREE.Vector3());
}

export async function yolParcalariniYukle(): Promise<YolParcalari> {
  const kit = await gltfYukle("/models/road_complete.glb");
  kit.updateMatrixWorld(true);
  return {
    kavsak: meshtenParca(meshBul(kit, "006")),
    donus: meshtenParca(meshBul(kit, "011")),
    uzunDuz: meshtenParca(meshBul(kit, "017")),
  };
}

export function kavsakKur(p: YolParcalari): THREE.Group {
  const kok = new THREE.Group();
  const BOYUT = 12;
  const k = BOYUT / Math.max(boyut(p.kavsak).x, boyut(p.kavsak).z);

  const kavsak = p.kavsak.clone(true);
  kavsak.scale.setScalar(k);
  kok.add(kavsak);

  const yol = boyut(p.uzunDuz).multiplyScalar(k);
  const uzunluk = Math.max(yol.x, yol.z);
  const mesafe = BOYUT / 2 + uzunluk / 2;
  const kg = yol.x > yol.z ? Math.PI / 2 : 0;
  const db = yol.x > yol.z ? 0 : Math.PI / 2;

  const kol = (x: number, z: number, rot: number) => {
    const s = p.uzunDuz.clone(true);
    s.scale.setScalar(k);
    s.position.set(x, 0, z);
    s.rotation.y = rot;
    kok.add(s);
  };

  for (const [x, z, rot] of [
    [0, -mesafe, kg],
    [0, mesafe, kg],
    [mesafe, 0, db],
    [-mesafe, 0, db],
    [0, mesafe + uzunluk, kg],
    [0, -(mesafe + uzunluk), kg],
    [0, mesafe + 2 * uzunluk, kg],
    [mesafe + uzunluk, 0, db],
    [-(mesafe + uzunluk), 0, db],
    [mesafe + 2 * uzunluk, 0, db],
    [-(mesafe + 2 * uzunluk), 0, db],
  ] as Array<[number, number, number]>) {
    kol(x, z, rot);
  }

  const ts = boyut(p.donus).multiplyScalar(k);
  const span = Math.max(ts.x, ts.z);
  const genislik = Math.min(yol.x, yol.z);
  const uc = -(mesafe + uzunluk + uzunluk / 2);
  const donus = p.donus.clone(true);
  donus.scale.setScalar(k);
  donus.rotation.y = Math.PI;
  donus.position.set(-(span - genislik) * 0.5, 0, uc - span * 0.5);
  kok.add(donus);
  donus.updateMatrixWorld(true);
  const tb = new THREE.Box3().setFromObject(donus);
  const gap = Math.abs(uc - tb.max.z) < Math.abs(uc - tb.min.z) ? uc - tb.max.z : uc - tb.min.z;
  donus.position.z += gap + 0.15;

  return kok;
}
