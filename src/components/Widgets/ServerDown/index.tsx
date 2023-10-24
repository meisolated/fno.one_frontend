import React from "react"
import styles from "./style.module.css"

const ServerDown = () => {
    return (
        <div className={styles.serverDown}>
            <h1>Server is Down</h1>
            <p>We apologize for the inconvenience. Our server is currently down for maintenance. Please check back later.</p>
        </div>
    )
}

export default ServerDown
