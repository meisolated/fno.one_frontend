import Head from "next/head"
import { useEffect, useState } from "react"
import List from "../../List"
import css from "./style.module.css"
export default function Trades() {
    const sampleTrades = [{
        "clientId": "FXXXXX",
        "orderDateTime": "07-Aug-2020 13:51:12",
        "orderNumber": "120080789075",
        "exchangeOrderNo": "1200000009204725",
        "exchange": 10,
        "side": 1,
        "segment": 10,
        "orderType": 2,
        "fyToken": "101000000010666",
        "productType": "CNC",
        "tradedQty": 10,
        "tradePrice": 32.7,
        "tradeValue": 327.0,
        "tradeNumber": "52605023",
        "id": "52605023",
        "row": 1,
        "symbol": "NSE:PNB-EQ"
    },
    {
        "clientId": "FXXXXX",
        "orderDateTime": "07-Aug-2020 13:48:12",
        "orderNumber": "120080789139",
        "exchangeOrderNo": "1000000012031528",
        "exchange": 10,
        "side": 1,
        "segment": 10,
        "orderType": 2,
        "fyToken": "101000000010454",
        "productType": "CNC",
        "tradedQty": 19,
        "tradePrice": 14.1,
        "tradeValue": 267.9,
        "tradeNumber": "3281523",
        "id": "3281523",
        "row": 3,
        "symbol": "NSE:CENTRUM-EQ"
    },
    {
        "clientId": "FXXXXX1",
        "orderDateTime": "07-Aug-2020 13:47:22",
        "orderNumber": "120080797993",
        "exchangeOrderNo": "1100000008047027",
        "exchange": 10,
        "side": 1,
        "segment": 10,
        "orderType": 2,
        "fyToken": "101000000018783",
        "productType": "CNC",
        "tradedQty": 4,
        "tradePrice": 115.5,
        "tradeValue": 462.0,
        "tradeNumber": "27945307",
        "id": "27945307",
        "row": 4,
        "symbol": "NSE:IDFNIFTYET-EQ"
    }]
    const [tradesList, setTradesList] = useState([])
    const [isLoading, setLoading] = useState(false)
    useEffect(() => {
        const getTrades = async () => {
            setLoading(true)
            const trades = await fetch("https://fno.one/api/trades")
            const tradesJson = await trades.json()
            console.log(tradesJson)
            setTradesList(tradesJson.trades)
            setLoading(false)
        }
        getTrades()
    }, [])
    return (
        <div>
            <Head>
                <title>Trades</title>
            </Head>
            <h1>Trades</h1>
            {!isLoading &&
                <List columns={[
                    "orderDateTime",
                    "side",
                    "segment",
                    "tradedQty",
                    "tradePrice",
                    "tradeValue",
                    "symbol",]} rows={tradesList} />}
        </div>
    )
}
