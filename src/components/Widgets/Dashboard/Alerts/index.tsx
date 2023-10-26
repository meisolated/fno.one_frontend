import Head from "next/head"
import { useState } from "react"
import NumberInput from "../../../Input/Number"
import style from "./style.module.css"
export default function Alerts({ marketData }: any) {
    const symbols = [
        {
            name: "BANK NIFTY",
            symbol: "NIFTY BANK",
        },
        {
            name: "NIFTY",
            symbol: "NIFTY 50",
        },
        {
            name: "FIN NIFTY",
            symbol: "NIFTY FIN SERVICE",
        },
    ]
    const [currentSymbol, setCurrentSymbol] = useState<any>("BANK NIFTY")
    const [alertPrice, setAlertPrice] = useState(0)
    const [condition, setCondition] = useState("greater")

    function onAlertPriceChange(_price: any) {
        setAlertPrice(_price)
        const symbol = symbols.filter((_index: any) => _index.name == currentSymbol)[0].symbol
        const lp = marketData[symbol].lp

        if (lp > _price) {
            setCondition("greaterThan")
        } else {
            setCondition("lessThan")
        }

    }
    function onSymbolChange(index: any) {
        setCurrentSymbol(index)
    }
    function setAlert() {
        const symbol = symbols.filter((_index: any) => _index.name == currentSymbol)[0].symbol
        fetch("/internalApi/marketAlerts/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                symbol: symbol,
                value: alertPrice,
                condition: condition,
                alerted: false
            })
        }).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <div>
            <Head>
                <title>Alerts</title>
            </Head>
            <h1>Alerts</h1>
            <div className={style.chooseIndex}>
                Switch Symbol
                <div className={style.indexList}>
                    {symbols.map((_index: any, indexKey: any) => {
                        return (
                            <div className={`${_index.name == currentSymbol ? style.indexButtonActive : style.indexButton}`} key={indexKey} onClick={() => onSymbolChange(_index.name)}>
                                {_index.name}
                            </div>
                        )
                    })}
                </div>
            </div>
            <NumberInput placeholder="Alert Price" label="Alert Price" onChange={(value: any) => onAlertPriceChange(value)} incrementalValue={10} maxValue={10000000} startValue={0} />
            <div className="margin-top" />
            <button className="smallButton" onClick={setAlert} >
                Set Alert
            </button>
        </div>
    )
}
