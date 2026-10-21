// Köşeli parantez biçimli iki cam parça ve aralarında yanan katmanlı alev, kıvılcımlar (three.js).
// Bu dosya yalnız tarayıcıda, sayfa açıldıktan sonra dinamik olarak yüklenir.
//
// Cam: alevi iki yandan saran iki kalın cam köşeli parantez, önden "[ alev ]" (logodaki işaretin 3B hâli).
// Alev logodakiyle aynı biçimde, dört katman (kor, turuncu, sarı, öz); her zaman kameraya döner, rüzgârla eğilir.
//
// Dünya birimleri: alevin tabanı y=ALEV_TABANI'nda, camın ortası y=CAM_ORTASI'nda.
// Ekrandaki yer, boy ve camın açılması `sahneDurumu`ndan okunur (GSAP değiştirir).

import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Points,
  Quaternion,
  Scene,
  ShaderMaterial,
  Shape,
  ShapeGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
  type Material,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { pozKaristir, sahneDurumu, type Poz } from "./durum";

/** Camın altından üstüne kadar yükseklik, zemin ışığıyla birlikte (yerleşim ölçeği için). */
const NESNE_BOYU = 3.4;
const KAMERA_UZAKLIK = 12;
const CAM_ORTASI = 0.5;
const ALEV_TABANI = -0.24;
/** Logodaki alev yolu 100x140'lık kutuda çizildi; dünya birimine çevirme oranı. */
const ALEV_OLCEGI = 0.0105;
const ALEV_BOYU = 136 * ALEV_OLCEGI;
/** Alevin görünen ortası (hale ve ışık buraya konur). */
const ALEV_ORTASI = ALEV_TABANI + 0.62;

/** Alevin ve ışığın renkleri (paletten bağımsız, markanın alevi). Alev renkleri 0-1 aralığında sRGB. */
const ALEV_RENKLERI = {
  cekirdek: [1.0, 0.84, 0.25],
  orta: [1.0, 0.45, 0.07],
  dis: [0.95, 0.15, 0.04],
  kivilcim: [1.0, 0.62, 0.18],
  hale: 0xff6a14,
  haleKucuk: 0xffc23a,
  zeminIsigi: 0xff4a2b,
  isik: 0xff8a2e,
};

/** Sahnenin zemini sayfanın gece rengiyle aynı olmalı: paletten (CSS --lacivert) okunur. */
const sahneZemini = () => getComputedStyle(document.documentElement).getPropertyValue("--lacivert").trim() || "#050d1e";

type Secenek = {
  /** İlk kare çizilince çağrılır. */
  hazir: () => void;
  /** Hareket azaltma tercihi: zaman akmaz, yalnız gerektiğinde çizilir. */
  azHareket: boolean;
};

/** Alev katmanları: dıştan içe kor, turuncu, sarı ve öz. Her biri bir öncekinin küçültülmüşü, biraz önde. */
const KATMANLAR = [
  { olcek: 1, z: 0 },
  { olcek: 0.74, z: 0.012 },
  { olcek: 0.5, z: 0.024 },
  { olcek: 0.26, z: 0.036 },
];

export function fanusSahnesiKur(tuval: HTMLCanvasElement, secenek: Secenek) {
  const dar = window.matchMedia("(max-width: 767px)").matches;
  const zayif = dar || (navigator.hardwareConcurrency ?? 8) <= 4;

  let cizici: WebGLRenderer;
  try {
    cizici = new WebGLRenderer({
      canvas: tuval,
      antialias: !zayif,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }
  cizici.setPixelRatio(Math.min(window.devicePixelRatio, zayif ? 1.25 : 1.5));
  // Nötr ton eşleme: alevin doygun renkleri solmadan kalır, camın parlamaları yumuşak sıkışır
  cizici.toneMapping = NeutralToneMapping;
  cizici.toneMappingExposure = 1.0;
  cizici.outputColorSpace = SRGBColorSpace;
  cizici.transmissionResolutionScale = zayif ? 0.5 : 1;
  // Zemin sayfayla aynı renk ve opak: saydam zeminde three.js kırılma için camın arkasını beyaz siler (süt cam görünümü)
  cizici.setClearColor(sahneZemini(), 1);

  const sahne = new Scene();
  const pmrem = new PMREMGenerator(cizici);
  const ortam = pmrem.fromScene(new RoomEnvironment(), 0.04);
  sahne.environment = ortam.texture;
  sahne.environmentIntensity = 0.9;

  const kamera = new PerspectiveCamera(30, 1, 0.1, 100);
  kamera.position.set(0, 1.2, KAMERA_UZAKLIK);
  kamera.lookAt(0, 0, 0);

  // Silinecekler listesi (yokEt'te bellek boşaltılır)
  const geometriler: BufferGeometry[] = [];
  const malzemeler: Material[] = [];
  const g = <T extends BufferGeometry>(geo: T) => (geometriler.push(geo), geo);
  const m = <T extends Material>(mal: T) => (malzemeler.push(mal), mal);

  // Yerleşim (ekrandaki konum ve boy) > eğim (imleç ve salınım) > parçalar
  const yerlesim = new Group();
  const egim = new Group();
  yerlesim.add(egim);
  sahne.add(yerlesim);

  // ---- Cam ----
  const camMalzeme = m(
    new MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.03,
      transmission: 1,
      thickness: 0.6,
      ior: 1.5,
      // Kenarlarda ince gökkuşağı kırılması
      dispersion: zayif ? 0 : 4,
      envMapIntensity: 2,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      iridescence: 0.22,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [100, 400],
      attenuationColor: new Color(0xf2f6ff),
      attenuationDistance: 8,
      specularIntensity: 1,
    }),
  );

  // Köşeli parantez: iki kalın cam parça, önden "[ ]"
  const koseliGeo = (yon: 1 | -1) => {
    const geo = g(
      yumusat(
        new ExtrudeGeometry(koseliBicimi(yon), {
          depth: 0.3,
          bevelEnabled: true,
          bevelThickness: 0.09,
          bevelSize: 0.06,
          bevelSegments: zayif ? 4 : 8,
          curveSegments: zayif ? 6 : 12,
        }),
      ),
    );
    geo.translate(0, 0, -0.15);
    return geo;
  };
  const koseli = new Group();
  const solKoseli = new Mesh(koseliGeo(1), camMalzeme);
  const sagKoseli = new Mesh(koseliGeo(-1), camMalzeme);
  koseli.add(solKoseli, sagKoseli);
  koseli.position.y = CAM_ORTASI;

  egim.add(koseli);

  // ---- Alev (opak, ışıyan; cam onu kırarak gösterir) ----
  const alevOrtak = {
    uZaman: { value: 0 },
    uEgim: { value: new Vector2() },
    uGuc: { value: 1 },
  };
  const alevGrubu = new Group();
  alevGrubu.position.y = ALEV_TABANI;
  const dayanak = 4 * ALEV_OLCEGI;
  const alevMalzemeleri = KATMANLAR.map((katman, i) => {
    const geo = g(new ShapeGeometry(alevBicimi(), zayif ? 16 : 32));
    geo.translate(0, -dayanak, 0);
    geo.scale(katman.olcek, katman.olcek, 1);
    geo.translate(0, dayanak, katman.z);
    const malzeme = m(
      new ShaderMaterial({
        uniforms: {
          ...alevOrtak,
          uFaz: { value: i * 1.37 },
          uAlt: { value: new Color() },
          uUst: { value: new Color() },
        },
        vertexShader: /* glsl */ `
          uniform float uZaman;
          uniform vec2 uEgim;
          uniform float uGuc;
          uniform float uFaz;
          varying float vH;
          void main() {
            vec3 p = position;
            float h = clamp(p.y / ${ALEV_BOYU.toFixed(4)}, 0.0, 1.0);
            // Nefes: boy güçle uzar, katmanlar ayrı fazda hafifçe büyüyüp küçülür
            p.y *= 0.88 + 0.12 * uGuc + 0.035 * sin(uZaman * 7.6 + uFaz);
            p.x *= 1.0 + 0.045 * sin(uZaman * 6.1 + uFaz * 1.7);
            // Salınım ve rüzgâr: tepeye doğru artar
            float bukulme = pow(h, 1.5);
            float salinim = sin(uZaman * 4.8 + h * 3.0 + uFaz) * 0.05 + sin(uZaman * 10.5 + h * 6.0 + uFaz) * 0.016;
            p.x += (uEgim.x * 0.55 + salinim) * bukulme;
            vH = h;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uAlt;
          uniform vec3 uUst;
          varying float vH;
          void main() {
            gl_FragColor = vec4(mix(uAlt, uUst, smoothstep(0.0, 0.85, vH)), 1.0);
            #include <colorspace_fragment>
          }
        `,
      }),
    );
    alevGrubu.add(new Mesh(geo, malzeme));
    return malzeme;
  });
  egim.add(alevGrubu);

  // ---- Hale (alevin etrafındaki ışık) ----
  const haleDokusu = haleDokusuYap();
  const haleMalzemesi = (renk: number, saydamlik: number) =>
    m(
      new SpriteMaterial({
        map: haleDokusu,
        color: renk,
        opacity: saydamlik,
        transparent: true,
        blending: AdditiveBlending,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      }),
    );
  const haleBuyuk = new Sprite(haleMalzemesi(0xff9a3c, 0.2));
  haleBuyuk.scale.setScalar(5.6);
  haleBuyuk.renderOrder = 20;
  const haleKucuk = new Sprite(haleMalzemesi(0xffcf96, 0.2));
  haleKucuk.scale.setScalar(2.2);
  haleKucuk.renderOrder = 21;
  haleBuyuk.position.y = haleKucuk.position.y = ALEV_ORTASI;
  egim.add(haleBuyuk, haleKucuk);

  // Camın altına düşen sıcak ışık
  const zeminIsigiMalzeme = m(
    new MeshBasicMaterial({
      map: haleDokusu,
      color: 0xeb8f3a,
      transparent: true,
      opacity: 0.32,
      blending: AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  const zeminIsigi = new Mesh(g(new PlaneGeometry(7.5, 7.5)), zeminIsigiMalzeme);
  zeminIsigi.rotation.x = -Math.PI / 2;
  zeminIsigi.position.y = -1.2;
  egim.add(zeminIsigi);

  // ---- Kıvılcımlar ----
  const KIVILCIM = zayif ? 40 : 90;
  const konumlar = new Float32Array(KIVILCIM * 3);
  const boyutlar = new Float32Array(KIVILCIM);
  const parlakliklar = new Float32Array(KIVILCIM);
  const omur = new Float32Array(KIVILCIM);
  const hiz = new Float32Array(KIVILCIM);
  const faz = new Float32Array(KIVILCIM);
  const yaricap = new Float32Array(KIVILCIM);
  const kivilcimTazele = (i: number, rastgeleOmur: boolean) => {
    omur[i] = rastgeleOmur ? Math.random() : 0;
    hiz[i] = 0.06 + Math.random() * 0.12;
    faz[i] = Math.random() * Math.PI * 2;
    yaricap[i] = 0.08 + Math.random() * 0.7;
    boyutlar[i] = 0.5 + Math.random() * 1.4;
  };
  for (let i = 0; i < KIVILCIM; i++) kivilcimTazele(i, true);

  const kivilcimGeo = g(new BufferGeometry());
  kivilcimGeo.setAttribute("position", new BufferAttribute(konumlar, 3));
  kivilcimGeo.setAttribute("aBoyut", new BufferAttribute(boyutlar, 1));
  kivilcimGeo.setAttribute("aParlaklik", new BufferAttribute(parlakliklar, 1));
  const kivilcimMalzeme = m(
    new ShaderMaterial({
      uniforms: { uPiksel: { value: cizici.getPixelRatio() }, uOlcek: { value: 1 }, uRenk: { value: new Color() } },
      vertexShader: /* glsl */ `
        attribute float aBoyut;
        attribute float aParlaklik;
        uniform float uPiksel;
        uniform float uOlcek;
        varying float vParlaklik;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aBoyut * uPiksel * uOlcek * (34.0 / -mv.z);
          vParlaklik = aParlaklik;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uRenk;
        varying float vParlaklik;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(uRenk * 1.5, a * a * vParlaklik);
        }
      `,
      transparent: true,
      blending: AdditiveBlending,
      depthTest: false,
      depthWrite: false,
    }),
  );
  const kivilcimlar = new Points(kivilcimGeo, kivilcimMalzeme);
  kivilcimlar.renderOrder = 22;
  kivilcimlar.frustumCulled = false;
  egim.add(kivilcimlar);

  // ---- Işıklar ----
  const alevIsigi = new PointLight(0xffa04a, 6, 0, 2);
  alevIsigi.position.y = ALEV_ORTASI;
  egim.add(alevIsigi);
  const arkaIsik = new DirectionalLight(0xffe4c4, 1.4);
  arkaIsik.position.set(-4, 6, -4);
  const onIsik = new DirectionalLight(0xffffff, 0.35);
  onIsik.position.set(3, 2, 6);
  sahne.add(arkaIsik, onIsik);

  // ---- İmleç ve rüzgâr ----
  const imlec = { x: 0, y: 0, oncekiX: 0, oncekiY: 0, var: false };
  const ruzgar = new Vector2();
  const imlecHareketi = (olay: PointerEvent) => {
    imlec.x = (olay.clientX / window.innerWidth) * 2 - 1;
    imlec.y = (olay.clientY / window.innerHeight) * 2 - 1;
    imlec.var = true;
  };
  window.addEventListener("pointermove", imlecHareketi, { passive: true });

  // ---- Boyut ----
  let yenidenCiz = true;
  const boyutla = () => {
    const genislik = tuval.clientWidth || window.innerWidth;
    const yukseklik = tuval.clientHeight || window.innerHeight;
    cizici.setSize(genislik, yukseklik, false);
    kamera.aspect = genislik / yukseklik;
    kamera.updateProjectionMatrix();
    yenidenCiz = true;
  };
  boyutla();
  window.addEventListener("resize", boyutla);

  // ---- Renkler: alev sabit, zemin paletten (palet seçici değişince de) ----
  const temaUygula = () => {
    const t = ALEV_RENKLERI;
    cizici.setClearColor(sahneZemini(), 1);
    const renk = (rgb: number[]) => new Color().setRGB(rgb[0]!, rgb[1]!, rgb[2]!, SRGBColorSpace);
    const beyaz = new Color(0xffffff);
    const [cekirdek, orta, dis] = [renk(t.cekirdek), renk(t.orta), renk(t.dis)];
    // Her katmanın altı açık, tepesi koyu: kor, turuncu, sarı, öz
    const renkler: [Color, Color][] = [
      [dis.clone().lerp(orta, 0.4), dis],
      [orta.clone().lerp(cekirdek, 0.35), orta],
      [cekirdek.clone().lerp(beyaz, 0.35), cekirdek],
      [cekirdek.clone().lerp(beyaz, 0.85), cekirdek.clone().lerp(beyaz, 0.55)],
    ];
    alevMalzemeleri.forEach((malzeme, i) => {
      (malzeme.uniforms.uAlt.value as Color).copy(renkler[i]![0]);
      (malzeme.uniforms.uUst.value as Color).copy(renkler[i]![1]);
    });
    (kivilcimMalzeme.uniforms.uRenk.value as Color).setRGB(t.kivilcim[0]!, t.kivilcim[1]!, t.kivilcim[2]!);
    haleBuyuk.material.color.set(t.hale);
    haleKucuk.material.color.set(t.haleKucuk);
    zeminIsigiMalzeme.color.set(t.zeminIsigi);
    alevIsigi.color.set(t.isik);
    yenidenCiz = true;
  };
  temaUygula();
  window.addEventListener("fanus:tema", temaUygula);

  // ---- Kare döngüsü ----
  let zaman = 0;
  let onceki = performance.now();
  let ilkKare = true;
  let sonPoz: Poz | null = null;
  const egimHedefi = { x: 0, z: 0 };
  const egimDonusu = new Quaternion();

  const kare = () => {
    const simdi = performance.now();
    const dt = Math.min((simdi - onceki) / 1000, 0.05);
    onceki = simdi;

    const poz = pozKaristir(sahneDurumu.akis, sahneDurumu.son, sahneDurumu.sonKarisim);
    tuval.style.opacity = String(Math.min(Math.max(poz.gorunur, 0), 1));
    if (poz.gorunur < 0.005 || document.hidden) return;

    if (secenek.azHareket) {
      const ayni =
        sonPoz && !yenidenCiz && (Object.keys(poz) as (keyof Poz)[]).every((k) => Math.abs(poz[k] - sonPoz![k]) < 1e-4);
      if (ayni) return;
    } else {
      zaman += dt;
    }
    sonPoz = poz;
    yenidenCiz = false;

    // Ekrandaki yer ve boy
    const gorunenH = 2 * Math.tan(MathUtils.degToRad(kamera.fov / 2)) * KAMERA_UZAKLIK;
    const gorunenW = gorunenH * kamera.aspect;
    const olcek = (poz.boy * gorunenH) / NESNE_BOYU;
    yerlesim.scale.setScalar(olcek);
    yerlesim.position.set(poz.x * gorunenW, -poz.y * gorunenH, 0);

    // Açılış: önce alev tutuşur, sonra cam yukarıdan iner
    const giris = secenek.azHareket ? 1 : sahneDurumu.giris;
    const alevGiris = MathUtils.smoothstep(giris, 0, 0.35);
    const camGiris = MathUtils.smootherstep(giris, 0.22, 1);
    const acilma = poz.kapak + (1 - camGiris) * 1.9;
    // İki parça kapı gibi açılır: yana kayar, iç kenarı arkaya döner (kameraya yaklaşıp büyümez)
    solKoseli.position.x = -acilma * 0.95;
    sagKoseli.position.x = acilma * 0.95;
    solKoseli.rotation.y = -acilma * 0.55;
    sagKoseli.rotation.y = acilma * 0.55;

    // Rüzgâr: imlecin hızı, cam açıldıkça alevi daha çok etkiler
    const vx = (imlec.x - imlec.oncekiX) / Math.max(dt, 0.001);
    const vy = (imlec.y - imlec.oncekiY) / Math.max(dt, 0.001);
    imlec.oncekiX = imlec.x;
    imlec.oncekiY = imlec.y;
    ruzgar.x = MathUtils.lerp(ruzgar.x, MathUtils.clamp(vx * 0.09, -1.6, 1.6), 0.07);
    ruzgar.y = MathUtils.lerp(ruzgar.y, MathUtils.clamp(vy * 0.05, -1, 1), 0.07);
    const maruz = 0.1 + 0.9 * Math.min(acilma, 1);
    const esinti = sahneDurumu.ruzgar * (Math.sin(zaman * 1.7) * 0.6 + Math.sin(zaman * 4.3) * 0.35);
    const egimX = (ruzgar.x + esinti) * maruz;
    const egimZ = ruzgar.y * 0.5 * maruz;

    const titreme =
      1 + 0.05 * Math.sin(zaman * 11) * Math.sin(zaman * 3.7) + 0.18 * Math.abs(egimX) * Math.sin(zaman * 23);
    const guc = Math.max(poz.isik * alevGiris * titreme, 0);
    alevOrtak.uZaman.value = zaman;
    alevOrtak.uGuc.value = guc;
    alevOrtak.uEgim.value.set(egimX, egimZ);
    // Alev güçle büyür ama camdan taşmaz (ışığa dalışta büyüyen hale ve ışıktır)
    alevGrubu.scale.setScalar(0.35 + 0.65 * Math.min(guc, 1.15));
    alevGrubu.visible = guc > 0.01;

    haleBuyuk.material.opacity = 0.2 * Math.min(guc, 3);
    haleKucuk.material.opacity = 0.2 * Math.min(guc, 2);
    haleBuyuk.scale.setScalar(4.6 + guc * 1.2);
    haleKucuk.position.x = haleBuyuk.position.x = egimX * 0.12;
    zeminIsigiMalzeme.opacity = 0.26 * Math.min(guc, 2.2);
    alevIsigi.intensity = 7 * guc * olcek * olcek;

    // Eğim: imleç (fare varsa) ve yavaş salınım
    if (imlec.var) {
      egimHedefi.x = imlec.y * 0.12;
      egimHedefi.z = -imlec.x * 0.07;
    }
    egim.rotation.x = MathUtils.lerp(egim.rotation.x, egimHedefi.x + Math.sin(zaman * 0.4) * 0.03, 0.05);
    egim.rotation.z = MathUtils.lerp(egim.rotation.z, egimHedefi.z + Math.sin(zaman * 0.31) * 0.02, 0.05);
    egim.rotation.y = Math.sin(zaman * 0.22) * 0.38 + (imlec.var ? imlec.x * 0.18 : 0);

    // Alev hep kameraya bakar (düz katmanlar yandan görünmesin): eğimin dönüşünü geri al
    egim.updateWorldMatrix(true, false);
    egim.getWorldQuaternion(egimDonusu);
    alevGrubu.quaternion.copy(egimDonusu.invert()).multiply(kamera.quaternion);

    // Kıvılcımlar: alevden yükselir; cam kapalıyken içinde kalır, açılınca tavan yükselir ve rüzgâra kapılır
    const kapali = acilma < 0.3;
    const tavan = MathUtils.lerp(1.65, 4.2, Math.min(acilma, 1));
    const sinirX = kapali ? 0.6 : 3;
    const sinirZ = kapali ? 0.22 : 3;
    for (let i = 0; i < KIVILCIM; i++) {
      omur[i] += dt * hiz[i] * (0.6 + 0.4 * guc);
      if (omur[i] >= 1) kivilcimTazele(i, false);
      const o = omur[i];
      const aci = faz[i] + zaman * 0.6 + o * 3;
      const yar = yaricap[i] * (0.25 + o * 0.9);
      konumlar[i * 3] = MathUtils.clamp(Math.cos(aci) * yar + egimX * o * o * 2.2, -sinirX, sinirX);
      konumlar[i * 3 + 1] = ALEV_TABANI + o * (tavan - ALEV_TABANI);
      konumlar[i * 3 + 2] = MathUtils.clamp(Math.sin(aci) * yar, -sinirZ, sinirZ);
      parlakliklar[i] = Math.sin(o * Math.PI) * Math.min(guc, 1.5) * 0.8;
    }
    kivilcimGeo.attributes.position.needsUpdate = true;
    kivilcimGeo.attributes.aParlaklik.needsUpdate = true;
    kivilcimMalzeme.uniforms.uOlcek.value = olcek;

    cizici.render(sahne, kamera);
    if (ilkKare) {
      ilkKare = false;
      secenek.hazir();
    }

    // Uyarlanır kalite: ilk saniyelerde kare süresi uzunsa (zayıf ekran kartı) çözünürlüğü düşür
    if (!olcum.bitti && !secenek.azHareket) {
      olcum.kare += 1;
      if (olcum.kare > 30) olcum.toplam += dt;
      if (olcum.kare === 120) {
        olcum.bitti = true;
        if (olcum.toplam / 90 > 1 / 45) {
          cizici.setPixelRatio(1);
          cizici.transmissionResolutionScale = 0.5;
          camMalzeme.dispersion = 0;
          kivilcimMalzeme.uniforms.uPiksel.value = 1;
          boyutla();
        }
      }
    }
  };
  const olcum = { kare: 0, toplam: 0, bitti: false };

  // Gölgelendiricileri önceden ve mümkünse paralel derle: ilk karede ana iş parçacığı kilitlenmesin
  let yokEdildi = false;
  cizici
    .compileAsync(sahne, kamera)
    .catch(() => undefined)
    .then(() => {
      if (!yokEdildi) cizici.setAnimationLoop(kare);
    });

  return {
    yokEt() {
      yokEdildi = true;
      cizici.setAnimationLoop(null);
      window.removeEventListener("pointermove", imlecHareketi);
      window.removeEventListener("resize", boyutla);
      window.removeEventListener("fanus:tema", temaUygula);
      geometriler.forEach((geo) => geo.dispose());
      malzemeler.forEach((mal) => mal.dispose());
      haleDokusu.dispose();
      ortam.dispose();
      pmrem.dispose();
      cizici.dispose();
    },
  };
}

/**
 * Logodaki alevin biçimi, tabanı y=0'da. SVG yolu (100x140'lık kutuda, y aşağı):
 * M57 2C64 34 88 54 88 90C88 119 71 138 50 138C29 138 12 119 12 90C12 58 42 42 57 2Z
 */
function alevBicimi() {
  const n = (x: number, y: number): [number, number] => [(x - 50) * ALEV_OLCEGI, (138 - y) * ALEV_OLCEGI];
  const b = new Shape();
  b.moveTo(...n(57, 2));
  b.bezierCurveTo(...n(64, 34), ...n(88, 54), ...n(88, 90));
  b.bezierCurveTo(...n(88, 119), ...n(71, 138), ...n(50, 138));
  b.bezierCurveTo(...n(29, 138), ...n(12, 119), ...n(12, 90));
  b.bezierCurveTo(...n(12, 58), ...n(42, 42), ...n(57, 2));
  return b;
}

/**
 * ExtrudeGeometry her yüzeye ayrı (düz) normal verir; camda bu, kırılan alevi şerit şerit gösterir.
 * Aynı noktadaki köşeler birleştirilip normaller yeniden hesaplanınca kavisler pürüzsüz kırar.
 */
function yumusat(geo: BufferGeometry) {
  geo.deleteAttribute("normal");
  const birlesik = mergeVertices(geo, 1e-4);
  birlesik.computeVertexNormals();
  geo.dispose();
  return birlesik;
}

/**
 * Köşeli parantez biçimli cam parçanın önden görünüşü (ortası 0,0). yon 1: soldaki "[", -1: sağdaki "]".
 * Dış köşeler yuvarlatılmış; logodaki çizimle aynı oran (boy 2,9; kol 0,62; kalınlık 0,26).
 */
function koseliBicimi(yon: 1 | -1) {
  const H = 1.45; // yarı boy
  const L = 1.05; // dış kenarın ortadan uzaklığı
  const k = 0.62; // kol uzunluğu
  const t = 0.26; // kalınlık
  const r = 0.14; // dış köşe yarıçapı
  const n = (x: number, y: number): [number, number] => [x * yon, y];
  const b = new Shape();
  b.moveTo(...n(-L + k, -H));
  b.lineTo(...n(-L + r, -H));
  b.quadraticCurveTo(...n(-L, -H), ...n(-L, -H + r));
  b.lineTo(...n(-L, H - r));
  b.quadraticCurveTo(...n(-L, H), ...n(-L + r, H));
  b.lineTo(...n(-L + k, H));
  b.lineTo(...n(-L + k, H - t));
  b.lineTo(...n(-L + t, H - t));
  b.lineTo(...n(-L + t, -H + t));
  b.lineTo(...n(-L + k, -H + t));
  b.closePath();
  return b;
}

/** Ortası beyaz, kenara doğru saydamlaşan yuvarlak doku (hale ve zemin ışığı için). */
function haleDokusuYap() {
  const tuval = document.createElement("canvas");
  tuval.width = tuval.height = 128;
  const baglam = tuval.getContext("2d")!;
  const egri = baglam.createRadialGradient(64, 64, 0, 64, 64, 64);
  egri.addColorStop(0, "rgba(255,255,255,1)");
  egri.addColorStop(0.18, "rgba(255,255,255,0.6)");
  egri.addColorStop(0.45, "rgba(255,255,255,0.14)");
  egri.addColorStop(1, "rgba(255,255,255,0)");
  baglam.fillStyle = egri;
  baglam.fillRect(0, 0, 128, 128);
  const doku = new CanvasTexture(tuval);
  doku.colorSpace = SRGBColorSpace;
  return doku;
}
