import Head from "next/head"
import { useState } from "react"
import { Home as HomeIcon, Settings as SettingsIcon, Trend as TrendIcon } from "../../assets/svg"
import Home from "../../components/admin/dashboard/home"
import Settings from "../../components/admin/dashboard/settings"
import Trades from "../../components/admin/dashboard/trades"

import css from "./style.module.css"
export default function Dashboard() {
    const [navbar, setNavbar] = useState(false)
    const [active, setActive] = useState("home")
    const navbarState = () => {
        setNavbar(!navbar)
    }
    const onNavbarItemClick = (e: string) => {
        console.log(e)
        setActive(e)
    }

    return (
        <>
            <Head>
                <title>Dashboard</title>
                <meta name="google" content="notranslate" />
                <meta name="google" content="nositelinkssearchbox" key="sitelinks" />
            </Head>
            <div className={css.dashboard}>
                <div className={`${navbar ? css.lock_navbar_vertical : css.navbar_vertical}`}>
                    <div className={css.logo}>FnO</div>
                    <div className="divider"></div>
                    <div className={css.navbar_vertical_items}>
                        <div className={`${css.navbar_vertical_item} ${active == "home" && css.active_navbar_item}`} onClick={() => onNavbarItemClick("home")}>
                            <div className={css.navbar_vertical_item_icon}>
                                <HomeIcon />
                            </div>
                            <div className={css.navbar_vertical_item_text}>Home</div>
                        </div>
                        <div className={`${css.navbar_vertical_item} ${active == "trades" && css.active_navbar_item}`} onClick={() => onNavbarItemClick("trades")}>
                            <div className={css.navbar_vertical_item_icon}>
                                <TrendIcon />
                            </div>
                            <div className={css.navbar_vertical_item_text}>Trades</div>
                        </div>
                        <div className="divider margin-top-n-bottom" />
                        <div className={`${css.navbar_vertical_item} ${active == "settings" && css.active_navbar_item}`} onClick={() => onNavbarItemClick("settings")}>
                            <div className={css.navbar_vertical_item_icon}>
                                <SettingsIcon />
                            </div>

                            <div className={css.navbar_vertical_item_text}>Settings</div>
                        </div>
                    </div>
                </div>
                <div className={`${css.content} ${navbar && css.content_when_navbar_vertical_is_locked}`}>{active == "home" ? <Home /> : active == "trades" ? <Trades /> : <Settings />}</div>
            </div>
        </>
    )
}

export const getServerSideProps = async (context: any) => {
    const forwarded = context.req.headers["x-real-ip"]
    const ip = forwarded ? forwarded.split(/, /)[0] : context.req.connection.remoteAddress
    if (ip === "103.62.93.150" || ip === "::ffff:127.0.0.1") {
        return {
            props: {
                ip: ip,
            },
        }
    }
    return {
        redirect: {
            destination: "/404",
            permanent: false,
        },
    }
}
