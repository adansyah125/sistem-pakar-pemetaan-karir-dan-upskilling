"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import type { RiwayatItem } from "@/types/career";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Loader2 } from "lucide-react";

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

  return (
    <DashboardLayout tujuanKarir={latest?.hasilDiagnosis?.karirUtama ?? null}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-foreground mb-2">
            Skill Map
          </h1>
          <p className="text-muted-foreground">Visualisasi kompetensi berdasarkan hasil assessment.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : !latest ? (
          <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-12 text-center rounded-none">
            <GitBranch className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-headline-lg mb-4">Belum Ada Data Skill</h2>
            <p className="text-muted-foreground mb-6">Selesaikan assessment untuk melihat peta skill Anda.</p>
            <Button
              onClick={() => router.push("/diagnosis-karir")}
              variant="accent"
              size="lg"
            >
              Mulai Diagnosis
            </Button>
          </Card>
        ) : (
          <>
            {latest.roadmap && (
              <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-6 rounded-none">
                <h2 className="font-headline-lg text-headline-lg-mobile mb-4 text-foreground">Skill Target</h2>
                <p className="text-muted-foreground mb-4">
                  Skill yang perlu dikembangkan untuk mencapai karir{" "}
                  <span className="font-bold text-primary">{latest.hasilDiagnosis?.karirUtama}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {latest.roadmap.langkah.flatMap((l) => l.skill).filter((s, i, a) => a.indexOf(s) === i).map((skill) => (
                    <Badge key={skill} variant="accent" className="px-4 py-2 text-sm border-2 border-primary rounded-lg">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {latest.hasilDiagnosis?.kompetensiKunci && (
              <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-6 rounded-none">
                <h2 className="font-headline-lg text-headline-lg-mobile mb-4 text-secondary-foreground">Kompetensi Kunci</h2>
                <div className="flex flex-wrap gap-3">
                  {latest.hasilDiagnosis.kompetensiKunci.map((k) => (
                    <Badge key={k} variant="secondary" className="px-4 py-2 text-sm border-2 border-secondary rounded-lg">
                      {k}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-6 rounded-none">
              <h2 className="font-headline-lg text-headline-lg-mobile mb-4 text-[hsl(90,100%,47%)]">Karir Alternatif</h2>
              <div className="flex flex-wrap gap-3">
                {latest.hasilDiagnosis?.karirAlternatif.map((k) => (
                  <Badge key={k} variant="outline" className="px-4 py-2 text-sm border-2 border-[hsl(90,100%,47%)] text-[hsl(90,100%,47%)] rounded-lg">
                    {k}
                  </Badge>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
