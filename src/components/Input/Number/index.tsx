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

    useEffect(() => {
        setValue(startValue)
    }, [startValue])

    function onValueChange(_value: any) {
        if (_value == "add") {
            const currentValue = parseInt(value) || 0
            if (maxValue != 0) {
                if (currentValue + incrementalValue > maxValue) {
                    setValue(maxValue)
                    onChange(maxValue)
                    return
                }
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
            if (_value > maxValue) {
                setValue(maxValue)
                onChange(maxValue)
                return
            }
            onChange(_value)
            setValue(_value)
            return
        }
    }
    return (
        <div className={style.formGroup}>
            <input autoComplete="off" className={style.formField} placeholder={label} name={label} id={label} value={value} required onChange={(e: any) => onValueChange(e.target.value)} />
            <label className={style.formLabel}>{label}</label>
            <div className={style.formNumber}>
                <button className={style.formNumberButton} onClick={() => onValueChange("sub")}>
                    -
                </button>
                <button className={style.formNumberButton} onClick={() => onValueChange("add")}>
                    +
                </button>
            </div>
        </div>
    )
}
export default NumberInput
