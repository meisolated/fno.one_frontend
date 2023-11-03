import io from "socket.io-client"
import { playSound } from "../helper"
import * as log from "../helper/consoleLog"
export default class UserWebsocket {
    private socket
    private socketOptions
    private socketUrl = "wss://fno.one/user"
    private token
    private setLogs
    private setConnectedSockets
    private subscribedEvents = {
        subscribeOrderUpdate: false,
        subscribeMarketAlerts: false,
    }
    constructor(token: string, setLogs: Function, setConnectedSockets: Function) {
        this.token = token
        this.setLogs = setLogs
        this.socketOptions = {
            transports: ["websocket"],
            upgrade: false,
            path: "/socket",
            query: {
                sessionId: this.token,
            },
        }
        this.socket = io(this.socketUrl, this.socketOptions)
        this.setConnectedSockets = setConnectedSockets
    }

    public connect() {
        this.socket.connect()
        this.socket.on("connect", () => {
            log.success("Connected to user websocket")
            this.setLogs((logs: any) => {
                return [...logs, "Connected to user websocket"]
            })
            if (!this.subscribedEvents.subscribeOrderUpdate) {
                this.socket.emit("subscribeOrderUpdate", { sessionId: this.token })
                this.socket.emit("subscribeMarketAlerts", { sessionId: this.token })
                this.subscribedEvents.subscribeOrderUpdate = true
                this.subscribedEvents.subscribeMarketAlerts = true
            }
            this.setConnectedSockets((connectedSockets: any) => {
                return { ...connectedSockets, user: true }
            })
        })
        this.socket.on("disconnect", () => {
            this.subscribedEvents.subscribeMarketAlerts = false
            this.subscribedEvents.subscribeOrderUpdate = false
            log.warning("Disconnected from user websocket")
            this.setLogs((logs: any) => {
                return [...logs, "Disconnected from user websocket"]
            })
            this.setConnectedSockets((connectedSockets: any) => {
                return { ...connectedSockets, user: false }
            })
        })
        this.socket.on("error", (error: any) => {
            log.error("Error from user websocket")
            this.setLogs((logs: any) => {
                return [...logs, "Error from user websocket"]
            })
        })
        this.socket.emit("subscribeOrderUpdate", { sessionId: this.token })
        this.socket.on("orderUpdate", (data: any) => {
            const parsedData = JSON.parse(data)
            const message = parsedData.message
            log.info(message)
            this.setLogs((orderUpdates: any) => {
                return [...orderUpdates, message]
            })
            if (message.includes("CONFIRMED")) {
                playSound()
            }
        })

        this.socket.emit("subscribeMarketAlerts", { sessionId: this.token })
        this.socket.on("marketAlerts", (data: any) => {
            const parsedData = JSON.parse(data)
            const message = parsedData.message
            if (message) log.info(message)
            if (parsedData.status == "triggered") {
                playSound()
            }
        })
    }
    public disconnect() {
        log.warning("Disconnecting from user websocket")
        this.socket.disconnect()
    }
}
