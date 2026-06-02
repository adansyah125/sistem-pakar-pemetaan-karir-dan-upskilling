"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import type { RiwayatItem } from "@/types/career";

export default function SkillMap() {
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
  const latestSkor = riwayat.find(
    (r) => r.roadmap
  );

  const assessment = null;

  return (
    <DashboardLayout tujuanKarir={latest?.hasilDiagnosis?.karirUtama ?? null}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-primary mb-2">
            Skill Map
          </h1>
          <p className="text-on-surface-variant">Visualisasi kompetensi berdasarkan hasil assessment.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full" />
          </div>
        ) : !latest ? (
          <div className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">account_tree</span>
            <h2 className="font-headline-lg mb-4">Belum Ada Data Skill</h2>
            <p className="text-on-surface-variant mb-6">Selesaikan assessment untuk melihat peta skill Anda.</p>
            <button
              onClick={() => router.push("/diagnosis-karir")}
              className="px-8 py-3 bg-primary-container text-on-primary-fixed font-label-bold border-2 border-black shadow-[4px_4px_0px_0px_#000000]"
            >
              Mulai Diagnosis
            </button>
          </div>
        ) : (
          <>
            {latest.roadmap && (
              <div className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6">
                <h2 className="font-headline-lg text-headline-lg-mobile mb-4 text-primary">Skill Target</h2>
                <p className="text-on-surface-variant mb-4">
                  Skill yang perlu dikembangkan untuk mencapai karir{" "}
                  <span className="font-bold text-primary-container">{latest.hasilDiagnosis?.karirUtama}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {latest.roadmap.langkah.flatMap((l) => l.skill).filter((s, i, a) => a.indexOf(s) === i).map((skill) => (
                    <span key={skill} className="px-4 py-2 bg-primary-container/10 text-primary-container font-label-bold border-2 border-primary-container rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {latest.hasilDiagnosis?.kompetensiKunci && (
              <div className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6">
                <h2 className="font-headline-lg text-headline-lg-mobile mb-4 text-secondary">Kompetensi Kunci</h2>
                <div className="flex flex-wrap gap-3">
                  {latest.hasilDiagnosis.kompetensiKunci.map((k) => (
                    <span key={k} className="px-4 py-2 bg-secondary-container/10 text-on-secondary-container font-label-bold border-2 border-secondary rounded-lg">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6">
              <h2 className="font-headline-lg text-headline-lg-mobile mb-4 text-tertiary">Karir Alternatif</h2>
              <div className="flex flex-wrap gap-3">
                {latest.hasilDiagnosis?.karirAlternatif.map((k) => (
                  <span key={k} className="px-4 py-2 bg-tertiary-container/10 text-on-tertiary-container font-label-bold border-2 border-tertiary rounded-lg">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
