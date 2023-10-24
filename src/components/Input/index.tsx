import React, { useEffect, useState } from "react"
import style from "./style.module.css"
const TextInput = ({ placeholder, onChange, type, incrementalValue, startValue }: any) => {
    const [value, setValue] = useState<any>(startValue)

    useEffect(() => {
        setValue(startValue)
    }, [startValue])
    function onValueChange(_value: any) {
        if (_value == "add") {
            const currentValue = parseInt(value) || 0
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
            onChange(_value)
            setValue(_value)
            return
        }
    }
    return (
        <div className={style.formGroup}>
            <input
                autoComplete="off"
                className={style.formField}
                placeholder={placeholder}
                name={placeholder}
                id={placeholder}
                value={value}
                required
                onChange={(e: any) => onValueChange(e.target.value)}
            />
            <label className={style.formLabel}>{placeholder}</label>
            {type == "number" && (
                <div className={style.formNumber}>
                    <button className={style.formNumberButton} onClick={() => onValueChange("sub")}>
                        -
                    </button>
                    <button className={style.formNumberButton} onClick={() => onValueChange("add")}>
                        +
                    </button>
                </div>
            )}
        </div>
    )
}
export default TextInput
