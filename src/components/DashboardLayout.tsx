"use client";

import MainNavbar from "./navbar";
import MobileNavbar from "./MobileNavbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, GitBranch, FileQuestion, Route, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: GitBranch, label: "Skill Map", href: "/skill-map" },
  { icon: FileQuestion, label: "Test Center", href: "/test-center" },
  { icon: Route, label: "Roadmaps", href: "/peta-jalan" },
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
        <aside className="hidden md:flex flex-col py-6 gap-stack-sm h-screen w-64 border-r border-border bg-card sticky top-20">
          <div className="px-6 mb-stack-md">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-label-bold text-foreground">Peserta</div>
                {tujuanKarir && (
                  <div className="text-xs text-muted-foreground">
                    {tujuanKarir}
                  </div>
                )}
              </div>
            </div>
          </div>
          <nav className="flex-grow">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all",
                    isActive
                      ? "bg-secondary text-secondary-foreground border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-label-bold">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="px-4 mt-auto">
            <Separator className="my-4" />
          </div>
        </aside>
        <main className="flex-grow px-margin-mobile md:px-margin-desktop py-stack-lg relative overflow-x-hidden animate-fade-in">
          {children}
        </main>
      </div>
      <MobileNavbar />
    </>
  );
}
