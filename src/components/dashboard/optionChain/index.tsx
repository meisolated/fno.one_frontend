import { Dropdown, Table } from "@nextui-org/react"
import Head from "next/head"
import { useEffect, useState } from "react"
import css from "./style.module.css"

export default function OptionChain({ marketData }: { marketData: any }) {
    const [isLoading, setLoading] = useState(false)
    const [currentExpiry, setCurrentExpiry] = useState<any>("")
    const [expiryList, setExpiryList] = useState<any>([])
    const [strikePrices, setStrikePrices] = useState<any>([])
    const [currentExpiryOptionChain, setCurrentExpiryOptionChain] = useState<any>([])
    useEffect(() => {
        setLoading(true)
        fetch("/api/optionChain?symbol=BANKNIFTY")
            .then((res) => res.json())
            .then((d: optionChainApi) => {
                console.log(d)
                const expiryList = Object.keys(d.expiryListWithStrikePrices)
                setCurrentExpiry(d.currentExpiry)
                setStrikePrices(d.strikePrices)
                setExpiryList(expiryList)
                setCurrentExpiryOptionChain(d.expiryListWithStrikePrices[d.currentExpiry])

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
                    {/* make drop down of expiry list */}
                    <Dropdown>
                        <Dropdown.Button flat>Expiry {currentExpiry}</Dropdown.Button>
                        <Dropdown.Menu aria-label="Dynamic Actions" items={expiryList}>
                            {expiryList.map((expiry: any, index: number) => {
                                return <Dropdown.Item key={index}>{expiry}</Dropdown.Item>
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                    {currentExpiryOptionChain.length > 0 &&
                        currentExpiryOptionChain.map((option: any, index: number) => {
                            return (
                                <div key={index}>
                                    <a>{option.identifier}:</a>
                                    <a>{marketData[option.identifier] ? marketData[option.identifier].lp : 0}</a>
                                </div>
                            )
                        })}
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