"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MainNavbar from "@/components/navbar";

export default function MasukDaftar() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setError("Akun berhasil dibuat! Silakan cek email Anda untuk verifikasi.");
        setTimeout(() => setMode("login"), 2000);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push("/diagnosis-karir");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <div className="fixed inset-0 aurora-bg z-0 pointer-events-none" />
      <MainNavbar />
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-margin-mobile z-10">
        <div className="w-full max-w-md">
          <div className="glass-card border-2 border-black shadow-[8px_8px_0px_0px_#000000] p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-primary mb-2">
                {mode === "login" ? "Masuk" : "Daftar"}
              </h1>
              <p className="text-on-surface-variant text-sm">
                {mode === "login"
                  ? "Masuk ke akun Auralis Anda"
                  : "Buat akun baru untuk memulai"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="font-label-bold text-xs uppercase tracking-wider text-on-surface-variant mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nama@email.com"
                  className="w-full p-4 border-2 border-black bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:border-primary-container transition-colors"
                />
              </div>
              <div>
                <label className="font-label-bold text-xs uppercase tracking-wider text-on-surface-variant mb-2 block">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                  className="w-full p-4 border-2 border-black bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:border-primary-container transition-colors"
                />
              </div>

              {error && (
                <div
                  className={`p-4 border-2 font-body-md text-sm ${
                    error.includes("berhasil")
                      ? "bg-tertiary-container/20 border-tertiary-container text-tertiary-fixed"
                      : "bg-error/10 border-error text-error"
                  }`}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary-container text-on-primary-fixed font-headline-lg text-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 hover:translate-x-1 transition-all active:translate-y-0 active:translate-x-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Memproses..."
                  : mode === "login"
                  ? "Masuk"
                  : "Daftar"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-on-surface-variant text-sm">
                {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setError("");
                  }}
                  className="text-primary-container font-label-bold underline hover:text-primary-fixed-dim transition-colors"
                >
                  {mode === "login" ? "Daftar" : "Masuk"}
                </button>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-surface-container-lowest/50 p-4 border border-outline-variant/30 rounded-lg mt-6">
            <span
              className="material-symbols-outlined text-primary-fixed-dim"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock
            </span>
            <p className="text-body-md text-on-surface-variant text-sm italic">
              Data Anda aman dengan enkripsi end-to-end Auralis.
            </p>
          </div>
        </div>
      </main>
     
    </div>
  );
}
