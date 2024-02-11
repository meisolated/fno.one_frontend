import io from "socket.io-client"
import { playAlertSound, playSound, playThisSound } from "../helper"
import * as log from "../helper/consoleLog"

const soundsUrl = "https://fno.one/sounds/"

const audios = {
    positionClosedWithStopLoss: soundsUrl + "position_closed_with_stop_loss.mp3",
    orderPlaced: soundsUrl + "order_placed.mp3",
    orderPartiallyFilled: soundsUrl + "order_partially_filled.mp3",
    orderFilled: soundsUrl + "order_filled.mp3",
    trailingStopLoss: soundsUrl + "trailing_stop_loss.mp3",
    positionClosedWithTarget: soundsUrl + "position_closed_with_target.mp3",
    // ----------------
    positionRejectedByMoneyManager: soundsUrl + "position_rejected_by_money_manager.mp3",
    positionRejectedByRiskManager: soundsUrl + "position_rejected_by_risk_manager.mp3",
    positionApprovedByMoneyManager: soundsUrl + "position_approved_by_money_manager.mp3",
    positionApprovedByRiskManager: soundsUrl + "position_approved_by_risk_manager.mp3",
    approvedByRiskManager: soundsUrl + "approved_by_risk_manager.mp3",
    approvedByMoneyManager: soundsUrl + "approved_by_money_manager.mp3",
    rejectedByRiskManager: soundsUrl + "rejected_by_risk_manager.mp3", //audio to be added
    rejectedByMoneyManager: soundsUrl + "rejected_by_money_manager.mp3",//audio to be added
    // ----------------
    positionApproved: soundsUrl + "approved.mp3",
    orderFailed: soundsUrl + "order_failed.mp3",
    orderRejected: soundsUrl + "order_rejected.mp3",
    modificationDoneByRiskManager: soundsUrl + "modification_done_by_risk_manager.mp3",
    positionClosed: soundsUrl + "position_closed.mp3",
    positionClosedManually: soundsUrl + "position_closed_manually.mp3",

}

/**
 * We need to add some call back function
 */
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

            this.socket.emit("subscribePositionUpdates", { sessionId: this.token })
            this.socket.emit("subscribeOrderUpdate", { sessionId: this.token })
            this.socket.emit("subscribeMarketAlerts", { sessionId: this.token })
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

        this.socket.on("orderUpdate", (data: any) => {
            const parsedData = JSON.parse(data)
            console.log(parsedData)
        })

        this.socket.on("marketAlerts", (data: any) => {
            const parsedData = JSON.parse(data)
            console.log(parsedData)
            if (parsedData.status === "triggered") {
                playAlertSound()
            }
        })
        this.socket.on("positionUpdates", (data: any) => {
            const parsedData = JSON.parse(data)
            console.log(parsedData)
            const positionStatus = parsedData.status
            if (positionStatus.includes("orderFilled") || positionStatus.includes("exitPositionOrderFilled")) {
                playThisSound(audios.orderFilled)
            } else if (positionStatus.includes("orderPartiallyFilled") || positionStatus.includes("exitPositionOrderPartiallyFilled")) {
                playThisSound(audios.orderPartiallyFilled)
            } else if (positionStatus.includes("orderPlaced") || positionStatus.includes("exitPositionOrderPlaced")) {
                playThisSound(audios.orderPlaced)
            } else if (positionStatus.includes("orderFailed") || positionStatus.includes("exitPositionOrderFailed")) {
                playThisSound(audios.orderFailed)
            } else if (positionStatus.includes("orderRejected") || positionStatus.includes("exitPositionOrderRejected")) {
                playThisSound(audios.orderRejected)
            } else if (positionStatus.includes("rejectedByMoneyManager")) {
                playThisSound(audios.positionRejectedByMoneyManager)
            } else if (positionStatus.includes("rejectedByRiskManager")) {
                playThisSound(audios.positionRejectedByRiskManager)
            } else if (positionStatus.includes("approvedByMoneyManager")) {
                playThisSound(audios.approvedByMoneyManager)
            } else if (positionStatus.includes("approvedByRiskManager")) {
                playThisSound(audios.approvedByRiskManager)
            } else if (positionStatus.includes("modificationDoneByRiskManager")) {
                playThisSound(audios.modificationDoneByRiskManager)
            } else if (positionStatus.includes("approved")) {
                playThisSound(audios.positionApproved)
            } else if (positionStatus.includes("closedWithStopLoss")) {
                playThisSound(audios.positionClosedWithStopLoss)
            } else if (positionStatus.includes("positionClosedWithTarget")) {
                playThisSound(audios.positionClosedWithTarget)
            } else if (positionStatus.includes("trailingStopLoss")) {
                playThisSound(audios.trailingStopLoss)
            } else if (positionStatus.includes("positionManuallyClosed")) {
                playThisSound(audios.positionClosedManually)
            } else if (positionStatus.includes("positionClosed")) {
                playThisSound(audios.positionClosed)
            }
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
