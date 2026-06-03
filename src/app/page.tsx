"use client";

import { useEffect } from "react";
import MainNavbar from "@/components/navbar";
import MobileNavbar from "@/components/MobileNavbar";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Brain, Zap, MapPin, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Beranda() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const glow1 = document.querySelector(".glow-1") as HTMLElement;
      const glow2 = document.querySelector(".glow-2") as HTMLElement;
      if (!glow1 || !glow2) return;
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      glow1.style.transform = `translate(${x * 50}px, ${y * 50}px)`;
      glow2.style.transform = `translate(-${x * 30}px, -${y * 30}px)`;
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <MainNavbar />
      <div className="aurora-glow">
        <div className="glow-1" />
        <div className="glow-2" />
      </div>
      <main className="pt-20 animate-fade-in">
        <section className="relative min-h-[921px] flex items-center justify-center px-margin-mobile md:px-margin-desktop py-stack-lg overflow-hidden">
          <div className="max-w-5xl text-center z-10">
            <h1 className="font-headline-xl text-[40px] md:text-headline-xl leading-[1.1] md:leading-tight mb-stack-sm text-foreground uppercase tracking-tighter">
              Petakan Karier Masa Depanmu <span className="text-primary italic">dengan AI</span>
            </h1>
            <p className="font-body-lg text-body-lg text-muted-foreground max-w-2xl mx-auto mb-stack-lg">
              Navigasi dunia kerja yang dinamis dengan sistem pakar Auralis. Temukan keunikan dirimu melalui asesmen berbasis AI dan rancang roadmap kesuksesan yang presisi.
            </p>
          </div>
          <div className="absolute -z-10 opacity-30 w-full h-full">
            <Image
    className="object-cover"
    alt="A futuristic digital career landscape visualization"
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE0cs3WI6Vlf9_OTGfuOeBElzX-vNzjSdJmGTMj1tt1eQVdsxmv60SD1zWwol2-l5_-L2oos_g6EslWYS1pTYioz7dtANbpCfompFGIw6--DnKue0iLSjx-S9tQR5EsA9CP5I78ugzF_MWnOlt2FWbp-jIfmpTtspN3bEqIofwjJwsTF30qvK_bqeJbyuVY9FlklMRdDImSNxUMXC0lKcIsucGvVuPSm5cX4QWQv6c_zpqZaArqPhCaUhjutsr5DX6gobBMCAIAjQ"
    fill
    priority
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
          </div>
        </section>
        <section className="px-margin-mobile md:px-margin-desktop py-stack-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-stack-md hover:-translate-y-1 transition-transform group rounded-none">
              <div className="w-16 h-16 bg-primary flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000] mb-stack-md group-hover:bg-accent transition-colors">
                <Brain className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-headline-lg text-headline-lg text-foreground mb-base">Sistem Pakar</h3>
              <p className="font-body-md text-body-md text-muted-foreground">
                Algoritma canggih yang mensimulasikan saran dari konsultan karier profesional untuk memberikan insight mendalam tentang potensi tersembunyimu.
              </p>
            </Card>
            <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-stack-md hover:-translate-y-1 transition-transform group rounded-none">
              <div className="w-16 h-16 bg-secondary flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000] mb-stack-md group-hover:bg-primary transition-colors">
                <Zap className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="font-headline-lg text-headline-lg text-foreground mb-base">AI Asesmen</h3>
              <p className="font-body-md text-body-md text-muted-foreground">
                Evaluasi keterampilan real-time yang adaptif. Uji kemampuanmu dalam lingkungan simulasi yang mencerminkan tantangan industri modern.
              </p>
            </Card>
            <Card className="glass-card border-2 border-black shadow-[4px_4px_0px_0px_#000] p-stack-md hover:-translate-y-1 transition-transform group rounded-none">
              <div className="w-16 h-16 bg-[hsl(90,100%,47%)] flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000] mb-stack-md group-hover:bg-secondary transition-colors">
                <MapPin className="h-8 w-8 text-[hsl(90,100%,11%)]" />
              </div>
              <h3 className="font-headline-lg text-headline-lg text-foreground mb-base">Roadmap</h3>
              <p className="font-body-md text-body-md text-muted-foreground">
                Peta jalan karier personal yang mendetail, mulai dari pemilihan kursus hingga persiapan wawancara di perusahaan impianmu.
              </p>
            </Card>
          </div>
        </section>
        <section className="bg-muted border-y-2 border-border py-stack-md overflow-hidden">
          <div className="px-margin-mobile md:px-margin-desktop mb-stack-sm">
            <span className="font-label-mono text-label-mono uppercase tracking-widest text-muted-foreground">Trusted by Global Leaders</span>
          </div>
          <div className="flex flex-nowrap gap-gutter px-margin-mobile md:px-margin-desktop opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-gutter min-w-max">
              <div className="text-2xl font-bold px-8">GOOGLE</div>
              <div className="text-2xl font-bold px-8">MICROSOFT</div>
              <div className="text-2xl font-bold px-8">AMAZON</div>
              <div className="text-2xl font-bold px-8">META</div>
              <div className="text-2xl font-bold px-8">NETFLIX</div>
              <div className="text-2xl font-bold px-8">ADOBE</div>
              <div className="text-2xl font-bold px-8">TESLA</div>
              <div className="text-2xl font-bold px-8">SPACE X</div>
            </div>
          </div>
        </section>
        <section className="px-margin-mobile md:px-margin-desktop py-stack-lg">
          <div className="glass-card border-2 border-black shadow-[8px_8px_0px_0px_#000] p-stack-lg relative overflow-hidden flex flex-col md:flex-row items-center gap-gutter rounded-none">
            <div className="flex-1 z-10">
              <h2 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-foreground mb-stack-sm leading-tight">Siap Meluncur ke Level Berikutnya?</h2>
              <p className="font-body-lg text-body-lg text-muted-foreground mb-stack-md">
                Bergabunglah dengan ribuan profesional yang telah menemukan jalur karier yang tepat dengan presisi AI Auralis.
              </p>
              <Link
                href="/masuk-daftar"
                className="inline-flex h-12 items-center justify-center rounded-none bg-primary text-primary-foreground font-headline-lg text-headline-lg px-8 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:-translate-y-1 transition-all"
              >
                Daftar Sekarang
                <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </div>
            <div className="flex-1 w-full md:w-auto h-64 border-2 border-black shadow-[4px_4px_0px_0px_#000] relative overflow-hidden">
              <Image
                priority
                fill
                className="w-full h-full object-cover"
                alt="Professional digital nomads working in a high-tech space"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5voYFkqxlRoyGsFsQ_w1P-LC4wf_VpQcvGy0s0P_a9XJXMUGtTEEadXsTBJqMj_JXe6GU1nD2xxTR-wJXEa1e5GJTWBpp8H002PHDhZTO2Z2jdV2WrNLTMOT-VFTJ8PwSBYd7AcC-7kIGPYHZDPzNoB9CD2ZRSD8ZFu4ITBodHfEc58D4A3kfr6XR6Log_TBZYU5K4Eo_UUggWnJUWuiUJDQYWyC8WQ2hRi3taPTefR5ht4Qv6Fa_O3-2extyP_N9CI1WCC1RM80"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t-2 border-border mt-stack-lg bg-card">
        <div className="flex flex-col md:flex-row justify-between items-center py-stack-md px-margin-mobile md:px-margin-desktop gap-gutter">
          <div className="flex flex-col items-center md:items-start">
            <div className="font-headline-lg-mobile text-primary text-headline-lg-mobile md:text-headline-lg mb-2">Auralis Systems</div>
            <p className="font-body-md text-body-md text-muted-foreground max-w-sm text-center md:text-left">
              &copy; 2024 Auralis Systems. Neo-Brutalism Edition.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-gutter">
            <a className="text-muted-foreground hover:text-foreground transition-colors font-body-md text-body-md" href="#">Privacy Policy</a>
            <a className="text-muted-foreground hover:text-foreground transition-colors font-body-md text-body-md" href="#">Terms of Service</a>
            <a className="text-muted-foreground hover:text-foreground transition-colors font-body-md text-body-md" href="#">API Docs</a>
            <a className="text-muted-foreground hover:text-foreground transition-colors font-body-md text-body-md" href="#">Contact Support</a>
          </div>
        </div>
      </footer>
      <MobileNavbar />
    </>
  );
}
