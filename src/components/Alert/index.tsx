import { useEffect, useState } from "react"
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa"
import styles from "./style.module.css" // Create a CSS module for styling



const Alert = ({ position, type, message }: any) => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsVisible(false)
        }, 3000)

        return () => clearTimeout(timeout)
    }, [])

    const getIcon = () => {
        switch (type) {
            case "success":
                return <FaCheckCircle />
            case "error":
                return <FaExclamationCircle />
            case "info":
                return <FaInfoCircle />
            default:
                return null
        }
    }

    const getPositionStyle = () => {
        switch (position) {
            case "top-left":
                return styles.topLeft
            case "top-right":
                return styles.topRight
            case "bottom-left":
                return styles.bottomLeft
            case "bottom-right":
                return styles.bottomRight
            case "middle":
                return styles.middle
            default:
                return null
        }
    }
    const getBackgroundColor = () => {
        switch (type) {
            case "success":
                return styles.success
            case "error":
                return styles.error
            case "info":
                return styles.info
            default:
                return null
        }
    }
    const getExitAnimation = () => {
        switch (position) {
            case "top-left":
                return styles.exitTopLeft
            case "top-right":
                return styles.exitTopRight
            case "bottom-left":
                return styles.exitBottomLeft
            case "bottom-right":
                return styles.exitBottomRight
            case "middle":
                return styles.exitMiddle
            default:
                return null
        }
    }

    return (
        <div className={`${styles.alert} ${getPositionStyle()} ${isVisible ? styles.show : styles.hide}`}>
            <div className={`${styles.alertBox} ${type} ${getBackgroundColor()} ${isVisible ? "" : getExitAnimation()}`}>
                {getIcon()}
                <p>{message}</p>
            </div>
        </div>
    )
}

export default Alert
