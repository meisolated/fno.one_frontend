// TextInput.js
import React from "react"
import style from "./style.module.css"

const TextInput = ({ placeholder, value, onChange }: any) => {
    return <input type="text" className={style.textInput} placeholder={placeholder} value={value} onChange={onChange} />
}

export default TextInput
