# Trafik Işığı Simülasyonu

Dört yönlü kavşakta trafik ışığı ve araç kuyruklarını terminal üzerinden yöneten bir TypeScript simülasyonu.

Kuyruk yoğunluğuna göre yeşil ışık süresi değişir: az araçta sabit zamanlama, yoğunlukta uyarlanabilir zamanlama kullanılır.

## Çalıştırma

```bash
npm install
npm start
```

```bash
npm test
```

## Komutlar

| Komut | Açıklama |
|--------|----------|
| `kuzey` `guney` `dogu` `bati` | O yöne araç ekle |
| `durum` | Işıklar, kuyruklar ve aktif strateji |
| `tick` | Simülasyonu ilerlet |
| `cikis` | Çık |

## Yapı

| Bölüm | Konum |
|--------|--------|
| Simülasyon | `src/domain/` |
| Zamanlama stratejileri | `src/patterns/strategy/` |
| Terminal arayüzü | `src/main.ts` |
