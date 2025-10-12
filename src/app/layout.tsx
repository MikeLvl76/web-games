import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StorageProvider } from "@/components/provider/storage";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web games",
  description: "Play games in your browser!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StorageProvider>
          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <main className="flex-1">
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>
        </StorageProvider>
      </body>
    </html>
  );
}
