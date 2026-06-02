"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCareerStore } from "@/store/useCareerStore";
import MobileNavbar from "@/components/MobileNavbar";
import type { RiwayatItem } from "@/types/career";
import MainNavbar from "@/components/navbar";

export default function Profil() {
  const router = useRouter();
  const store = useCareerStore();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [riwayat, setRiwayat] = useState<RiwayatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/masuk-daftar");
        return;
      }

      setUser({ email: authUser.email || "Pengguna" });

      try {
        const res = await fetch(
          `/api/riwayat?userId=${authUser.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setRiwayat(data.riwayat || []);
        }
      } catch (err) {
        console.error("Gagal fetch riwayat:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    store.reset();
    router.push("/masuk-daftar");
  }

  const latest = riwayat[0] || null;
  const progressRoadmap = latest?.progressRoadmap ?? 0;

  return (
    <>
    <MainNavbar />
      <div className="aurora-bg" />
      <main className="pt-24 md:pt-32 pb-stack-lg flex flex-col md:flex-row gap-gutter px-margin-mobile md:px-margin-desktop min-h-screen animate-fade-in">
        <aside className="w-full md:w-80 flex flex-col gap-gutter">
          <div className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6 flex flex-col items-center text-center">
            <div className="relative w-32 h-32 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-primary-container animate-pulse shadow-[0_0_15px_rgba(0,219,233,0.6)]" />
              <div className="w-full h-full rounded-full border-2 border-black bg-surface-container-highest flex items-center justify-center relative z-10">
                <span className="material-symbols-outlined text-5xl text-primary-container">
                  person
                </span>
              </div>
            </div>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary-fixed-dim">
              {user?.email?.split("@")[0] || "Pengguna"}
            </h1>
            <p className="font-label-bold text-label-bold text-on-surface-variant mb-6 uppercase tracking-widest">
              {latest
                ? `${latest.hasilDiagnosis?.karirUtama || "Belum diagnosis"}`
                : "Belum diagnosis"}
            </p>
            <div className="w-full space-y-3 mb-6 text-left">
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg border border-black/20">
                <span className="material-symbols-outlined text-primary-container">
                  email
                </span>
                <span className="text-body-md font-body-md truncate">
                  {user?.email || "-"}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg border border-black/20">
                <span className="material-symbols-outlined text-secondary">
                  verified
                </span>
                <span className="text-body-md font-body-md">
                  Status:{" "}
                  {latest ? "Terdiagnosis" : "Menunggu diagnosis"}
                </span>
              </div>
            </div>
            <button
              onClick={() => router.push("/diagnosis-karir")}
              className="w-full py-3 bg-primary-container text-on-primary-fixed font-headline-lg-mobile border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 hover:translate-x-0.5 transition-transform active:translate-y-1 active:translate-x-1 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">
                add_circle
              </span>
              Diagnosis Baru
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-3 mt-3 bg-surface-container text-error font-label-bold border-2 border-error shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 hover:translate-x-0.5 transition-transform active:translate-y-1 active:translate-x-1"
            >
              Logout
            </button>
          </div>
        </aside>
        <section className="flex-1 flex flex-col gap-gutter">
          {latest && latest.hasilDiagnosis && (
            <div className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6">
              <h2 className="font-headline-lg text-headline-lg-mobile text-primary mb-4">
                Hasil Diagnosis Terbaru
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="font-label-bold text-xs uppercase text-on-surface-variant">
                    Karir Utama
                  </span>
                  <p className="font-headline-lg-mobile text-on-surface mt-1">
                    {latest.hasilDiagnosis.karirUtama}
                  </p>
                </div>
                <div>
                  <span className="font-label-bold text-xs uppercase text-on-surface-variant">
                    Skor Kecocokan
                  </span>
                  <p className="font-headline-lg-mobile text-primary-container mt-1">
                    {latest.hasilDiagnosis.skorKepercayaan}%
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="font-label-bold text-xs uppercase text-on-surface-variant">
                  Karir Alternatif
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {latest.hasilDiagnosis.karirAlternatif.map((k) => (
                    <span
                      key={k}
                      className="px-3 py-1 bg-secondary-container text-on-secondary-container text-sm font-label-bold border border-black"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 p-4 bg-surface-container-low border border-black">
                <p className="text-body-md text-on-surface-variant italic">
                  {latest.hasilDiagnosis.alasan}
                </p>
              </div>
              {latest.roadmap && (
                <div className="mt-6">
                  <span className="font-label-bold text-xs uppercase text-on-surface-variant">
                    Progress Roadmap
                  </span>
                  <div className="flex items-end gap-2 mt-2 mb-2">
                    <span className="text-4xl font-headline-xl text-primary-container leading-none">
                      {progressRoadmap}%
                    </span>
                    <span className="text-on-surface-variant mb-1">Selesai</span>
                  </div>
                  <div className="w-full h-4 bg-surface-container border-2 border-black relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-primary-container transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,219,233,0.4)]"
                      style={{ width: `${progressRoadmap}%` }}
                    />
                  </div>
                </div>
              )}
              <button
                onClick={() => {
                  store.setSessionId(latest.id);
                  store.setRoadmap(null);
                  router.push("/peta-jalan");
                }}
                className="mt-6 px-8 py-3 bg-secondary-container text-on-secondary-container font-label-bold border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:-translate-y-0.5 hover:translate-x-0.5 transition-all"
              >
                Lihat Roadmap Lengkap
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <h2 className="font-headline-lg text-headline-lg-mobile text-primary ml-2">
              Riwayat Diagnosis
            </h2>
            {riwayat.length === 0 && !loading && (
              <div className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-8 text-center">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">
                  history
                </span>
                <p className="text-on-surface-variant mb-4">
                  Belum ada riwayat diagnosis. Mulai assessment karir Anda
                  sekarang!
                </p>
                <button
                  onClick={() => router.push("/diagnosis-karir")}
                  className="px-8 py-3 bg-primary-container text-on-primary-fixed font-label-bold border-2 border-black shadow-[4px_4px_0px_0px_#000000]"
                >
                  Mulai Diagnosis
                </button>
              </div>
            )}
            {riwayat.map((item) => (
              <div
                key={item.id}
                className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-surface-container-highest transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-container text-on-primary-container flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                    <span className="material-symbols-outlined">
                      analytics
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline-lg-mobile text-on-surface">
                      {item.hasilDiagnosis?.karirUtama || "Diagnosis"}
                    </h3>
                    <p className="text-body-md text-on-surface-variant">
                      {new Date(item.dibuatPada).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      &bull; Skor:{" "}
                      {item.hasilDiagnosis?.skorKepercayaan || "-"}/100
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {item.roadmap && (
                    <div className="px-3 py-1 bg-tertiary-container text-on-tertiary-container text-xs font-bold border border-black rounded-full uppercase">
                      Roadmap Tersedia
                    </div>
                  )}
                  <button
                    onClick={() => {
                      store.setSessionId(item.id);
                      store.setRoadmap(null);
                      router.push("/peta-jalan");
                    }}
                    className="p-2 border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:-translate-y-0.5 hover:translate-x-0.5 transition-transform active:translate-y-0.5 active:translate-x-0.5"
                  >
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <MobileNavbar />
    </>
  );
}
