import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import PWARegister from "@/components/PWARegister";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <LanguageProvider>
          <Head>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#000000" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          </Head>
          <div className="min-h-full flex flex-col transition-colors duration-300 dark:bg-slate-950 dark:text-white font-sans">
            <PWARegister />
            <Component {...pageProps} />
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
