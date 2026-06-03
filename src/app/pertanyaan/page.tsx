"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainNavbar from "@/components/navbar";
import { useCareerStore } from "@/store/useCareerStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";


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
    return pilihan[key] || `Opsi ${key}`;
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
        <aside className="hidden md:flex flex-col py-6 gap-stack-sm h-screen w-64 border-r border-border bg-card sticky top-20">
          <div className="px-6 mb-6">
            <div className="flex items-center gap-3 p-2 bg-accent border-2 border-black rounded-lg">
              <div className="w-10 h-10 rounded-full border-2 border-black bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-foreground">
                  person
                </span>
              </div>
              <div>
                <div className="font-label-bold text-foreground">Peserta</div>
                <div className="text-xs text-muted-foreground">
                  Assessment
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-label-bold uppercase text-xs tracking-wider">Progress</span>
              <span className="font-bold text-primary">{answeredCount}/{soalAktif.length}</span>
            </div>
            <Progress value={progress} className="h-3 border border-border rounded-none [&>*]:bg-primary" />
            <div className="flex flex-wrap gap-2 mt-4">
              {soalAktif.map((s) => (
                <div
                  key={s.nomor}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-bold border-2 rounded-none cursor-pointer transition-colors ${
                    jawaban[s.nomor]
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary"
                  }`}
                  onClick={() => {
                    document.getElementById(`soal-${s.nomor}`)?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {s.nomor}
                </div>
              ))}
            </div>
          </div>
        </aside>
        <main className="flex-grow px-margin-mobile md:px-margin-desktop py-stack-lg max-w-4xl animate-fade-in">
          <form onSubmit={handleSubmit}>
            <div className="mb-stack-lg">
              <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-foreground mb-2">
                Soal Kompetensi
              </h1>
              <p className="text-muted-foreground">
                Jawablah 10 soal berikut dengan sebaik mungkin.
              </p>
              <div className="md:hidden mt-4">
                <Progress value={progress} className="h-3 border border-border rounded-none [&>*]:bg-primary" />
                <p className="text-sm text-muted-foreground mt-1 text-right">{answeredCount}/{soalAktif.length} terjawab</p>
              </div>
            </div>

            <div className="flex flex-col gap-stack-lg">
              {soalAktif.map((soal) => (
                <div key={soal.nomor} id={`soal-${soal.nomor}`}>
                  <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-6 rounded-none">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="accent" className="text-sm px-3 py-1 rounded-none">
                        Soal {soal.nomor}
                      </Badge>
                      {soal.kategori && (
                        <Badge variant="outline" className="text-xs rounded-none border-border">
                          {soal.kategori}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-headline-lg-mobile text-foreground mb-4">
                      {soal.pertanyaan}
                    </h3>
                    <div className="flex flex-col gap-3">
                      {Object.entries(soal.pilihan).map(([key, value]) => {
                        const isSelected = jawaban[soal.nomor] === key;
                        return (
                          <label
                            key={key}
                            className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-all duration-100 ${
                              isSelected
                                ? "border-primary bg-primary/10 shadow-[4px_4px_0px_0px_#000] -translate-y-0.5 translate-x-0.5"
                                : "border-border bg-card hover:bg-accent hover:-translate-y-0.5 hover:translate-x-0.5 shadow-[4px_4px_0px_0px_#000]"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`soal-${soal.nomor}`}
                              value={key}
                              checked={isSelected}
                              onChange={() => handleSelect(soal.nomor, key)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                            }`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                            </div>
                            <span className={`font-body-md ${isSelected ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                              {getPilihanLabel(soal.pilihan, key)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            <div className="mt-stack-lg flex justify-center">
              <Button
                type="submit"
                variant="accent"
                size="xl"
                disabled={submitting}
                className="text-lg"
              >
                {submitting ? "Mengirim..." : `Kirim Jawaban (${answeredCount}/${soalAktif.length})`}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
