import React, { useEffect, useState } from "react"
import style from "./style.module.css"
const TextInput = ({ placeholder, onChange, startValue }: any) => {
    const [value, setValue] = useState<any>(startValue)
    useEffect(() => {
        setValue(startValue)
    }, [startValue])
    function onValueChange(_value: any) {
        onChange(_value)
        setValue(_value)
        return
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
        </div>
    )
}
export default TextInput
