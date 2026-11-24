import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const yukleyici = new GLTFLoader();

export async function gltfYukle(url: string): Promise<THREE.Group> {
  return (await yukleyici.loadAsync(url)).scene;
}

export function boyutaSigdir(kok: THREE.Object3D, hedef: number): void {
  kok.updateMatrixWorld(true);
  const kutu = new THREE.Box3().setFromObject(kok);
  if (kutu.isEmpty()) return;
  const b = kutu.getSize(new THREE.Vector3());
  kok.scale.multiplyScalar(hedef / Math.max(b.x, b.y, b.z, 0.001));
  kok.updateMatrixWorld(true);
  const k2 = new THREE.Box3().setFromObject(kok);
  const m = k2.getCenter(new THREE.Vector3());
  kok.position.x -= m.x;
  kok.position.z -= m.z;
  kok.position.y -= k2.min.y;
}

export function arabaRengiSec(kok: THREE.Object3D, renk: string): void {
  kok.traverse((o) => {
    if (o.name.startsWith("color_")) o.visible = o.name.includes(renk);
  });
}

export function sablonKopyala(sablon: THREE.Group): THREE.Group {
  const k = sablon.clone(true);
  k.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    o.material = Array.isArray(o.material)
      ? o.material.map((m) => m.clone())
      : o.material.clone();
  });
  return k;
}

export function lambaMeshleriniBul(kok: THREE.Object3D): {
  kirmizi: THREE.Mesh | null;
  sari: THREE.Mesh | null;
  yesil: THREE.Mesh | null;
} {
  let kirmizi: THREE.Mesh | null = null;
  let sari: THREE.Mesh | null = null;
  let yesil: THREE.Mesh | null = null;
  kok.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    const n = o.name.toLowerCase();
    if (n.includes("rot")) kirmizi = o;
    else if (n.includes("gelb")) sari = o;
    else if (n.includes("gr") && !n.includes("gelb")) yesil = o;
  });
  return { kirmizi, sari, yesil };
}
