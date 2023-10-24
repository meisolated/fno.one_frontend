import Head from "next/head"
import { useEffect, useState } from "react"
import TextInput from "../../../Input"
import NumberInput from "../../../Input/Number"
import Loading from "../../../Loading"
import style from "./style.module.css"
export default function Settings() {
    // ---- State Variables ----
    const [positionType, setPositionType] = useState<any>({
        longPosition: { percentageOfFundsToUse: 0, fundsToUse: 0 },
        scalpingPosition: { percentageOfFundsToUse: 0, fundsToUse: 0 },
        swingPosition: { percentageOfFundsToUse: 0, fundsToUse: 0 },
        expiryPosition: { percentageOfFundsToUse: 0, fundsToUse: 0 },
    })
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [saved, setSaved] = useState<boolean>(false)
    const [funds, setFunds] = useState<any>({
        available: 0,
        total: 0,
        used: 0,
    })
    const [percentageOfFundsToUse, setPercentageOfFundsToUse] = useState<any>({
        percentageOfFundsToUse: 0,
        fundsToUse: 0
    })
    // ---- End of State Variables ----

    // ---- Functions ----
    function onPositionTypeChange(positionType: string, value: number) {
        setPositionType((prev: any) => {
            return { ...prev, [positionType]: { percentageOfFundsToUse: value, fundsToUse: ((percentageOfFundsToUse.fundsToUse * value) / 100).toFixed(2) } }
        })
    }

    async function onPercentageOfFundsToUseChange(value: number) {
        setPercentageOfFundsToUse((prev: any) => {
            return { ...prev, percentageOfFundsToUse: value, fundsToUse: ((funds.available * value) / 100).toFixed(2) }
        })

    }

    function onPositionTypeSaveButtonClicked() {
        if (isLoading) return
        if (saved) return
        fetch("/internalApi/update/user/updatePositionTypeSettings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                positionTypeSettings: positionType,
                moneyManager: {
                    percentageOfFundsToUse: percentageOfFundsToUse.percentageOfFundsToUse,
                    fundsToUse: percentageOfFundsToUse.fundsToUse
                }

            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(positionType)
                console.log(data)
                setSaved(true)
            })
    }

    // ---- End of Functions ----

    // ---- Effects ----
    useEffect(() => {
        if (saved) {
            setTimeout(() => {
                setSaved(false)
            }, 500)
        }
    }, [positionType, percentageOfFundsToUse])

    useEffect(() => {
        onPositionTypeChange("longPosition", positionType.longPosition.percentageOfFundsToUse)
        onPositionTypeChange("scalpingPosition", positionType.scalpingPosition.percentageOfFundsToUse)
        onPositionTypeChange("swingPosition", positionType.swingPosition.percentageOfFundsToUse)
        onPositionTypeChange("expiryPosition", positionType.expiryPosition.percentageOfFundsToUse)
    }, [percentageOfFundsToUse])

    useEffect(() => {
        setIsLoading(true)
        fetch("/internalApi/user")
            .then((res) => res.json())
            .then(({ data }) => {
                setPositionType(data.positionTypeSettings)
                setPercentageOfFundsToUse(data.moneyManager)
                setFunds(data.funds.fyers)
                setIsLoading(false)
            })
    }, [])

    // ---- End of Effects ----
    if (isLoading) <Loading />
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
                        <NumberInput
                            placeholder={`Long Position % [₹ ${positionType.longPosition.fundsToUse}]`}
                            onChange={(value: any) => onPositionTypeChange("longPosition", value)}
                            incrementalValue={5}
                            maxValue={100}
                            startValue={positionType.longPosition.percentageOfFundsToUse}
                        />
                        <NumberInput
                            placeholder={`Scalping Position % [₹ ${positionType.scalpingPosition.fundsToUse}]`}
                            onChange={(value: any) => onPositionTypeChange("scalpingPosition", value)}
                            incrementalValue={5}
                            maxValue={100}
                            startValue={positionType.scalpingPosition.percentageOfFundsToUse}
                        />
                        <NumberInput
                            placeholder={`Swing Position % [₹ ${positionType.swingPosition.fundsToUse}]`}
                            onChange={(value: any) => onPositionTypeChange("swingPosition", value)}
                            maxValue={100}
                            incrementalValue={5}
                            startValue={positionType.swingPosition.percentageOfFundsToUse}
                        />
                        <NumberInput
                            placeholder={`Expiry Position % [₹ ${positionType.expiryPosition.fundsToUse}]`}
                            onChange={(value: any) => onPositionTypeChange("expiryPosition", value)}
                            maxValue={100}
                            incrementalValue={5}
                            startValue={positionType.expiryPosition.percentageOfFundsToUse}
                        />
                        <div className="margin-top" />
                        <div className={`smallButton ${saved && "disabledButton"}`} onClick={onPositionTypeSaveButtonClicked}>
                            {saved ? "SAVED" : "SAVE"}
                        </div>
                    </div>
                </div>
                <div className={style.settingsGridItem}>
                    <h2>Funds Settings</h2>
                    <div>Percentage of Funds to Use</div>
                    <NumberInput placeholder={`Percentage %  [₹ ${percentageOfFundsToUse.fundsToUse}]`} onChange={(value: any) => onPercentageOfFundsToUseChange(value)} incrementalValue={5} maxValue={100} startValue={percentageOfFundsToUse.percentageOfFundsToUse} />
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
