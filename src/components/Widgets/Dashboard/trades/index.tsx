import { Table } from "@nextui-org/react"
import Head from "next/head"
import { useEffect, useState } from "react"
import badgeStyle from "../../../Badge/style.module.css"
import tableStyle from "../../../Table/style.module.css"
import { StyledBadge } from "../../../Items/StyledBadge"
import css from "./style.module.css"
export default function Trades() {
    const [tradesList, setTradesList] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [tradesPAndL, setTradesPAndL] = useState(0)
    const [pagination, setPagination] = useState<Boolean>(false)
    const [error, setError] = useState<String>("")

    const tradesPAndLCalculation = (list: any) => {
        let allBought = 0
        let allSold = 0
        list.filter((trade: any) => {
            if (trade.side === 1) {
                return (allBought += trade.tradeValue)
            } else if (trade.side === -1) {
                return (allSold += trade.tradeValue)
            }
        })
        return allSold - allBought
    }
    useEffect(() => {
        const getTrades = async () => {
            setLoading(true)
            const trades = await fetch("https://fno.one/api/trades")
            trades.ok ? console.log("trades fetched") : setError("trades fetch failed")
            const tradesJson = await trades.json()
            const _tradesList = tradesJson.trades
            setTradesList(_tradesList)
            if (_tradesList.length > 20) {
                setPagination(true)
            }
            console.log(_tradesList)
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
            {!isLoading && (
                <table className={tableStyle.table}>
                    <thead>
                        <tr>
                            <th>Order Date Time</th>
                            <th>Symbol</th>
                            <th>Side</th>
                            <th>Traded Quantity</th>
                            <th>Trade Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tradesList.map((trade: any, index: number) => {
                            return (
                                <tr key={index}>
                                    <td>{trade.orderDateTime}</td>
                                    <td>{trade.symbol}</td>
                                    {trade.side === 1 ? (
                                        <td>
                                            <div className={badgeStyle.buyBadge}>BUY</div>
                                        </td>
                                    ) : (
                                        <td>
                                            <div className={badgeStyle.sellBadge}>SELL</div>
                                        </td>
                                    )}
                                    <td>{trade.tradedQty}</td>
                                    <td>{trade.tradePrice}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
            {/* {!isLoading && <List columns={["orderDateTime", "side", "segment", "tradedQty", "tradePrice", "tradeValue", "symbol"]} rows={tradesList} />} */}
            {/* {!isLoading && (
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
                                    {trade.side === 1 ? (
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
                    {pagination && <Table.Pagination shadow noMargin align="center" rowsPerPage={10} onPageChange={(page) => console.log({ page })} />}
                </Table>
            )} */}
            {error && <h1>{error}</h1>}
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
