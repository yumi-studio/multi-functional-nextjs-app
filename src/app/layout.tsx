import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { Geist, Geist_Mono } from "next/font/google";
import { Flip, ToastContainer } from "react-toastify";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { APP_NAME } from "./lib/config";

import "@/app/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-toastify/dist/ReactToastify.css";


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
    template: `%s | ${APP_NAME}`,
    default: APP_NAME
  },
  description: "It's never too late to learn new things.",
}

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
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppRouterCacheProvider>
          <NextIntlClientProvider>
            {/* <AppProvider> */}
            {/* <ThemeProvider defaultTheme="light" attribute='class' storageKey="theme"> */}
            {/* <AuthProvider> */}
            {children}
            {/* </AuthProvider> */}
            {/* </ThemeProvider> */}
            {/* </AppProvider> */}
          </NextIntlClientProvider>
        </AppRouterCacheProvider>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          theme="light"
          transition={Flip}
        />
      </body>
    </html>
  );
}
