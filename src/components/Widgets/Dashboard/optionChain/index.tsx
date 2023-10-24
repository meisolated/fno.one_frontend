import Head from "next/head"
import { useEffect, useState } from "react"
import TextInput from "../../../Input"
import tableStyle from "../../../Table/style.module.css"
import css from "./style.module.css"

export default function OptionChain({ marketData, optionChainData }: any) {
    // const indies = ["BANKNIFTY", "NIFTY", "FINNIFTY"]
    const [isLoading, setLoading] = useState(true)
    const [optionChain, setCurrentOptionChain] = useState<any>([])
    const [allIndiesOptionChain, setAllIndiesOptionChain] = useState<any>({})
    const [index, setIndex] = useState<any>("BANKNIFTY")
    const [indies, setIndies] = useState<any>(["BANKNIFTY", "NIFTY", "FINNIFTY"])
    const [indiesConfig, setIndiesConfig] = useState<any>({})

    function onIndexChange(_index: any) {
        setIndex(_index)
        setCurrentOptionChain(allIndiesOptionChain[_index])
    }

    useEffect(() => {
        if (!optionChainData.indies && !optionChain.allIndiesOptionChain && !optionChainData.indiesConfig) return
        setIndies(optionChainData.indies)
        setCurrentOptionChain(optionChainData.allIndiesOptionChain[index])
        setAllIndiesOptionChain(optionChainData.allIndiesOptionChain)
        setIndiesConfig(optionChainData.indiesConfig)
        setLoading(false)
    }, [optionChainData])

    if (isLoading) return <div>Loading...</div>
    return (
        <div>
            <Head>
                <title>Option Chain</title>
            </Head>
            <div className={css.pageWrapper}>
                <div className={css.headerWrapper}>
                    <h1>Option Chain</h1>
                    <NewTradeSettingsWidget currentExpiryOptionChain={optionChain} marketData={marketData} indiesConfig={indiesConfig} index={index} />
                    <div className={css.chooseIndex}>
                        Switch Index
                        <div className={css.indexList}>
                            {indies.map((_index: any, indexKey: any) => {
                                return (
                                    <div className={`${_index == index ? css.indexButtonActive : css.indexButton}`} key={indexKey} onClick={() => onIndexChange(_index)}>
                                        {_index}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <OptionChainWidget optionChain={optionChain} marketData={marketData} />
                </div>
            </div>
        </div>
    )
}

const OptionChainWidget = ({ optionChain, marketData }: any) => {
    return (
        <table className={tableStyle.table}>
            <thead>
                <tr>
                    <th>CE</th>
                    <th>STRIKE PRICE</th>
                    <th>PE</th>
                </tr>
            </thead>
            <tbody>
                {optionChain.length > 0 &&
                    optionChain.map((option: any, index: number) => {
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
    )
}

const NewTradeSettingsWidget = ({ currentExpiryOptionChain, marketData, indiesConfig, index }: any) => {
    const [callOrPut, setCallOrPut] = useState(1)
    const [quantity, setQuantity] = useState(0)
    const [optionPrice, setOptionPrice] = useState(0)
    const [RiskToRewardRatio, setRiskToRewardRatio] = useState(0)
    const [stopLoss, setStopLoss] = useState(0)
    const [closestOption, setClosestOption] = useState(null)
    const [closestOptionStrikeSymbol, setClosestOptionStrikeSymbol] = useState<any>({})
    const [fundsRequirement, setFundsRequirement] = useState(0)
    const [maxLoss, setMaxLoss] = useState(0)
    const [maxProfit, setMaxProfit] = useState(0)
    const [paceOrderResponse, setPlaceOrderResponse] = useState<any>(null)

    const onChangeSide = () => {
        const _side = callOrPut == 1 ? -1 : 1
        setCallOrPut(_side)
    }
    const onChangeQuantity = (value: any) => {
        setQuantity(value)
    }
    const onChangeOptionPrice = (value: any) => {
        setOptionPrice(value)
    }
    const onChangeRiskToRewardRatio = (value: any) => {
        setRiskToRewardRatio(value)
    }
    const onChangeStopLoss = (value: any) => {
        setStopLoss(value)
    }

    useEffect(() => {
        onRefreshUpdateTradeInsights()
    }, [callOrPut, quantity, optionPrice, RiskToRewardRatio, stopLoss, index])

    const onRefreshUpdateTradeInsights = () => {
        // first we will find the nearest strike price to the price provided by the user
        const nearestOption = findNearestStrikePrice(currentExpiryOptionChain, callOrPut == 1 ? "CE" : "PE", optionPrice)
        if (!nearestOption) return
        setClosestOption(nearestOption)
        setClosestOptionStrikeSymbol({ fy: nearestOption.other.fy[callOrPut == 1 ? "CE" : "PE"], trueData: nearestOption[callOrPut == 1 ? "CE" : "PE"] })
        if (quantity !== 0 && optionPrice !== 0) {
            setFundsRequirement(quantity * nearestOption[`${callOrPut == 1 ? "CE" : "PE"}_LTP`])
        }
        if (RiskToRewardRatio !== 0 && stopLoss !== 0 && quantity !== 0 && optionPrice !== 0) {
            setMaxLoss(quantity * stopLoss)
            setMaxProfit(quantity * (RiskToRewardRatio * stopLoss))
        }
    }

    function findNearestStrikePrice(options: any, side: string, targetPrice: number) {
        const filteredOptions = options //.filter(option => option[side] === `BANKNIFTY231004${option.strike}${side}`)

        if (filteredOptions.length === 0) {
            console.error(`No options found for side ${side}`)
            return null
        }

        const nearestOption = filteredOptions.reduce((prev: any, curr: any) => {
            return Math.abs(curr[`${side}_LTP`] - targetPrice) < Math.abs(prev[`${side}_LTP`] - targetPrice) ? curr : prev
        })

        return nearestOption
    }

    async function onPlaceOrder() {
        if (quantity == 0 || optionPrice == 0 || RiskToRewardRatio == 0 || stopLoss == 0) return setPlaceOrderResponse("Please fill all the fields")
        if (closestOptionStrikeSymbol == "") return setPlaceOrderResponse("Please refresh the trade insights")
        if (quantity % indiesConfig[index].lotSize !== 0) return setPlaceOrderResponse("Quantity should be multiple of lot size")
        if (stopLoss > optionPrice) return setPlaceOrderResponse("Stop loss should be less than option price")
        const sendOrderReq = await fetch("/internalApi/placeOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                symbol: closestOptionStrikeSymbol.fy,
                quantity: quantity,
                riskToReward: RiskToRewardRatio,
                positionType: "scalpingPosition",
                stopLoss: stopLoss,
                orderSide: 1, // Buy by default
            }),
        })
        const sendOrderRes = await sendOrderReq.json()
        setPlaceOrderResponse(JSON.stringify(sendOrderRes))
        console.log(sendOrderRes)
    }

    return (
        <>
            <div>Trade Setting</div>
            <div className={css.newTradeSettingsWidget}>
                <div className={css.newTradeSettingsLeftChild}>
                    <div className={css.newTradeSettingsWidgetChild}>
                        <TextInput placeholder="Quantity " type="number" onChange={(value: any) => onChangeQuantity(value)} incrementalValue={indiesConfig[index].lotSize} />
                        <TextInput placeholder="Option Price" onChange={(value: any) => onChangeOptionPrice(value)} />
                    </div>
                    <div className={css.newTradeSettingsWidgetChild}>
                        <TextInput placeholder="RR Ratio" type="number" onChange={(value: any) => onChangeRiskToRewardRatio(value)} incrementalValue={1} />
                        <TextInput placeholder="StopLoss" onChange={(value: any) => onChangeStopLoss(value)} />
                    </div>
                    <div className={css.newTradeSide}>
                        <button className={` ${callOrPut == 1 ? css.buySideButton : css.sellSideButton}`} onClick={() => onChangeSide()}>
                            {callOrPut == 1 ? "CALL" : "PUT"} SIDE
                        </button>
                    </div>
                    <div>{paceOrderResponse}</div>
                    <button onClick={onPlaceOrder} className={css.placeOrderButton}>
                        Place Order
                    </button>
                </div>
                <div className={css.newTradeSettingsRightChild}>
                    <div>Closest Option: {closestOptionStrikeSymbol.fy}</div>
                    <div>Funds Requirement: {fundsRequirement}</div>
                    <div>Max Loss: {maxLoss}</div>
                    <div>Max Profit: {maxProfit}</div>
                    <button onClick={onRefreshUpdateTradeInsights}>refresh</button>
                </div>
            </div>
        </>
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
