import Head from "next/head"
import { useEffect, useState } from "react"
import NumberInput from "../../../Input/Number"
import TextInput from "../../../Input/Text"
import Loading from "../../../Loading"
import style from "./style.module.css"
export default function Settings() {
    // ---- State Variables ----
    const [positionType, setPositionType] = useState<any>({
        long: { percentageOfFundsToUse: 0, fundsToUse: 0, preferredOptionPrice: 0, riskToRewardRatio: 0 },
        scalping: { percentageOfFundsToUse: 0, fundsToUse: 0, preferredOptionPrice: 0, riskToRewardRatio: 0 },
        swing: { percentageOfFundsToUse: 0, fundsToUse: 0, preferredOptionPrice: 0, riskToRewardRatio: 0 },
        expiry: { percentageOfFundsToUse: 0, fundsToUse: 0, preferredOptionPrice: 0, riskToRewardRatio: 0 },
    })
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [saved, setSaved] = useState<boolean>(false)
    const [funds, setFunds] = useState<any>({
        available: 0,
        total: 0,
        used: 0,
    })
    const [moneyManager, setMoneyManager] = useState<any>({
        percentageOfFundsToUse: 0,
        fundsToUse: 0,
    })
    // ---- End of State Variables ----

    // ---- Functions ----
    function onPositionTypeChange(_positionType: string, value: number) {
        setPositionType((prev: any) => {
            return { ...prev, [_positionType]: { ...positionType[_positionType], percentageOfFundsToUse: value, fundsToUse: ((moneyManager.fundsToUse * value) / 100).toFixed(2) } }
        })
    }

    async function onPercentageOfFundsToUseChange(value: number) {
        setMoneyManager((prev: any) => {
            return { ...prev, percentageOfFundsToUse: value, fundsToUse: ((funds.available * value) / 100).toFixed(2) }
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
                console.log(positionType)
                console.log(data)
                setSaved(true)
            })
    }
    // ---- End of Button Clicks Functions ----

    // ---- End of Functions ----

    // ---- Effects ----
    useEffect(() => {
        if (saved) {
            setTimeout(() => {
                setSaved(false)
            }, 500)
        }
    }, [positionType, moneyManager])

    useEffect(() => {
        onPositionTypeChange("long", positionType.long.percentageOfFundsToUse)
        onPositionTypeChange("scalping", positionType.scalping.percentageOfFundsToUse)
        onPositionTypeChange("swing", positionType.swing.percentageOfFundsToUse)
        onPositionTypeChange("expiry", positionType.expiry.percentageOfFundsToUse)
    }, [moneyManager])

    useEffect(() => {
        setIsLoading(true)
        fetch("/internalApi/user/get")
            .then((res) => res.json())
            .then(({ data }) => {
                setPositionType(data.positionTypeSettings)
                setMoneyManager(data.moneyManager)
                setFunds(data.funds.fyers)
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
            })
    }, [])

    // ---- End of Effects ----
    if (isLoading) return <Loading />
    return (
        <div className={style.pageWrapper}>
            <Head>
                <title>Settings</title>
            </Head>
            {/* <h1>Settings</h1> */}
            <div className={style.settingsGrid}>
                <div className={style.settingsGridItem}>
                    <h2>Position Type Settings</h2>
                    <div>Percentage of Funds to Use</div>
                    <div className={style.positionTypeSettingsWrapper}>
                        <div className={style.positionTypeSettingsItem}>
                            <div className="text-center full-width underline">
                                <a>Long Position</a>
                            </div>
                            <NumberInput
                                placeholder={`Percentage % [₹ ${positionType.long.fundsToUse}]`}
                                onChange={(value: any) => onPositionTypeChange("long", value)}
                                incrementalValue={5}
                                maxValue={100}
                                startValue={positionType.long.percentageOfFundsToUse}
                            />
                            <TextInput
                                placeholder={`Preferred Option Price`}
                                onChange={(value: any) => onPreferredOptionPriceChange("long", value)}
                                startValue={positionType.long.preferredOptionPrice}
                            />
                            <NumberInput
                                placeholder={`RTR Ratio`}
                                onChange={(value: any) => onRiskToRewardRatioChange("long", value)}
                                incrementalValue={1}
                                maxValue={15}
                                startValue={positionType.long.riskToRewardRatio}
                            />
                        </div>
                        <div className={style.positionTypeSettingsItem}>
                            <div className="text-center full-width underline">
                                <a>Scalping Position</a>
                            </div>
                            <NumberInput
                                placeholder={`Percentage % [₹ ${positionType.scalping.fundsToUse}]`}
                                onChange={(value: any) => onPositionTypeChange("scalping", value)}
                                incrementalValue={5}
                                maxValue={100}
                                startValue={positionType.scalping.percentageOfFundsToUse}
                            />
                            <TextInput
                                placeholder={`Preferred Option Price`}
                                onChange={(value: any) => onPreferredOptionPriceChange("scalping", value)}
                                startValue={positionType.scalping.preferredOptionPrice}
                            />
                            <NumberInput
                                placeholder={`RTR Ratio`}
                                onChange={(value: any) => onRiskToRewardRatioChange("scalping", value)}
                                incrementalValue={1}
                                maxValue={15}
                                startValue={positionType.scalping.riskToRewardRatio}
                            />
                        </div>

                        <div className={style.positionTypeSettingsItem}>
                            <div className="text-center full-width underline">
                                <a>Swing Position</a>
                            </div>
                            <NumberInput
                                placeholder={`Percentage % [₹ ${positionType.swing.fundsToUse}]`}
                                onChange={(value: any) => onPositionTypeChange("swing", value)}
                                maxValue={100}
                                incrementalValue={5}
                                startValue={positionType.swing.percentageOfFundsToUse}
                            />
                            <TextInput
                                placeholder={`Preferred Option Price`}
                                onChange={(value: any) => onPreferredOptionPriceChange("swing", value)}
                                startValue={positionType.swing.preferredOptionPrice}
                            />
                            <NumberInput
                                placeholder={`RTR Ratio`}
                                onChange={(value: any) => onRiskToRewardRatioChange("swing", value)}
                                incrementalValue={1}
                                maxValue={15}
                                startValue={positionType.swing.riskToRewardRatio}
                            />
                        </div>
                        <div className={style.positionTypeSettingsItem}>
                            <div className="text-center full-width underline">
                                <a>Expiry Position</a>
                            </div>
                            <NumberInput
                                placeholder={`Percentage % [₹ ${positionType.expiry.fundsToUse}]`}
                                onChange={(value: any) => onPositionTypeChange("expiry", value)}
                                maxValue={100}
                                incrementalValue={5}
                                startValue={positionType.expiry.percentageOfFundsToUse}
                            />
                            <TextInput
                                placeholder={`Preferred Option Price`}
                                onChange={(value: any) => onPreferredOptionPriceChange("expiry", value)}
                                startValue={positionType.expiry.preferredOptionPrice}
                            />
                            <NumberInput
                                placeholder={`RTR Ratio`}
                                onChange={(value: any) => onRiskToRewardRatioChange("expiry", value)}
                                incrementalValue={1}
                                maxValue={15}
                                startValue={positionType.expiry.riskToRewardRatio}
                            />
                        </div>
                        <div className="margin-top" />
                        <div className={`smallButton ${saved && "disabledButton"}`} onClick={onPositionTypeSaveButtonClicked}>
                            {saved ? "SAVED" : "SAVE"}
                        </div>
                    </div>
                </div>
                <div className={style.settingsGridItem}>
                    <h2>Funds Settings</h2>
                    <div>Percentage of Funds to Use</div>
                    <NumberInput
                        placeholder={`Percentage %  [₹ ${moneyManager.fundsToUse}]`}
                        onChange={(value: any) => onPercentageOfFundsToUseChange(value)}
                        incrementalValue={5}
                        maxValue={100}
                        startValue={moneyManager.percentageOfFundsToUse}
                    />
                    <div className="margin-top" />
                    {/* <div className="margin-top" /> */}
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
