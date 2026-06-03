"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Diagnosis", href: "/diagnosis-karir" },
  { label: "Peta-Jalan", href: "/peta-jalan" },
  { label: "Profil", href: "/profil" },
];

export default function MainNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) setUser({ email: u.email || "" });
    });
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setMenuOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop">
      <Link href="/" className="font-headline-lg text-primary tracking-tighter italic">
        Auralis Career
      </Link>
      <div className="hidden md:flex items-center gap-gutter">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "text-primary font-bold border-b-2 border-primary font-label-bold text-label-bold"
                  : "text-muted-foreground hover:text-foreground transition-colors font-label-bold text-label-bold"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-stack-sm">
        {user ? (
          <>
            <span className="hidden md:block text-sm text-muted-foreground">
              {user.email?.split("@")[0]}
            </span>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="hidden md:flex text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </>
        ) : (
          <Link
            href="/masuk-daftar"
            className="hidden md:inline-flex h-9 px-4 items-center justify-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Log In
          </Link>
        )}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 border border-border text-muted-foreground hover:text-foreground transition-colors rounded-md"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border md:hidden flex flex-col pb-4 pt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-margin-mobile py-4 font-label-bold text-label-bold border-b border-border/10 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="px-margin-mobile pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground px-1">
                  {user.email}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full text-destructive border-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link
                href="/masuk-daftar"
                className="w-full inline-flex h-11 items-center justify-center rounded-md bg-primary text-primary-foreground font-label-bold border-2 border-black shadow-[2px_2px_0px_0px_#000] text-center"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
