import io from 'socket.io-client'
export default class PublicWebsocket {
    private socket
    private socketOptions
    private socketUrl = "wss://fno.one/public"
    private token
    private setMarket
    private setLogs
    constructor(token: string, setMarket: Function, setLogs: Function) {
        this.token = token
        this.socketOptions = {
            transports: ["websocket"],
            upgrade: false,
            path: "/socket",
            query: {
                sessionId: this.token,
            },
        }
        this.setMarket = setMarket
        this.setLogs = setLogs
        this.socket = io(this.socketUrl, this.socketOptions)
    }
    public connect() {
        this.socket.connect()
        this.socket.on("connect", () => {
            this.setLogs((logs: any) => {
                return [...logs, "Connected to public websocket"]
            })
        })
        this.socket.on("disconnect", () => {
            this.setLogs((logs: any) => {
                return [...logs, "Disconnected from public websocket"]
            })
        })
        this.socket.on("error", (error: any) => {
            this.setLogs((logs: any) => {
                return [...logs, "Error from public websocket"]
            })
        })
        this.socket.emit("subscribeMarketDataUpdate", { sessionId: this.token })
        this.socket.on("marketDataUpdate", (data: any) => {
            const parsedData = JSON.parse(data)
            const symbol = parsedData.symbol || parsedData.Symbol
            this.setMarket((marketData: any) => {
                return { ...marketData, [symbol]: parsedData }
            })

        })

    }
    public disconnect() {
        this.socket.disconnect()
    }
    public isConnected() {
        return this.socket.connected
    }

}