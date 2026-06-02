import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'CareerPath AI - Sistem Pakar Pemetaan Karir & Upskilling',
  description: 'Temukan karir digital yang cocok untuk Anda lewat analisis sistem pakar dan uji kompetensi dinamis berbasis AI untuk mengatasi skill gap.',
  keywords: ['sistem pakar karir', 'pemetaan karir', 'upskilling gratis', 'tes kerja AI', 'skill gap analysis'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-body-md text-body-md selection:bg-primary-container selection:text-on-primary-container bg-background text-on-background">
        {children}
      </body>
    </html>
  );
}
