import { Table } from "@nextui-org/react"
import Head from "next/head"
import { useEffect, useState } from "react"
import { StyledBadge } from "../items/StyledBadge"
import css from "./style.module.css"

export default function Orders() {
    const [OrdersList, setOrdersList] = useState([])
    const [isLoading, setLoading] = useState(false)
    useEffect(() => {
        const getOrders = async () => {
            setLoading(true)
            const Orders = await fetch("https://fno.one/api/orders")
            const OrdersJson = await Orders.json()
            setOrdersList(OrdersJson.orders)
            console.log(OrdersJson)
            setLoading(false)
        }
        getOrders()
    }, [])
    return (
        <div>
            <Head>
                <title>Orders</title>
            </Head>
            <div className={css.pageWrapper}>
                <div className={css.headerWrapper}>
                    <h1>Orders</h1>
                    <h2>Orders List</h2>
                </div>

                <div className={css.ordersListWrapper}>
                    {!isLoading && (
                        <Table aria-label="Orders Table" css={{ height: "auto", width: "90%", borderRadius: "30px" }} bordered shadow={false}>
                            <Table.Header>
                                <Table.Column>Order Date Time</Table.Column>
                                <Table.Column>Symbol</Table.Column>
                                <Table.Column>Side</Table.Column>
                                <Table.Column>Traded Quantity</Table.Column>
                                <Table.Column>Trade Price</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {OrdersList.map((order: any) => (
                                    <Table.Row key={order.orderDateTime}>
                                        <Table.Cell>{order.orderDateTime}</Table.Cell>
                                        <Table.Cell>{order.symbol}</Table.Cell>
                                        <Table.Cell>
                                            <StyledBadge type={order.side === 1 ? "buy" : "sell"}>{order.side === 1 ? "Buy" : "Sell"}</StyledBadge>
                                        </Table.Cell>
                                        <Table.Cell>{order.filledQty}</Table.Cell>
                                        <Table.Cell>{order.tradedPrice}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>

                    )}
                </div>
            </div>

            {/* {!isLoading && <List columns={["orderDateTime", "side", "segment", "tradedQty", "tradePrice", "tradeValue", "symbol"]} rows={OrdersList} />} */}

        </div>
    )
}
