// NotificationComponent.js
import React, { useEffect, useState } from "react"

const NotificationComponent = () => {
    const [notificationPermission, setNotificationPermission] = useState("")

    useEffect(() => {
        // Check if the browser supports notifications

        if ("Notification" in window) {
            // Check the current notification permission status
            if (Notification.permission === "granted") {
                setNotificationPermission("granted")
            } else if (Notification.permission === "denied") {
                setNotificationPermission("denied")
            } else if (Notification.permission === "default") {
                requestNotificationPermission()
            }
        }
    }, [])

    const requestNotificationPermission = async () => {
        try {
            const permission = await Notification.requestPermission()

            setNotificationPermission(permission)
        } catch (error) {
            console.error("Error requesting notification permission:", error)
        }
    }

    return (
        <></>
        // <div>
        //     <p>Notification Permission: {notificationPermission}</p>
        //     {notificationPermission !== 'granted' && (
        //         <button onClick={requestNotificationPermission}>
        //             Request Notification Permission
        //         </button>
        //     )}
        // </div>
    )
}

export default NotificationComponent
