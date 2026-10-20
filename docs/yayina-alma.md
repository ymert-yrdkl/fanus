# Yayına alma (Coolify, fanustr.ahmcloud.com)

Sunucu Ahmet'in; adımlar Yusuf ve Ahmet'in onayıyla yapılır. Kurgu: açık GitHub deposu, Coolify'da Dockerfile ile
derleme. Site durumsuz: veritabanı ve kalıcı birim yok.

## 1. Kod
Açık depo: https://github.com/ymert-yrdkl/fanus (dal `main`).

```bash
git remote add origin git@github.com:ymert-yrdkl/fanus.git
git push -u origin main
```

## 2. Coolify kaynağı
1. Yeni proje `fanus` › ortam `production` › yeni kaynak › **Public Git Repository** →
   `https://github.com/ymert-yrdkl/fanus`, dal `main`, Build Pack **Dockerfile**.
2. Port **3000**. Alan adı `https://fanustr.ahmcloud.com`.
3. Ortam değişkeni (derleme argümanı olarak da işaretlenmeli):
   `NEXT_PUBLIC_SITE_ADRESI` = `https://fanustr.ahmcloud.com` (fanus.tr bağlanınca `https://fanus.tr`).
4. Sağlık kontrolü imajda (`/robots.txt`).

Depo açık olduğu için GitHub webhook yok: `git push` sonrası Coolify'da **Deploy** düğmesine basılır.

## 3. DNS
Hostinger › ahmcloud.com DNS: A kaydı `fanustr` → `187.124.174.57` (diğer alt alanlarla aynı sunucu), TTL 300.
Kayıt yayılınca Coolify (Traefik + Let's Encrypt) HTTPS sertifikasını ilk istekte kendisi alır.

## 4. fanus.tr'ye geçiş
fanus.tr'nin DNS'inde `@` ve `www` için A kaydı → `187.124.174.57`; Coolify'da alan adına
`https://fanus.tr,https://www.fanus.tr` eklenir, `NEXT_PUBLIC_SITE_ADRESI` güncellenip yeniden dağıtılır
(kanonik adres, site haritası ve paylaşım görseli bu adresle üretilir).
