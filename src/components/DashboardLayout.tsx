"use client";

import MainNavbar from "./navbar";
import MobileNavbar from "./MobileNavbar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "account_tree", label: "Skill Map", href: "/skill-map" },
  { icon: "quiz", label: "Test Center", href: "/test-center" },
  { icon: "alt_route", label: "Roadmaps", href: "/peta-jalan" },
];

export default function DashboardLayout({
  children,
  tujuanKarir,
}: {
  children: React.ReactNode;
  tujuanKarir?: string | null;
}) {
  const pathname = usePathname();

  return (
    <>
      <MainNavbar />
      <div className="flex pt-20">
        <aside className="hidden md:flex flex-col py-6 gap-stack-sm h-screen w-64 border-r-2 border-black bg-surface-container shadow-[4px_0px_0px_0px_#000000] sticky top-20">
          <div className="px-6 mb-stack-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full border-2 border-black bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container">
                  person
                </span>
              </div>
              <div>
                <div className="font-label-bold text-on-surface">Peserta</div>
                {tujuanKarir && (
                  <div className="text-xs text-on-surface-variant">
                    {tujuanKarir}
                  </div>
                )}
              </div>
            </div>
          </div>
          <nav className="flex-grow">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-transform hover:translate-x-1 ${
                    isActive
                      ? "bg-secondary-container text-on-secondary-container border-2 border-black shadow-[2px_2px_0px_0px_#000000]"
                      : "text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="font-label-bold">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-grow px-margin-mobile md:px-margin-desktop py-stack-lg relative overflow-x-hidden animate-fade-in">
          {children}
        </main>
      </div>
      <MobileNavbar />
    </>
  );
}
