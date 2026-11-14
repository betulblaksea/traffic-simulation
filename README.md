# Trafik Işığı Simülasyonu

Dört yönlü kavşakta trafik ışığı ve araç kuyruklarını terminal üzerinden yöneten bir TypeScript simülasyonu.

Kuyruk yoğunluğuna göre yeşil ışık süresi değişir. Her ışık kırmızı, sarı ve yeşil durumları arasında geçer. Işık renk değişimleri olay günlüğüne yazılır. Terminal yalnızca `KavsakArayuzu` üzerinden çalışır; ışıklar, kuyruklar, zamanlama ve olaylar bu arayüzün arkasında toplanır.

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
| `olay` | Son ışık değişim olayları |
| `tick` | Simülasyonu ilerlet |
| `cikis` | Çık |

## Yapı

| Bölüm | Konum |
|--------|--------|
| Simülasyon | `src/domain/` |
| Zamanlama stratejileri | `src/patterns/strategy/` |
| Olay günlüğü | `src/patterns/observer/` |
| Kavşak arayüzü | `src/patterns/facade/` |
| Işık durumları | `src/patterns/state/` |
| Terminal arayüzü | `src/main.ts` |
