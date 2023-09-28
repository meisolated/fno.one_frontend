import io from 'socket.io-client'
import { playSound } from '../helper'
import * as log from "../helper/consoleLog"
export default class UserWebsocket {
    private socket
    private socketOptions
    private socketUrl = "wss://fno.one/user"
    private token
    private setLogs
    constructor(token: string, setLogs: Function) {
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
    }

    public connect() {
        this.socket.connect()
        this.socket.on("connect", () => {
            log.success("Connected to user websocket")
            this.setLogs((logs: any) => {
                return [...logs, "Connected to user websocket"]
            })
        })
        this.socket.on("disconnect", () => {
            log.warning("Disconnected from user websocket")
            this.setLogs((logs: any) => {
                return [...logs, "Disconnected from user websocket"]
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
    }
    public disconnect() {
        log.warning("Disconnecting from user websocket")
        this.socket.disconnect()
    }
}