"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import type { RiwayatItem } from "@/types/career";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [riwayat, setRiwayat] = useState<RiwayatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push("/masuk-daftar"); return; }
      setUser({ email: authUser.email || "Pengguna" });

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
  const totalAssessment = riwayat.length;

  return (
    <DashboardLayout tujuanKarir={latest?.hasilDiagnosis?.karirUtama ?? null}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-primary mb-2">
            Dashboard
          </h1>
          <p className="text-on-surface-variant">
            Selamat datang, <span className="font-bold">{user?.email?.split("@")[0] || "Peserta"}</span>
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full" />
          </div>
        ) : !latest ? (
          <div className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">dashboard</span>
            <h2 className="font-headline-lg mb-4">Belum Ada Data</h2>
            <p className="text-on-surface-variant mb-6">Lakukan diagnosis karir terlebih dahulu untuk melihat dashboard.</p>
            <button
              onClick={() => router.push("/diagnosis-karir")}
              className="px-8 py-3 bg-primary-container text-on-primary-fixed font-label-bold border-2 border-black shadow-[4px_4px_0px_0px_#000000]"
            >
              Mulai Diagnosis
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6">
                <span className="material-symbols-outlined text-3xl text-primary-container mb-3">badge</span>
                <p className="text-3xl font-bold text-primary-container">{latest.hasilDiagnosis?.karirUtama || "-"}</p>
                <p className="text-sm text-on-surface-variant mt-1">Karir Utama</p>
              </div>
              <div className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6">
                <span className="material-symbols-outlined text-3xl text-secondary mb-3">analytics</span>
                <p className="text-3xl font-bold text-secondary">{latest.hasilDiagnosis?.skorKepercayaan || 0}%</p>
                <p className="text-sm text-on-surface-variant mt-1">Skor Kecocokan</p>
              </div>
              <div className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6">
                <span className="material-symbols-outlined text-3xl text-tertiary mb-3">history</span>
                <p className="text-3xl font-bold text-tertiary">{totalAssessment}</p>
                <p className="text-sm text-on-surface-variant mt-1">Total Assessment</p>
              </div>
            </div>

            {latest.roadmap && (
              <div className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6">
                <h2 className="font-headline-lg text-headline-lg-mobile mb-4">Progress Roadmap</h2>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-4xl font-bold text-primary-container">{latest.progressRoadmap}%</span>
                  <span className="text-on-surface-variant mb-1">Selesai</span>
                </div>
                <div className="w-full h-5 bg-surface-container border-2 border-black relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-primary-container transition-all duration-1000"
                    style={{ width: `${latest.progressRoadmap}%` }}
                  />
                </div>
                <button
                  onClick={() => router.push("/peta-jalan")}
                  className="mt-6 px-6 py-2 bg-secondary-container text-on-secondary-container font-label-bold border-2 border-black shadow-[2px_2px_0px_0px_#000000]"
                >
                  Lihat Roadmap
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
