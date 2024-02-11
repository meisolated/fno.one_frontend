import React, { FC, ReactNode, createContext, useContext, useState } from "react"
import { playErrorSound, playSuccessSound } from "../../helper"
import css from "./style.module.css"
interface Toast {
    id: number
    message: string
    type: "success" | "error" | "info" | "default"
}

interface ToastContextType {
    showToast: (message: string, type: "success" | "error" | "info" | "default") => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
    children: ReactNode
}
export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = (message: string, type: "success" | "error" | "info" | "default") => {
        const id = new Date().getTime()
        if (type === "success") playSuccessSound()
        else if (type === "error") playErrorSound()

        setToasts((prevToasts) => [
            ...prevToasts,
            {
                id,
                message,
                type,
            },
        ])

        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
        }, 3000)
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={css.toastContainer}>
                {toasts.map((toast) => (
                    <div key={toast.id} className={`${css.toast} ${css[toast.type]}`}>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = (): ((message: string, type: "success" | "error" | "info" | "default") => void) => {
    const context = useContext(ToastContext)
    if (!context) throw new Error("useToast must be used within a ToastProvider")
    return context.showToast
}
