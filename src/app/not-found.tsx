import Link from "next/link";
import { FanusIsareti } from "@/bilesenler/Logo";
import { dugmeSinifi } from "@/bilesenler/dugme";

export default function BulunamadiSayfasi() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <FanusIsareti className="size-16 text-krem" />
      <h1 className="bolum-baslik mt-8">Bu sayfa yok.</h1>
      <p className="mt-4 max-w-[28rem] text-lg text-soluk">
        Adres yanlış yazılmış ya da sayfa kaldırılmış olabilir. Ana sayfadan devam edebilirsiniz.
      </p>
      <Link href="/" className={`${dugmeSinifi.alev} mt-8`}>
        Ana sayfaya dön
      </Link>
    </main>
  );
}
