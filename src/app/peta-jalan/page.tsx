"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MainNavbar from "@/components/navbar";
import MobileNavbar from "@/components/MobileNavbar";
import { useCareerStore } from "@/store/useCareerStore";
import { supabase } from "@/lib/supabase";
import type { Roadmap, RoadmapStep } from "@/types/career";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Circle, BookOpen, PlayCircle, GraduationCap, Flag, Clock, LayoutDashboard, GitBranch, FileQuestion, Route, HelpCircle } from "lucide-react";

export default function PetaJalan() {
  const router = useRouter();
  const store = useCareerStore();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(store.roadmap);
  const [progress, setProgress] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmap() {
      if (store.roadmap) {
        setRoadmap(store.roadmap);
        setLoading(false);
        return;
      }

      if (!store.sessionId) {
        router.push("/diagnosis-karir");
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/masuk-daftar");
          return;
        }

        const res = await fetch("/api/gemini/roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            diagnosisSessionId: store.sessionId,
            userId: user.id,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        store.setRoadmap(data.roadmap);
        setRoadmap(data.roadmap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoadmap();
  }, [store.sessionId, store.roadmap, router]);

  function toggleStep(urutan: number) {
    setProgress((prev) =>
      prev.includes(urutan)
        ? prev.filter((u) => u !== urutan)
        : [...prev, urutan]
    );
  }

  const completedSteps = progress.length;
  const totalSteps = roadmap?.langkah.length || 1;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
        <HelpCircle className="h-16 w-16 text-muted-foreground" />
        <p className="text-muted-foreground">
          Belum ada roadmap. Silakan lakukan diagnosis terlebih dahulu.
        </p>
        <Button
          onClick={() => router.push("/diagnosis-karir")}
          variant="accent"
          size="lg"
        >
          Mulai Diagnosis
        </Button>
      </div>
    );
  }

  return (
    <>
      <MainNavbar />
      <div className="flex pt-20">
        <aside className="hidden md:flex flex-col py-6 gap-stack-sm h-screen w-64 border-r border-border bg-card sticky top-20">
          <div className="px-6 mb-stack-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full border-2 border-black bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-foreground">
                  person
                </span>
              </div>
              <div>
                <div className="font-label-bold text-foreground">Peserta</div>
                <div className="text-xs text-muted-foreground">
                  {roadmap.tujuanKarir}
                </div>
              </div>
            </div>
          </div>
          <nav className="flex-grow">
            <Link className="flex items-center gap-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground px-4 py-3 mx-2 rounded-lg transition-colors" href="/dashboard">
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-label-bold">Dashboard</span>
            </Link>
            <Link className="flex items-center gap-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground px-4 py-3 mx-2 rounded-lg transition-colors" href="/skill-map">
              <GitBranch className="h-5 w-5" />
              <span className="font-label-bold">Skill Map</span>
            </Link>
            <Link className="flex items-center gap-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground px-4 py-3 mx-2 rounded-lg transition-colors" href="/test-center">
              <FileQuestion className="h-5 w-5" />
              <span className="font-label-bold">Test Center</span>
            </Link>
            <Link className="flex items-center gap-3 bg-secondary text-secondary-foreground border-2 border-black shadow-[2px_2px_0px_0px_#000] mx-2 px-4 py-3 rounded-lg" href="/peta-jalan">
              <Route className="h-5 w-5" />
              <span className="font-label-bold">Roadmaps</span>
            </Link>
          </nav>
          <div className="px-4 mt-auto">
            <Separator className="my-4" />
          </div>
        </aside>
        <main className="flex-grow px-margin-mobile md:px-margin-desktop py-stack-lg relative overflow-x-hidden animate-fade-in">
          <div className="mb-stack-lg max-w-4xl mx-auto text-center">
            <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl mb-4">
              Upskilling Roadmap
            </h1>
            <p className="text-body-lg text-muted-foreground">
              Panduan langkah demi langkah menuju{" "}
              <span className="text-primary font-bold">{roadmap.tujuanKarir}</span>
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-card border-2 border-black px-4 py-2 rounded-full">
                <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_#00f0ff]" />
                <span className="font-label-bold">
                  Progress: {progressPercent}%
                </span>
              </div>
              <div className="flex items-center gap-2 bg-card border-2 border-black px-4 py-2 rounded-full">
                <span className="font-label-bold">
                  {roadmap.levelAwal} → {roadmap.levelTarget}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-card border-2 border-black px-4 py-2 rounded-full">
                <Clock className="h-4 w-4" />
                <span className="font-label-bold">
                  Estimasi: {roadmap.estimasiTotal}
                </span>
              </div>
            </div>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary transform -translate-x-1/2 timeline-glow z-0" />
            {roadmap.langkah.map((langkah, index) => {
              const isLeft = index % 2 === 0;
              const isCompleted = progress.includes(langkah.urutan);

              return (
                <div
                  key={langkah.urutan}
                  className="relative z-10 flex flex-col md:flex-row items-center mb-stack-lg"
                >
                  {isLeft ? (
                    <div className="w-full md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                      <StepCard
                        langkah={langkah}
                        isCompleted={isCompleted}
                        onToggle={toggleStep}
                      />
                    </div>
                  ) : (
                    <div className="hidden md:block md:w-1/2" />
                  )}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-8 h-8 border-4 rounded-full z-20 shadow-[0_0_15px_#00f0ff] ${
                      isCompleted
                        ? "bg-black border-primary"
                        : "bg-card border-muted-foreground"
                    }`}
                  >
                    {isCompleted && (
                      <span className="flex items-center justify-center w-full h-full text-primary text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  {!isLeft ? (
                    <div className="w-full md:w-1/2 md:pl-12 mb-6 md:mb-0">
                      <StepCard
                        langkah={langkah}
                        isCompleted={isCompleted}
                        onToggle={toggleStep}
                      />
                    </div>
                  ) : (
                    <div className="hidden md:block md:w-1/2" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-stack-lg max-w-5xl mx-auto">
            <div className="relative bg-card border-2 border-black neo-shadow overflow-hidden group rounded-none">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-20">
                <h2 className="font-headline-lg text-foreground mb-2">
                  Tujuan Akhir: {roadmap.tujuanKarir}
                </h2>
                <p className="font-body-md text-muted-foreground max-w-2xl">
                  Setelah menyelesaikan semua langkah, Anda akan memiliki
                  kualifikasi sebagai {roadmap.levelTarget} di bidang{" "}
                  {roadmap.tujuanKarir}.
                </p>
              </div>
              <div className="h-48 bg-card flex items-center justify-center">
                <Flag className="h-24 w-24 text-primary/30" />
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileNavbar />
    </>
  );
}

function StepCard({
  langkah,
  isCompleted,
  onToggle,
}: {
  langkah: RoadmapStep;
  isCompleted: boolean;
  onToggle: (urutan: number) => void;
}) {
  return (
    <div
      className={`bg-card/70 backdrop-blur-xl border-2 border-black p-6 neo-shadow inline-block w-full max-w-md hover:-translate-y-1 transition-transform rounded-none ${
        isCompleted ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-4 text-primary">
        <span className="font-headline-lg-mobile md:font-headline-lg">
          Langkah {langkah.urutan}
        </span>
        {isCompleted ? (
          <CheckCircle className="h-6 w-6" />
        ) : (
          <Circle className="h-6 w-6" />
        )}
      </div>
      <h3 className="font-headline-lg-mobile text-foreground mb-2">
        {langkah.judul}
      </h3>
      <p className="text-body-md text-muted-foreground mb-4 text-sm">
        {langkah.deskripsi}
      </p>
      <div className="mb-4">
        <span className="font-label-bold text-xs uppercase tracking-wider text-muted-foreground">
          Skill yang dipelajari:
        </span>
        <div className="flex flex-wrap gap-2 mt-2">
          {langkah.skill.map((s) => (
            <Badge
              key={s}
              variant="outline"
              className="border-2 border-black text-xs rounded-none bg-card"
            >
              {s}
            </Badge>
          ))}
        </div>
      </div>
      {langkah.sumberBelajar.length > 0 && (
        <div className="mb-4">
          <span className="font-label-bold text-xs uppercase tracking-wider text-muted-foreground">
            Sumber Belajar:
          </span>
          <ul className="mt-2 space-y-1">
            {langkah.sumberBelajar.map((sumber, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-center gap-1">
                {sumber.tipe === "course" ? (
                  <GraduationCap className="h-3 w-3" />
                ) : sumber.tipe === "video" ? (
                  <PlayCircle className="h-3 w-3" />
                ) : (
                  <BookOpen className="h-3 w-3" />
                )}
                {sumber.nama}
                {sumber.url && (
                  <span className="text-primary ml-1 text-xs">
                    ({sumber.tipe})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" /> {langkah.estimasi}
        </span>
        <Button
          type="button"
          onClick={() => onToggle(langkah.urutan)}
          variant={isCompleted ? "outline" : "accent"}
          size="sm"
        >
          {isCompleted ? "Selesai ✓" : "Tandai Selesai"}
        </Button>
      </div>
    </div>
  );
}
