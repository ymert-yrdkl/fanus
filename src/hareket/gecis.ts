// Sayfalar arası geçiş: perde kapanır, yeni sayfaya gidilir, perde kalkar.
// GecisYoneticisi bileşeni (layout'ta) kendini buraya kaydeder; menü penceresi gibi yerler
// bağlantıyı kendisi yönetmek istediğinde `gecisleGit` çağırır.

type Git = (adres: string) => void;

let gitIslevi: Git | null = null;

export function gecisKaydet(islev: Git | null) {
  gitIslevi = islev;
}

/** Perde animasyonuyla sayfaya gider; geçiş yöneticisi yoksa doğrudan gider. */
export function gecisleGit(adres: string) {
  if (gitIslevi) gitIslevi(adres);
  else window.location.assign(adres);
}
