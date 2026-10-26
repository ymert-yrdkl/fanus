# Sitenin yazı tiplerini küçültür: yalnız sitede kullanılan karakterler ve eksen aralıkları kalır.
#
#   python scripts/yazitipi-uret.py        (gerekli: pip install fonttools brotli)
#
# Kaynak: kaynak/yazitipi/*.woff2 (Google Fonts'un next/font ile indirdiği latin ve latin-ext dosyaları; SIL OFL).
# Çıktılar (elle düzenlenmez, bu betik yazar):
#   public/yazitipi/<ad>-<parça>.<özet>.woff2  dosya adında içerik özeti: tarayıcı bir yıl önbellekte tutar,
#                                             dosya değişince adı da değişir (next.config.ts › headers)
#   src/app/yazitipleri.css                   @font-face kuralları, yedek yazı tipi ölçüleri, --font-* değişkenleri
#   src/site/yazitipleri.ts                   açılışta ön yüklenen dosyalar (layout.tsx)
# Her aile iki dosya: "latin" (ASCII, Latin-1, ı, tipografik işaretler) ve "tr" (Ğ ğ İ Ş ş ₺); CSS ikisini
# unicode-range ile tek aile gibi birleştirir.
#
# Neden (26 Ekim 2026): Google'ın dosyaları bütün eksenleri ve yüzlerce kullanılmayan karakteri taşıyordu (açılışta
# 269 KB). Telefonda bu baytlar ilk çizimle yarışıyordu (PageSpeed). Şimdi ~104 KB.
#
# Eksenler sitedeki kullanıma göre (globals.css ve bileşenler):
#   Bricolage Grotesque  wght 500-700, wdth 85-100, opsz 96'ya sabit (başlıkların hepsi opsz 96; ekseni aralıkta tutmak
#                        dosyayı 61 KB'tan 105 KB'a çıkarıyor). Logo ayrı: "bricolage-logo" yalnız f a n u s o t
#                        harfleri, logonun kendi ayarında (opsz 22, wght 600, wdth 100); logo eskisiyle birebir aynı.
#   Geist                wght 400-700
#   Geist Mono           wght 400-600
# Yeni bir kalınlık, genişlik ya da Latin dışı karakter kullanılırsa aralıklar genişletilip betik yeniden çalıştırılır.

import hashlib
import io
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

KOK = Path(__file__).resolve().parent.parent
KAYNAK = KOK / "kaynak" / "yazitipi"
CIKTI = KOK / "public" / "yazitipi"
CSS = KOK / "src" / "app" / "yazitipleri.css"
TS = KOK / "src" / "site" / "yazitipleri.ts"
YENI_SATIR = "\n"


def aralik(bas, son):
    return list(range(bas, son + 1))


# latin: ASCII, Latin-1 (Ç Ö Ü ç ö ü â © · ...), ı, Œ œ, tire ve tırnaklar, • …, ‰, ‹ ›, €, ™, ↑ ↓, eksi
LATIN = (
    aralik(0x20, 0x7E)
    + aralik(0xA0, 0xFF)
    + [0x131, 0x152, 0x153]
    + aralik(0x2010, 0x2027)
    + [0x2030, 0x2039, 0x203A, 0x20AC, 0x2122, 0x2191, 0x2193, 0x2212]
)
# tr: Türkçeye özgü ve latin-ext dosyasında duranlar: Ğ ğ İ Ş ş, Türk lirası
TR = [0x11E, 0x11F, 0x130, 0x15E, 0x15F, 0x20BA]

# (dosya adı, CSS aile adı, eksenler, @font-face tanımı, yedek yazı tipi ölçüleri)
# Yedek ölçüler next/font'un ürettiğiyle aynı: yazı tipi gelmeden Arial bu oranlarla çizilir, gelince satırlar kaymaz.
AILELER = [
    (
        "bricolage",
        "Bricolage",
        {"wght": (500, 700), "wdth": (85, 100), "opsz": 96},
        ["font-weight: 500 700;", "font-stretch: 85% 100%;"],
        ["ascent-override: 88.21%;", "descent-override: 25.61%;", "line-gap-override: 0%;", "size-adjust: 105.43%;"],
    ),
    (
        "geist",
        "Geist",
        {"wght": (400, 700)},
        ["font-weight: 400 700;"],
        ["ascent-override: 95.94%;", "descent-override: 28.16%;", "line-gap-override: 0%;", "size-adjust: 104.76%;"],
    ),
    (
        "geist-mono",
        "Geist Mono",
        {"wght": (400, 600)},
        ["font-weight: 400 600;"],
        ["ascent-override: 74.67%;", "descent-override: 21.92%;", "line-gap-override: 0%;", "size-adjust: 134.59%;"],
    ),
]


def unicode_araligi(kodlar):
    """[0x20, 0x21, ..., 0x7E] -> "U+0020-007E" biçiminde, ardışıkları birleştirerek."""
    kodlar = sorted(set(kodlar))
    parcalar = []
    bas = kodlar[0]
    for i, kod in enumerate(kodlar):
        son_mu = i == len(kodlar) - 1
        if son_mu or kodlar[i + 1] != kod + 1:
            parcalar.append(f"U+{bas:04X}" + (f"-{kod:04X}" if kod != bas else ""))
            if not son_mu:
                bas = kodlar[i + 1]
    return ", ".join(parcalar)


def uret(kaynak, ad, eksenler, karakterler):
    """Eksenleri daraltır, karakterleri süzer, woff2 olarak içerik özetli adla yazar; dosya yolunu döndürür."""
    font = TTFont(kaynak)
    font = instancer.instantiateVariableFont(font, eksenler)
    # Daraltılmış yazı tipi yeniden okunur: aynı nesnede alt kümeye geçince değişken glif tablosu eski glif adlarını arıyor
    ara = io.BytesIO()
    font.save(ara)
    ara.seek(0)
    font = TTFont(ara)
    secenek = subset.Options()
    secenek.layout_features = ["*"]  # kerning, bitişik harfler, Türkçe yerel biçimler kalsın
    secenek.hinting = False  # web'de woff2 için gereksiz
    secenek.name_IDs = ["*"]
    alt = subset.Subsetter(options=secenek)
    alt.populate(unicodes=karakterler)
    alt.subset(font)
    font.flavor = "woff2"
    ara = io.BytesIO()
    font.save(ara)
    veri = ara.getvalue()
    dosya = CIKTI / f"{ad}.{hashlib.sha256(veri).hexdigest()[:8]}.woff2"
    dosya.write_bytes(veri)
    return dosya


def kural(satirlar):
    return YENI_SATIR.join(["@font-face {"] + [f"  {s}" for s in satirlar] + ["}"])


def main():
    CIKTI.mkdir(parents=True, exist_ok=True)
    for eski in CIKTI.glob("*.woff2"):
        eski.unlink()
    kurallar, onyukle = [], []
    toplam = {"once": 0, "sonra": 0}

    def kaydet(dosya, once=0):
        boyut = dosya.stat().st_size
        toplam["once"] += once
        toplam["sonra"] += boyut
        print(f"{dosya.name:40} {once or '':>8} -> {boyut:>7} bayt")
        adres = f"/yazitipi/{dosya.name}"
        onyukle.append(adres)
        return adres

    for ad, aile, eksenler, tanim, yedek in AILELER:
        for parca, kaynak_ad, karakterler in (("latin", "latin", LATIN), ("tr", "latin-ext", TR)):
            kaynak = KAYNAK / f"{ad}-{kaynak_ad}.woff2"
            adres = kaydet(uret(kaynak, f"{ad}-{parca}", eksenler, karakterler), kaynak.stat().st_size)
            kurallar.append(
                kural(
                    [f'font-family: "{aile}";', f'src: url("{adres}") format("woff2");']
                    + tanim
                    + ["font-display: swap;", f"unicode-range: {unicode_araligi(karakterler)};"]
                )
            )
        kurallar.append(kural([f'font-family: "{aile} Fallback";', 'src: local("Arial");'] + yedek))

    # Logo: "fanussoft" yazısı, 22 px'te optik boy 22 (Logo.tsx › .logo-yazi); sabit tek bir çizim
    harfler = [ord(c) for c in "fanusot"]
    adres = kaydet(uret(KAYNAK / "bricolage-latin.woff2", "bricolage-logo", {"opsz": 22, "wght": 600, "wdth": 100}, harfler))
    kurallar.append(
        kural(
            ['font-family: "Bricolage Logo";', f'src: url("{adres}") format("woff2");', "font-weight: 600;"]
            + ["font-display: swap;", f"unicode-range: {unicode_araligi(harfler)};"]
        )
    )

    degiskenler = YENI_SATIR.join(
        [
            ":root {",
            '  --font-bricolage: "Bricolage", "Bricolage Fallback";',
            '  --font-geist: "Geist", "Geist Fallback";',
            '  --font-geist-mono: "Geist Mono", "Geist Mono Fallback";',
            "}",
        ]
    )
    CSS.write_text(
        "/* Bu dosyayı scripts/yazitipi-uret.py yazar; elle düzenlemeyin. */"
        + YENI_SATIR * 2
        + (YENI_SATIR * 2).join(kurallar + [degiskenler])
        + YENI_SATIR,
        encoding="utf-8",
    )
    TS.write_text(
        YENI_SATIR.join(
            [
                "// Bu dosyayı scripts/yazitipi-uret.py yazar; elle düzenlemeyin.",
                "// Açılışta ön yüklenen yazı tipi dosyaları (layout.tsx).",
                "export const YAZI_TIPI_DOSYALARI = [",
                *[f'  "{a}",' for a in onyukle],
                "];",
                "",
            ]
        ),
        encoding="utf-8",
    )
    print(f"{'toplam':40} {toplam['once']:>8} -> {toplam['sonra']:>7} bayt")


if __name__ == "__main__":
    sys.exit(main())
