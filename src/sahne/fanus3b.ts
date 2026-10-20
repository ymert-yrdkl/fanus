// Cam fanus, içinde yanan alev ve kıvılcımlar (three.js).
// Bu dosya yalnız tarayıcıda, sayfa açıldıktan sonra dinamik olarak yüklenir.
//
// Dünya birimleri: başlangıç noktası alevin merkezi. Taban y=-1.0'da, cam tabanın üstünde durur.
// Ekrandaki yer, boy ve camın kalkması `sahneDurumu`ndan okunur (GSAP değiştirir).

import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  LatheGeometry,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
  MeshBasicMaterial,
  type Material,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { pozKaristir, sahneDurumu, type Poz } from "./durum";

/** Tabanın altından topuzun üstüne kadar yükseklik (yerleşim ölçeği için). */
const NESNE_BOYU = 3.6;
const KAMERA_UZAKLIK = 12;
const CAM_YARICAP = 1.08;
const CAM_KALINLIK = 0.035;
const CAM_DUZ_BOY = 1.95;

/** Sahnenin renkleri, sitenin temasına göre (<html data-tema>). Renkler 0-1 aralığında RGB. */
const SAHNE_TEMALARI = {
  eski: {
    zemin: 0x0d0c0b,
    cekirdek: [1.0, 0.86, 0.28],
    orta: [1.0, 0.52, 0.08],
    dis: [0.93, 0.16, 0.03],
    taban: [0.32, 0.42, 0.95],
    kivilcim: [1.0, 0.62, 0.18],
    hale: 0xff6a14,
    haleKucuk: 0xffc23a,
    zeminIsigi: 0xeb8f3a,
    isik: 0xff8a2e,
    metal: 0xc8924a,
  },
  kor: {
    zemin: 0x0b0b0c,
    cekirdek: [1.0, 0.86, 0.28],
    orta: [1.0, 0.52, 0.08],
    dis: [0.93, 0.16, 0.03],
    taban: [0.35, 0.4, 0.95],
    kivilcim: [1.0, 0.62, 0.18],
    hale: 0xff6a14,
    haleKucuk: 0xffc23a,
    zeminIsigi: 0xff4a2b,
    isik: 0xff8a2e,
    metal: 0xb4b4ba,
  },
  gece: {
    zemin: 0x070b16,
    cekirdek: [1.0, 0.86, 0.28],
    orta: [1.0, 0.52, 0.08],
    dis: [0.93, 0.16, 0.03],
    taban: [0.3, 0.42, 1.0],
    kivilcim: [1.0, 0.62, 0.18],
    hale: 0xff6a14,
    haleKucuk: 0xffc23a,
    zeminIsigi: 0xff5a36,
    isik: 0xff8a2e,
    metal: 0xb9c2d3,
  },
  "lacivert-kor": {
    zemin: 0x050d1e,
    cekirdek: [1.0, 0.86, 0.28],
    orta: [1.0, 0.52, 0.08],
    dis: [0.93, 0.16, 0.03],
    taban: [0.3, 0.42, 1.0],
    kivilcim: [1.0, 0.62, 0.18],
    hale: 0xff6a14,
    haleKucuk: 0xffc23a,
    zeminIsigi: 0xff4a2b,
    isik: 0xff8a2e,
    metal: 0xb9c2d3,
  },
  lacivert: {
    zemin: 0x08142b,
    cekirdek: [0.9, 0.96, 1.0],
    orta: [0.45, 0.68, 1.0],
    dis: [0.16, 0.36, 1.0],
    taban: [0.55, 0.3, 1.0],
    kivilcim: [0.55, 0.75, 1.0],
    hale: 0x3d7bff,
    haleKucuk: 0xa8c8ff,
    zeminIsigi: 0x3d7bff,
    isik: 0x6aa0ff,
    metal: 0xb9c2d3,
  },
};
type SahneTemasi = keyof typeof SAHNE_TEMALARI;

function etkinTema(): (typeof SAHNE_TEMALARI)[SahneTemasi] {
  const kod = document.documentElement.dataset.tema as SahneTemasi | undefined;
  return SAHNE_TEMALARI[kod && kod in SAHNE_TEMALARI ? kod : "eski"];
}

type Secenek = {
  /** İlk kare çizilince çağrılır. */
  hazir: () => void;
  /** Hareket azaltma tercihi: zaman akmaz, yalnız gerektiğinde çizilir. */
  azHareket: boolean;
};

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
  cizici.toneMapping = ACESFilmicToneMapping;
  cizici.toneMappingExposure = 1.05;
  cizici.outputColorSpace = SRGBColorSpace;
  cizici.transmissionResolutionScale = zayif ? 0.5 : 1;
  // Zemin sayfayla aynı renk ve opak: saydam zeminde three.js kırılma için camın arkasını beyaz siler (süt cam görünümü)
  cizici.setClearColor(etkinTema().zemin, 1);

  const sahne = new Scene();
  const pmrem = new PMREMGenerator(cizici);
  const ortam = pmrem.fromScene(new RoomEnvironment(), 0.04);
  sahne.environment = ortam.texture;
  sahne.environmentIntensity = 0.55;

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

  // ---- Taban ----
  const koyuMetal = m(new MeshStandardMaterial({ color: 0x1b1713, metalness: 0.7, roughness: 0.34 }));
  const pirinc = m(new MeshStandardMaterial({ color: 0xc8924a, metalness: 1, roughness: 0.26 }));

  const taban = new Mesh(g(new CylinderGeometry(1.34, 1.42, 0.24, 96)), koyuMetal);
  taban.position.y = -1.12;
  const halka = new Mesh(g(new TorusGeometry(1.17, 0.028, 16, 160)), pirinc);
  halka.rotation.x = Math.PI / 2;
  halka.position.y = -0.995;
  const brulor = new Mesh(g(new CylinderGeometry(0.2, 0.27, 0.5, 48)), pirinc);
  brulor.position.y = -0.75;
  const brulorAgzi = new Mesh(g(new CylinderGeometry(0.17, 0.17, 0.03, 32)), koyuMetal);
  brulorAgzi.position.y = -0.495;
  const fitil = new Mesh(g(new CylinderGeometry(0.018, 0.02, 0.16, 8)), m(new MeshBasicMaterial({ color: 0x120c08 })));
  fitil.position.y = -0.42;
  egim.add(taban, halka, brulor, brulorAgzi, fitil);

  // ---- Cam (kalınlığı olan kapalı profil, döndürülerek) ----
  const profil: Vector2[] = [];
  const R = CAM_YARICAP;
  const r = R - CAM_KALINLIK;
  const H = CAM_DUZ_BOY;
  profil.push(new Vector2(R + 0.025, 0), new Vector2(R, 0.07), new Vector2(R, H));
  for (let i = 1; i <= 28; i++) {
    const a = (i / 28) * (Math.PI / 2);
    profil.push(new Vector2(Math.max(R * Math.cos(a), 0.0001), H + R * Math.sin(a)));
  }
  for (let i = 28; i >= 0; i--) {
    const a = (i / 28) * (Math.PI / 2);
    profil.push(new Vector2(Math.max(r * Math.cos(a), 0.0001), H + r * Math.sin(a)));
  }
  profil.push(new Vector2(r, 0.05), new Vector2(r + 0.02, 0), new Vector2(R + 0.025, 0));

  const camMalzeme = m(
    new MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.035,
      transmission: 1,
      thickness: 0.22,
      ior: 1.46,
      envMapIntensity: 1.7,
      clearcoat: 0.8,
      clearcoatRoughness: 0.06,
      iridescence: 0.32,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [100, 380],
      attenuationColor: new Color(0xfff0dd),
      attenuationDistance: 6,
      specularIntensity: 1,
    }),
  );

  const kapak = new Group();
  const cam = new Mesh(g(new LatheGeometry(profil, zayif ? 72 : 120)), camMalzeme);
  const dudak = new Mesh(g(new TorusGeometry(R + 0.012, 0.032, 12, 128)), camMalzeme);
  dudak.rotation.x = Math.PI / 2;
  dudak.position.y = 0.03;
  const boyun = new Mesh(g(new CylinderGeometry(0.05, 0.075, 0.12, 24)), camMalzeme);
  boyun.position.y = H + R + 0.03;
  const topuz = new Mesh(g(new SphereGeometry(0.125, 32, 24)), camMalzeme);
  topuz.position.y = H + R + 0.15;
  kapak.add(cam, dudak, boyun, topuz);
  egim.add(kapak);

  // ---- Alev (opak, ışıyan; cam onu kırarak gösterir) ----
  const alevMalzeme = m(
    new ShaderMaterial({
      uniforms: {
        uZaman: { value: 0 },
        uEgim: { value: new Vector2() },
        uGuc: { value: 1 },
        uCekirdek: { value: new Color() },
        uOrta: { value: new Color() },
        uDis: { value: new Color() },
        uTaban: { value: new Color() },
      },
      vertexShader: /* glsl */ `
        uniform float uZaman;
        uniform vec2 uEgim;
        uniform float uGuc;
        varying vec3 vNormal;
        varying vec3 vBakis;
        varying float vYukseklik;
        void main() {
          vec3 p = position;
          float h = clamp(p.y / 0.2, -1.0, 1.0);
          float ust = max(h, 0.0);
          p.y *= mix(1.0, 2.6 * (0.85 + 0.15 * uGuc), step(0.0, h));
          p.xz *= (1.0 - 0.74 * pow(ust, 1.35)) * (0.9 + 0.1 * uGuc);
          float salinim = sin(uZaman * 7.0 + ust * 4.0) * 0.022 + sin(uZaman * 13.0 + ust * 9.0) * 0.011;
          float bukulme = pow(ust, 1.6);
          p.x += (uEgim.x * 0.55 + salinim) * bukulme;
          p.z += (uEgim.y * 0.55 + cos(uZaman * 5.0 + ust * 3.0) * 0.016) * bukulme;
          vYukseklik = h;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vBakis = -mv.xyz;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uGuc;
        uniform vec3 uCekirdek;
        uniform vec3 uOrta;
        uniform vec3 uDis;
        uniform vec3 uTaban;
        varying vec3 vNormal;
        varying vec3 vBakis;
        varying float vYukseklik;
        void main() {
          float kenar = 1.0 - abs(dot(normalize(vNormal), normalize(vBakis)));
          // Ortası sarı, kenara doğru turuncu ve kızıl; tepeye çıktıkça kızıllaşır, dibi hafif mavi
          vec3 renk = mix(uCekirdek, uOrta, smoothstep(0.02, 0.5, kenar));
          renk = mix(renk, uDis, smoothstep(0.42, 0.95, kenar));
          renk = mix(renk, uDis, smoothstep(0.35, 1.0, vYukseklik) * 0.5);
          renk = mix(renk, uTaban, smoothstep(-0.3, -0.95, vYukseklik) * 0.5);
          // Fazla parlatıp beyaza kaçırmadan canlı tut
          gl_FragColor = vec4(min(renk * (1.08 + 0.22 * uGuc), vec3(1.0)), 1.0);
        }
      `,
    }),
  );
  const alev = new Mesh(g(new SphereGeometry(0.2, 48, 32)), alevMalzeme);
  alev.position.y = -0.15;
  egim.add(alev);

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
  const haleBuyuk = new Sprite(haleMalzemesi(0xff9a3c, 0.26));
  haleBuyuk.scale.setScalar(5.6);
  haleBuyuk.renderOrder = 20;
  const haleKucuk = new Sprite(haleMalzemesi(0xffcf96, 0.7));
  haleKucuk.scale.setScalar(1.5);
  haleKucuk.renderOrder = 21;
  haleBuyuk.position.y = haleKucuk.position.y = 0.05;
  egim.add(haleBuyuk, haleKucuk);

  // Tabanın çevresine düşen sıcak ışık
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
  zeminIsigi.position.y = -1.245;
  egim.add(zeminIsigi);

  // ---- Kıvılcımlar ----
  const KIVILCIM = zayif ? 48 : 110;
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
    yaricap[i] = 0.08 + Math.random() * 0.75;
    boyutlar[i] = 0.6 + Math.random() * 1.6;
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
  alevIsigi.position.y = 0.05;
  egim.add(alevIsigi);
  const arkaIsik = new DirectionalLight(0xffe4c4, 1.4);
  arkaIsik.position.set(-4, 6, -4);
  const onIsik = new DirectionalLight(0xffffff, 0.25);
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

  // ---- Tema: renkleri sitenin temasına göre ayarla (tema seçici değişince de) ----
  const temaUygula = () => {
    const t = etkinTema();
    cizici.setClearColor(t.zemin, 1);
    (alevMalzeme.uniforms.uCekirdek.value as Color).setRGB(t.cekirdek[0]!, t.cekirdek[1]!, t.cekirdek[2]!);
    (alevMalzeme.uniforms.uOrta.value as Color).setRGB(t.orta[0]!, t.orta[1]!, t.orta[2]!);
    (alevMalzeme.uniforms.uDis.value as Color).setRGB(t.dis[0]!, t.dis[1]!, t.dis[2]!);
    (alevMalzeme.uniforms.uTaban.value as Color).setRGB(t.taban[0]!, t.taban[1]!, t.taban[2]!);
    (kivilcimMalzeme.uniforms.uRenk.value as Color).setRGB(t.kivilcim[0]!, t.kivilcim[1]!, t.kivilcim[2]!);
    haleBuyuk.material.color.set(t.hale);
    haleKucuk.material.color.set(t.haleKucuk);
    zeminIsigiMalzeme.color.set(t.zeminIsigi);
    alevIsigi.color.set(t.isik);
    pirinc.color.set(t.metal);
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
    const kapakToplam = poz.kapak + (1 - camGiris) * 1.9;
    kapak.position.y = -1.0 + kapakToplam * 1.85;
    kapak.position.x = poz.kapak * 0.35;
    kapak.rotation.z = -poz.kapak * 0.16;

    // Rüzgâr: imlecin hızı, cam kalktıkça alevi daha çok etkiler
    const vx = (imlec.x - imlec.oncekiX) / Math.max(dt, 0.001);
    const vy = (imlec.y - imlec.oncekiY) / Math.max(dt, 0.001);
    imlec.oncekiX = imlec.x;
    imlec.oncekiY = imlec.y;
    ruzgar.x = MathUtils.lerp(ruzgar.x, MathUtils.clamp(vx * 0.09, -1.6, 1.6), 0.07);
    ruzgar.y = MathUtils.lerp(ruzgar.y, MathUtils.clamp(vy * 0.05, -1, 1), 0.07);
    const maruz = 0.1 + 0.9 * Math.min(kapakToplam, 1);
    const esinti = sahneDurumu.ruzgar * (Math.sin(zaman * 1.7) * 0.6 + Math.sin(zaman * 4.3) * 0.35);
    const egimX = (ruzgar.x + esinti) * maruz;
    const egimZ = ruzgar.y * 0.5 * maruz;

    const titreme =
      1 + 0.05 * Math.sin(zaman * 11) * Math.sin(zaman * 3.7) + 0.18 * Math.abs(egimX) * Math.sin(zaman * 23);
    const guc = Math.max(poz.isik * alevGiris * titreme, 0);
    alevMalzeme.uniforms.uZaman.value = zaman;
    alevMalzeme.uniforms.uGuc.value = guc;
    (alevMalzeme.uniforms.uEgim.value as Vector2).set(egimX, egimZ);
    alev.scale.setScalar(0.35 + 0.65 * Math.min(guc, 1.6));
    alev.visible = guc > 0.01;

    haleBuyuk.material.opacity = 0.3 * Math.min(guc, 3);
    haleKucuk.material.opacity = 0.75 * Math.min(guc, 2);
    haleBuyuk.scale.setScalar(4.6 + guc * 1.2);
    haleKucuk.position.x = haleBuyuk.position.x = egimX * 0.12;
    zeminIsigiMalzeme.opacity = 0.26 * Math.min(guc, 2.2);
    alevIsigi.intensity = 7 * guc * olcek * olcek;

    // Eğim: imleç (fare varsa) ve yavaş salınım
    if (imlec.var) {
      egimHedefi.x = imlec.y * 0.09;
      egimHedefi.z = -imlec.x * 0.07;
    }
    egim.rotation.x = MathUtils.lerp(egim.rotation.x, egimHedefi.x + Math.sin(zaman * 0.4) * 0.025, 0.05);
    egim.rotation.z = MathUtils.lerp(egim.rotation.z, egimHedefi.z + Math.sin(zaman * 0.31) * 0.02, 0.05);
    egim.rotation.y = Math.sin(zaman * 0.22) * 0.25;

    // Kıvılcımlar: alevden yükselir; cam kalkınca tavan yükselir ve rüzgâra kapılır
    const tavan = MathUtils.lerp(1.75, 4.2, Math.min(kapakToplam, 1));
    for (let i = 0; i < KIVILCIM; i++) {
      omur[i] += dt * hiz[i] * (0.6 + 0.4 * guc);
      if (omur[i] >= 1) kivilcimTazele(i, false);
      const o = omur[i];
      const aci = faz[i] + zaman * 0.6 + o * 3;
      const yar = yaricap[i] * (0.25 + o * 0.9);
      const sinir = kapakToplam < 0.3 ? 0.92 : 3;
      konumlar[i * 3] = MathUtils.clamp(Math.cos(aci) * yar + egimX * o * o * 2.2, -sinir, sinir);
      konumlar[i * 3 + 1] = -0.25 + o * (tavan + 0.25);
      konumlar[i * 3 + 2] = MathUtils.clamp(Math.sin(aci) * yar, -sinir, sinir);
      parlakliklar[i] = Math.sin(o * Math.PI) * Math.min(guc, 1.5) * 0.9;
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
