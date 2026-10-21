/**
 * Gece (3B sahne) bölümünden gündüz içeriğe geçiş: degrade yok, gündüz köşeleri yuvarlak bir sayfa gibi başlar.
 * Sayfada bir kez, 3B sahnenin bittiği yerde kullanılır. Görünüm globals.css › .gecis-yaprak.
 */
export default function GecisBandi() {
  return <div aria-hidden="true" className="gecis-yaprak" />;
}
