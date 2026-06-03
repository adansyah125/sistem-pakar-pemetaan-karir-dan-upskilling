"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileQuestion, Route, User } from "lucide-react";

const items = [
  { icon: Home, label: "Beranda", href: "/" },
  { icon: FileQuestion, label: "Test", href: "/diagnosis-karir" },
  { icon: Route, label: "Roadmap", href: "/peta-jalan" },
  { icon: User, label: "Profil", href: "/profil" },
];

export default function MobileNavbar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border flex justify-around items-center h-16 z-50">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-2 ${
              isActive
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? "fill-primary" : ""}`} />
            <span className="text-[10px] font-label-bold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
