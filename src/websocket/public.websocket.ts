import io from "socket.io-client"
import * as log from "../helper/consoleLog"
export default class PublicWebsocket {
    private socket
    private socketOptions
    private socketUrl = "wss://fno.one/public"
    private token
    private setMarket
    private setDifference
    private setLogs
    private setConnectedSockets
    constructor(token: string, setMarket: Function, setDifference: Function, setLogs: Function, setConnectedSockets: Function) {
        this.token = token
        this.socketOptions = {
            transports: ["websocket"],
            upgrade: true,
            path: "/socket",
            query: {
                sessionId: this.token,
            },
        }
        this.setMarket = setMarket
        this.setDifference = setDifference
        this.setLogs = setLogs
        this.socket = io(this.socketUrl, this.socketOptions)
        this.setConnectedSockets = setConnectedSockets
    }
    public connect() {
        this.socket.connect()
        this.socket.on("connect", () => {
            log.success("Connected to public websocket")
            this.setLogs((logs: any) => {
                return [...logs, "Connected to public websocket"]
            })
            this.setConnectedSockets((connectedSockets: any) => {
                return { ...connectedSockets, public: true }
            })
            this.socket.emit("subscribeMarketDataUpdate", { sessionId: this.token })
        })
        this.socket.on("disconnect", () => {
            log.warning("Disconnected from public websocket")
            this.setLogs((logs: any) => {
                return [...logs, "Disconnected from public websocket"]
            })
            this.setConnectedSockets((connectedSockets: any) => {
                return { ...connectedSockets, public: false }
            })
        })
        this.socket.on("error", (error: any) => {
            log.error("Error from public websocket")
            this.setLogs((logs: any) => {
                return [...logs, "Error from public websocket"]
            })
        })
        this.socket.on("marketDataUpdate", (data: any) => {
            const parsedData = JSON.parse(data)
            const symbol = parsedData.symbol
            this.setMarket((marketData: any) => {
                return { ...marketData, [symbol]: parsedData }
            })
        })
        this.socket.on("marketMovementUpdate", (data: any) => {
            const parsedData = JSON.parse(data)
            const symbol = parsedData.symbol
            this.setDifference((differenceData: any) => {
                return { ...differenceData, [symbol]: parsedData }
            })
        })
    }
    public disconnect() {
        log.warning("Disconnecting from public websocket")
        this.socket.disconnect()
    }
    public isConnected() {
        return this.socket.connected
    }
}
