import { Table } from "@nextui-org/react"
import Head from "next/head"
import { useEffect, useState } from "react"
import { StyledBadge } from "../../../components/dashboard/items/StyledBadge"
import List from "../../List"
import css from "./style.module.css"
export default function Trades() {
    const sampleTrades = [
        {
            clientId: "FXXXXX",
            orderDateTime: "07-Aug-2020 13:51:12",
            orderNumber: "120080789075",
            exchangeOrderNo: "1200000009204725",
            exchange: 10,
            side: 1,
            segment: 10,
            orderType: 2,
            fyToken: "101000000010666",
            productType: "CNC",
            tradedQty: 10,
            tradePrice: 32.7,
            tradeValue: 327.0,
            tradeNumber: "52605023",
            id: "52605023",
            row: 1,
            symbol: "NSE:PNB-EQ",
        },
        {
            clientId: "FXXXXX",
            orderDateTime: "07-Aug-2020 13:48:12",
            orderNumber: "120080789139",
            exchangeOrderNo: "1000000012031528",
            exchange: 10,
            side: 1,
            segment: 10,
            orderType: 2,
            fyToken: "101000000010454",
            productType: "CNC",
            tradedQty: 19,
            tradePrice: 14.1,
            tradeValue: 267.9,
            tradeNumber: "3281523",
            id: "3281523",
            row: 3,
            symbol: "NSE:CENTRUM-EQ",
        },
        {
            clientId: "FXXXXX1",
            orderDateTime: "07-Aug-2020 13:47:22",
            orderNumber: "120080797993",
            exchangeOrderNo: "1100000008047027",
            exchange: 10,
            side: 1,
            segment: 10,
            orderType: 2,
            fyToken: "101000000018783",
            productType: "CNC",
            tradedQty: 4,
            tradePrice: 115.5,
            tradeValue: 462.0,
            tradeNumber: "27945307",
            id: "27945307",
            row: 4,
            symbol: "NSE:IDFNIFTYET-EQ",
        },
    ]
    const [tradesList, setTradesList] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [tradesPAndL, setTradesPAndL] = useState(0)
    const tradesPAndLCalculation = (list: any) => {
        let tradesPAndL = 0
        list.forEach((trade: any) => {
            if (trade.transactionType === 1) {
                tradesPAndL += trade.tradeValue
            }
            else {
                tradesPAndL -= trade.tradeValue
            }
        })
        return tradesPAndL
    }
    useEffect(() => {
        const getTrades = async () => {
            setLoading(true)
            const trades = await fetch("https://fno.one/api/trades")
            const tradesJson = await trades.json()
            setTradesList(tradesJson.trades)
            const tradesPAndL: any = tradesPAndLCalculation(tradesJson.trades)
            setTradesPAndL(tradesPAndL)
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
            <div className={css.tradesOverview}>
                <div className={css.tradesOverviewItem}>
                    <h3>Trades P&L</h3>
                    <h2>{tradesPAndL}</h2>
                </div>

            </div>
            <h2>Trades List</h2>
            {/* {!isLoading && <List columns={["orderDateTime", "side", "segment", "tradedQty", "tradePrice", "tradeValue", "symbol"]} rows={tradesList} />} */}
            {!isLoading && (
                <Table aria-label="Trades Table" css={{ height: "auto", width: "90%", borderRadius: "30px" }} bordered shadow={false}>
                    <Table.Header>
                        <Table.Column>Order Date Time</Table.Column>
                        <Table.Column>Symbol</Table.Column>
                        <Table.Column>Side</Table.Column>
                        <Table.Column>Traded Quantity</Table.Column>
                        <Table.Column>Trade Price</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {tradesList.map((trade: any, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell css={{ color: "white" }}>{trade.orderDateTime}</Table.Cell>
                                    <Table.Cell css={{ color: "white" }}>{trade.symbol}</Table.Cell>
                                    {trade.transactionType === 1 ? (
                                        <Table.Cell>
                                            <StyledBadge type={"buy"}>Buy</StyledBadge>
                                        </Table.Cell>
                                    ) : (
                                        <Table.Cell>
                                            <StyledBadge type={"sell"}>Sell</StyledBadge>
                                        </Table.Cell>
                                    )}
                                    <Table.Cell css={{ color: "white" }}>{trade.tradedQty}</Table.Cell>
                                    <Table.Cell css={{ color: "white" }}>{trade.tradePrice}</Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                    <Table.Pagination
                        shadow
                        noMargin
                        align="center"
                        rowsPerPage={10}
                        onPageChange={(page) => console.log({ page })}
                    />
                </Table>
            )}
        </div>
    )
}
//!exchange 10 = NSE, 11 = MCX, 12 = BSE

// clientId: "XV19818"

// exchange: 10

// exchangeOrderNo: "1500000010302674"

// fyToken: "101123020939055"

// id: "430582881"

// orderDateTime: "07-Feb-2023 09:33:28"

// orderNumber: "223020741152"

// orderType: 2

// productType: "MARGIN"

// row: 1

// segment: 11

// symbol: "NSE:BANKNIFTY2320941400CE"

// tradeNumber: "430582881"

// tradePrice: 413.7

// tradeValue: 10342.5

// tradedQty: 25

// transactionType: -1
