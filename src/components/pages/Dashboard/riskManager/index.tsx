import Head from "next/head"
import { useEffect, useState } from "react"
import NumberInput from "../../../Input/Number"
import Loading from "../../../Loading"
import { useToast } from "../../../Toast/provider"
import ToggleSwitch from "../../../ToggleSwitch"
import css from "./style.module.css"

interface riskManager {
    numberOfTradesAllowedPerDay: number,
    takeControlOfManualTrades: boolean,
    percentageOfMaxProfitPerDay: number,
    percentageOfMaxLossPerDay: number,
}
export default function RiskManager() {
    const [riskManager, setRiskManager] = useState<riskManager>({
        numberOfTradesAllowedPerDay: 0,
        takeControlOfManualTrades: false,
        percentageOfMaxProfitPerDay: 0,
        percentageOfMaxLossPerDay: 0,
    })
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [saved, setSaved] = useState<boolean>(false)
    const showToast = useToast()
    // ------------------| Functions |------------------
    function onTakeControlOfManualTradesChange(newState: boolean) {
        setSaved(false)
        setRiskManager((prevState) => {
            return { ...prevState, takeControlOfManualTrades: newState }
        })
    }
    function onNumberOfTradesAllowedPerDayChange(newState: number) {
        setSaved(false)
        setRiskManager((prevState) => {
            return { ...prevState, numberOfTradesAllowedPerDay: newState }
        })
    }
    function onPercentageOfMaxProfitPerDayChange(newState: number) {
        setSaved(false)
        setRiskManager((prevState) => {
            return { ...prevState, percentageOfMaxProfitPerDay: newState }
        })
    }
    function onPercentageOfMaxLossPerDayChange(newState: number) {
        setSaved(false)
        setRiskManager((prevState) => {
            return { ...prevState, percentageOfMaxLossPerDay: newState }
        })
    }
    function onSaveButtonClicked() {
        console.log("Saving", saved, isLoading)
        if (isLoading) return
        if (saved) return
        fetch("/internalApi/user/updateRiskManager", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                riskManager: riskManager,
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
    useEffect(() => {
        setIsLoading(true)
        fetch("/internalApi/user/get")
            .then((res) => res.json())
            .then(({ data }) => {
                setIsLoading(false)
                if (Object.keys(data.riskManager).length === 0) return
                setRiskManager(data.riskManager)
            })
    }, [])
    if (isLoading) <Loading />
    return (
        <div>
            <Head>
                <title>Risk Manager</title>
            </Head>
            <div className="margin-top margin-left-5px fit-content">
                <a>Take Control of manual trades: </a>
                <ToggleSwitch currentState={riskManager.takeControlOfManualTrades} onStateChange={onTakeControlOfManualTradesChange} />
                <div className="margin-top" />
                <NumberInput placeholder="Trades allowed per day" onChange={onNumberOfTradesAllowedPerDayChange} incrementalValue={1} maxValue={0} startValue={riskManager.numberOfTradesAllowedPerDay} />
                <div className="margin-top" />
                <NumberInput placeholder="%age of max profit per day" onChange={onPercentageOfMaxProfitPerDayChange} incrementalValue={1} maxValue={0} startValue={riskManager.percentageOfMaxProfitPerDay} />
                <div className="margin-top" />
                <NumberInput placeholder="%age of max loss per day" onChange={onPercentageOfMaxLossPerDayChange} incrementalValue={1} maxValue={0} startValue={riskManager.percentageOfMaxLossPerDay} />
                <div className="margin-top" />

                <button className={`smallButton fit-content ${saved && "disabledButton"}`} onClick={onSaveButtonClicked}>
                    {saved ? "SAVED" : "SAVE"}
                </button>
            </div>
        </div>
    )
}
