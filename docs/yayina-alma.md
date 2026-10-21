# Yayına alma (Coolify, fanussoft.com)

## Durum (21 Ekim 2026)

- YAYINDA: **https://fanussoft.com** (Let's Encrypt). `https://www.fanussoft.com` ve `https://fanustr.ahmcloud.com`
  (her yol) 308 ile fanussoft.com'a yönlenir (`next.config.ts`). Coolify'da `NEXT_PUBLIC_SITE_ADRESI=https://fanussoft.com`.
- Alan adları İHS'de (Yusuf'un hesabı). DNS: İHS › Alan Adı › Yönet › DNS Zone Servisi (açık); kayıtlar
  `@` ve `www` → A `187.124.174.57`. İHS'de DNS düzenlemek için önce **alan adı kilidi** kaldırılmalı (Yusuf yapar,
  iş bitince tekrar açar); .com için ayrıca alan adı sahibi e-posta doğrulaması gerekir (yapıldı).
- fanussoft.com.tr: DNS kayıtları aynı şekilde eklendi, ama .tr kayıt sistemi alan adını henüz yayına almadı (21 Ekim
  akşamı NXDOMAIN). Açılınca Coolify › Domains › Add Domain ile `fanussoft.com.tr` eklenir (www kendiliğinden gelir);
  yönlendirme kodda hazır.

## Önceki durum (20 Ekim 2026)

- Coolify paneli: https://panel.ahmcloud.com (uygulama: `/project/ccyhabwrej0jlzti0tyhlcol/environment/djvpcds9vcvfirqkv3prddlx/application/9nvnwcezuq8yfbdrwpkqgg4j`).
- Coolify: Root Team › proje `fanus` › `production` › uygulama `fanus` (Public Git Repository, Dockerfile, port 3000)
  kuruldu, `NEXT_PUBLIC_SITE_ADRESI=https://fanustr.ahmcloud.com` (derleme + çalışma), ilk dağıtım başarılı.
  Not: Coolify'a girince ekip seçicide **Root Team** seçilmeli (kişisel ekipte proje ve sunucu yok).
- Alan adları: `https://fanustr.ahmcloud.com`, `https://www.fanustr.ahmcloud.com` ve geçici
  `http://9nvnwcezuq8yfbdrwpkqgg4j.187.124.174.57.sslip.io` (DNS gelene kadar bu adresten açılır).
- DNS: Hostinger (Ahmet'in hesabı) › ahmcloud.com › DNS: A `fanustr` ve A `www.fanustr`
  → `187.124.174.57`, TTL 300 (20 Ekim 2026). Let's Encrypt sertifikası alındı (ilk dağıtım DNS'ten önce yapıldığı için
  uygulama bir kez Restart edildi). YAYINDA: https://fanustr.ahmcloud.com

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

## fanussoft.com.tr (22 Ekim 2026)

.tr kayıt sistemi (ns43.ns.tr) alan adını İHS'nin knuth.ihsdns.com / dijkstra.ihsdns.com sunucularına devretti; A kayıtları
(@ ve www → 187.124.174.57) İHS DNS Zone'da. Coolify › fanus › Domains'e https://fanussoft.com.tr eklendi (www
kendiliğinden geldi), Redeploy ile uygulandı; Let's Encrypt sertifikası alındı, `next.config.ts` 308 ile fanussoft.com'a
yönlendiriyor.
