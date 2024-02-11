import type { AppProps } from "next/app"
import { ToastProvider } from "../components/Toast/provider"
import "../styles/globals.css"
import "../worker/clock"

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ToastProvider>
            <Component {...pageProps} />
        </ToastProvider>
    )
}
