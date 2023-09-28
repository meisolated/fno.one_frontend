import io from 'socket.io-client'
import { playSound } from '../helper'
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
            this.setLogs((logs: any) => {
                return [...logs, "Connected to user websocket"]
            })
        })
        this.socket.on("disconnect", () => {
            this.setLogs((logs: any) => {
                return [...logs, "Disconnected from user websocket"]
            })
        })
        this.socket.on("error", (error: any) => {
            this.setLogs((logs: any) => {
                return [...logs, "Error from user websocket"]
            })
        })
        this.socket.emit("subscribeOrderUpdate", { sessionId: this.token })
        this.socket.on("orderUpdate", (data: any) => {
            const parsedData = JSON.parse(data)
            const message = parsedData.message
            console.log(parsedData)
            this.setLogs((orderUpdates: any) => {
                return [...orderUpdates, message]
            })
            if (message.includes("CONFIRMED")) {
                playSound()
            }
        })

    }
}