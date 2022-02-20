import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThirdwebProvider } from "@3rdweb/react";
import Head from "next/head";
import "nprogress/nprogress.css";
import Router from "next/router";
import NProgress from "nprogress";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <NextThemeProvider attribute="class">
      <SessionProvider session={session}>
        <ThirdwebProvider
          connectors={{
            injected: {},
          }}
          supportedChainIds={[4]}
        >
          <Head>
            <title>Wordable The Modern Wordle</title>
            <link
              rel="shortcut icon"
              href="/images/logo.png"
              type="image/x-icon"
            />
          </Head>
          <Component {...pageProps} />
        </ThirdwebProvider>
      </SessionProvider>
    </NextThemeProvider>
  );
};

export default MyApp;
