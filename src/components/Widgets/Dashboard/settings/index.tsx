import Head from "next/head"
import { useEffect, useState } from "react"
import NumberInput from "../../../Input/Number"
import TextInput from "../../../Input/Text"
import Loading from "../../../Loading"
import style from "./style.module.css"
export default function Settings() {
    // ---- State Variables ----
    const [positionType, setPositionType] = useState<any>({
        longPosition: { percentageOfFundsToUse: 0, fundsToUse: 0, preferredOptionPrice: 0, riskToRewardRatio: 0 },
        scalpingPosition: { percentageOfFundsToUse: 0, fundsToUse: 0, preferredOptionPrice: 0, riskToRewardRatio: 0 },
        swingPosition: { percentageOfFundsToUse: 0, fundsToUse: 0, preferredOptionPrice: 0, riskToRewardRatio: 0 },
        expiryPosition: { percentageOfFundsToUse: 0, fundsToUse: 0, preferredOptionPrice: 0, riskToRewardRatio: 0 },
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
        // this useEffect is causing a problem
        /**
         * next-dev.js:20 Warning: A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen.
         * Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components
         */
        onPositionTypeChange("longPosition", positionType.longPosition.percentageOfFundsToUse)
        onPositionTypeChange("scalpingPosition", positionType.scalpingPosition.percentageOfFundsToUse)
        onPositionTypeChange("swingPosition", positionType.swingPosition.percentageOfFundsToUse)
        onPositionTypeChange("expiryPosition", positionType.expiryPosition.percentageOfFundsToUse)
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
                                placeholder={`Percentage % [₹ ${positionType.longPosition.fundsToUse}]`}
                                onChange={(value: any) => onPositionTypeChange("longPosition", value)}
                                incrementalValue={5}
                                maxValue={100}
                                startValue={positionType.longPosition.percentageOfFundsToUse}
                            />
                            <TextInput
                                placeholder={`Preferred Option Price`}
                                onChange={(value: any) => onPreferredOptionPriceChange("longPosition", value)}
                                startValue={positionType.longPosition.preferredOptionPrice}
                            />
                            <NumberInput
                                placeholder={`RTR Ratio`}
                                onChange={(value: any) => onRiskToRewardRatioChange("longPosition", value)}
                                incrementalValue={1}
                                maxValue={15}
                                startValue={positionType.longPosition.riskToRewardRatio}
                            />
                        </div>
                        <div className={style.positionTypeSettingsItem}>
                            <div className="text-center full-width underline">
                                <a>Scalping Position</a>
                            </div>
                            <NumberInput
                                placeholder={`Percentage % [₹ ${positionType.scalpingPosition.fundsToUse}]`}
                                onChange={(value: any) => onPositionTypeChange("scalpingPosition", value)}
                                incrementalValue={5}
                                maxValue={100}
                                startValue={positionType.scalpingPosition.percentageOfFundsToUse}
                            />
                            <TextInput
                                placeholder={`Preferred Option Price`}
                                onChange={(value: any) => onPreferredOptionPriceChange("scalpingPosition", value)}
                                startValue={positionType.scalpingPosition.preferredOptionPrice}
                            />
                            <NumberInput
                                placeholder={`RTR Ratio`}
                                onChange={(value: any) => onRiskToRewardRatioChange("scalpingPosition", value)}
                                incrementalValue={1}
                                maxValue={15}
                                startValue={positionType.scalpingPosition.riskToRewardRatio}
                            />
                        </div>

                        <div className={style.positionTypeSettingsItem}>
                            <div className="text-center full-width underline">
                                <a>Swing Position</a>
                            </div>
                            <NumberInput
                                placeholder={`Percentage % [₹ ${positionType.swingPosition.fundsToUse}]`}
                                onChange={(value: any) => onPositionTypeChange("swingPosition", value)}
                                maxValue={100}
                                incrementalValue={5}
                                startValue={positionType.swingPosition.percentageOfFundsToUse}
                            />
                            <TextInput
                                placeholder={`Preferred Option Price`}
                                onChange={(value: any) => onPreferredOptionPriceChange("swingPosition", value)}
                                startValue={positionType.swingPosition.preferredOptionPrice}
                            />
                            <NumberInput
                                placeholder={`RTR Ratio`}
                                onChange={(value: any) => onRiskToRewardRatioChange("swingPosition", value)}
                                incrementalValue={1}
                                maxValue={15}
                                startValue={positionType.swingPosition.riskToRewardRatio}
                            />
                        </div>
                        <div className={style.positionTypeSettingsItem}>
                            <div className="text-center full-width underline">
                                <a>Expiry Position</a>
                            </div>
                            <NumberInput
                                placeholder={`Percentage % [₹ ${positionType.expiryPosition.fundsToUse}]`}
                                onChange={(value: any) => onPositionTypeChange("expiryPosition", value)}
                                maxValue={100}
                                incrementalValue={5}
                                startValue={positionType.expiryPosition.percentageOfFundsToUse}
                            />
                            <TextInput
                                placeholder={`Preferred Option Price`}
                                onChange={(value: any) => onPreferredOptionPriceChange("expiryPosition", value)}
                                startValue={positionType.expiryPosition.preferredOptionPrice}
                            />
                            <NumberInput
                                placeholder={`RTR Ratio`}
                                onChange={(value: any) => onRiskToRewardRatioChange("expiryPosition", value)}
                                incrementalValue={1}
                                maxValue={15}
                                startValue={positionType.expiryPosition.riskToRewardRatio}
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
