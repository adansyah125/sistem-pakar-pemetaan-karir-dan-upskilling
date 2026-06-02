"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import type { RiwayatItem } from "@/types/career";

export default function TestCenter() {
  const router = useRouter();
  const [riwayat, setRiwayat] = useState<RiwayatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push("/masuk-daftar"); return; }

      try {
        const res = await fetch(`/api/riwayat?userId=${authUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setRiwayat(data.riwayat || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const latest = riwayat[0] || null;

  return (
    <DashboardLayout tujuanKarir={latest?.hasilDiagnosis?.karirUtama ?? null}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-primary mb-2">
              Test Center
            </h1>
            <p className="text-on-surface-variant">Kelola assessment dan uji kompetensi Anda.</p>
          </div>
          <button
            onClick={() => router.push("/diagnosis-karir")}
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-primary-container text-on-primary-fixed font-label-bold border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 hover:translate-x-0.5 transition-all"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Diagnosis Baru
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full" />
          </div>
        ) : riwayat.length === 0 ? (
          <div className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">quiz</span>
            <h2 className="font-headline-lg mb-4">Belum Ada Test</h2>
            <p className="text-on-surface-variant mb-6">Mulai assessment karir pertama Anda sekarang.</p>
            <button
              onClick={() => router.push("/diagnosis-karir")}
              className="px-8 py-3 bg-primary-container text-on-primary-fixed font-label-bold border-2 border-black shadow-[4px_4px_0px_0px_#000000]"
            >
              Mulai Diagnosis
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {riwayat.map((item, index) => (
              <div
                key={item.id}
                className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-container flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                    <span className="material-symbols-outlined text-on-primary-container">analytics</span>
                  </div>
                  <div>
                    <h3 className="font-headline-lg-mobile">
                      {item.hasilDiagnosis?.karirUtama || `Assessment #${index + 1}`}
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      {new Date(item.dibuatPada).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                      {" "}&bull;{" "}
                      Skor: {item.hasilDiagnosis?.skorKepercayaan || "-"}/100
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.roadmap && (
                    <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container text-xs font-bold border border-black rounded-full">
                      Roadmap ✓
                    </span>
                  )}
                  <button
                    onClick={() => {
                      router.push("/peta-jalan");
                    }}
                    className="px-4 py-2 bg-secondary-container text-on-secondary-container font-label-bold border-2 border-black shadow-[2px_2px_0px_0px_#000000] text-sm"
                  >
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => router.push("/diagnosis-karir")}
          className="md:hidden w-full py-3 bg-primary-container text-on-primary-fixed font-label-bold border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Diagnosis Baru
        </button>
      </div>
    </DashboardLayout>
  );
}
