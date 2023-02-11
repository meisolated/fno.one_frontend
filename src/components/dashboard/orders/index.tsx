import Head from "next/head"
import { useEffect, useState } from "react"
import List from "../../List"
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
            <h1>Orders</h1>
            {!isLoading && <List columns={["orderDateTime", "side", "segment", "tradedQty", "tradePrice", "tradeValue", "symbol"]} rows={OrdersList} />}
        </div>
    )
}
