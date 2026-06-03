"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCareerStore } from "@/store/useCareerStore";
import MobileNavbar from "@/components/MobileNavbar";
import type { RiwayatItem } from "@/types/career";
import MainNavbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Mail, BadgeCheck, Plus, LogOut, History, ChevronRight, BarChart3, Route } from "lucide-react";

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
      <div className="aurora-bg fixed inset-0 z-0 pointer-events-none" />
      <main className="pt-24 md:pt-32 pb-stack-lg flex flex-col md:flex-row gap-gutter px-margin-mobile md:px-margin-desktop min-h-screen animate-fade-in relative z-10">
        <aside className="w-full md:w-80 flex flex-col gap-gutter">
          <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-6 flex flex-col items-center text-center rounded-none">
            <div className="relative w-32 h-32 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse shadow-[0_0_15px_rgba(0,219,233,0.6)]" />
              <div className="w-full h-full rounded-full border-2 border-black bg-card flex items-center justify-center relative z-10">
                <User className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground">
              {user?.email?.split("@")[0] || "Pengguna"}
            </h1>
            <p className="font-label-bold text-label-bold text-muted-foreground mb-6 uppercase tracking-widest">
              {latest
                ? `${latest.hasilDiagnosis?.karirUtama || "Belum diagnosis"}`
                : "Belum diagnosis"}
            </p>
            <div className="w-full space-y-3 mb-6 text-left">
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border/20">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-body-md font-body-md truncate text-muted-foreground">
                  {user?.email || "-"}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border/20">
                <BadgeCheck className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-body-md font-body-md text-muted-foreground">
                  Status:{" "}
                  {latest ? "Terdiagnosis" : "Menunggu diagnosis"}
                </span>
              </div>
            </div>
            <Button
              onClick={() => router.push("/diagnosis-karir")}
              variant="accent"
              className="w-full h-12"
            >
              <Plus className="h-5 w-5 mr-2" />
              Diagnosis Baru
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full h-12 mt-3 text-destructive border-destructive"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </Card>
        </aside>
        <section className="flex-1 flex flex-col gap-gutter">
          {latest && latest.hasilDiagnosis && (
            <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-6 rounded-none">
              <h2 className="font-headline-lg text-headline-lg-mobile text-foreground mb-4">
                Hasil Diagnosis Terbaru
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="font-label-bold text-xs uppercase text-muted-foreground">
                    Karir Utama
                  </span>
                  <p className="font-headline-lg-mobile text-foreground mt-1">
                    {latest.hasilDiagnosis.karirUtama}
                  </p>
                </div>
                <div>
                  <span className="font-label-bold text-xs uppercase text-muted-foreground">
                    Skor Kecocokan
                  </span>
                  <p className="font-headline-lg-mobile text-primary mt-1">
                    {latest.hasilDiagnosis.skorKepercayaan}%
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="font-label-bold text-xs uppercase text-muted-foreground">
                  Karir Alternatif
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {latest.hasilDiagnosis.karirAlternatif.map((k) => (
                    <Badge
                      key={k}
                      variant="secondary"
                      className="text-sm border-2 border-black rounded-none"
                    >
                      {k}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-4 p-4 bg-card border border-border">
                <p className="text-body-md text-muted-foreground italic">
                  {latest.hasilDiagnosis.alasan}
                </p>
              </div>
              {latest.roadmap && (
                <div className="mt-6">
                  <span className="font-label-bold text-xs uppercase text-muted-foreground">
                    Progress Roadmap
                  </span>
                  <div className="flex items-end gap-2 mt-2 mb-2">
                    <span className="text-4xl font-headline-xl text-primary leading-none">
                      {progressRoadmap}%
                    </span>
                    <span className="text-muted-foreground mb-1">Selesai</span>
                  </div>
                  <Progress value={progressRoadmap} className="h-4 border-2 border-border rounded-none [&>*]:bg-primary [&>*]:shadow-[0_0_10px_rgba(0,219,233,0.4)]" />
                </div>
              )}
              <Button
                onClick={() => {
                  store.setSessionId(latest.id);
                  store.setRoadmap(null);
                  router.push("/peta-jalan");
                }}
                variant="secondary"
                className="mt-6 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-none"
              >
                <Route className="h-4 w-4 mr-2" />
                Lihat Roadmap Lengkap
              </Button>
            </Card>
          )}

          <div className="flex flex-col gap-4">
            <h2 className="font-headline-lg text-headline-lg-mobile text-foreground ml-2">
              Riwayat Diagnosis
            </h2>
            {riwayat.length === 0 && !loading && (
              <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-8 text-center rounded-none">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Belum ada riwayat diagnosis. Mulai assessment karir Anda
                  sekarang!
                </p>
                <Button
                  onClick={() => router.push("/diagnosis-karir")}
                  variant="accent"
                  size="lg"
                >
                  Mulai Diagnosis
                </Button>
              </Card>
            )}
            {riwayat.map((item) => (
              <Card
                key={item.id}
                className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-accent transition-colors rounded-none"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-headline-lg-mobile text-foreground">
                      {item.hasilDiagnosis?.karirUtama || "Diagnosis"}
                    </h3>
                    <p className="text-body-md text-muted-foreground">
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
                    <Badge variant="secondary" className="border-2 border-black rounded-none">
                      Roadmap Tersedia
                    </Badge>
                  )}
                  <button
                    onClick={() => {
                      store.setSessionId(item.id);
                      store.setRoadmap(null);
                      router.push("/peta-jalan");
                    }}
                    className="p-2 border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 hover:translate-x-0.5 transition-transform active:translate-y-0.5 active:translate-x-0.5"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <MobileNavbar />
    </>
  );
}
