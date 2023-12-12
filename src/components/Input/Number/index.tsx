import React, { useEffect, useState } from "react"
import style from "./style.module.css"
interface NumberInputProps {
    placeholder: string
    onChange: any
    incrementalValue: number
    maxValue: number
    startValue: number
}
const NumberInput = ({ placeholder: label, onChange, incrementalValue, maxValue, startValue }: NumberInputProps) => {
    const [value, setValue] = useState<any>(startValue)
    const [interval, setInt] = useState<any>(null)

    useEffect(() => {
        setValue(startValue)
    }, [startValue])

    function onValueChange(_value: any) {
        if (_value == "add") {
            const currentValue = parseInt(value) || 0
            if (currentValue + incrementalValue > maxValue && maxValue != 0) {
                setValue(maxValue)
                onChange(maxValue)
                console.log("max")
                return
            }
            onChange(currentValue + incrementalValue)
            setValue(currentValue + incrementalValue)
            return
        } else if (_value == "sub") {
            const currentValue = parseInt(value) || 0
            if (currentValue - incrementalValue < 0) {
                setValue(0)
                onChange(0)
                return
            }
            onChange(currentValue - incrementalValue)
            setValue(currentValue - incrementalValue)
            return
        } else {
            if (_value > maxValue && maxValue != 0) {
                setValue(maxValue)
                onChange(maxValue)
                return
            }
            onChange(_value)
            setValue(_value)
            return
        }
    }
    function clickHold(status: any, action: any) {
        if (status == "down") {
            let currentValue = parseInt(value) || 0
            let finalValue = currentValue
            const interval = setInterval(() => {
                if (action == "add") {
                    finalValue = currentValue + incrementalValue
                } else if (action == "sub") {
                    finalValue = currentValue - incrementalValue
                }
                setValue(finalValue)
                onChange(finalValue)
                currentValue = finalValue
            }, 300)
            setInt(interval)
        } else if (status == "up") {
            clearInterval(interval)
        }
    }
    return (
        <div className={`${style.formGroup} fit-content`}>
            <input autoComplete="off" className={style.formField} placeholder={label} name={label} id={label} value={value} required onChange={(e: any) => onValueChange(e.target.value)} />
            <label className={`${style.formLabel} fit-content`}>{label}</label>
            <div className={style.formNumber}>
                <button className={style.formNumberButton} onClick={() => onValueChange("sub")} onMouseDown={() => clickHold("down", "sub")} onMouseUp={() => clickHold("up", "sub")}>
                    -
                </button>
                <button className={style.formNumberButton} onClick={() => onValueChange("add")} onMouseDown={() => clickHold("down", "add")} onMouseUp={() => clickHold("up", "add")}>
                    +
                </button>
            </div>
        </div>
    )
}
export default NumberInput
