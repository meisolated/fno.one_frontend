export {}

declare global {
    interface newOrder {
        symbol: string
        qty: number
        type: 1 | 2 | 3 | 4 // 1 - Limit Order, 2 - Market Order, 3 - Stop Loss (SL-M), 4 StopLimit (SL-L)
        side: 1 | -1
        productType: "CND" | "INTRADAY" | "MARGIN" | "CO" | "BO"
        limitPrice: 0 | number
        stopPrice: 0 | number
        disclosedQty: 0 | number
        validity: "DAY" | "IOC"
        offlineOrder: boolean
        stopLoss: 0 | number
        takeProfit: 0 | number
    }
}
