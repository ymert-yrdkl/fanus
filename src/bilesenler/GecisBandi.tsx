/**
 * Gece (lacivert) ile gündüz (kurumsal beyaz) bölümleri arasındaki renk geçişi.
 * "safak": geceden gündüze, "aksam": gündüzden geceye. Renkler globals.css › .gecis-bandi.
 */
export default function GecisBandi({ yon, boy = "uzun" }: { yon: "safak" | "aksam"; boy?: "uzun" | "kisa" }) {
  return (
    <div
      aria-hidden="true"
      className={`gecis-bandi gecis-bandi--${yon} ${boy === "uzun" ? "h-[36vh] min-h-56" : "h-40 md:h-56"}`}
    />
  );
}
