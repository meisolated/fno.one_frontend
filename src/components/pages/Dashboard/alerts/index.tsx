import Head from "next/head"
import { useEffect, useState } from "react"
import NumberInput from "../../../Input/Number"
import Loading from "../../../Loading"
import Selector from "../../../Selector"
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
    const [symbolsNameList, setSymbolsNameList] = useState<any>([])
    const [currentSymbol, setCurrentSymbol] = useState<any>("BANK NIFTY")
    const [alertPrice, setAlertPrice] = useState(0)
    const [condition, setCondition] = useState("greaterThan")
    const [alertsList, setAlertsList] = useState<any>([])
    const [alertValueStartValue, setAlertValueStartValue] = useState(0)
    const [loading, setLoading] = useState(true)

    function onAlertPriceChange(_price: any) {
        setAlertPrice(parseFloat(_price))
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
        const lp = marketData[symbol] ? marketData[symbol].lp : indexLTP[symbol] || 0
        setAlertValueStartValue(lp)
        onAlertPriceChange(lp)
    }
    function setAlert() {
        const symbol = symbols.filter((_index: any) => _index.name == currentSymbol)[0].symbol
        if (alertPrice == 0) return console.log("alertPrice", alertPrice)
        if (typeof alertPrice != "number") return console.log("alertPrice typeof", typeof alertPrice, alertPrice)
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
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const deleteAlert = (id: any) => {
        fetch("/internalApi/marketAlerts/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                alertId: id,
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

    useEffect(() => {
        if (!marketData) return
        if (!symbols) return
        setSymbolsNameList(symbols.map((symbol) => symbol.name))
        fetchAlerts()
    }, [])
    if (loading) return <Loading />
    return (
        <div>
            <Head>
                <title>Alerts</title>
            </Head>
            <h1>Alerts</h1>
            <div className="fit-content">
                <Selector label="Symbol" itemsList={symbolsNameList} selectionChanged={(value: any) => onSymbolChange(value)} />
                <NumberInput placeholder="Alert Price" onChange={(value: any) => onAlertPriceChange(value)} incrementalValue={10} maxValue={10000000} startValue={alertValueStartValue} />
                <div className="margin-top" />
                <button className="smallButton" onClick={setAlert}>
                    Set Alert
                </button>
            </div>
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
                                        <button onClick={() => deleteAlert(alert._id)}>DELETE</button>
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
