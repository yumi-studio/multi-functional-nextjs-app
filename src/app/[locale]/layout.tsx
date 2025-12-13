import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";
import Loading from "@/app/[locale]/loading";
import { AuthProvider } from "@/app/context/AuthContext";
import { AppProvider } from "../context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | Duy's NextGen`,
    default: "Duy's NextGen",
  },
  description: "It's never too late to learn new things.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-sm`}>
        <NextIntlClientProvider>
          <AppProvider>
            <AuthProvider>
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </AuthProvider>
          </AppProvider>
        </NextIntlClientProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
