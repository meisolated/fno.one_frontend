import React from "react"
import style from "./style.module.css"
const TextInput = ({ placeholder, value, onChange, type, changeValue }: any) => {
    return (
        <div className={style.form__group}>
            <input
                type={type}
                className={style.form__field}
                placeholder={placeholder}
                name={placeholder}
                id={placeholder}
                value={changeValue}
                required
                onChange={(e: any) => onChange(e.target.value)}
            />
            <label className={style.form__label}>{placeholder}</label>
        </div>
    )
}
export default TextInput
