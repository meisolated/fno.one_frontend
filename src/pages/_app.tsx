import { createTheme, NextUIProvider } from "@nextui-org/react"
import type { AppProps } from "next/app"
import "../styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
    const theme = createTheme({
        type: "dark",
        theme: {
            colors: {
                primary: "#126edd",
                secondary: "#1f2937",
                success: "#10b981",
                error: "#ef4444",
                warning: "#f59e0b",
                info: "#3b82f6",
                background: "#1f2937",
                surface: "#1f2937",
                text: "#ffffff",
                border: "#374151",
                disabled: "#9ca3af",
                placeholder: "#9ca3af",
                backdrop: "#000000",
                hover: "#1f2937",
                active: "#1f2937",
                selected: "#1f2937",
                "selected-hover": "#1f2937",
                "selected-disabled": "#1f2937",
                "selected-text": "#ffffff",
                "accent-1": "#1f2937",
                "accent-2": "#1f2937",
            },
        },
    })

    return (
        <NextUIProvider theme={theme}>
            <Component {...pageProps} />
        </NextUIProvider>
    )
}
