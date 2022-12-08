import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider} from 'react-query';
import Head from 'next/head';
import Nav from '../components/Nav';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import { useState } from 'react';


const queryClient = new QueryClient();

export default function App({Component, pageProps }: AppProps<{ initialSession: Session}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  return (
    <>
      <Head>
          <title>MyMovies</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/movie.png" />
      </Head>
      <Nav />
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </SessionContextProvider>
    </>
  )
}
