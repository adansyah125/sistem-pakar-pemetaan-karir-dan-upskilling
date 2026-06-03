"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainNavbar from "@/components/navbar";
import MobileNavbar from "@/components/MobileNavbar";
import { useCareerStore } from "@/store/useCareerStore";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Plus, X, Info, Check } from "lucide-react";

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
          <Progress value={(step / 3) * 100} className="h-4 border-2 border-border shadow-[2px_2px_0px_0px_#000] rounded-none [&>*]:bg-primary [&>*]:shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
          <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-6 md:p-10 flex flex-col gap-stack-md rounded-none">
            {step === 1 && (
              <>
                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className="text-xs uppercase tracking-widest w-fit border-foreground/20 text-muted-foreground">
                    Langkah 1 dari 3
                  </Badge>
                  <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground leading-tight">
                    Apa minat utama Anda dalam teknologi?
                  </h1>
                  <p className="text-muted-foreground text-sm">
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
                        className={`group flex items-start gap-4 p-4 border-2 border-black transition-all shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:translate-x-1 duration-100 text-left rounded-none ${
                          selected
                            ? "option-selected"
                            : "bg-card hover:bg-accent hover:-translate-y-0.5 hover:translate-x-0.5"
                        }`}
                      >
                        <span
                          className={`font-headline-lg text-xl w-10 h-10 flex items-center justify-center shrink-0 border ${
                            selected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-black text-primary border-primary/20"
                          }`}
                        >
                          {selected ? <Check className="h-5 w-5" /> : opt.label[0]}
                        </span>
                        <div className="flex flex-col text-left">
                          <span className="font-label-bold text-foreground">
                            {opt.label}
                          </span>
                          <span className="text-body-md text-muted-foreground text-sm mt-1">
                            {opt.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-end mt-6">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    variant="accent"
                    size="xl"
                  >
                    Selanjutnya
                    <ArrowRight className="h-5 w-5 ml-1" />
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className="text-xs uppercase tracking-widest w-fit border-foreground/20 text-muted-foreground">
                    Langkah 2 dari 3
                  </Badge>
                  <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground leading-tight">
                    Ada minat lain? Tulis di sini
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Jika ada bidang lain yang Anda minati tapi tidak tercantum,
                    tuliskan di bawah ini (opsional).
                  </p>
                </div>
                <textarea
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder="Contoh: Blockchain, Game Development, AR/VR, Quantum Computing..."
                  className="w-full p-4 border-2 border-border bg-card text-foreground font-body-md resize-none h-32 focus:outline-none focus:border-primary transition-colors rounded-none"
                />
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    variant="ghost"
                    size="lg"
                    className="text-muted-foreground"
                  >
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    Kembali
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    variant="accent"
                    size="xl"
                  >
                    Selanjutnya
                    <ArrowRight className="h-5 w-5 ml-1" />
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className="text-xs uppercase tracking-widest w-fit border-foreground/20 text-muted-foreground">
                    Langkah 3 dari 3
                  </Badge>
                  <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground leading-tight">
                    Skill yang sudah Anda miliki
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Tambahkan skill teknologi yang sudah Anda kuasai. Tekan Enter
                    untuk menambahkan.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Contoh: JavaScript, Figma, Python..."
                    className="flex-1 h-12 border-2 border-border bg-card text-foreground focus:border-primary rounded-none"
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    variant="secondary"
                    className="h-12 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-none"
                  >
                    <Plus className="h-5 w-5 mr-1" />
                    Tambah
                  </Button>
                </div>
                {skillList.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {skillList.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="flex items-center gap-2 px-4 py-2 text-sm border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-none text-secondary-foreground"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-destructive hover:text-destructive/80 transition-colors ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                {error && (
                  <div className="p-4 bg-destructive/10 border-2 border-destructive text-destructive font-body-md text-sm">
                    {error}
                  </div>
                )}
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    variant="ghost"
                    size="lg"
                    className="text-muted-foreground"
                  >
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    Kembali
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    variant="accent"
                    size="xl"
                  >
                    {loading ? "Memproses..." : "Mulai Assessment"}
                  </Button>
                </div>
              </>
            )}
          </Card>
          <div className="flex items-center gap-3 bg-card/50 p-4 border border-border/30 rounded-lg">
            <Info className="h-5 w-5 text-muted-foreground shrink-0" />
            <p className="text-body-md text-muted-foreground text-sm italic">
              Jawaban Anda membantu Auralis AI memetakan jalur karier teknis
              yang paling relevan dengan potensi Anda.
            </p>
          </div>
        </div>
      </main>

      <div className="fixed top-[10%] right-[5%] w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="fixed bottom-[15%] left-[5%] w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10" />
      <MobileNavbar />
    </div>
  );
}
