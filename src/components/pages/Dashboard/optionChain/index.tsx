import Head from "next/head"
import { useEffect, useState } from "react"
import { roundToNearestMultiple } from "../../../../helper"
import NumberInput from "../../../Input/Number"
import Loading from "../../../Loading"
import Selector from "../../../Selector"
import tableStyle from "../../../Table/style.module.css"
import { useToast } from "../../../Toast/provider"
import css from "./style.module.css"

interface props {
    marketData: any
    optionChainData: any
    user: any
    indexLTP: any
    serverData: any
}

export default function OptionChain({ marketData, optionChainData, user, indexLTP, serverData }: props) {
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

    if (isLoading) return <Loading />
    return (
        <div>
            <Head>
                <title>Option Chain</title>
            </Head>
            <div className={css.pageWrapper}>
                <div className={css.headerWrapper}>
                    <h1>Option Chain</h1>
                    <NewTradeSettingsWidget
                        currentExpiryOptionChain={optionChain}
                        marketData={marketData}
                        indiesConfig={indiesConfig}
                        index={index}
                        user={user}
                        indexLTP={indexLTP}
                        serverData={serverData}
                    />
                    <Selector label={"Switch Index"} itemsList={indies} selectionChanged={(item: any) => onIndexChange(item)} />

                    <OptionChainWidget optionChain={optionChain} marketData={marketData} ATMStrikePrice={ATMStrikePrice} />
                </div>
            </div>
        </div>
    )
}
const NewTradeSettingsWidget = ({ currentExpiryOptionChain, marketData, indiesConfig, index, user, indexLTP, serverData }: any) => {
    // ------------------| States  |------------------
    const [callOrPutList] = useState<any>(["call", "put"])
    const [sideList] = useState<any>(["buy", "sell"])
    const [callOrPut, setCallOrPut] = useState(1)
    const [quantity, setQuantity] = useState(0)
    const [side, setSide] = useState<number>(-1)
    const [userOptionPrice, setUserOptionPrice] = useState<any>(0)
    const [currentOptionPrice, setCurrentOptionPrice] = useState<number>(0)
    const [riskToRewardRatio, setRiskToRewardRatio] = useState<number>(0)
    const [stopLoss, setStopLoss] = useState<number>(0)
    const [closestOption, setClosestOption] = useState(null)
    const [closestOptionStrikeSymbol, setClosestOptionStrikeSymbol] = useState<any>({})
    const [fundsRequirement, setFundsRequirement] = useState<number>(0)
    const [maxLoss, setMaxLoss] = useState<number>(0)
    const [maxProfit, setMaxProfit] = useState<number>(0)
    const [positionTypes, setPositionTypes] = useState<any>([])
    const [positionType, setPositionType] = useState<any>("")
    const [fundsToUse, setFundsToUse] = useState<number>(0)
    const [lotSize, setLotSize] = useState<number>(0)
    const [placeOrderButtonState, setPlaceOrderButtonState] = useState<any>(true)
    const [optionPriceToUse, setOptionPriceToUse] = useState<any>(0)
    const showToast = useToast()

    // ------------------| States END  |------------------

    // ------------------| Functions  |------------------
    const onCallOrPutChange = (e: string) => {
        const _side = e == "call" ? 1 : -1
        setCallOrPut(_side)
    }
    const onChangeSide = (e: string) => {
        const _side = e == "buy" ? 1 : -1
        setSide(_side)
    }
    const onChangeQuantity = (value: any) => {
        setQuantity(value)
    }
    const onChangeOptionPrice = (value: any) => {
        setUserOptionPrice(parseFloat(value))
    }
    const onChangeRiskToRewardRatio = (value: any) => {
        setRiskToRewardRatio(parseInt(value))
    }
    const onChangeStopLoss = (value: any) => {
        setStopLoss(value)
    }

    const calculateQuantity = (fundsToUse: any, optionPrice: any) => {
        const quantity = fundsToUse / optionPrice
        return Math.floor(quantity / indiesConfig[index].lotSize) * indiesConfig[index].lotSize || 0
    }

    const onRefreshUpdateTradeInsights = () => {
        // first we will find the nearest strike price to the price provided by the user
        const nearestOption = findNearestStrikePrice(currentExpiryOptionChain, callOrPut == 1 ? "CE" : "PE", userOptionPrice)
        if (!nearestOption) return console.log("No nearest option found")
        setClosestOption(nearestOption)
        setClosestOptionStrikeSymbol({ fy: nearestOption.other.fy[callOrPut == 1 ? "CE" : "PE"], trueData: nearestOption[callOrPut == 1 ? "CE" : "PE"] })
        const optionPriceToUse = nearestOption[`${callOrPut == 1 ? "CE" : "PE"}_LTP`]
        setOptionPriceToUse(optionPriceToUse)
        const _quantity = calculateQuantity(fundsToUse, optionPriceToUse)
        setQuantity(_quantity)
        if (_quantity !== 0 && optionPriceToUse !== 0) {
            setFundsRequirement(parseFloat((_quantity * nearestOption[`${callOrPut == 1 ? "CE" : "PE"}_LTP`]).toFixed(2)))
        }
        if (riskToRewardRatio !== 0 && stopLoss !== 0 && _quantity !== 0 && optionPriceToUse !== 0) {
            setMaxLoss(_quantity * stopLoss)
            setMaxProfit(_quantity * (riskToRewardRatio * stopLoss))
        }
        // if sell side check if the premium is greater than the stop loss * risk to reward ratio
        if (side == -1) {
            if (optionPriceToUse < stopLoss * riskToRewardRatio) {
                showToast(`Option premium is greater than stop loss * risk to reward ratio`, "error")
                setPlaceOrderButtonState(false)
                // setTimeout(() => setPlaceOrderButtonState(true), 10000)
            } else {
                setPlaceOrderButtonState(true)
            }
        } else {
            setPlaceOrderButtonState(true)
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
    function fundsAllowedToUse(user: any) {
        const fundsToUseBasedOnPercentageOfFundsAllocated = parseFloat(((user.funds.fyers.available / 100) * user.moneyManager.percentageOfFundsToUse).toFixed(2))
        if (serverData.todaysDay == "saturday" || serverData.todaysDay == "sunday") return fundsToUseBasedOnPercentageOfFundsAllocated / 2
        const fundsToUseBasedOnWeekDay = parseFloat(((fundsToUseBasedOnPercentageOfFundsAllocated / 100) * user.moneyManager.weekDays[serverData.todaysDay].percentageOfFundsToUse).toFixed(2))
        const fundsToUseBasedOnPositionType = parseFloat(((fundsToUseBasedOnWeekDay / 100) * user.positionTypeSettings[positionType].percentageOfFundsToUse).toFixed(2))
        return fundsToUseBasedOnPositionType
    }

    // ------------------| Functions END  |------------------
    // ------------------| Button Click Functions  |------------------
    async function onPlaceOrder() {
        if (!placeOrderButtonState) return
        setPlaceOrderButtonState(false)
        if (quantity == 0 || userOptionPrice == 0 || riskToRewardRatio == 0 || stopLoss == 0) return showToast("Please fill all the fields", "error")
        if (closestOptionStrikeSymbol == "") return showToast("Please refresh the trade insights", "error")
        if (quantity % indiesConfig[index].lotSize !== 0) return showToast(`Quantity should be multiple of lot size ${indiesConfig[index].lotSize}, current quantity ${quantity}`, "error")
        if (stopLoss > userOptionPrice) return showToast(`Stop loss should be less than option price ${userOptionPrice}, current stop loss ${stopLoss}`, "error")
        const sendOrderReq = await fetch("/internalApi/placeOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                symbol: closestOptionStrikeSymbol.fy,
                quantity: quantity,
                limitPrice: currentOptionPrice,
                riskToReward: riskToRewardRatio,
                positionType: positionType,
                stopLoss: stopLoss,
                orderSide: side,
                // callOrPut: callOrPut,
            }),
        })
        const sendOrderRes = await sendOrderReq.json()
        if (sendOrderRes.code == 200) {
            showToast(sendOrderRes.message, "success")
        } else {
            showToast(sendOrderRes.message, "error")
        }
        setTimeout(() => setPlaceOrderButtonState(true), 10000)
    }
    // ------------------| Button Click Functions END  |------------------

    // ------------------| useEffects  |------------------
    useEffect(() => {
        setLotSize(indiesConfig[index].lotSize)
        onRefreshUpdateTradeInsights()
    }, [callOrPut, userOptionPrice, riskToRewardRatio, stopLoss, side, index])

    useEffect(() => {
        if (!user.serverData.positionTypes) return
        const positionTypes = Object.keys(user.serverData.positionTypes)
        setPositionTypes(positionTypes)
    }, [])

    useEffect(() => {
        if (!user.positionTypeSettings[positionType]?.preferredOptionPrice) return
        setUserOptionPrice(user.positionTypeSettings[positionType]?.preferredOptionPrice)
        setRiskToRewardRatio(parseFloat(user.positionTypeSettings[positionType]?.riskToRewardRatio))
        setStopLoss(parseFloat(user.positionTypeSettings[positionType]?.stopLoss))
        setFundsToUse(fundsAllowedToUse(user))
    }, [positionType])

    useEffect(() => {
        if (!closestOption) return
        const optionPrice = marketData[closestOption[callOrPut == 1 ? "CE" : "PE"]]?.lp || closestOption[`${callOrPut == 1 ? "CE" : "PE"}_LTP`]
        setCurrentOptionPrice(parseFloat(optionPrice))
    }, [marketData, currentExpiryOptionChain, closestOption, callOrPut])

    // ------------------| useEffects END  |------------------
    if (!user) return <div>Loading...</div>
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
                        {/* <button className={` ${callOrPut == 1 ? css.callButton : css.putButton}`} onClick={() => onChangeSide()}>
                            {callOrPut == 1 ? "CALL" : "PUT"}
                        </button> */}
                        <Selector label="Side" itemsList={sideList} selectionChanged={(e: string) => onChangeSide(e)} />
                        <Selector label="Call Or Put" itemsList={callOrPutList} selectionChanged={(e: string) => onCallOrPutChange(e)} />
                    </div>
                    <button onClick={onPlaceOrder} className={`${placeOrderButtonState ? css.placeOrderButton : css.disabledPlaceOrderButton}`}>
                        Place Order
                    </button>
                </div>
                <div className={css.newTradeSettingsRightChild}>
                    <div>Closest Option: {closestOptionStrikeSymbol.fy}</div>
                    <div>Current Option Price: {currentOptionPrice}</div>
                    <div>Funds Requirement: {fundsRequirement}</div>
                    <div>Max Loss: {maxLoss}</div>
                    <div>Max Profit: {maxProfit}</div>
                    {/* <button onClick={onRefreshUpdateTradeInsights}>refresh</button> */}
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
