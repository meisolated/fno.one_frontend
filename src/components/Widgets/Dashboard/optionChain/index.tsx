import { useEffect, useState } from "react"
import Dropdown from "../../../Dropdown"

import Head from "next/head"
import TextInput from "../../../InputText"
import tableStyle from "../../../Table/style.module.css"
import css from "./style.module.css"

export default function OptionChain({ marketData }: any) {
    const [isLoading, setLoading] = useState(false)
    const [currentExpiry, setCurrentExpiry] = useState<String>("")
    const [expiryList, setExpiryList] = useState<any>([])
    const [currentExpiryOptionChain, setCurrentExpiryOptionChain] = useState<any>([])
    useEffect(() => {
        setLoading(true)
        fetch("/api/optionChain?symbol=BANKNIFTY")
            .then((res) => res.json())
            .then((d: any) => {
                const expiryList = d.expiryList
                setCurrentExpiry(d.currentExpiry)
                setExpiryList(expiryList)
                setCurrentExpiryOptionChain(d.optionChainList)
                setLoading(false)
            })
            .catch((err) => {
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
                    <Dropdown items={expiryList} callbackFunction={setCurrentExpiry} />
                    <NewTradeSettingsWidget currentExpiryOptionChain={currentExpiryOptionChain} marketData={marketData} />
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

const NewTradeSettingsWidget = ({ currentExpiryOptionChain, marketData }: any) => {
    const [side, setSide] = useState(1)
    const [quantity, setQuantity] = useState(0)
    const [optionPrice, setOptionPrice] = useState(0)
    const [RiskToRewardRatio, setRiskToRewardRatio] = useState(0)
    const [stopLoss, setStopLoss] = useState(0)
    const [closestOption, setClosestOption] = useState(0)
    const [fundsRequirement, setFundsRequirement] = useState(0)
    const [maxLoss, setMaxLoss] = useState(0)

    const onChangeSide = () => {
        const _side = side == 1 ? -1 : 1
        setSide(_side)
    }
    const onChangeQuantity = (value: any) => {
        setQuantity(value)
        onFormUpdate()
    }
    const onChangeOptionPrice = (value: any) => {
        setOptionPrice(value)
        onFormUpdate()
    }
    const onChangeRiskToRewardRatio = (value: any) => {
        setRiskToRewardRatio(value)
        onFormUpdate()
    }
    const onChangeStopLoss = (value: any) => {
        setStopLoss(value)
        onFormUpdate()
    }

    const onFormUpdate = () => {
        if (quantity !== 0 && optionPrice !== 0 && RiskToRewardRatio !== 0 && stopLoss !== 0) {
            const _closestOption = quantity * optionPrice
            const _fundsRequirement = quantity * optionPrice
            const _maxLoss = quantity * optionPrice
            setClosestOption(_closestOption)
            setFundsRequirement(_fundsRequirement)
            setMaxLoss(_maxLoss)
        }
    }

    function findClosestNumber() {
        if (optionPrice == 0) return
        currentExpiryOptionChain.map((option: any, index: number) => {
            if (side == 1) {
                const ltp = marketData[option.CE] ? marketData[option.CE].lp : option.CE_LTP
                if (optionPrice > ltp) {
                }
            }
        })
    }

    return (
        <div className={css.newTradeSettingsWidget}>
            <div className={css.newTradeSettingsLeftChild}>
                <div className={css.newTradeSettingsWidgetChild}>
                    <TextInput placeholder="Quantity " type="number" onChange={(value: any) => onChangeQuantity(value)} />
                    <TextInput placeholder="Option Price" type="number" onChange={(value: any) => onChangeOptionPrice(value)} />
                </div>
                <div className={css.newTradeSettingsWidgetChild}>
                    <TextInput placeholder="Risk to Reward Ratio" type="number" onChange={(value: any) => onChangeRiskToRewardRatio(value)} />
                    <TextInput placeholder="StopLoss" type="number" onChange={(value: any) => onChangeStopLoss(value)} />
                </div>
                <div className={css.newTradeSide}>
                    <button className={` ${side == 1 ? css.buySideButton : css.sellSideButton}`} onClick={() => onChangeSide()}>
                        {side == 1 ? "CALL" : "PUT"} SIDE
                    </button>
                </div>
                <button className={css.placeOrderButton}>Place Order</button>
            </div>
            <div className={css.newTradeSettingsRightChild}>
                <div>Closest Option {closestOption}</div>
                <div>Funds Requirement {fundsRequirement}</div>
                <div>Max Loss {maxLoss}</div>
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
