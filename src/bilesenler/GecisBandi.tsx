/**
 * Gece (lacivert, 3B sahne) bölümünden gündüz (kurumsal beyaz) içeriğe renk geçişi. Sayfada bir kez,
 * 3B sahnenin bittiği yerde kullanılır; geçişten sonra sayfa sonuna kadar gündüzdür. Renkler globals.css › .gecis-bandi.
 */
export default function GecisBandi({ boy = "uzun" }: { boy?: "uzun" | "kisa" }) {
  return <div aria-hidden="true" className={`gecis-bandi ${boy === "uzun" ? "h-[36vh] min-h-56" : "h-40 md:h-56"}`} />;
}
