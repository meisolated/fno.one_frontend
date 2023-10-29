import Head from "next/head"
import { useEffect, useState } from "react"
import NumberInput from "../../../Input/Number"
import tableStyle from "../../../Table/style.module.css"
import style from "./style.module.css"

interface props {
    marketData: any
    indexLTP: any
}

export default function Alerts({ marketData, indexLTP }: props) {
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
    const [condition, setCondition] = useState("greaterThan")
    const [alertsList, setAlertsList] = useState<any>([])
    const [alertValueStartValue, setAlertValueStartValue] = useState(0)

    function onAlertPriceChange(_price: any) {
        setAlertPrice(_price)
        const symbol = symbols.filter((_index: any) => _index.name == currentSymbol)[0].symbol
        const lp = marketData[symbol] ? marketData[symbol].lp : indexLTP[symbol]

        if (lp < _price) {
            setCondition("greaterThan")
        } else {
            setCondition("lessThan")
        }
    }
    function onSymbolChange(index: any) {
        setCurrentSymbol(index)
        const symbol = symbols.filter((_index: any) => _index.name == index)[0].symbol
        const lp = marketData[symbol] ? marketData[symbol].lp : indexLTP[symbol]
        setAlertValueStartValue(lp)
        onAlertPriceChange(lp)
    }
    function setAlert() {
        const symbol = symbols.filter((_index: any) => _index.name == currentSymbol)[0].symbol
        if (alertPrice == 0) return
        if (typeof alertPrice != "number") return
        fetch("/internalApi/marketAlerts/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                symbol: symbol,
                value: alertPrice,
                condition: condition,
                alerted: false,
            }),
        })
            .then(async (res) => {
                console.log(res)
                fetchAlerts()
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const fetchAlerts = () => {
        fetch("/internalApi/marketAlerts/get")
            .then(async (res) => {
                const json: any = await res.json()
                if (json.code == 200) {
                    setAlertsList(json.marketAlerts)
                } else {
                    console.log(json)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        fetchAlerts()
    }, [])
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
            <NumberInput
                placeholder="Alert Price"
                label="Alert Price"
                onChange={(value: any) => onAlertPriceChange(value)}
                incrementalValue={10}
                maxValue={10000000}
                startValue={alertValueStartValue}
            />
            <div className="margin-top" />
            <button className="smallButton" onClick={setAlert}>
                Set Alert
            </button>
            <div className="margin-top" />
            <table className={tableStyle.table}>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>Condition</th>
                        <th>Triggered</th>
                        <th>Remove Alert</th>
                    </tr>
                </thead>
                <tbody>
                    {alertsList.length > 0 &&
                        alertsList.map((alert: any, index: number) => {
                            // if (alert.alerted) return
                            return (
                                <tr key={index}>
                                    <td>{alert.symbol}</td>
                                    <td>{alert.value}</td>
                                    <td>{alert.condition}</td>
                                    <td>{alert.alerted ? "YES" : "NO"}</td>
                                    <td>
                                        <button>DELETE</button>
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            {alertsList.length == 0 && <div className={tableStyle.noRowsFound}>No Alerts Set</div>}
        </div>
    )
}
