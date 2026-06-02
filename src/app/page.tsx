"use client";

import { useEffect } from "react";
import MainNavbar from "@/components/navbar";
import MobileNavbar from "@/components/MobileNavbar";
import Link from "next/link";

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
            <h1 className="font-headline-xl text-[40px] md:text-headline-xl leading-[1.1] md:leading-tight mb-stack-sm text-primary uppercase tracking-tighter">
              Petakan Karier Masa Depanmu <span className="text-primary-container italic">dengan AI</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-stack-lg">
              Navigasi dunia kerja yang dinamis dengan sistem pakar Auralis. Temukan keunikan dirimu melalui asesmen berbasis AI dan rancang roadmap kesuksesan yang presisi.
            </p>
            {/* <div className="flex flex-col md:flex-row items-center justify-center gap-gutter">
              <Link
                href="/diagnosis-karir"
                className="w-full md:w-auto bg-primary-container text-on-primary-fixed font-headline-lg text-headline-lg px-10 py-4 border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 hover:translate-x-1 active:translate-y-1 active:translate-x-1 transition-all duration-100"
              >
                Mulai Tes Sekarang
              </Link>
              <Link
                href="/peta-jalan"
                className="w-full md:w-auto bg-surface-container text-on-surface font-headline-lg text-headline-lg px-10 py-4 border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 hover:translate-x-1 active:translate-y-1 active:translate-x-1 transition-all duration-100"
              >
                Lihat Roadmap
              </Link>
            </div> */}
          </div>
          <div className="absolute -z-10 opacity-30 w-full h-full">
            <img
              className="w-full h-full object-cover"
              alt="A futuristic digital career landscape visualization"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE0cs3WI6Vlf9_OTGfuOeBElzX-vNzjSdJmGTMj1tt1eQVdsxmv60SD1zWwol2-l5_-L2oos_g6EslWYS1pTYioz7dtANbpCfompFGIw6--DnKue0iLSjx-S9tQR5EsA9CP5I78ugzF_MWnOlt2FWbp-jIfmpTtspN3bEqIofwjJwsTF30qvK_bqeJbyuVY9FlklMRdDImSNxUMXC0lKcIsucGvVuPSm5cX4QWQv6c_zpqZaArqPhCaUhjutsr5DX6gobBMCAIAjQ"
            />
          </div>
        </section>
        <section className="px-margin-mobile md:px-margin-desktop py-stack-lg">
          {/* <div className="mb-stack-lg">
            <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-primary-fixed-dim">Solusi Cerdas Kami</h2>
            <div className="h-1 w-24 bg-primary-container mt-2" />
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="glass-card p-stack-md border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 transition-transform group">
              <div className="w-16 h-16 bg-primary-container flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000000] mb-stack-md group-hover:bg-tertiary-container transition-colors">
                <span className="material-symbols-outlined text-4xl text-on-primary-container">psychology</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg text-primary mb-base">Sistem Pakar</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Algoritma canggih yang mensimulasikan saran dari konsultan karier profesional untuk memberikan insight mendalam tentang potensi tersembunyimu.
              </p>
            </div>
            <div className="glass-card p-stack-md border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 transition-transform group">
              <div className="w-16 h-16 bg-secondary-container flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000000] mb-stack-md group-hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-4xl text-on-secondary-container">bolt</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg text-secondary mb-base">AI Asesmen</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Evaluasi keterampilan real-time yang adaptif. Uji kemampuanmu dalam lingkungan simulasi yang mencerminkan tantangan industri modern.
              </p>
            </div>
            <div className="glass-card p-stack-md border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 transition-transform group">
              <div className="w-16 h-16 bg-tertiary-container flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000000] mb-stack-md group-hover:bg-secondary-container transition-colors">
                <span className="material-symbols-outlined text-4xl text-on-tertiary-container">map</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg text-tertiary mb-base">Roadmap</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Peta jalan karier personal yang mendetail, mulai dari pemilihan kursus hingga persiapan wawancara di perusahaan impianmu.
              </p>
            </div>
          </div>
        </section>
        <section className="bg-surface-container-low border-y-2 border-black py-stack-md overflow-hidden">
          <div className="px-margin-mobile md:px-margin-desktop mb-stack-sm">
            <span className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant">Trusted by Global Leaders</span>
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
          <div className="glass-card border-2 border-black shadow-[8px_8px_0px_0px_#000000] p-stack-lg relative overflow-hidden flex flex-col md:flex-row items-center gap-gutter">
            <div className="flex-1 z-10">
              <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-primary mb-stack-sm leading-tight">Siap Meluncur ke Level Berikutnya?</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-md">
                Bergabunglah dengan ribuan profesional yang telah menemukan jalur karier yang tepat dengan presisi AI Auralis.
              </p>
              <Link
                href="/masuk-daftar"
                className="inline-block bg-primary-container text-on-primary-fixed font-headline-lg text-headline-lg px-8 py-3 border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:-translate-y-1 transition-all"
              >
                Daftar Sekarang
              </Link>
            </div>
            <div className="flex-1 w-full md:w-auto h-64 border-2 border-black shadow-[4px_4px_0px_0px_#000000] relative overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="Professional digital nomads working in a high-tech space"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5voYFkqxlRoyGsFsQ_w1P-LC4wf_VpQcvGy0s0P_a9XJXMUGtTEEadXsTBJqMj_JXe6GU1nD2xxTR-wJXEa1e5GJTWBpp8H002PHDhZTO2Z2jdV2WrNLTMOT-VFTJ8PwSBYd7AcC-7kIGPYHZDPzNoB9CD2ZRSD8ZFu4ITBodHfEc58D4A3kfr6XR6Log_TBZYU5K4Eo_UUggWnJUWuiUJDQYWyC8WQ2hRi3taPTefR5ht4Qv6Fa_O3-2extyP_N9CI1WCC1RM80"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t-2 border-black mt-stack-lg bg-surface-container-lowest dark:bg-surface-container-lowest">
        <div className="flex flex-col md:flex-row justify-between items-center py-stack-md px-margin-mobile md:px-margin-desktop gap-gutter">
          <div className="flex flex-col items-center md:items-start">
            <div className="font-headline-lg-mobile text-primary text-headline-lg-mobile md:text-headline-lg mb-2">Auralis Systems</div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm text-center md:text-left">
              &copy; 2024 Auralis Systems. Neo-Brutalism Edition.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-gutter">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Terms of Service</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">API Docs</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Contact Support</a>
          </div>
        </div>
      </footer>
      <MobileNavbar />
    </>
  );
}
