import { Input, Radio, Spacer } from "@nextui-org/react"
import Head from "next/head"
import { useEffect, useState } from "react"
import css from "./style.module.css"

interface Props {
    user: any
}

export default function Settings(props: Props) {
    const [globalSettings, setGlobalSettings] = useState<any>({
        strikePricePreference: "1",
    })
    const [activeTab, setActiveTab] = useState<any>("1")
    const setTab = (value: any) => {
        setActiveTab(value)
    }
    const setStrikePricePreference = (value: any) => {
        setGlobalSettings((gs: any) => {
            return {
                ...gs,
                strikePricePreference: value,
            }
        })
    }
    useEffect(() => {
        console.log(props.user)
    }, [])
    return (
        <div>
            <Head>
                <title>Settings</title>
            </Head>
            <div className={css.contentWrapper}>
                <div className={css.tabs}>
                    <div className={`${activeTab == "1" ? css.navbarItemActive : css.tabsItems}`} onClick={() => setTab(1)}>
                        General
                    </div>
                    <div className={`${activeTab == "2" ? css.navbarItemActive : css.tabsItems}`} onClick={() => setTab(2)}>
                        Global
                    </div>
                    <div className={`${activeTab == "3" ? css.navbarItemActive : css.tabsItems}`} onClick={() => setTab(3)}>
                        Money Manager
                    </div>
                    <div className={`${activeTab == "4" ? css.navbarItemActive : css.tabsItems}`} onClick={() => setTab(4)}>
                        Risk Manager
                    </div>
                    <div className={`${activeTab == "5" ? css.navbarItemActive : css.tabsItems}`} onClick={() => setTab(5)}>
                        Strategies Manager
                    </div>
                </div>
                <div className={css.settingsWrapper}>
                    <h1>Global Trade Settings</h1>
                    <div className="align-horizontal">
                        <Radio.Group label="Strike Price Preference" defaultValue="1" orientation="horizontal" onChange={(value) => setStrikePricePreference(value)}>
                            <Radio value="1" description="At the Money">
                                ATM
                            </Radio>
                            <Radio value="2" description="Out of the Money">
                                OTM
                            </Radio>
                            <Radio value="3" description="In the Money">
                                ITM
                            </Radio>
                        </Radio.Group>
                        <Spacer y={1} />
                        <div>
                            {globalSettings.strikePricePreference === "2" && <div>How deep out of the Money?</div>}
                            {globalSettings.strikePricePreference === "3" && <div>How deep in the Money?</div>}
                            {globalSettings.strikePricePreference !== "1" && <div className="small-text">Choose from 0 to 10</div>}
                            {globalSettings.strikePricePreference !== "1" && <Input aria-label="number" clearable placeholder="Number" initialValue="0" />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
