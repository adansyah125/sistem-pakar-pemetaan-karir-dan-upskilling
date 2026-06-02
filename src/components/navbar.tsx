"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
    setMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b-2 border-black shadow-[4px_4px_0px_0px_#000000] flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop">
      <Link href="/" className="font-headline-lg text-primary-container tracking-tighter italic">
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
                  ? "text-primary-container font-bold border-b-2 border-primary-container font-label-bold text-label-bold"
                  : "text-on-surface hover:text-primary transition-colors font-label-bold text-label-bold"
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
            <span className="hidden md:block text-sm text-on-surface-variant">
              {user.email?.split("@")[0]}
            </span>
            <button
              onClick={handleLogout}
              className="hidden md:block px-4 py-2 font-label-bold text-sm text-on-surface-variant hover:text-error transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/masuk-daftar"
            className="hidden md:block px-6 py-2 font-label-bold text-on-surface-variant hover:text-primary transition-colors"
          >
            Log In
          </Link>
        )}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 border-2 border-black text-on-surface hover:text-primary-container transition-colors"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
        >
          <span className="material-symbols-outlined">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-xl border-b-2 border-black shadow-[0_4px_0px_0px_#000000] md:hidden flex flex-col pb-4 pt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-margin-mobile py-4 font-label-bold text-label-bold border-b border-black/10 ${
                  isActive
                    ? "text-primary-container"
                    : "text-on-surface-variant"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="px-margin-mobile pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <span className="text-sm text-on-surface-variant px-1">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-surface-container text-error font-label-bold border-2 border-error shadow-[2px_2px_0px_0px_#000000]"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/masuk-daftar"
                className="w-full py-3 bg-primary-container text-on-primary-fixed font-label-bold border-2 border-black shadow-[2px_2px_0px_0px_#000000] text-center"
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
