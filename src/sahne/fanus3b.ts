// Silindir cam fanus ve içinde yanan mavi jet alevi, yükselen kıvılcımlar (three.js).
// Bu dosya yalnız tarayıcıda, sayfa açıldıktan sonra dinamik olarak yüklenir.
//
// Cam: dikey bir silindir; üstte ve altta omuz gibi daralıp ortada dar birer delikle açılır (lamba camı gibi).
// Karşıdan bakınca iki dikey kenar ve daralan uçlar "[ ]" gibi okunur, dönünce silindir olduğu görülür.
// Alev (25 Ekim 2026, Yusuf): ocak alevi ya da jet motoru gibi mavi-mor, güçlü ve dik bir alev. Alttaki delikten
// yükselir: beyaz-mavi çekirdek, mavi gövde, mor uçlar, eksende şok elmasları gibi parlak düğümler; ince ve hızlı
// türbülans, az salınım. Rüzgârla tepesi bükülür, cam kalkınca savrulur; gövde ve ışıltı cam üstüne çizilir
// (kırılma geçişinde kenarlar testere dişi oluyordu), dışında kâğıda mavi leke bırakan hale.
//
// Dünya birimleri: alevin tabanı y=ALEV_TABANI'nda, camın ortası y=CAM_ORTASI'nda.
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
/** Alevin tabanı (alttaki deliğin hemen üstü), boyu ve en geniş yerindeki yarı genişliği (dünya birimi). */
const ALEV_TABANI = -0.66;
const ALEV_BOYU = 2.15;
const ALEV_YARIM_GEN = 0.4;
/** Alevin görünen ortası (hale ve ışık buraya konur). */
const ALEV_ORTASI = ALEV_TABANI + 0.8;

/** Alevin ve ışığın renkleri (paletten bağımsız, markanın mavi alevi). Alev renkleri 0-1 aralığında sRGB. */
const ALEV_RENKLERI = {
  cekirdek: [0.9, 0.97, 1.0],
  orta: [0.2, 0.54, 1.0],
  dis: [0.3, 0.2, 0.92],
  uc: [0.74, 0.3, 0.96],
  hale: 0x4f8cff,
  haleKucuk: 0xb4cdff,
  zeminIsigi: 0x3f7cff,
  isik: 0x5a8dff,
  toz: 0x8fb4ff,
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

/** Gürültü ve alev biçimi: gövde ile ışıltı gölgelendiricilerinin ortak parçası. */
const ALEV_ORTAK_GLSL = /* glsl */ `
  uniform float uZaman;
  uniform float uGuc;
  varying vec2 vP;
  // Yarı genişlik profili (0..1): meme ağzında dar, hızla şişer, uzun bir koniyle sivrilir (jet alevi)
  float profil(float h) {
    float sisme = h < 0.35 ? sin(1.5708 * h / 0.35) : 1.0;
    return (0.22 + 0.78 * sisme) * pow(1.0 - h, 0.45);
  }
  float karma(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float gurultu(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(karma(i), karma(i + vec2(1.0, 0.0)), f.x), mix(karma(i + vec2(0.0, 1.0)), karma(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float s = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) { s += a * gurultu(p); p *= 2.03; a *= 0.5; }
    return s;
  }
  // Bu yükseklikteki yarı genişliğe göre eksenden uzaklık (0 eksen, 1 kenar), hızlı akan gürültüyle aşındırılmış
  float kenarUzakligi(float h, float asinmaCarpani, out float n, out float n2) {
    float yarim = max(profil(clamp(h, 0.0, 1.0)), 0.02);
    float d = abs(vP.x) / yarim;
    n = fbm(vec2(vP.x * 2.4 + 3.0, h * 4.5 - uZaman * 3.2));
    n2 = fbm(vec2(vP.x * 5.0 - 7.0, h * 7.0 - uZaman * 5.0));
    return d + (n - 0.5) * (0.12 + 0.5 * h) * asinmaCarpani;
  }
`;

const ALEV_KOSE_GLSL = /* glsl */ `
  uniform float uZaman;
  uniform vec2 uEgim;
  uniform float uGuc;
  varying vec2 vP;
  void main() {
    vec3 p = position;
    float h = clamp(p.y / ${ALEV_BOYU.toFixed(4)}, 0.0, 1.0);
    vP = vec2(p.x / ${ALEV_YARIM_GEN.toFixed(4)}, h);
    // Jet nabzı: boy güçle uzar, ince ve hızlı titrer
    p.y *= 0.92 + 0.08 * uGuc + 0.015 * sin(uZaman * 9.0) + 0.01 * sin(uZaman * 17.3);
    p.x *= 1.0 + 0.02 * sin(uZaman * 6.1);
    // Rüzgârla bükülme tepeye doğru artar; kendi salınımı az (jet dik durur)
    float bukulme = pow(h, 1.7);
    float salinim = sin(uZaman * 4.2 + h * 3.0) * 0.02 + sin(uZaman * 9.1 + h * 6.0) * 0.008;
    p.x += (uEgim.x * 0.6 + salinim) * bukulme;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

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
      // Yazılımla çizimde (ekran kartı yok) bağlam açılmaz, yedek ışık kalır (FanusSahnesi › ekranKartiVar)
      failIfMajorPerformanceCaveat: true,
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

  // ---- Alev: yumuşak kenarlı gövde ve dışında kâğıda mavi leke bırakan ışıltı; ikisi de cam üstüne çizilir ----
  const alevOrtak = {
    uZaman: { value: 0 },
    uEgim: { value: new Vector2() },
    uGuc: { value: 1 },
    uCekirdek: { value: new Color() },
    uOrta: { value: new Color() },
    uDis: { value: new Color() },
    uUc: { value: new Color() },
  };
  const alevGrubu = new Group();
  alevGrubu.position.y = ALEV_TABANI;
  // Dikey bir levha: profil dışı parçacık gölgelendiricide silinir, köşe gölgelendirici rüzgârla büker
  const alevGeo = g(new PlaneGeometry(ALEV_YARIM_GEN * 2, ALEV_BOYU, zayif ? 12 : 24, zayif ? 48 : 96));
  alevGeo.translate(0, ALEV_BOYU / 2, 0);

  const govdeMalzeme = m(
    new ShaderMaterial({
      uniforms: alevOrtak,
      vertexShader: ALEV_KOSE_GLSL,
      fragmentShader: /* glsl */ `
        ${ALEV_ORTAK_GLSL}
        uniform vec3 uCekirdek;
        uniform vec3 uOrta;
        uniform vec3 uDis;
        uniform vec3 uUc;
        void main() {
          float h = vP.y;
          float n, n2;
          float kenar = kenarUzakligi(h, 1.0, n, n2);
          if (kenar > 1.05) discard;
          float ic = clamp(1.0 - kenar, 0.0, 1.0);
          // Kenar yumuşak: kesme çizgisi testere dişi yapar, saydamlık yapmaz
          float a = smoothstep(1.05, 0.86, kenar);
          // Şok elmasları: eksende yukarı akan parlak düğümler (meme ağzında değil, gövdenin ortasında)
          float elmas = 1.0 - 0.45 * (0.5 + 0.5 * cos(h * 16.0 - uZaman * 6.0)) * smoothstep(0.08, 0.3, h) * smoothstep(0.55, 0.95, ic);
          // Beyaz-mavi çekirdek: eksende, alt yarıda güçlü; türbülansla nefes alır
          float cekirdek = smoothstep(0.3, 1.0, ic) * smoothstep(1.0, 0.12, h) * (0.75 + 0.35 * n2) * elmas;
          vec3 renk = mix(uDis, uOrta, smoothstep(0.0, 0.7, ic));
          // Uçlar mora döner
          renk = mix(renk, uUc, smoothstep(0.5, 1.0, h) * (1.0 - 0.5 * ic));
          renk = mix(renk, uCekirdek, clamp(cekirdek, 0.0, 1.0));
          renk += vec3(0.85, 0.95, 1.0) * pow(clamp(cekirdek, 0.0, 1.0), 2.5) * 0.7;
          renk *= 0.85 + 0.3 * n2 + 0.15 * clamp(uGuc - 1.0, 0.0, 1.5);
          gl_FragColor = vec4(renk, a);
          #include <colorspace_fragment>
        }
      `,
      // Cam üstüne çizilir (kırılma geçişine girmez: orada kenarlar kesme yüzünden testere dişi oluyordu)
      transparent: true,
      blending: NormalBlending,
      depthTest: false,
      depthWrite: false,
    }),
  );
  const govde = new Mesh(alevGeo, govdeMalzeme);
  govde.renderOrder = 20;
  alevGrubu.add(govde);

  const piriltiMalzeme = m(
    new ShaderMaterial({
      uniforms: alevOrtak,
      vertexShader: ALEV_KOSE_GLSL,
      fragmentShader: /* glsl */ `
        ${ALEV_ORTAK_GLSL}
        uniform vec3 uOrta;
        uniform vec3 uDis;
        void main() {
          float h = vP.y;
          float n, n2;
          float kenar = kenarUzakligi(h, 0.6, n, n2);
          float a = smoothstep(1.5, 0.3, kenar) * (0.2 + 0.1 * n2) * min(uGuc, 1.6);
          vec3 renk = mix(uDis, uOrta, smoothstep(1.2, 0.3, kenar));
          gl_FragColor = vec4(renk, a);
          #include <colorspace_fragment>
        }
      `,
      // Kâğıt zeminde toplamalı karışım beyaza gider; normal karışımla mavi bir leke bırakır
      transparent: true,
      blending: NormalBlending,
      depthTest: false,
      depthWrite: false,
    }),
  );
  const pirilti = new Mesh(alevGeo, piriltiMalzeme);
  pirilti.scale.set(1.35, 1.15, 1);
  pirilti.renderOrder = 19;
  alevGrubu.add(pirilti);
  egim.add(alevGrubu);

  // ---- Hale (alevin etrafındaki ışık; kâğıt zeminde normal karışımla mavi leke) ----
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
  const haleBuyuk = new Sprite(haleMalzemesi(ALEV_RENKLERI.hale, 0.22));
  haleBuyuk.scale.setScalar(4.4);
  haleBuyuk.renderOrder = 17;
  const haleKucuk = new Sprite(haleMalzemesi(ALEV_RENKLERI.haleKucuk, 0.45));
  haleKucuk.scale.setScalar(2.2);
  haleKucuk.renderOrder = 18;
  haleBuyuk.position.y = haleKucuk.position.y = ALEV_ORTASI;
  egim.add(haleBuyuk, haleKucuk);

  // Kâğıda düşen leke (ateşböceğiyle birlikte kayar)
  const zeminIsigiMalzeme = m(
    new MeshBasicMaterial({
      map: haleDokusu,
      color: ALEV_RENKLERI.zeminIsigi,
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

  // ---- Kıvılcım: alevden yükselen küçük zerreler ----
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
  const noktaIsigi = new PointLight(ALEV_RENKLERI.isik, 6, 0, 2);
  noktaIsigi.position.y = ALEV_ORTASI;
  egim.add(noktaIsigi);
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

  // ---- Renkler: alev sabit, zemin sayfanın kâğıt renginden ----
  const temaUygula = () => {
    cizici.setClearColor(sahneZemini(), 1);
    (tozMalzeme.uniforms.uRenk.value as Color).set(ALEV_RENKLERI.toz);
    const [c, o, d, u] = [ALEV_RENKLERI.cekirdek, ALEV_RENKLERI.orta, ALEV_RENKLERI.dis, ALEV_RENKLERI.uc];
    alevOrtak.uCekirdek.value.setRGB(c[0]!, c[1]!, c[2]!, SRGBColorSpace);
    alevOrtak.uOrta.value.setRGB(o[0]!, o[1]!, o[2]!, SRGBColorSpace);
    alevOrtak.uDis.value.setRGB(d[0]!, d[1]!, d[2]!, SRGBColorSpace);
    alevOrtak.uUc.value.setRGB(u[0]!, u[1]!, u[2]!, SRGBColorSpace);
    yenidenCiz = true;
  };
  temaUygula();

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

    // Alev: jet gibi dik ve güçlü; nabız ince ve hızlı, rüzgârla tepesi bükülür
    const nabiz = 1 + 0.03 * Math.sin(zaman * 11) + 0.02 * Math.sin(zaman * 23.7);
    const guc = Math.max(poz.isik * isikGiris * nabiz, 0);
    alevOrtak.uZaman.value = zaman;
    alevOrtak.uGuc.value = guc;
    alevOrtak.uEgim.value.set(egimX, egimZ);
    alevGrubu.visible = guc > 0.01;
    alevGrubu.scale.setScalar(0.86 + 0.14 * Math.min(guc, 1.5));
    haleBuyuk.material.opacity = 0.22 * Math.min(guc, 2);
    haleKucuk.material.opacity = 0.45 * Math.min(guc, 1.5);
    haleBuyuk.scale.setScalar(3.8 + guc * 0.8);
    zeminIsigiMalzeme.opacity = 0.3 * Math.min(guc, 2.2);
    noktaIsigi.intensity = 7 * guc * olcek * olcek;

    // Eğim: imleç (fare varsa) ve yavaş salınım
    if (imlec.var) {
      egimHedefi.x = imlec.y * 0.12;
      egimHedefi.z = -imlec.x * 0.07;
    }
    egim.rotation.x = MathUtils.lerp(egim.rotation.x, egimHedefi.x + Math.sin(zaman * 0.4) * 0.03, 0.05);
    egim.rotation.z = MathUtils.lerp(egim.rotation.z, egimHedefi.z + Math.sin(zaman * 0.31) * 0.02, 0.05);
    egim.rotation.y = Math.sin(zaman * 0.22) * 0.38 + (imlec.var ? imlec.x * 0.18 : 0);

    // Kıvılcım: alevden yükselir; cam kapalıyken içinde kalır, kalkınca tavan yükselir ve rüzgâra kapılır
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
      konumlar[i * 3 + 1] = ALEV_ORTASI - 0.5 + o * (tavan - ALEV_ORTASI + 0.5);
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
