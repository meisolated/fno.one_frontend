import Head from "next/head"
import { useEffect, useState } from "react"
import { roundToNearestMultiple } from "../../../../helper"
import NumberInput from "../../../Input/Number"
import Selector from "../../../Selector"
import tableStyle from "../../../Table/style.module.css"
import css from "./style.module.css"

interface props {
    marketData: any
    optionChainData: any
    user: any
    indexLTP: any
}

export default function OptionChain({ marketData, optionChainData, user, indexLTP }: props) {
    // const indies = ["BANKNIFTY", "NIFTY", "FINNIFTY"]
    const [isLoading, setLoading] = useState(true)
    const [optionChain, setCurrentOptionChain] = useState<any>([])
    const [allIndiesOptionChain, setAllIndiesOptionChain] = useState<any>({})
    const [index, setIndex] = useState<any>("BANKNIFTY")
    const [indies, setIndies] = useState<any>(["BANKNIFTY", "NIFTY", "FINNIFTY"])
    const [indiesConfig, setIndiesConfig] = useState<any>({})
    const [ATMStrikePrice, setATMStrikePrice] = useState<any>(null)

    function calculateATMStrikePrice() {
        const currentIndexLTP = indexLTP[indiesConfig[index].name]
        const roundOffPrice = roundToNearestMultiple(currentIndexLTP, indiesConfig[index].strikePriceGap)
        const filteredOptions = allIndiesOptionChain[index].filter((option: any) => option.strike == roundOffPrice)
        setATMStrikePrice(filteredOptions)
    }
    function onIndexChange(_index: any) {
        setIndex(_index)
        setCurrentOptionChain(allIndiesOptionChain[_index])
    }
    useEffect(() => {
        if (!indexLTP[indiesConfig[index]?.name]) return
        calculateATMStrikePrice()
    }, [indiesConfig, index, indexLTP])
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
                    <NewTradeSettingsWidget currentExpiryOptionChain={optionChain} marketData={marketData} indiesConfig={indiesConfig} index={index} user={user} indexLTP={indexLTP} />
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
                    <OptionChainWidget optionChain={optionChain} marketData={marketData} ATMStrikePrice={ATMStrikePrice} />
                </div>
            </div>
        </div>
    )
}
const NewTradeSettingsWidget = ({ currentExpiryOptionChain, marketData, indiesConfig, index, user, indexLTP }: any) => {
    // ------------------| States  |------------------
    const [callOrPut, setCallOrPut] = useState(1)
    const [quantity, setQuantity] = useState(0)
    const [userOptionPrice, setUserOptionPrice] = useState<any>("")
    const [currentOptionPrice, setCurrentOptionPrice] = useState<any>(0)
    const [riskToRewardRatio, setRiskToRewardRatio] = useState(0)
    const [stopLoss, setStopLoss] = useState(0)
    const [closestOption, setClosestOption] = useState(null)
    const [closestOptionStrikeSymbol, setClosestOptionStrikeSymbol] = useState<any>({})
    const [fundsRequirement, setFundsRequirement] = useState(0)
    const [maxLoss, setMaxLoss] = useState(0)
    const [maxProfit, setMaxProfit] = useState(0)
    const [paceOrderResponse, setPlaceOrderResponse] = useState<any>(null)
    const [positionTypes, setPositionTypes] = useState<any>([])
    const [positionType, setPositionType] = useState<any>("")
    const [fundsToUse, setFundsToUse] = useState<any>(0)
    const [lotSize, setLotSize] = useState<any>(0)

    // ------------------| States END  |------------------

    // ------------------| Functions  |------------------
    const onChangeSide = () => {
        const _side = callOrPut == 1 ? -1 : 1
        setCallOrPut(_side)
    }
    const onChangeQuantity = (value: any) => {
        setQuantity(value)
    }
    const onChangeOptionPrice = (value: any) => {
        setUserOptionPrice(value)
    }
    const onChangeRiskToRewardRatio = (value: any) => {
        setRiskToRewardRatio(value)
    }
    const onChangeStopLoss = (value: any) => {
        setStopLoss(value)
    }

    const calculateQuantity = (fundsToUse: any, optionPrice: any, lotSize: any) => {
        const quantity = fundsToUse / optionPrice
        return Math.floor(quantity / lotSize) * lotSize || 0
    }

    const onRefreshUpdateTradeInsights = () => {
        // first we will find the nearest strike price to the price provided by the user
        const nearestOption = findNearestStrikePrice(currentExpiryOptionChain, callOrPut == 1 ? "CE" : "PE", userOptionPrice)
        if (!nearestOption) return console.log("No nearest option found")
        setClosestOption(nearestOption)
        setClosestOptionStrikeSymbol({ fy: nearestOption.other.fy[callOrPut == 1 ? "CE" : "PE"], trueData: nearestOption[callOrPut == 1 ? "CE" : "PE"] })
        const optionPriceToUse = nearestOption[`${callOrPut == 1 ? "CE" : "PE"}_LTP`]
        const _quantity = calculateQuantity(fundsToUse, optionPriceToUse, lotSize)
        setQuantity(_quantity)
        if (_quantity !== 0 && optionPriceToUse !== 0) {
            setFundsRequirement(_quantity * nearestOption[`${callOrPut == 1 ? "CE" : "PE"}_LTP`])
        }
        if (riskToRewardRatio !== 0 && stopLoss !== 0 && _quantity !== 0 && optionPriceToUse !== 0) {
            setMaxLoss(_quantity * stopLoss)
            setMaxProfit(_quantity * (riskToRewardRatio * stopLoss))
        }
    }

    function getATMStrikePrice() {
        const currentIndexLTP = indexLTP[indiesConfig[index].name]
        const roundOffPrice = roundToNearestMultiple(currentIndexLTP, indiesConfig[index].strikePriceGap)
        const filteredOptions = currentExpiryOptionChain.filter((option: any) => option.strike == roundOffPrice)
        return filteredOptions
    }
    function findNearestStrikePrice(options: any, side: string, targetPrice: any) {
        if (targetPrice === "ATM") {
            const atmStrikePrice = getATMStrikePrice()
            if (atmStrikePrice.length === 0) {
                console.error(`No options found for side ${side}`)
                return null
            } else {
                const filteredOptions = atmStrikePrice //.filter(option => option[side] === `BANKNIFTY231004${option.strike}${side}`)
                if (filteredOptions.length === 0) {
                    console.error(`No options found for side ${side}`)
                    return null
                }
                const nearestOption = filteredOptions.reduce((prev: any, curr: any) => {
                    return Math.abs(curr[`${side}_LTP`] - targetPrice) < Math.abs(prev[`${side}_LTP`] - targetPrice) ? curr : prev
                })
                return nearestOption
            }
        } else {
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
    }
    // ------------------| Functions END  |------------------
    // ------------------| Button Click Functions  |------------------
    async function onPlaceOrder() {
        if (quantity == 0 || userOptionPrice == 0 || riskToRewardRatio == 0 || stopLoss == 0) return setPlaceOrderResponse("Please fill all the fields")
        if (closestOptionStrikeSymbol == "") return setPlaceOrderResponse("Please refresh the trade insights")
        if (quantity % indiesConfig[index].lotSize !== 0) return setPlaceOrderResponse("Quantity should be multiple of lot size")
        if (stopLoss > userOptionPrice) return setPlaceOrderResponse("Stop loss should be less than option price")
        const sendOrderReq = await fetch("/internalApi/placeOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                symbol: closestOptionStrikeSymbol.fy,
                quantity: quantity,
                riskToReward: riskToRewardRatio,
                positionType: "scalping",
                stopLoss: stopLoss,
                orderSide: 1, // Buy by default
            }),
        })
        const sendOrderRes = await sendOrderReq.json()
        setPlaceOrderResponse(JSON.stringify(sendOrderRes))
        console.log(sendOrderRes)
    }
    // ------------------| Button Click Functions END  |------------------

    // ------------------| useEffects  |------------------
    useEffect(() => {
        onRefreshUpdateTradeInsights()
        setLotSize(indiesConfig[index].lotSize)
    }, [callOrPut, userOptionPrice, riskToRewardRatio, stopLoss, index])

    useEffect(() => {
        if (!user.serverData.positionTypes) return
        const positionTypes = Object.keys(user.serverData.positionTypes)
        setPositionTypes(positionTypes)
    }, [])

    function fundsAllowedToUse(user: any) {
        // const fundsToUseBasedOnDay = user.funds.fyers.available *
    }
    useEffect(() => {
        if (!user.positionTypeSettings[positionType]?.preferredOptionPrice) return
        setUserOptionPrice(user.positionTypeSettings[positionType]?.preferredOptionPrice)
        setRiskToRewardRatio(user.positionTypeSettings[positionType]?.riskToRewardRatio)
        // const fundsAllowedToUseToday =
        setFundsToUse(user.positionTypeSettings[positionType]?.fundsToUse)
        setStopLoss(user.positionTypeSettings[positionType]?.stopLoss)
    }, [positionType])

    useEffect(() => {
        if (!closestOption) return
        const optionPrice = marketData[closestOption[callOrPut == 1 ? "CE" : "PE"]]?.lp || closestOption[`${callOrPut == 1 ? "CE" : "PE"}_LTP`]
        setCurrentOptionPrice(optionPrice)
    }, [marketData, currentExpiryOptionChain, closestOption, callOrPut])

    // ------------------| useEffects END  |------------------
    return (
        <>
            <div>Trade Setting</div>
            <div className={css.newTradeSettingsWidget}>
                <div className={css.newTradeSettingsLeftChild}>
                    <Selector label={"Position Type"} itemsList={positionTypes} selectionChanged={(item: any) => setPositionType(item)} />
                    <div className={css.newTradeSettingsWidgetChild}>
                        <NumberInput placeholder="Quantity" onChange={(value: any) => onChangeQuantity(value)} incrementalValue={indiesConfig[index].lotSize} maxValue={0} startValue={quantity} />
                        <NumberInput placeholder="Option Price" onChange={(value: any) => onChangeOptionPrice(value)} incrementalValue={1} maxValue={0} startValue={userOptionPrice} />
                    </div>
                    <div className={css.newTradeSettingsWidgetChild}>
                        <NumberInput placeholder="RR Ratio" onChange={(value: any) => onChangeRiskToRewardRatio(value)} incrementalValue={1} maxValue={0} startValue={riskToRewardRatio} />
                        <NumberInput placeholder="StopLoss" onChange={(value: any) => onChangeStopLoss(value)} incrementalValue={1} maxValue={0} startValue={stopLoss} />
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
                    <div>Current Option Price: {currentOptionPrice}</div>
                    <div>Funds Requirement: {fundsRequirement}</div>
                    <div>Max Loss: {maxLoss}</div>
                    <div>Max Profit: {maxProfit}</div>
                    <button onClick={onRefreshUpdateTradeInsights}>refresh</button>
                </div>
            </div>
        </>
    )
}

const OptionChainWidget = ({ optionChain, marketData, ATMStrikePrice }: any) => {
    const [_ATMStrikePrice, setATMStrikePrice] = useState<any>([])

    useEffect(() => {
        if (!ATMStrikePrice) return
        setATMStrikePrice([ATMStrikePrice[0].CE, ATMStrikePrice[0].PE])
    }, [ATMStrikePrice])
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
                            <tr key={index} className={_ATMStrikePrice.includes(option.CE || option.PE) ? css.ATMStrikePriceAlteration : ""}>
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
