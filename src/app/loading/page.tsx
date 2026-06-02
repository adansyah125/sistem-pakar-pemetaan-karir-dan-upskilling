"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCareerStore } from "@/store/useCareerStore";
import { supabase } from "@/lib/supabase";

const STATUS_MAP: Record<string, string[]> = {
  questions: [
    "Menganalisis minat dan skill Anda...",
    "Menghubungkan ke sistem pakar Auralis...",
    "Merumuskan 10 soal kompetensi yang sesuai...",
    "Mengkategorikan soal berdasarkan bidang...",
    "Hampir selesai...",
  ],
  assess: [
    "Mengevaluasi jawaban Anda...",
    "Membandingkan dengan standar kompetensi...",
    "Menghitung skor per kompetensi...",
    "Menyusun analisis kekuatan dan kelemahan...",
    "Hampir selesai...",
  ],
  roadmap: [
    "Menganalisis hasil assessment...",
    "Menentukan level kompetensi Anda...",
    "Menyusun langkah-langkah upskilling...",
    "Mengkurasi sumber belajar terbaik...",
    "Menyiapkan roadmap karir personal...",
  ],
};

export default function LoadingWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoadingPage />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="overflow-hidden h-screen w-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function LoadingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get("step") || "questions";
  const [statusIndex, setStatusIndex] = useState(0);
  const [error, setError] = useState("");

  const statuses =
    STATUS_MAP[step] || STATUS_MAP.questions;

  const namaUser = "Pengguna";

  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length);
    }, 2500);

    return () => clearInterval(statusInterval);
  }, [statuses.length]);

  useEffect(() => {
    async function process() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/masuk-daftar");
          return;
        }

        const store = useCareerStore.getState();

        if (step === "questions") {
          if (!store.sessionId) {
            router.push("/diagnosis-karir");
            return;
          }

          const res = await fetch("/api/gemini/questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              diagnosisSessionId: store.sessionId,
              userId: user.id,
            }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Gagal generate soal");

          store.setSoalAktif(data.soal, data.assessmentId);
          setTimeout(() => router.push("/pertanyaan"), 500);
        } else if (step === "assess") {
          if (!store.assessmentId) {
            router.push("/diagnosis-karir");
            return;
          }

          const res = await fetch("/api/gemini/assess", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              assessmentId: store.assessmentId,
              jawaban: store.jawaban,
              userId: user.id,
            }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Gagal analisis");

          store.setAssessmentResult(data.result);
          setTimeout(() => router.push("/loading?step=roadmap"), 500);
        } else if (step === "roadmap") {
          if (!store.sessionId) {
            router.push("/diagnosis-karir");
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
          if (!res.ok) throw new Error(data.error || "Gagal buat roadmap");

          store.setRoadmap(data.roadmap);
          setTimeout(() => router.push("/peta-jalan"), 500);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan"
        );
      }
    }

    const timer = setTimeout(process, 1500);
    return () => clearTimeout(timer);
  }, [step, router]);

  if (error) {
    return (
      <div className="overflow-hidden h-screen w-screen flex flex-col items-center justify-center p-margin-mobile">
        <div className="glass-card border-2 border-error p-8 max-w-md text-center">
          <span className="material-symbols-outlined text-error text-5xl mb-4">
            error
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile text-error mb-4">
            Terjadi Kesalahan
          </h2>
          <p className="text-body-md text-on-surface-variant mb-6">{error}</p>
          <button
            onClick={() => router.push("/diagnosis-karir")}
            className="px-8 py-3 bg-primary-container text-on-primary-fixed font-label-bold border-2 border-black shadow-[4px_4px_0px_0px_#000000]"
          >
            Kembali ke Diagnosis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden h-screen w-screen flex flex-col">
      <main className="relative flex-grow flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-1/4 -left-1/4 w-[80%] h-[80%] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(0, 219, 233, 0.15) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute bottom-1/4 -right-1/4 w-[60%] h-[60%] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(0, 219, 233, 0.15) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>
        <div className="z-10 flex flex-col items-center gap-stack-lg">
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
            <div className="absolute inset-0 border-[6px] border-black rounded-full brutal-shadow bg-surface-container/40 backdrop-blur-md" />
            <div className="absolute inset-2 border-t-[6px] border-r-[6px] border-primary-container rounded-full animate-orbit" />
            <div className="bg-primary-container p-6 border-2 border-black brutal-shadow rounded-full flex items-center justify-center">
              <span
                className="material-symbols-outlined text-on-primary-container text-4xl md:text-6xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                psychology
              </span>
            </div>
          </div>
          <div className="text-center space-y-stack-sm max-w-lg">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary-container animate-blink tracking-tight min-h-[3rem] transition-opacity duration-300">
              {statuses[statusIndex]}
            </h1>
            <p className="font-body-md text-on-surface-variant opacity-80 px-4">
              {step === "roadmap"
                ? "Menyusun roadmap karir khusus untuk Anda."
                : "Mempersiapkan assessment yang dipersonalisasi."}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-base">
            <div className="px-4 py-2 bg-surface-container-highest border-2 border-black rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-mono text-label-mono uppercase tracking-widest text-primary">
                Engine: Gemini 2.5 Flash
              </span>
            </div>
            <div className="px-4 py-2 bg-surface-container-highest border-2 border-black rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse" />
              <span className="font-label-mono text-label-mono uppercase tracking-widest text-tertiary-fixed">
                {step === "questions"
                  ? "Generate Soal"
                  : step === "assess"
                  ? "Evaluasi Jawaban"
                  : "Buat Roadmap"}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary" />
          <div className="absolute top-0 left-1/4 w-[2px] h-full bg-primary" />
          <div className="absolute bottom-1/4 right-1/4 w-[100px] h-[100px] border-4 border-primary-container rotate-45" />
        </div>
      </main>
    </div>
  );
}
