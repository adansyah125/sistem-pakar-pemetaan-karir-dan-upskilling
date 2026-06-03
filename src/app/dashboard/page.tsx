"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import type { RiwayatItem } from "@/types/career";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, BarChart3, History, Route, ClipboardList, Loader2 } from "lucide-react";

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
          <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Selamat datang, <span className="font-bold">{user?.email?.split("@")[0] || "Peserta"}</span>
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : !latest ? (
          <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-12 text-center rounded-none">
            <ClipboardList className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-headline-lg mb-4">Belum Ada Data</h2>
            <p className="text-muted-foreground mb-6">Lakukan diagnosis karir terlebih dahulu untuk melihat dashboard.</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-6 rounded-none">
                <BadgeCheck className="h-8 w-8 text-primary mb-3" />
                <p className="text-3xl font-bold text-primary">{latest.hasilDiagnosis?.karirUtama || "-"}</p>
                <p className="text-sm text-muted-foreground mt-1">Karir Utama</p>
              </Card>
              <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-6 rounded-none">
                <BarChart3 className="h-8 w-8 text-secondary mb-3" />
                <p className="text-3xl font-bold text-secondary">{latest.hasilDiagnosis?.skorKepercayaan || 0}%</p>
                <p className="text-sm text-muted-foreground mt-1">Skor Kecocokan</p>
              </Card>
              <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-6 rounded-none">
                <History className="h-8 w-8 text-[hsl(90,100%,47%)] mb-3" />
                <p className="text-3xl font-bold text-[hsl(90,100%,47%)]">{totalAssessment}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Assessment</p>
              </Card>
            </div>

            {latest.roadmap && (
              <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-6 rounded-none">
                <h2 className="font-headline-lg text-headline-lg-mobile mb-4">Progress Roadmap</h2>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-4xl font-bold text-primary">{latest.progressRoadmap}%</span>
                  <span className="text-muted-foreground mb-1">Selesai</span>
                </div>
                <Progress value={latest.progressRoadmap} className="h-5 border-2 border-border rounded-none [&>*]:bg-primary [&>*]:transition-all [&>*]:duration-1000" />
                <Button
                  onClick={() => router.push("/peta-jalan")}
                  variant="secondary"
                  className="mt-6 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-none"
                >
                  <Route className="h-4 w-4 mr-2" />
                  Lihat Roadmap
                </Button>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
