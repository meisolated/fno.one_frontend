import Head from "next/head"
import { useEffect, useState } from "react"
import { capitalizeFirstLetter } from "../../../../helper"
import NumberInput from "../../../Input/Number"
import TextInput from "../../../Input/Text"
import Loading from "../../../Loading"
import Selector from "../../../Selector"
import { useToast } from "../../../Toast/provider"
import ToggleSwitch from "../../../ToggleSwitch"
import style from "./style.module.css"
export default function MoneyManager() {
    // ---- State Variables ----
    const [positionType, setPositionType] = useState<any>({
        long: { quantity: 0, preferredOptionPrice: 0, riskToRewardRatio: 0, stopLoss: 0 },
        scalping: { quantity: 0, preferredOptionPrice: 0, riskToRewardRatio: 0, stopLoss: 0 },
        swing: { quantity: 0, preferredOptionPrice: 0, riskToRewardRatio: 0, stopLoss: 0 },
        expiry: { quantity: 0, preferredOptionPrice: 0, riskToRewardRatio: 0, stopLoss: 0 },
    })
    const [moneyManager, setMoneyManager] = useState<any>({
        fundsToUse: 0,
    })
    const [funds, setFunds] = useState<any>({
        available: 0,
        total: 0,
        used: 0,
    })
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [saved, setSaved] = useState<boolean>(false)
    const [positionTypesList, setPositionTypesList] = useState<any>(["long", "scalping", "swing", "expiry"])
    const showToast = useToast()
    // ---- End of State Variables ----

    function onPositionTypeChange(_positionType: string, value: number) {
        setPositionType((prev: any) => {
            return {
                ...prev,
                [_positionType]: { ...positionType[_positionType], percentageOfFundsToUse: value, fundsToUse: ((moneyManager.fundsToUse * value) / 100).toFixed(2) },
            }
        })
    }

    async function onFundsToUseChange(value: number) {
        if (moneyManager.mode == "percentage") {
            setMoneyManager((prev: any) => {
                return { ...prev, percentageOfFundsToUse: value, fundsToUse: ((funds.available * value) / 100).toFixed(2) }
            })
        } else {
            setMoneyManager((prev: any) => {
                return { ...prev, fundsToUse: value }
            })
        }
    }
    function onQuantityChange(positionType: string, value: number) {
        setPositionType((prev: any) => {
            return { ...prev, [positionType]: { ...prev[positionType], quantity: value } }
        })
    }

    function onPreferredOptionPriceChange(positionType: string, value: number) {
        setPositionType((prev: any) => {
            return { ...prev, [positionType]: { ...prev[positionType], preferredOptionPrice: value } }
        })
    }
    function onRiskToRewardRatioChange(positionType: string, value: number) {
        setPositionType((prev: any) => {
            return { ...prev, [positionType]: { ...prev[positionType], riskToRewardRatio: value } }
        })
    }
    function onStopLossChange(positionType: string, value: number) {
        setPositionType((prev: any) => {
            return { ...prev, [positionType]: { ...prev[positionType], stopLoss: value } }
        })
    }

    // ---- Button Clicks Functions ----
    function onPositionTypeSaveButtonClicked() {
        if (isLoading) return
        if (saved) return
        fetch("/internalApi/user/updatePositionTypeSettings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                positionTypeSettings: positionType,
                moneyManager: moneyManager,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setSaved(true)
                showToast("Settings Saved", "success")
            })
            .catch((err) => {
                showToast("Error Saving Settings", "error")
            })
    }
    // ---- End of Button Clicks Functions ----

    // ---- End of Functions ----

    // ---- Use Effects ----
    useEffect(() => {
        if (saved) {
            setTimeout(() => {
                setSaved(false)
            }, 500)
        }
    }, [positionType, moneyManager])

    useEffect(() => {
        positionTypesList.map((item: any, index: number) => {
            return onPositionTypeChange(item.toLowerCase(), positionType[item.toLowerCase()].percentageOfFundsToUse)
        })
    }, [moneyManager])

    useEffect(() => {
        setIsLoading(true)
        fetch("/internalApi/user/get")
            .then((res) => res.json())
            .then(({ data }) => {
                setPositionType(data.positionTypeSettings)
                setMoneyManager(data.moneyManager)
                setFunds(data.funds.fyers)
            })
        fetch("/internalApi/serverData")
            .then((res) => res.json())
            .then(({ data }) => {
                setPositionTypesList(data.positionTypesList)
            })
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }, [])

    // ---- End of Use Effects ----
    if (isLoading) return <Loading />
    return (
        <div className={style.pageWrapper}>
            <Head>
                <title>Settings</title>
            </Head>
            <div className={style.settingsGrid}>
                <div className={style.settingsGridItem}>
                    <h2>Position Type Settings</h2>
                    <div className={style.positionTypeSettingsWrapper}>
                        {positionTypesList.map((item: any, index: number) => {
                            return (
                                <div className={style.positionTypeSettingsItem} key={index}>
                                    <div className="text-center full-width underline">
                                        <a>{capitalizeFirstLetter(item)} Position</a>
                                    </div>

                                    <NumberInput
                                        placeholder={`Quantity`}
                                        onChange={(value: any) => onQuantityChange(item.toLowerCase(), value)}
                                        incrementalValue={5}
                                        maxValue={900}
                                        startValue={positionType[item.toLowerCase()].quantity}
                                    />
                                    <TextInput
                                        placeholder={`Preferred Option Price`}
                                        onChange={(value: any) => onPreferredOptionPriceChange(item.toLowerCase(), value)}
                                        startValue={positionType[item.toLowerCase()].preferredOptionPrice}
                                    />
                                    <NumberInput
                                        placeholder={`RTR Ratio`}
                                        onChange={(value: any) => onRiskToRewardRatioChange(item.toLowerCase(), value)}
                                        incrementalValue={1}
                                        maxValue={15}
                                        startValue={positionType[item.toLowerCase()].riskToRewardRatio}
                                    />
                                    <NumberInput
                                        placeholder={`Stop Loss`}
                                        onChange={(value: any) => onStopLossChange(item.toLowerCase(), value)}
                                        incrementalValue={2}
                                        maxValue={0}
                                        startValue={positionType[item.toLowerCase()].stopLoss}
                                    />
                                </div>
                            )
                        })}
                        <div className="margin-top" />
                        <div className={`smallButton ${saved && "disabledButton"}`} onClick={onPositionTypeSaveButtonClicked}>
                            {saved ? "SAVED" : "SAVE"}
                        </div>
                    </div>
                </div>
                <div className={style.settingsGridItem}>
                    <h2>Money Manager</h2>
                    <a>Amount of Funds Allocated</a>
                    <div className="margin-top" />
                    {/* <ToggleSwitch currentState={moneyManager.mode == "percentage" ? true : false} onStateChange={onFundsToUseModeChange} /> */}
                    <NumberInput placeholder={`Amount`} onChange={(value: any) => onFundsToUseChange(value)} incrementalValue={5} maxValue={funds.available} startValue={moneyManager.fundsToUse} />
                    <div className="margin-top" />
                    {/* <div className="margin-top" /> */}
                    <div className={`smallButton ${saved && "disabledButton"}`} onClick={onPositionTypeSaveButtonClicked}>
                        {saved ? "SAVED" : "SAVE"}
                    </div>
                    {/* <div className="margin-top" />
                    <h2>Week Days Settings</h2>
                    <div>Percentage of Funds to Use (FTU) based on week day</div>
                    {weekDaysList.map((item: any, index: number) => {
                        return (
                            <div className={style.weekDaysSettingsItem} key={index}>
                                <NumberInput
                                    placeholder={`${capitalizeFirstLetter(item)} %  [₹ ${moneyManager.weekDays[item.toLowerCase()].fundsToUse}]`}
                                    onChange={(value: any) => onWeekDaysPercentageOfFundsToUseChange(item.toLowerCase(), value)}
                                    incrementalValue={5}
                                    maxValue={100}
                                    startValue={moneyManager.weekDays[item.toLowerCase()].percentageOfFundsToUse}
                                />
                            </div>
                        )
                    })}
                    <div className="margin-top" />
                    <div className={`smallButton ${saved && "disabledButton"}`} onClick={onPositionTypeSaveButtonClicked}>
                        {saved ? "SAVED" : "SAVE"}
                    </div> */}
                </div>
                <div className={style.settingsGridItem}>
                    <h2>Funds Details </h2>
                    <div className={style.fundsItemWrapper}>
                        <a className={"underline"}>Fyers Funds</a>
                        <div className={style.fundsItem}>
                            <a> Total Funds : </a>
                            <a className={`${style.fundsDataLabel} underline`}>{funds.total.toFixed(2)}</a>
                        </div>
                        <div className={style.fundsItem}>
                            <a> Available : </a>
                            <a className={`${style.fundsDataLabel} underline`}>{funds.available.toFixed(2)}</a>
                        </div>
                        <div className={style.fundsItem}>
                            <a> Used : </a>
                            <a className={`${style.fundsDataLabel} underline`}>{funds.used.toFixed(2)}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
