# fanussoft: Next.js standalone imajı (Coolify, Dockerfile derleme paketi).
# Site durumsuzdur: veritabanı ve kalıcı birim gerekmez.

FROM node:24-alpine AS bagimliliklar
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:24-alpine AS derleme
WORKDIR /app
# Paylaşım görseli, kanonik adres ve site haritası bu adresle üretilir (derleme anında yazılır)
ARG NEXT_PUBLIC_SITE_ADRESI=https://fanussoft.com
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_ADRESI=$NEXT_PUBLIC_SITE_ADRESI
COPY --from=bagimliliklar /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-alpine AS calisma
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S fanus && adduser -S fanus -G fanus
COPY --from=derleme --chown=fanus:fanus /app/public ./public
COPY --from=derleme --chown=fanus:fanus /app/.next/standalone ./
COPY --from=derleme --chown=fanus:fanus /app/.next/static ./.next/static
# Görsel iyileştirici (sharp) için Linux kütüphaneleri: standalone izleyicisi her zaman kopyalamıyor
COPY --from=derleme --chown=fanus:fanus /app/node_modules/@img ./node_modules/@img
USER fanus
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/robots.txt >/dev/null || exit 1
CMD ["node", "server.js"]
