import { useEffect, useState } from "react"
import Dropdown from "../../../Dropdown"

import Head from "next/head"
import tableStyle from "../../../Table/style.module.css"
import css from "./style.module.css"

export default function OptionChain({ marketData }: { marketData: any }) {
    const [isLoading, setLoading] = useState(false)
    const [currentExpiry, setCurrentExpiry] = useState<any>("")
    const [expiryList, setExpiryList] = useState<any>([])
    const [currentExpiryOptionChain, setCurrentExpiryOptionChain] = useState<any>([])
    useEffect(() => {
        setLoading(true)
        fetch("/api/optionChain?symbol=BANKNIFTY")
            .then((res) => res.json())
            .then((d: optionChainApi) => {
                console.log(d)
                const expiryList = d.expiryList
                setCurrentExpiry(d.currentExpiry)
                setExpiryList(expiryList)
                setCurrentExpiryOptionChain(d.optionChainList)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }, [])
    return (
        <div>
            <Head>
                <title>Orders</title>
            </Head>
            <div className={css.pageWrapper}>
                <div className={css.headerWrapper}>
                    <h1>Option Chain</h1>
                    <a>{currentExpiry}</a>
                    <Dropdown items={expiryList} callbackFunction={setCurrentExpiry} />

                    <table className={tableStyle.table}>
                        <thead>
                            <tr>
                                <th>CE</th>
                                <th>STRIKE PRICE</th>
                                <th>PE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentExpiryOptionChain.length > 0 &&
                                currentExpiryOptionChain.map((option: any, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td>{marketData[option.CE] ? marketData[option.CE].lp : option.CE_LTP}</td>
                                            <td>{option.strike}</td>
                                            <td>{marketData[option.PE] ? marketData[option.PE].lp : option.PE_LTP}</td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

// ATP
// :
// 549.1
// L2_LTT
// :
// 1686295237
// LTQ
// :
// 25
// ask
// :
// 511.9
// bid
// :
// 510.8
// ch
// :
// -15.5
// chp
// :
// -2.94
// cmd
// :
// {c: 511.55, h: 512.5, l: 504, o: 505.35, t: 1686295200, …}
// description
// :
// "NSE:BANKNIFTY2361543700CE"
// exchange
// :
// "NSE"
// high_price
// :
// "630"
// low_price
// :
// 448.6
// lp
// :
// 511.55
// marketStat
// :
// 2
// open_price
// :
// 542.25
// original_name
// :
// "NSE:BANKNIFTY2361543700CE"
// prev_close_price
// :
// 527.05
// short_name
// :
// "BANKNIFTY2361543700CE"
// spread
// :
// 1.099999999999966
// symbol
// :
// "NSE:BANKNIFTY2361543700CE"
// tot_buy
// :
// 87550
// tot_sell
// :
// 35400
// tt
// :
// 1686295238
// volume
// :
// 2520975
