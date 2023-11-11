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
    constructor(token: string, setLogs: Function, setConnectedSockets: Function) {
        this.token = token
        this.setLogs = setLogs
        this.socketOptions = {
            transports: ["websocket"],
            upgrade: true,
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
            this.setConnectedSockets((connectedSockets: any) => {
                return { ...connectedSockets, user: true }
            })
        })
        this.socket.on("disconnect", () => {
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

        this.socket.emit("subscribeTradeUpdates", { sessionId: this.token })
        this.socket.emit("subscribeOrderUpdate", { sessionId: this.token })
        this.socket.emit("subscribeMarketAlerts", { sessionId: this.token })

        this.socket.on("orderUpdate", (data: any) => {
            console.log("orderUpdate")
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

        this.socket.on("marketAlerts", (data: any) => {
            console.log("marketAlerts")
            const parsedData = JSON.parse(data)
            if (parsedData.message) log.info(parsedData.message)
            if (parsedData.status == "triggered") {
                playSound()
            }
        })
        this.socket.on("tradeUpdates", (data: any) => {
            console.log("tradeUpdates")
            const parsedData = JSON.parse(data)
            if (parsedData.message) log.info(parsedData.message)
        })

        this.socket.on("pong", (data: any) => {
            // log.success("Pong from user websocket")
        })
        setInterval(() => {
            this.socket.emit("ping", { sessionId: this.token })
        }, 1000)
    }
    public disconnect() {
        log.warning("Disconnecting from user websocket")
        this.socket.disconnect()
    }
    public isConnected() {
        return this.socket.connected
    }
}
