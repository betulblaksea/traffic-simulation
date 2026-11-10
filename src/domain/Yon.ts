export type Yon = "kuzey" | "guney" | "dogu" | "bati";

export const YONLER: Yon[] = ["kuzey", "guney", "dogu", "bati"];

export const FAZ_CIFTLERI: [Yon, Yon][] = [
  ["kuzey", "guney"],
  ["dogu", "bati"],
];

export const YON_ETIKET: Record<Yon, string> = {
  kuzey: "Kuzey",
  guney: "Güney",
  dogu: "Doğu",
  bati: "Batı",
};
