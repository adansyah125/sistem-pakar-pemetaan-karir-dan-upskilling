"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MainNavbar from "@/components/navbar";
import MobileNavbar from "@/components/MobileNavbar";
import { useCareerStore } from "@/store/useCareerStore";
import { supabase } from "@/lib/supabase";
import type { Roadmap, RoadmapStep } from "@/types/career";

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
        <div className="animate-spin w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant">
          error_outline
        </span>
        <p className="text-on-surface-variant">
          Belum ada roadmap. Silakan lakukan diagnosis terlebih dahulu.
        </p>
        <button
          onClick={() => router.push("/diagnosis-karir")}
          className="px-8 py-3 bg-primary-container text-on-primary-fixed font-label-bold border-2 border-black shadow-[4px_4px_0px_0px_#000000]"
        >
          Mulai Diagnosis
        </button>
      </div>
    );
  }

  return (
    <>
      <MainNavbar />
      <div className="flex pt-20">
        <aside className="hidden md:flex flex-col py-6 gap-stack-sm h-screen w-64 border-r-2 border-black bg-surface-container shadow-[4px_0px_0px_0px_#000000] sticky top-20">
          <div className="px-6 mb-stack-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full border-2 border-black bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container">
                  person
                </span>
              </div>
              <div>
                <div className="font-label-bold text-on-surface">Peserta</div>
                <div className="text-xs text-on-surface-variant">
                  {roadmap.tujuanKarir}
                </div>
              </div>
            </div>
          </div>
          <nav className="flex-grow">
            <Link className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-highest px-4 py-3 mx-2 rounded-lg transition-transform hover:translate-x-1" href="/dashboard">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-bold">Dashboard</span>
            </Link>
            <Link className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-highest px-4 py-3 mx-2 rounded-lg transition-transform hover:translate-x-1" href="/skill-map">
              <span className="material-symbols-outlined">account_tree</span>
              <span className="font-label-bold">Skill Map</span>
            </Link>
            <Link className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-highest px-4 py-3 mx-2 rounded-lg transition-transform hover:translate-x-1" href="/test-center">
              <span className="material-symbols-outlined">quiz</span>
              <span className="font-label-bold">Test Center</span>
            </Link>
            <Link className="flex items-center gap-3 bg-secondary-container text-on-secondary-container border-2 border-black shadow-[2px_2px_0px_0px_#000000] ml-2 mr-2 px-4 py-3 rounded-lg" href="/peta-jalan">
              <span className="material-symbols-outlined">alt_route</span>
              <span className="font-label-bold">Roadmaps</span>
            </Link>
          </nav>
          <div className="px-4 mt-auto">
            <div className="flex flex-col gap-2 border-t-2 border-black/10 pt-4">
              <a className="flex items-center gap-3 text-on-surface-variant hover:text-primary px-4 py-2" href="#">
                <span className="material-symbols-outlined">help</span>
                <span className="font-label-bold">Help</span>
              </a>
            </div>
          </div>
        </aside>
        <main className="flex-grow px-margin-mobile md:px-margin-desktop py-stack-lg relative overflow-x-hidden animate-fade-in">
          <div className="mb-stack-lg max-w-4xl mx-auto text-center">
            <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl mb-4">
              Upskilling Roadmap
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              Panduan langkah demi langkah menuju{" "}
              <span className="text-primary font-bold">{roadmap.tujuanKarir}</span>
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-surface-container border-2 border-black px-4 py-2 rounded-full">
                <span className="w-3 h-3 rounded-full bg-primary-container shadow-[0_0_8px_#00f0ff]" />
                <span className="font-label-bold">
                  Progress: {progressPercent}%
                </span>
              </div>
              <div className="flex items-center gap-2 bg-surface-container border-2 border-black px-4 py-2 rounded-full">
                <span className="font-label-bold">
                  {roadmap.levelAwal} → {roadmap.levelTarget}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-surface-container border-2 border-black px-4 py-2 rounded-full">
                <span className="material-symbols-outlined text-sm">
                  schedule
                </span>
                <span className="font-label-bold">
                  Estimasi: {roadmap.estimasiTotal}
                </span>
              </div>
            </div>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary-container transform -translate-x-1/2 timeline-glow z-0" />
            {roadmap.langkah.map((langkah, index) => {
              const isLeft = index % 2 === 0;
              const isCompleted = progress.includes(langkah.urutan);
              const isActive = !isCompleted;

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
                        isActive={isActive}
                        onToggle={toggleStep}
                      />
                    </div>
                  ) : (
                    <div className="hidden md:block md:w-1/2" />
                  )}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-8 h-8 border-4 rounded-full z-20 shadow-[0_0_15px_#00f0ff] ${
                      isCompleted
                        ? "bg-black border-primary-container"
                        : "bg-surface-container-highest border-outline-variant"
                    }`}
                  >
                    {isCompleted && (
                      <span className="flex items-center justify-center w-full h-full text-primary-container text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  {!isLeft ? (
                    <div className="w-full md:w-1/2 md:pl-12 mb-6 md:mb-0">
                      <StepCard
                        langkah={langkah}
                        isCompleted={isCompleted}
                        isActive={isActive}
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
            <div className="relative bg-surface-container-highest border-2 border-black neo-shadow overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-20">
                <h2 className="font-headline-lg text-primary-fixed-dim mb-2">
                  Tujuan Akhir: {roadmap.tujuanKarir}
                </h2>
                <p className="font-body-md text-on-surface max-w-2xl">
                  Setelah menyelesaikan semua langkah, Anda akan memiliki
                  kualifikasi sebagai {roadmap.levelTarget} di bidang{" "}
                  {roadmap.tujuanKarir}.
                </p>
              </div>
              <div className="h-48 bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-8xl text-primary-container/30">
                  flag
                </span>
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
  isActive,
  onToggle,
}: {
  langkah: RoadmapStep;
  isCompleted: boolean;
  isActive: boolean;
  onToggle: (urutan: number) => void;
}) {
  return (
    <div
      className={`bg-surface-container-low/70 backdrop-blur-xl border-2 border-black p-6 neo-shadow inline-block w-full max-w-md hover:-translate-y-1 transition-transform ${
        isCompleted ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-4 text-primary-container">
        <span className="font-headline-lg-mobile md:font-headline-lg">
          Langkah {langkah.urutan}
        </span>
        <span className="material-symbols-outlined text-2xl">
          {isCompleted ? "check_circle" : "radio_button_unchecked"}
        </span>
      </div>
      <h3 className="font-headline-lg-mobile text-on-surface mb-2">
        {langkah.judul}
      </h3>
      <p className="text-body-md text-on-surface-variant mb-4 text-sm">
        {langkah.deskripsi}
      </p>
      <div className="mb-4">
        <span className="font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
          Skill yang dipelajari:
        </span>
        <div className="flex flex-wrap gap-2 mt-2">
          {langkah.skill.map((s) => (
            <span
              key={s}
              className="px-2 py-1 bg-surface-container-highest border border-black text-xs font-label-bold"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      {langkah.sumberBelajar.length > 0 && (
        <div className="mb-4">
          <span className="font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
            Sumber Belajar:
          </span>
          <ul className="mt-2 space-y-1">
            {langkah.sumberBelajar.map((sumber, i) => (
              <li key={i} className="text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-xs align-text-bottom mr-1">
                  {sumber.tipe === "course"
                    ? "school"
                    : sumber.tipe === "video"
                    ? "play_circle"
                    : "menu_book"}
                </span>
                {sumber.nama}
                {sumber.url && (
                  <span className="text-primary-container ml-1 text-xs">
                    ({sumber.tipe})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-on-surface-variant">
          ⏱ {langkah.estimasi}
        </span>
        <button
          type="button"
          onClick={() => onToggle(langkah.urutan)}
          className={`px-6 py-2 font-label-bold border-2 border-black transition-all active:translate-y-1 active:translate-x-1 ${
            isCompleted
              ? "bg-tertiary-fixed text-on-tertiary-fixed"
              : "bg-primary-container text-on-primary-container neo-shadow neo-shadow-hover"
          }`}
        >
          {isCompleted ? "Selesai ✓" : "Tandai Selesai"}
        </button>
      </div>
    </div>
  );
}
