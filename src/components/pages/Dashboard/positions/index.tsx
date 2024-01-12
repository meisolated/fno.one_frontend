import Head from "next/head"
import React, { useEffect, useState } from "react"
import badgeStyle from "../../../Badge/style.module.css"
import Dropdown from "../../../Dropdown"
import tableStyle from "../../../Table/style.module.css"

export default function Positions() {
    const [positionsList, setPositionsList] = useState([])
    const [filteredPositionsList, setFilteredPositionsList] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [totalProfitOrLoss, setTotalProfitOrLoss] = useState("")
    const [months, setMonths] = useState(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novermber", "December"])
    const [daysList, setDaysList] = useState(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])
    const [yearsList, setYearsList] = useState([2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026])
    const [year, setYear] = useState(new Date().getFullYear())
    const [currentMonth, setCurrentMonth] = useState("")

    function _totalProfitOrLoss(_positionsList: any) {
        let totalProfitOrLoss = 0
        _positionsList.forEach((position: any) => {
            totalProfitOrLoss += position.quantity * (position.sellAveragePrice - position.buyAveragePrice)
        })
        return totalProfitOrLoss.toFixed(2)
    }
    function _onMonthChange(_month: string) {
        const filteredPositions = positionsList.filter((position: any) => {
            const date = new Date(position.createdAt)
            const positionMonth = date.getMonth()
            return positionMonth === months.indexOf(_month)
        })
        setTotalProfitOrLoss(_totalProfitOrLoss(filteredPositions))
        setCurrentMonth(_month)
        setFilteredPositionsList(filteredPositions)
    }
    function _filterDataByDate(_positionsList: any) {
        const filteredPositionsList: any = {}
        _positionsList.map((position: any) => {
            const date = new Date(position.createdAt)
            const positionDate = date.getDate()
            const positionMonth = date.getMonth()
            const positionYear = date.getFullYear()
            const day = daysList[date.getDay()]
            filteredPositionsList[`${day}, ${positionDate} ${months[positionMonth]} ${positionYear}`] = position

        })
        return filteredPositionsList
    }
    useEffect(() => {
        setLoading(true)
        fetch("/internalApi/user/getAllPositions")
            .then((res) => res.json())
            .then((data) => {
                const filteredData = data.data//.filter((position: any) => position.quantity !== 0 && position.buyAveragePrice !== 0 && position.sellAveragePrice !== 0)
                setPositionsList(filteredData)
                setFilteredPositionsList(filteredData)
                setTotalProfitOrLoss(_totalProfitOrLoss(filteredData))
                _filterDataByDate(filteredData)
                setLoading(false)
            })
    }, [])
    return (
        <div>
            <Head>
                <title>Positions</title>
            </Head>
            <h1>positions</h1>

            {totalProfitOrLoss}
            <Dropdown items={months} callbackFunction={(e: any) => _onMonthChange(e)} />
            {!isLoading && (
                <table className={tableStyle.table}>
                    <thead>
                        <tr>
                            <th>SYMBOL</th>
                            <th>QUANTITY</th>
                            <th>SIDE</th>
                            <th>Buy Average</th>
                            <th>Sell Average</th>
                            <th>Profit/Loss</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPositionsList.map((order: any, index: any) => (
                            <tr key={index}>
                                <td>{order.symbol}</td>
                                <td>{order.quantity}</td>
                                <td>{order.side === 1 ? <div className={badgeStyle.buyBadge}>BUY</div> : <div className={badgeStyle.sellBadge}>SELL</div>}</td>
                                <td>{order.buyAveragePrice}</td>
                                <td>{order.sellAveragePrice}</td>
                                <td>{(order.quantity * (order.sellAveragePrice - order.buyAveragePrice)).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
