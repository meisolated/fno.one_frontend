// components/Popup.js
import React, { useEffect, useState } from "react"
import styles from "./style.module.css"

const Popup = ({ title, description, buttons, onClose }: { title: string; description: string; buttons: Array<string>; onClose: any }) => {
    const [isVisible, setIsVisible] = useState(false)

    const handleButtonClick = (buttonLabel: string) => {
        console.log(`Button Clicked: ${buttonLabel}`)
        setIsVisible(false)
        setTimeout(onClose(buttonLabel), 300)
    }

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true)
        }, 100)
    }, [])
    return (
        <div className={`${styles.popup} ${isVisible ? styles.popIn : styles.popOut}`}>
            <div className={styles.popupContent}>
                <div className={styles.popupHeader}>
                    <h2>{title}</h2>
                    <button className={styles.closeButton} onClick={() => handleButtonClick("No")}>
                        &times;
                    </button>
                </div>
                <div className={styles.popupBody}>
                    <p>{description}</p>
                </div>
                <div className={styles.popupFooter}>
                    {buttons.map((buttonLabel: string, index: number) => (
                        <button key={index} onClick={() => handleButtonClick(buttonLabel)}>
                            {buttonLabel}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Popup
