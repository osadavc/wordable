import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import "nprogress/nprogress.css";

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Wordable The Modern Wordle</title>
        <link rel="shortcut icon" href="/images/logo.png" type="image/x-icon" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default MyApp;
