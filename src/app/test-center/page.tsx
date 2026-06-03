"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import type { RiwayatItem } from "@/types/career";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileQuestion, BarChart3, Plus, Loader2 } from "lucide-react";

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
            <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-foreground mb-2">
              Test Center
            </h1>
            <p className="text-muted-foreground">Kelola assessment dan uji kompetensi Anda.</p>
          </div>
          <Button
            onClick={() => router.push("/diagnosis-karir")}
            variant="accent"
            className="hidden md:flex"
          >
            <Plus className="h-5 w-5 mr-2" />
            Diagnosis Baru
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : riwayat.length === 0 ? (
          <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-12 text-center rounded-none">
            <FileQuestion className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-headline-lg mb-4">Belum Ada Test</h2>
            <p className="text-muted-foreground mb-6">Mulai assessment karir pertama Anda sekarang.</p>
            <Button
              onClick={() => router.push("/diagnosis-karir")}
              variant="accent"
              size="lg"
            >
              Mulai Diagnosis
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {riwayat.map((item, index) => (
              <Card
                key={item.id}
                className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-none"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                    <BarChart3 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-headline-lg-mobile text-foreground">
                      {item.hasilDiagnosis?.karirUtama || `Assessment #${index + 1}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
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
                    <Badge variant="secondary" className="border-2 border-black rounded-none">
                      Roadmap ✓
                    </Badge>
                  )}
                  <Button
                    onClick={() => {
                      router.push("/peta-jalan");
                    }}
                    variant="secondary"
                    className="border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-none text-sm"
                  >
                    Detail
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Button
          onClick={() => router.push("/diagnosis-karir")}
          variant="accent"
          className="md:hidden w-full"
        >
          <Plus className="h-5 w-5 mr-2" />
          Diagnosis Baru
        </Button>
      </div>
    </DashboardLayout>
  );
}
