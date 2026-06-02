"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { icon: "home", label: "Beranda", href: "/" },
  { icon: "quiz", label: "Test", href: "/diagnosis-karir" },
  { icon: "alt_route", label: "Roadmap", href: "/peta-jalan" },
  { icon: "person", label: "Profil", href: "/profil" },
];

export default function MobileNavbar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t-2 border-black flex justify-around items-center h-16 z-50">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-2 ${
              isActive
                ? "text-primary-container"
                : "text-on-surface-variant"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={
                isActive
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-label-bold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
