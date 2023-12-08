import React from "react"
import css from "./style.module.css"
interface ToggleSwitchProps {
    currentState: boolean
    onStateChange: (newState: boolean) => void
}
const ToggleSwitch = ({ currentState, onStateChange }: ToggleSwitchProps) => {
    const toggleSwitch = () => {
        if (typeof onStateChange === "function") {
            onStateChange(!currentState)
        }
    }
    return (
        <>
            <input className={css.input} type="checkbox" id="switch" checked={currentState} onChange={toggleSwitch} />
            <label className={css.label} htmlFor="switch">
                Toggle
            </label>
        </>
    )
}

export default ToggleSwitch
