import Head from "next/head"
import { useEffect, useState } from "react"
import { useToast } from "../../../Toast/provider"
import ToggleSwitch from "../../../ToggleSwitch"
export default function ServerSettings() {
    const [developmentMode, setDevelopmentMode] = useState<boolean>(false)
    const showToast = useToast()
    const handleToggleChange = async (newState: any) => {
        setDevelopmentMode(newState)
    }

    function updateServerSettings() {
        fetch("/internalApi/serverSettings/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ developmentMode: developmentMode }),
        })
            .then((res) => res.json())
            .then((d) => {
                console.log(d)
                showToast("Server Settings Updated", "success")
            })
            .catch((err) => {
                console.log(err)
                showToast("Error Updating Server Settings", "error")
            })
    }

    useEffect(() => {
        fetch("/internalApi/serverSettings/get")
            .then((res) => res.json())
            .then((d) => {
                setDevelopmentMode(d.serverSettings.developmentMode)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    return (
        <div>
            <Head>
                <title>Server Settings</title>
            </Head>
            <h1>Sever Settings</h1>
            <h3> Development Mode: {developmentMode ? "Active" : "InActive"} </h3>
            <ToggleSwitch currentState={developmentMode} onStateChange={handleToggleChange} />

            <div className={"smallButton fit-content margin-top"} onClick={updateServerSettings}>
                Save
            </div>
        </div>
    )
}
