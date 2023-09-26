import Head from "next/head"
import { useEffect, useState } from "react"
import badgeStyle from "../../../Badge/style.module.css"
import tableStyle from "../../../Table/style.module.css"
import css from "./style.module.css"

export default function Orders() {
    const [OrdersList, setOrdersList] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState<String>("")
    useEffect(() => {
        const getOrders = async () => {
            setLoading(true)
            const Orders = await fetch("https://fno.one/api/orders")
            Orders.ok ? console.log("Orders fetched") : setError("Orders fetch failed")
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
                                {OrdersList.map((order: any) => (
                                    <tr key={order.orderDateTime}>
                                        <td>{order.orderDateTime}</td>
                                        <td>{order.symbol}</td>
                                        <td>{order.side === 1 ? <div className={badgeStyle.buyBadge}>BUY</div> : <div className={badgeStyle.sellBadge}>SELL</div>}</td>
                                        <td>{order.filledQty}</td>
                                        <td>{order.tradedPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {error && <p>{error}</p>}
                </div>
            </div>
        </div>
    )
}
