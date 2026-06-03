"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MainNavbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, LogIn, UserPlus } from "lucide-react";

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
          <Card className="glass-card border-2 border-black shadow-[8px_8px_0px_0px_#000] p-8 md:p-10 rounded-none">
            <div className="text-center mb-8">
              <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-foreground mb-2">
                {mode === "login" ? "Masuk" : "Daftar"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {mode === "login"
                  ? "Masuk ke akun Auralis Anda"
                  : "Buat akun baru untuk memulai"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nama@email.com"
                  className="h-12 border-2 border-border bg-card text-foreground focus:border-primary rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                  className="h-12 border-2 border-border bg-card text-foreground focus:border-primary rounded-none"
                />
              </div>

              {error && (
                <div
                  className={`p-4 border-2 font-body-md text-sm ${
                    error.includes("berhasil")
                      ? "bg-[hsl(90,100%,47%)]/20 border-[hsl(90,100%,47%)] text-[hsl(90,100%,11%)]"
                      : "bg-destructive/10 border-destructive text-destructive"
                  }`}
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                variant="accent"
                size="xl"
                className="w-full h-12"
              >
                {loading
                  ? "Memproses..."
                  : mode === "login"
                  ? <><LogIn className="h-5 w-5 mr-2" /> Masuk</>
                  : <><UserPlus className="h-5 w-5 mr-2" /> Daftar</>}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setError("");
                  }}
                  className="text-primary font-label-bold underline hover:text-primary/80 transition-colors"
                >
                  {mode === "login" ? "Daftar" : "Masuk"}
                </button>
              </p>
            </div>
          </Card>
          <div className="flex items-center gap-3 bg-card/50 p-4 border border-border/30 rounded-lg mt-6">
            <Lock className="h-5 w-5 text-muted-foreground shrink-0" />
            <p className="text-body-md text-muted-foreground text-sm italic">
              Data Anda aman dengan enkripsi end-to-end Auralis.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
