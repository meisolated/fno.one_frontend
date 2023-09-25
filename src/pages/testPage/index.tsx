import { useEffect, useState } from "react"
import Dropdown from "../../components/Dropdown"

export default function Dashboard(props: any) {
    const [currentExpiry, setCurrentExpiry] = useState<any>("")
    const [expiryList, setExpiryList] = useState<any>([])
    const [currentExpiryOptionChain, setCurrentExpiryOptionChain] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        setLoading(true)
        fetch("/api/optionChain?symbol=BANKNIFTY")
            .then((res) => res.json())
            .then((d: optionChainApi) => {
                console.log(d)
                const expiryList = d.expiryList
                setCurrentExpiry(d.currentExpiry)
                setExpiryList(expiryList)
                setCurrentExpiryOptionChain(d.optionChainList)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    return <div style={{ width: "100%", height: "100%", position: "absolute", alignItems: "center", textAlign: "center" }}>{!loading && <Dropdown items={expiryList} />}</div>
}
