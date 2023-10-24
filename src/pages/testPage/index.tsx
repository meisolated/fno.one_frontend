import { useEffect, useState } from "react"
import Popup from "../../components/Popup"
import ServerDown from "../../components/Widgets/ServerDown"
export default function TestPage(props: any) {
    const [popup, setPopup] = useState<boolean>(false)
    // function placeTestOrder() {
    //     const orderReq: newOrder = {
    //         symbol: "NSE:BANKNIFTY23O0445000CE",
    //         qty: 15,
    //         type: 2,
    //         side: 1,
    //         productType: "BO",
    //         limitPrice: 0,
    //         stopPrice: 0,
    //         disclosedQty: 0,
    //         validity: "DAY",
    //         offlineOrder: false,
    //         stopLoss: 70.0,
    //         takeProfit: 150,
    //     }
    //     fetch("/internalApi/testPlaceOrder", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(orderReq),
    //     })
    //         .then((res) => res.json())
    //         .then((d) => {
    //             console.log(d)
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //         })
    // }
    function onClose(z: any) {
        setTimeout(() => {
            setPopup(false)
        }, 300)
    }
    useEffect(() => {
        setTimeout(() => {
            setPopup(true)
        }, 1000)
    }, [])
    return (
        <div style={{ width: "100%", height: "100%", position: "absolute", alignItems: "center", textAlign: "center" }}>
            {/* <button onClick={placeTestOrder}>Place Test Order</button> */}
            {popup && <Popup title="Confirmation Required" description={"Are you sure you want to execute this trade?"} buttons={["NO", "YES"]} onClose={onClose} />}
            {/* <ServerDown /> */}
        </div>
    )
}
