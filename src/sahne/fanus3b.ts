// Silindir cam fanus ve içinde dolaşan ateşböceği, havada süzülen toz (three.js).
// Bu dosya yalnız tarayıcıda, sayfa açıldıktan sonra dinamik olarak yüklenir.
//
// Cam: dikey bir silindir; üstte ve altta omuz gibi daralıp ortada dar birer delikle açılır (lamba camı gibi).
// Karşıdan bakınca iki dikey kenar ve daralan uçlar "[ ]" gibi okunur, dönünce silindir olduğu görülür.
// Ateşböceği (23 Ekim 2026, alev yerine): camın içinde yavaş, kıvrımlı bir yolda dolaşan, ara ara göz kırpan sarı-yeşil
// bir ışık; arkasında sönen bir iz, etrafında hale, kâğıda düşen leke. Rüzgâr çıkınca telaşlanır (hızlanır, sık
// kırpar), cam kalkınca açıklığa doğru yükselir; cam inince sakinleşir.
//
// Dünya birimleri: ışığın merkezi y=ISIK_ORTASI'nda, camın ortası y=CAM_ORTASI'nda.
// Ekrandaki yer, boy ve camın kalkması `sahneDurumu`ndan okunur (GSAP değiştirir).

import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  NormalBlending,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Points,
  Scene,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
  type Material,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { pozKaristir, sahneDurumu, type Poz } from "./durum";

/** Camın altından üstüne kadar yükseklik, zemin ışığıyla birlikte (yerleşim ölçeği için). */
const NESNE_BOYU = 3.4;
const KAMERA_UZAKLIK = 12;
const CAM_ORTASI = 0.5;
/** Silindir camın dış yarıçapı, et kalınlığı ve yarı boyu. */
const CAM_YARICAPI = 1.05;
const CAM_ETI = 0.1;
const CAM_YARIM_BOY = 1.45;
/** Üstteki ve alttaki omzun yüksekliği (gövde bu kadar yükseklikte daralır) ve ortadaki deliğin yarıçapı. */
const OMUZ = 0.42;
const DELIK = 0.4;
/** Cam kalkınca ne kadar yükselir (dünya birimi). */
const CAM_KALKMA = 1.6;
/** Ateşböceğinin dolaştığı alanın merkezi (camın içinde) ve izin uzunluğu (kare). */
const ISIK_ORTASI = 0.38;
const IZ_UZUNLUGU = 48;
const IZ_NOKTASI = 6;
/** İz örnekleri arasındaki süre (sn) ve iki iz noktası arasındaki örnek sayısı. */
const IZ_ARALIGI = 0.07;
const IZ_ADIMI = 4;

/** Ateşböceğinin renkleri (paletten bağımsız, markanın ışığı: sarı-yeşil). */
const ISIK_RENKLERI = {
  // Ateşböceğinin sarı-yeşili. Kâğıt zeminde açık ton görünmez: gövde ve iz doygun, yalnız öz beyaza yakın
  oz: 0xffffe6,
  cekirdek: 0xd4e32a,
  hale: 0xdbe84a,
  haleKucuk: 0xe0ec4a,
  zeminIsigi: 0xd6e63a,
  isik: 0xdcf05a,
  toz: 0xcfe02e,
};

/** Sahnenin zemini sayfanın kâğıt rengiyle aynı olmalı: CSS --sahne-zemin'den okunur. */
const sahneZemini = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--sahne-zemin").trim() || "#f4f3ee";

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
  // Nötr ton eşleme: ışığın sıcak renkleri solmadan kalır, camın parlamaları yumuşak sıkışır
  cizici.toneMapping = NeutralToneMapping;
  cizici.toneMappingExposure = 1.0;
  cizici.outputColorSpace = SRGBColorSpace;
  cizici.transmissionResolutionScale = zayif ? 0.5 : 1;
  // Zemin sayfayla aynı renk (kâğıt) ve opak: saydam zeminde three.js kırılma için camın arkasını yarı beyaz siler
  cizici.setClearColor(sahneZemini(), 1);

  const sahne = new Scene();
  const pmrem = new PMREMGenerator(cizici);
  const ortam = pmrem.fromScene(new RoomEnvironment(), 0.04);
  sahne.environment = ortam.texture;
  sahne.environmentIntensity = 1.2;

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
      // Kâğıt zeminde tamamen berrak cam. Yusuf (23 Ekim): yayındaki cam güzel ama "biraz fazla gri";
      // gri, oda ortamının yansımasından geliyor: yansıma ve cila azaltıldı, kâğıt daha çok geçer
      color: 0xffffff,
      metalness: 0,
      // Hafif pürüz: ışıklar kavisli yüzeyde geniş dikey parıltılar bırakır (silindir cam okunur)
      roughness: 0.04,
      transmission: 1,
      thickness: 0.6,
      ior: 1.5,
      // Kenarlarda ince gökkuşağı kırılması
      dispersion: zayif ? 0 : 4,
      envMapIntensity: 1.8,
      clearcoat: 0.7,
      clearcoatRoughness: 0.08,
      iridescence: 0.22,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [100, 400],
      attenuationColor: new Color(0xf2f6ff),
      attenuationDistance: 8,
      specularIntensity: 1,
    }),
  );

  const camGrubu = new Group();
  const cam = new Mesh(g(silindirCam(zayif)), camMalzeme);
  camGrubu.add(cam);
  camGrubu.position.y = CAM_ORTASI;
  egim.add(camGrubu);

  // ---- Ateşböceği: hale, gövde, iz; hepsi bu grupla uçar ----
  const isikGrubu = new Group();
  isikGrubu.position.y = ISIK_ORTASI;
  egim.add(isikGrubu);

  // ---- Hale (ışığın etrafındaki sıcak leke; kâğıt zeminde normal karışım) ----
  const haleDokusu = haleDokusuYap();
  const haleMalzemesi = (renk: number, saydamlik: number) =>
    m(
      new SpriteMaterial({
        map: haleDokusu,
        color: renk,
        opacity: saydamlik,
        transparent: true,
        blending: NormalBlending,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      }),
    );
  const haleBuyuk = new Sprite(haleMalzemesi(ISIK_RENKLERI.hale, 0.22));
  haleBuyuk.scale.setScalar(2.4);
  haleBuyuk.renderOrder = 20;
  const haleKucuk = new Sprite(haleMalzemesi(ISIK_RENKLERI.haleKucuk, 0.55));
  haleKucuk.scale.setScalar(1.2);
  haleKucuk.renderOrder = 21;
  isikGrubu.add(haleBuyuk, haleKucuk);

  // Gövde: cam üstüne çizilen iki yumuşak disk (kırılma dokusuna girmez: kenar halkası ve testere dişi olmaz).
  // Dış disk sarı-yeşil, öz beyaz; kâğıt zeminde ışığı renk anlatır
  const cekirdek = new Sprite(haleMalzemesi(ISIK_RENKLERI.cekirdek, 0.95));
  cekirdek.scale.setScalar(0.5);
  cekirdek.renderOrder = 23;
  const oz = new Sprite(haleMalzemesi(ISIK_RENKLERI.oz, 0.9));
  oz.scale.setScalar(0.15);
  oz.renderOrder = 24;
  isikGrubu.add(cekirdek, oz);
  // İz: ateşböceğinin geçtiği yerlerde sönen noktalar (geçmiş konumlar halka tamponda tutulur)
  const iz = new Float32Array(IZ_UZUNLUGU * 3);
  let izBasi = 0;
  let izSayaci = 0;
  for (let i = 0; i < IZ_UZUNLUGU; i++) iz[i * 3 + 1] = ISIK_ORTASI;
  const izNoktalari = Array.from({ length: IZ_NOKTASI }, (_, i) => {
    const n = new Sprite(haleMalzemesi(ISIK_RENKLERI.cekirdek, 0.6));
    n.scale.setScalar(0.3 - i * 0.04);
    n.renderOrder = 22;
    egim.add(n);
    return n;
  });

  // Kâğıda düşen leke (ateşböceğiyle birlikte kayar)
  const zeminIsigiMalzeme = m(
    new MeshBasicMaterial({
      map: haleDokusu,
      color: ISIK_RENKLERI.zeminIsigi,
      transparent: true,
      opacity: 0.3,
      blending: NormalBlending,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  const zeminIsigi = new Mesh(g(new PlaneGeometry(7.5, 7.5)), zeminIsigiMalzeme);
  zeminIsigi.rotation.x = -Math.PI / 2;
  zeminIsigi.position.y = -1.2;
  egim.add(zeminIsigi);

  // ---- Toz: ışıkta süzülen küçük zerreler ----
  const TOZ = zayif ? 30 : 60;
  const konumlar = new Float32Array(TOZ * 3);
  const boyutlar = new Float32Array(TOZ);
  const parlakliklar = new Float32Array(TOZ);
  const omur = new Float32Array(TOZ);
  const hiz = new Float32Array(TOZ);
  const faz = new Float32Array(TOZ);
  const yaricap = new Float32Array(TOZ);
  const tozTazele = (i: number, rastgeleOmur: boolean) => {
    omur[i] = rastgeleOmur ? Math.random() : 0;
    hiz[i] = 0.04 + Math.random() * 0.08;
    faz[i] = Math.random() * Math.PI * 2;
    yaricap[i] = 0.1 + Math.random() * 0.6;
    boyutlar[i] = 0.4 + Math.random() * 1.1;
  };
  for (let i = 0; i < TOZ; i++) tozTazele(i, true);

  const tozGeo = g(new BufferGeometry());
  tozGeo.setAttribute("position", new BufferAttribute(konumlar, 3));
  tozGeo.setAttribute("aBoyut", new BufferAttribute(boyutlar, 1));
  tozGeo.setAttribute("aParlaklik", new BufferAttribute(parlakliklar, 1));
  const tozMalzeme = m(
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
          gl_FragColor = vec4(uRenk, a * a * vParlaklik);
        }
      `,
      transparent: true,
      blending: NormalBlending,
      depthTest: false,
      depthWrite: false,
    }),
  );
  const toz = new Points(tozGeo, tozMalzeme);
  toz.renderOrder = 22;
  toz.frustumCulled = false;
  egim.add(toz);

  // ---- Işıklar ----
  const noktaIsigi = new PointLight(ISIK_RENKLERI.isik, 6, 0, 2);
  isikGrubu.add(noktaIsigi);
  const arkaIsik = new DirectionalLight(0xffe4c4, 1.4);
  arkaIsik.position.set(-4, 6, -4);
  // Ön ve yan ışıklar: kavisli camın üstünde dikey parıltılar (silindirin okunması bunlara bağlı)
  const onIsik = new DirectionalLight(0xffffff, 1.6);
  onIsik.position.set(4, 3, 7);
  const yanIsik = new DirectionalLight(0xdfe8ff, 1.1);
  yanIsik.position.set(-6, 2.5, 4);
  sahne.add(arkaIsik, onIsik, yanIsik);

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

  // ---- Renkler: ışık sabit, zemin sayfanın kâğıt renginden ----
  const temaUygula = () => {
    cizici.setClearColor(sahneZemini(), 1);
    (tozMalzeme.uniforms.uRenk.value as Color).set(ISIK_RENKLERI.toz);
    yenidenCiz = true;
  };
  temaUygula();

  // ---- Kare döngüsü ----
  let zaman = 0;
  let ucus = 0;
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

    // Açılış: önce ışık yanar, sonra cam yukarıdan iner
    const giris = secenek.azHareket ? 1 : sahneDurumu.giris;
    const isikGiris = MathUtils.smoothstep(giris, 0, 0.35);
    const camGiris = MathUtils.smootherstep(giris, 0.22, 1);
    const acilma = poz.kapak + (1 - camGiris) * 1.9;
    // Cam kalkınca yukarı sıyrılır, hafifçe yana yatar
    camGrubu.position.y = CAM_ORTASI + acilma * CAM_KALKMA;
    camGrubu.rotation.z = acilma * 0.05;

    // Rüzgâr: imlecin hızı, cam kalktıkça ışığı daha çok etkiler
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

    // Ateşböceği: yavaş, kıvrımlı uçuş; rüzgârda telaşlanır (hızlanır), cam kalkınca açıklığa doğru yükselir
    const telas = Math.min(Math.abs(egimX), 1) * maruz;
    ucus += dt * (1 + 2.4 * telas + 0.6 * Math.max(0, Math.sin(zaman * 0.23)));
    const acik = Math.min(acilma, 1);
    const genlik = 1 + 0.6 * acik;
    const ux = (Math.sin(ucus * 0.37) * 0.4 + Math.sin(ucus * 0.91 + 1.3) * 0.16) * genlik + egimX * 0.22;
    const uy = ISIK_ORTASI + Math.sin(ucus * 0.29 + 0.7) * 0.42 + Math.sin(ucus * 0.73) * 0.1 + acik * 0.75;
    const uz = Math.cos(ucus * 0.41 + 2.1) * 0.28 + egimZ * 0.1;
    isikGrubu.position.set(ux, uy, uz);
    // Göz kırpma: çoğu zaman loş, aralıklı parlamalar; rüzgârda daha sık
    const kirp = Math.pow(0.5 + 0.5 * Math.sin(ucus * 1.7), 3);
    const parlama = 0.45 + 0.55 * kirp;
    const guc = Math.max(poz.isik * isikGiris * parlama, 0);
    isikGrubu.scale.setScalar(0.85 + 0.15 * Math.min(guc, 1.3));
    isikGrubu.visible = guc > 0.01;
    cekirdek.material.opacity = 0.95 * Math.min(guc, 1.2);
    oz.material.opacity = 0.9 * Math.min(guc, 1.2);
    haleBuyuk.material.opacity = 0.22 * Math.min(guc, 2);
    haleKucuk.material.opacity = 0.55 * Math.min(guc, 1.5);
    haleBuyuk.scale.setScalar(2 + guc * 0.6);
    zeminIsigi.position.x = ux * 0.8;
    zeminIsigiMalzeme.opacity = 0.3 * Math.min(guc, 2.2);
    noktaIsigi.intensity = 6 * guc * olcek * olcek;
    // İz: geçmiş konumlar belli aralıkla örneklenir; noktalar geriye doğru küçülüp söner
    izSayaci += dt;
    if (izSayaci >= IZ_ARALIGI) {
      izSayaci = 0;
      iz[izBasi * 3] = ux;
      iz[izBasi * 3 + 1] = uy;
      iz[izBasi * 3 + 2] = uz;
      izBasi = (izBasi + 1) % IZ_UZUNLUGU;
    }
    izNoktalari.forEach((n, i) => {
      const k = (izBasi - 1 - (i + 1) * IZ_ADIMI + IZ_UZUNLUGU * 2) % IZ_UZUNLUGU;
      n.position.set(iz[k * 3]!, iz[k * 3 + 1]!, iz[k * 3 + 2]!);
      n.material.opacity = (0.7 - i * 0.1) * Math.min(guc, 1.2) * isikGiris;
    });

    // Eğim: imleç (fare varsa) ve yavaş salınım
    if (imlec.var) {
      egimHedefi.x = imlec.y * 0.12;
      egimHedefi.z = -imlec.x * 0.07;
    }
    egim.rotation.x = MathUtils.lerp(egim.rotation.x, egimHedefi.x + Math.sin(zaman * 0.4) * 0.03, 0.05);
    egim.rotation.z = MathUtils.lerp(egim.rotation.z, egimHedefi.z + Math.sin(zaman * 0.31) * 0.02, 0.05);
    egim.rotation.y = Math.sin(zaman * 0.22) * 0.38 + (imlec.var ? imlec.x * 0.18 : 0);

    // Toz: ışıktan yükselir; cam kapalıyken içinde kalır, kalkınca tavan yükselir ve rüzgâra kapılır
    const kapali = acilma < 0.3;
    const tavan = MathUtils.lerp(1.65, 4.2, Math.min(acilma, 1));
    const sinirX = kapali ? 0.6 : 3;
    const sinirZ = kapali ? 0.22 : 3;
    for (let i = 0; i < TOZ; i++) {
      omur[i] += dt * hiz[i] * (0.6 + 0.4 * guc);
      if (omur[i] >= 1) tozTazele(i, false);
      const o = omur[i];
      const aci = faz[i] + zaman * 0.5 + o * 3;
      const yar = yaricap[i] * (0.25 + o * 0.9);
      konumlar[i * 3] = MathUtils.clamp(Math.cos(aci) * yar + egimX * o * o * 2.2, -sinirX, sinirX);
      konumlar[i * 3 + 1] = ISIK_ORTASI - 0.5 + o * (tavan - ISIK_ORTASI + 0.5);
      konumlar[i * 3 + 2] = MathUtils.clamp(Math.sin(aci) * yar, -sinirZ, sinirZ);
      parlakliklar[i] = Math.sin(o * Math.PI) * Math.min(guc, 1.5) * 0.55;
    }
    tozGeo.attributes.position.needsUpdate = true;
    tozGeo.attributes.aParlaklik.needsUpdate = true;
    tozMalzeme.uniforms.uOlcek.value = olcek;

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
          tozMalzeme.uniforms.uPiksel.value = 1;
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
 * Silindir cam: gövde düz, üstte ve altta çeyrek elips biçiminde omuzlarla daralıp ortada dar birer delikle
 * açılır; et kalınlığı her yerde CAM_ETI. Kesit (yarıçap, y) y ekseni etrafında döndürülür. Her kesit parçası
 * kendi köşelerini taşır; komşu parçaların ortak noktasında normaller ortalanır (omuz pürüzsüz), yalnız delik
 * kenarındaki köşeler keskin kalır.
 */
function silindirCam(zayif: boolean) {
  const R = CAM_YARICAPI;
  const e = CAM_ETI;
  const H = CAM_YARIM_BOY;
  const s = OMUZ;
  const d = DELIK;
  type Nokta = { r: number; y: number; keskin?: boolean };

  // Omuz: gövdeden (θ=0) deliğe (θ=90°) çeyrek elips; yon 1 üst, -1 alt; ic: iç yüzey (et kadar içeride)
  const omuz = (yon: 1 | -1, ic: boolean): Nokta[] => {
    const yr = R - d - (ic ? e : 0);
    const ys = s - (ic ? e : 0);
    const adim = zayif ? 6 : 10;
    const noktalar: Nokta[] = [];
    for (let i = 0; i <= adim; i++) {
      const t = ((i / adim) * Math.PI) / 2;
      noktalar.push({ r: d + yr * Math.cos(t), y: yon * (H - s + ys * Math.sin(t)) });
    }
    return noktalar;
  };
  const keskin = (n: Nokta): Nokta => ({ ...n, keskin: true });

  // Kapalı kesit: alt delikten dış yüzey boyunca üst deliğe, delik kenarından içeri, iç yüzey boyunca alt deliğe
  const altDis = omuz(-1, false).reverse(); // (d, -H) → (R, -H+s)
  const ustDis = omuz(1, false); // (R, H-s) → (d, H)
  const ustIc = omuz(1, true).reverse(); // (d, H-e) → (R-e, H-s)
  const altIc = omuz(-1, true); // (R-e, -H+s) → (d, -H+e)
  const kesit: Nokta[] = [
    keskin(altDis[0]!),
    ...altDis.slice(1),
    ...ustDis.slice(0, -1),
    keskin(ustDis.at(-1)!),
    keskin(ustIc[0]!),
    ...ustIc.slice(1),
    ...altIc.slice(0, -1),
    keskin(altIc.at(-1)!),
    keskin(altDis[0]!),
  ];

  // Her parçanın normali: kesit yönünün dik'i (dış yüzeyde yukarı giderken dışa, iç yüzeyde aşağı giderken içe)
  const parcaNormali = (a: Nokta, b: Nokta) => {
    const dr = b.r - a.r;
    const dy = b.y - a.y;
    const l = Math.hypot(dr, dy) || 1;
    return { r: dy / l, y: -dr / l };
  };
  const normaller = kesit.slice(0, -1).map((n, j) => parcaNormali(n, kesit[j + 1]!));
  // Ortak noktada normal: keskinse parçanın kendisi, değilse komşuyla ortalama
  const noktaNormali = (j: number, parca: number) => {
    const n = kesit[j]!;
    const onceki = normaller[parca - 1];
    const sonraki = normaller[parca];
    const komsu = parca === j ? onceki : sonraki; // j parçanın başıysa önceki, sonuysa sonraki parça komşudur
    const kendi = normaller[parca]!;
    if (n.keskin || !komsu) return kendi;
    const r = kendi.r + komsu.r;
    const y = kendi.y + komsu.y;
    const l = Math.hypot(r, y) || 1;
    return { r: r / l, y: y / l };
  };

  const dilim = zayif ? 56 : 112;
  const konum: number[] = [];
  const normal: number[] = [];
  const indis: number[] = [];
  for (let j = 0; j < kesit.length - 1; j++) {
    const p0 = kesit[j]!;
    const p1 = kesit[j + 1]!;
    const n0 = noktaNormali(j, j);
    const n1 = noktaNormali(j + 1, j);
    const taban = konum.length / 3;
    for (let i = 0; i <= dilim; i++) {
      const a = (i / dilim) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      konum.push(p0.r * ca, p0.y, p0.r * sa, p1.r * ca, p1.y, p1.r * sa);
      normal.push(n0.r * ca, n0.y, n0.r * sa, n1.r * ca, n1.y, n1.r * sa);
    }
    for (let i = 0; i < dilim; i++) {
      const k = taban + i * 2;
      indis.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(new Float32Array(konum), 3));
  geo.setAttribute("normal", new BufferAttribute(new Float32Array(normal), 3));
  geo.setIndex(indis);
  return geo;
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
