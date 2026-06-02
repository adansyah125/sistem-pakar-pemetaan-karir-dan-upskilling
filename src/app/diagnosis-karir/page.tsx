"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainNavbar from "@/components/navbar";
import MobileNavbar from "@/components/MobileNavbar";
import { useCareerStore } from "@/store/useCareerStore";
import { supabase } from "@/lib/supabase";

const MINAT_OPTIONS = [
  {
    id: "pengembangan-perangkat-lunak",
    label: "Pengembangan Perangkat Lunak",
    desc: "Membangun aplikasi, sistem, dan arsitektur kode yang efisien.",
  },
  {
    id: "ai",
    label: "Kecerdasan Buatan (AI)",
    desc: "Analisis data, machine learning, dan otomasi cerdas.",
  },
  {
    id: "keamanan-siber",
    label: "Keamanan Siber",
    desc: "Melindungi infrastruktur digital dan mitigasi ancaman global.",
  },
  {
    id: "ui-ux",
    label: "Desain UI/UX",
    desc: "Menciptakan antarmuka yang intuitif dan berpusat pada manusia.",
  },
  {
    id: "mobile",
    label: "Pengembangan Mobile",
    desc: "Membangun aplikasi iOS dan Android yang responsif.",
  },
  {
    id: "data-science",
    label: "Data Science",
    desc: "Mengolah data besar untuk insight bisnis dan prediksi.",
  },
  {
    id: "cloud-devops",
    label: "Cloud & DevOps",
    desc: "Infrastruktur cloud, CI/CD, dan otomatisasi deployment.",
  },
  {
    id: "iot",
    label: "Internet of Things (IoT)",
    desc: "Sistem embedded, sensor, dan konektivitas perangkat.",
  },
];

type Step = 1 | 2 | 3;

export default function DiagnosisKarir() {
  const router = useRouter();
  const { minat, setMinat } = useCareerStore();

  const [step, setStep] = useState<Step>(1);
  const [pilihan, setPilihan] = useState<string[]>(minat.pilihan);
  const [custom, setCustom] = useState(minat.custom);
  const [skillInput, setSkillInput] = useState("");
  const [skillList, setSkillList] = useState<string[]>(minat.skill);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function togglePilihan(id: string) {
    setPilihan((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function addSkill() {
    const s = skillInput.trim();
    if (s && !skillList.includes(s)) {
      setSkillList((prev) => [...prev, s]);
      setSkillInput("");
    }
  }

  function removeSkill(skill: string) {
    setSkillList((prev) => prev.filter((s) => s !== skill));
  }

  async function handleSubmit() {
    const newMinat = { pilihan, custom, skill: skillList };
    setMinat(newMinat);
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/masuk-daftar");
        return;
      }

      const res = await fetch("/api/gemini/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minat: newMinat, userId: user.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mendiagnosis");
      }

      useCareerStore.getState().setDiagnosisResult(data.result, data.sessionId);
      router.push("/loading?step=questions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <div className="fixed inset-0 aurora-bg z-0 pointer-events-none" />
      <MainNavbar />
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-margin-mobile z-10 animate-fade-in">
        <div className="w-full max-3xl flex flex-col gap-stack-md">
          <div className="w-full bg-surface-container-highest border-2 border-black h-4 overflow-hidden shadow-[2px_2px_0px_0px_#000000]">
            <div
              className="h-full bg-primary-container progress-neon transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
          <div className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6 md:p-10 flex flex-col gap-stack-md">
            {step === 1 && (
              <>
                <div className="flex flex-col gap-2">
                  <span className="text-primary-fixed-dim font-label-bold uppercase tracking-widest text-xs">
                    Langkah 1 dari 3
                  </span>
                  <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface leading-tight">
                    Apa minat utama Anda dalam teknologi?
                  </h1>
                  <p className="text-on-surface-variant text-sm">
                    Pilih satu atau lebih bidang yang paling menarik bagi Anda.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {MINAT_OPTIONS.map((opt) => {
                    const selected = pilihan.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => togglePilihan(opt.id)}
                        className={`group flex items-start gap-4 p-4 border-2 border-black transition-all shadow-[4px_4px_0px_0px_#000000] active:translate-y-1 active:translate-x-1 duration-100 text-left ${
                          selected
                            ? "option-selected bg-primary-container/20"
                            : "bg-surface-container-low hover:bg-surface-container-high hover:-translate-y-0.5 hover:translate-x-0.5"
                        }`}
                      >
                        <span
                          className={`font-headline-lg text-xl w-10 h-10 flex items-center justify-center shrink-0 border ${
                            selected
                              ? "bg-primary-container text-black border-primary-container"
                              : "bg-black text-primary-container border-primary-container/20"
                          }`}
                        >
                          {selected ? "✓" : opt.label[0]}
                        </span>
                        <div className="flex flex-col text-left">
                          <span className="font-label-bold text-on-surface">
                            {opt.label}
                          </span>
                          <span className="text-body-md text-on-surface-variant text-sm mt-1">
                            {opt.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-10 py-3 bg-primary-container text-on-primary-fixed font-headline-lg text-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 hover:translate-x-1 transition-all active:translate-y-0 active:translate-x-0"
                  >
                    Selanjutnya
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex flex-col gap-2">
                  <span className="text-primary-fixed-dim font-label-bold uppercase tracking-widest text-xs">
                    Langkah 2 dari 3
                  </span>
                  <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface leading-tight">
                    Ada minat lain? Tulis di sini
                  </h1>
                  <p className="text-on-surface-variant text-sm">
                    Jika ada bidang lain yang Anda minati tapi tidak tercantum,
                    tuliskan di bawah ini (opsional).
                  </p>
                </div>
                <textarea
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder="Contoh: Blockchain, Game Development, AR/VR, Quantum Computing..."
                  className="w-full p-4 border-2 border-black bg-surface-container-low text-on-surface font-body-md resize-none h-32 focus:outline-none focus:border-primary-container transition-colors"
                />
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-8 py-3 font-label-bold text-on-surface-variant hover:text-primary transition-colors border-2 border-transparent"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-10 py-3 bg-primary-container text-on-primary-fixed font-headline-lg text-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 hover:translate-x-1 transition-all active:translate-y-0 active:translate-x-0"
                  >
                    Selanjutnya
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="flex flex-col gap-2">
                  <span className="text-primary-fixed-dim font-label-bold uppercase tracking-widest text-xs">
                    Langkah 3 dari 3
                  </span>
                  <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface leading-tight">
                    Skill yang sudah Anda miliki
                  </h1>
                  <p className="text-on-surface-variant text-sm">
                    Tambahkan skill teknologi yang sudah Anda kuasai. Tekan Enter
                    untuk menambahkan.
                  </p>
                </div>
                <div className="flex gap-3">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Contoh: JavaScript, Figma, Python..."
                    className="flex-1 p-4 border-2 border-black bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:border-primary-container transition-colors"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-6 py-3 bg-secondary-container text-on-secondary-container font-label-bold border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:-translate-y-0.5 hover:translate-x-0.5 transition-all"
                  >
                    Tambah
                  </button>
                </div>
                {skillList.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {skillList.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest border-2 border-black shadow-[2px_2px_0px_0px_#000000]"
                      >
                        <span className="font-label-bold text-sm">{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-error hover:text-error/80 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {error && (
                  <div className="p-4 bg-error/10 border-2 border-error text-error font-body-md">
                    {error}
                  </div>
                )}
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-8 py-3 font-label-bold text-on-surface-variant hover:text-primary transition-colors border-2 border-transparent"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-10 py-3 bg-primary-container text-on-primary-fixed font-headline-lg text-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 hover:translate-x-1 transition-all active:translate-y-0 active:translate-x-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Memproses..." : "Mulai Assessment"}
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 bg-surface-container-lowest/50 p-4 border border-outline-variant/30 rounded-lg">
            <span
              className="material-symbols-outlined text-primary-fixed-dim"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              info
            </span>
            <p className="text-body-md text-on-surface-variant text-sm italic">
              Jawaban Anda membantu Auralis AI memetakan jalur karier teknis
              yang paling relevan dengan potensi Anda.
            </p>
          </div>
        </div>
      </main>
      
      <div className="fixed top-[10%] right-[5%] w-96 h-96 bg-secondary-container/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="fixed bottom-[15%] left-[5%] w-80 h-80 bg-primary-fixed-dim/10 rounded-full blur-[100px] -z-10" />
      <MobileNavbar />
    </div>
  );
}
