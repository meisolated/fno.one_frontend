// NotificationSender.js
import React from "react"

const NotificationSender = () => {
    const sendNotification = () => {
        if ("Notification" in window) {
            // Check if the browser supports notifications
            if (Notification.permission === "granted") {
                // Create a notification
                const options = {
                    icon: "https://fno.one/_next/image?url=%2Fanime-girl.gif&w=64&q=75", // Set the path to your icon
                    body: "This is the body of the notification",
                    tag: "unique-notification-tag", // Used to replace existing notifications with the same tag
                }
                new Notification("Hello, this is a notification!", options)
            } else if (Notification.permission !== "denied") {
                // Request permission if not denied
                Notification.requestPermission().then((permission) => {
                    if (permission === "granted") {
                        new Notification("Permission granted! You can now receive notifications.")
                    }
                })
            }
        }
    }

    return (
        <div>
            {/* <button onClick={sendNotification}>Send Notification</button> */}
        </div>
    )
}

export default NotificationSender
