import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import 'regenerator-runtime/runtime'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
