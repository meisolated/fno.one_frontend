import { useEffect, useState } from "react"
import Alert from "../../components/Alert"
import DraggableWidget from "../../components/Dragable"
import Popup from "../../components/Popup"
import { useToast } from "../../components/Toast/provider"
import ToggleSwitch from "../../components/ToggleSwitch"
export default function TestPage(props: any) {
    const [popup, setPopup] = useState<boolean>(false)
    const [serverMode, setServerMode] = useState<boolean>(false)
    const showToast = useToast()
    const handleToggleChange = (newState: any) => {
        setServerMode(newState)
        console.log(newState)
    }

    function _showToast() {
        showToast("This is an error message", "success")
    }

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
            {/* {popup && <Popup title="Confirmation Required" description={"Are you sure you want to execute this trade?"} buttons={["NO", "YES"]} onClose={onClose} />} */}
            <DraggableWidget Child={Child} title={"Market Alerts"} closable={true} />
            <Alert position="top-right" type="success" message="Success" />
            <ToggleSwitch currentState={serverMode} onStateChange={handleToggleChange} />
            <button className="smallButton" onClick={_showToast}>
                Show
            </button>
        </div>
    )
}

const Child = () => {
    return (
        <>
            <div style={{ width: "100%", height: "100%", position: "absolute", alignItems: "center", textAlign: "center" }}>
                <h1>Child</h1>
            </div>
        </>
    )
}
