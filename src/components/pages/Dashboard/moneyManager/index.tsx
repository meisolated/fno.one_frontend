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
        long: { percentageOfFundsToUse: 0, fundsToUse: 0, preferredOptionPrice: 0, riskToRewardRatio: 0, stopLoss: 0 },
        scalping: { percentageOfFundsToUse: 0, fundsToUse: 0, preferredOptionPrice: 0, riskToRewardRatio: 0, stopLoss: 0 },
        swing: { percentageOfFundsToUse: 0, fundsToUse: 0, preferredOptionPrice: 0, riskToRewardRatio: 0, stopLoss: 0 },
        expiry: { percentageOfFundsToUse: 0, fundsToUse: 0, preferredOptionPrice: 0, riskToRewardRatio: 0, stopLoss: 0 },
    })
    const [moneyManager, setMoneyManager] = useState<any>({
        mode: "percentage",
        percentageOfFundsToUse: 0,
        fundsToUse: 0,
        maxLossPerDay: 0,
        weekDays: {
            monday: { percentageOfFundsToUse: 0, fundsToUse: 0 },
            tuesday: { percentageOfFundsToUse: 0, fundsToUse: 0 },
            wednesday: { percentageOfFundsToUse: 0, fundsToUse: 0 },
            thursday: { percentageOfFundsToUse: 0, fundsToUse: 0 },
            friday: { percentageOfFundsToUse: 0, fundsToUse: 0 },
        },
    })
    const [funds, setFunds] = useState<any>({
        available: 0,
        total: 0,
        used: 0,
    })
    // const [moneyManager.mode, setFundsToUseMode] = useState<string>("percentage") // percentage, amount

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [saved, setSaved] = useState<boolean>(false)
    const [weekDaysList, setWeekDaysList] = useState<any>(["monday", "tuesday", "wednesday", "thursday", "friday"])
    const [positionTypesList, setPositionTypesList] = useState<any>(["long", "scalping", "swing", "expiry"])
    const [currentDay, setCurrentDay] = useState<string>("monday")
    const showToast = useToast()
    // ---- End of State Variables ----

    // ---- Functions ----
    function onFundsToUseModeChange(newState: boolean) {
        const _fundsToUseMode = newState ? "percentage" : "amount"
        setMoneyManager((prev: any) => {
            return { ...prev, mode: _fundsToUseMode }
        })
        if (_fundsToUseMode == "percentage") {
            //calculate percentage of funds to use 
            setMoneyManager((prev: any) => {
                return { ...prev, percentageOfFundsToUse: ((moneyManager.fundsToUse / funds.available) * 100).toFixed(0) }
            })
        } else {
            setMoneyManager((prev: any) => {
                return { ...prev, fundsToUse: ((funds.available * moneyManager.percentageOfFundsToUse) / 100).toFixed(2) }
            })
        }
    }
    function onPositionTypeChange(_positionType: string, value: number) {
        setPositionType((prev: any) => {
            return {
                ...prev,
                [_positionType]: { ...positionType[_positionType], percentageOfFundsToUse: value, fundsToUse: ((moneyManager.weekDays[currentDay].fundsToUse * value) / 100).toFixed(2) },
            }
        })
    }

    async function onPercentageOfFundsToUseChange(value: number) {
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
    function onWeekDaysPercentageOfFundsToUseChange(day: string, value: number) {
        setMoneyManager((prev: any) => {
            return { ...prev, weekDays: { ...prev.weekDays, [day]: { ...prev.weekDays[day], percentageOfFundsToUse: value, fundsToUse: ((moneyManager.fundsToUse * value) / 100).toFixed(2) } } }
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
            }).catch((err) => {
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
    }, [moneyManager, currentDay])
    useEffect(() => {
        weekDaysList.map((item: any, index: number) => {
            return onWeekDaysPercentageOfFundsToUseChange(item.toLowerCase(), moneyManager.weekDays[item.toLowerCase()].percentageOfFundsToUse)
        })
    }, [moneyManager.percentageOfFundsToUse, moneyManager.fundsToUse])

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
                setWeekDaysList(data.weekDays)
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
            {/* <h1>Settings</h1> */}
            <Selector label="Select Day" itemsList={weekDaysList} selectionChanged={(e: any) => setCurrentDay(e)} />
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
                                        placeholder={`Percentage % [₹ ${positionType[item.toLowerCase()].fundsToUse}]`}
                                        onChange={(value: any) => onPositionTypeChange(item.toLowerCase(), value)}
                                        incrementalValue={5}
                                        maxValue={100}
                                        startValue={positionType[item.toLowerCase()].percentageOfFundsToUse}
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
                    <a>{moneyManager.mode == "percentage" ? "Percentage" : "Amount"} of Funds Allocated</a>
                    <div className="margin-top" />
                    <ToggleSwitch currentState={moneyManager.mode == "percentage" ? true : false} onStateChange={onFundsToUseModeChange} />
                    <div className="margin-top" />
                    <NumberInput
                        placeholder={`${moneyManager.mode == "percentage" ? `Percentage %  [₹ ${moneyManager.fundsToUse}]` : `Amount`}`}
                        onChange={(value: any) => onPercentageOfFundsToUseChange(value)}
                        incrementalValue={5}
                        maxValue={moneyManager.mode == "percentage" ? 100 : funds.available}
                        startValue={moneyManager.mode == "percentage" ? moneyManager.percentageOfFundsToUse : moneyManager.fundsToUse}
                    />
                    <div className="margin-top" />
                    {/* <div className="margin-top" /> */}
                    <div className={`smallButton ${saved && "disabledButton"}`} onClick={onPositionTypeSaveButtonClicked}>
                        {saved ? "SAVED" : "SAVE"}
                    </div>
                    <div className="margin-top" />
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
                    </div>
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
