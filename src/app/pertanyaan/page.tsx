"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainNavbar from "@/components/navbar";
import { useCareerStore } from "@/store/useCareerStore";
import type { SoalKompetensi } from "@/types/career";

const LABEL_OPTIONS: Record<string, string> = {
  A: "Pilihan A",
  B: "Pilihan B",
  C: "Pilihan C",
  D: "Pilihan D",
};

export default function Pertanyaan() {
  const router = useRouter();
  const { soalAktif, jawaban, setJawaban } = useCareerStore();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (soalAktif.length === 0) {
      router.push("/diagnosis-karir");
    }
  }, [soalAktif, router]);

  const answeredCount = Object.keys(jawaban).length;
  const progress = soalAktif.length > 0 ? (answeredCount / soalAktif.length) * 100 : 0;

  function handleSelect(nomor: number, value: string) {
    setJawaban(nomor, value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (answeredCount < soalAktif.length) {
      alert(`Harap jawab semua soal (${answeredCount}/${soalAktif.length})`);
      return;
    }

    setSubmitting(true);
    router.push("/loading?step=assess");
  }

  if (soalAktif.length === 0) {
    return null;
  }

  const getPilihanLabel = (pilihan: Record<string, string>, key: string) => {
    return pilihan[key] || LABEL_OPTIONS[key] || `Opsi ${key}`;
  };

  return (
    <>
      <MainNavbar />
      <div
        className="aurora-bg"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          overflow: "hidden",
        }}
      >
        <div
          className="aurora-orb"
          style={{
            position: "absolute",
            filter: "blur(100px)",
            opacity: 0.4,
            borderRadius: "100%",
            backgroundColor: "rgba(182, 0, 248, 0.2)",
            width: "500px",
            height: "500px",
            top: "-80px",
            left: "-80px",
          }}
        />
        <div
          className="aurora-orb"
          style={{
            position: "absolute",
            filter: "blur(100px)",
            opacity: 0.2,
            borderRadius: "100%",
            backgroundColor: "rgba(0, 240, 255, 0.15)",
            width: "400px",
            height: "400px",
            bottom: "40px",
            right: "40px",
          }}
        />
      </div>
      <div className="flex pt-20 min-h-screen">
        <aside className="hidden md:flex flex-col py-6 gap-stack-sm h-screen w-64 border-r-2 border-black bg-surface-container shadow-[4px_0px_0px_0px_#000000] sticky top-20">
          <div className="px-6 mb-6">
            <div className="flex items-center gap-3 p-2 bg-surface-container-highest border-2 border-black rounded-lg">
              <div className="w-10 h-10 rounded-full border-2 border-black bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container text-lg">
                  person
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="font-label-bold text-label-bold text-on-surface truncate">
                  Peserta Assessment
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  {soalAktif[0]?.kategori || "Kompetensi"}
                </p>
              </div>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <div className="text-on-surface-variant hover:bg-surface-container-highest px-4 py-3 mx-2 rounded-lg transition-all flex items-center gap-3">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-bold">Dashboard</span>
            </div>
            <div className="bg-secondary-container text-on-secondary-container border-2 border-black shadow-[2px_2px_0px_0px_#000000] ml-2 mr-2 px-4 py-3 rounded-lg flex items-center gap-3">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                quiz
              </span>
              <span className="font-label-bold">Test Center</span>
            </div>
          </nav>
          <div className="mt-auto px-6">
            <div className="bg-surface-container-highest border-2 border-black p-3">
              <div className="text-xs font-label-bold text-on-surface-variant uppercase tracking-wider mb-2">
                Progress
              </div>
              <div className="w-full h-2 bg-surface-container border-2 border-black">
                <div
                  className="h-full bg-primary-container transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-on-surface-variant mt-1 text-right">
                {answeredCount}/{soalAktif.length}
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 px-margin-mobile md:px-margin-desktop py-stack-lg max-w-5xl mx-auto">
          <header className="mb-stack-lg">
            <div className="flex items-center gap-2 text-primary-fixed-dim mb-2">
              <span className="material-symbols-outlined">bolt</span>
              <span className="font-label-bold uppercase tracking-widest">
                AI Assessment In-Progress
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary mb-4">
              Evaluasi Kompetensi
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Jawab 10 soal kompetensi yang telah dirumuskan khusus oleh AI
              berdasarkan minat Anda.
            </p>
          </header>
          <form
            className="flex flex-col gap-gutter"
            onSubmit={handleSubmit}
          >
            {soalAktif.map((soal, index) => {
              const colorClasses = [
                "bg-primary-container",
                "bg-secondary-container",
                "bg-tertiary-container",
                "bg-primary-container",
                "bg-secondary-container",
                "bg-tertiary-container",
                "bg-primary-container",
                "bg-secondary-container",
                "bg-tertiary-container",
                "bg-primary-container",
              ];
              return (
                <div
                  key={soal.nomor}
                  className="glass-card p-stack-md border-2 border-black shadow-[4px_4px_0px_0px_#000000] relative group transition-transform hover:-translate-y-1"
                >
                  <div
                    className={`absolute -top-4 -left-4 w-12 h-12 ${colorClasses[index]} text-on-primary-container border-2 border-black shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center font-headline-lg-mobile italic`}
                  >
                    {soal.nomor}
                  </div>
                  <div className="mt-4">
                    <p className="font-headline-lg-mobile text-headline-lg-mobile mb-gutter">
                      {soal.pertanyaan}
                    </p>
                    <div className="grid gap-3">
                      {Object.entries(soal.pilihan).map(([key, value]) => (
                        <label
                          key={key}
                          className={`flex items-center gap-4 p-4 border-2 border-black cursor-pointer transition-colors ${
                            jawaban[soal.nomor] === key
                              ? "bg-primary-container/20 option-selected"
                              : "bg-surface-container-low hover:bg-surface-container-highest"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q${soal.nomor}`}
                            value={key}
                            checked={jawaban[soal.nomor] === key}
                            onChange={() => handleSelect(soal.nomor, key)}
                            className="hidden custom-radio"
                          />
                          <span
                            className={`radio-marker w-6 h-6 border-2 border-black rounded-full transition-all flex items-center justify-center ${
                              jawaban[soal.nomor] === key
                                ? "bg-primary-container border-primary-container"
                                : ""
                            }`}
                          >
                            {jawaban[soal.nomor] === key && (
                              <span className="text-black text-xs font-bold">
                                ✓
                              </span>
                            )}
                          </span>
                          <span className="font-body-md text-body-md">
                            <span className="font-label-bold mr-2">{key}.</span>
                            {value}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="mt-stack-lg border-t-4 border-black pt-stack-lg flex flex-col items-center gap-gutter">
              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto px-16 py-6 bg-primary-container text-on-primary-container font-headline-lg border-4 border-black shadow-[8px_8px_0px_0px_#000000] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[12px_12px_0px_0px_#000000] transition-all active:translate-y-2 active:translate-x-2 active:shadow-[4px_4px_0px_0px_#000000] uppercase tracking-tighter disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Mengirim..." : "Kirim Jawaban"}
              </button>
            </div>
          </form>
        </main>
      </div>
      <footer className="w-full border-t-2 border-black mt-stack-lg bg-surface-container-lowest flex flex-col md:flex-row justify-between items-center py-stack-md px-margin-mobile md:px-margin-desktop gap-gutter">
        <div className="flex items-center gap-2">
          <span className="font-headline-lg-mobile text-primary">Auralis</span>
          <span className="text-on-surface-variant text-sm">
            &copy; 2024 AI Edition.
          </span>
        </div>
        <div className="flex gap-6">
          <a
            className="font-body-md text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="font-body-md text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Terms of Service
          </a>
        </div>
      </footer>
    </>
  );
}
