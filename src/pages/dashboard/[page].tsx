import { useEffect, useState } from "react"

import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import Loading from "../../components/Loading"
import NotificationSender from "../../components/Notification/notificationSender"
import NotificationComponent from "../../components/Notification/requestNotificationPermission"
import Alerts from "../../components/pages/Dashboard/alerts"
import Home from "../../components/pages/Dashboard/home"
import Logs from "../../components/pages/Dashboard/logs"
import OptionChain from "../../components/pages/Dashboard/optionChain"
import Orders from "../../components/pages/Dashboard/orders"
import Positions from "../../components/pages/Dashboard/positions"
import Settings from "../../components/pages/Dashboard/settings"
import Trades from "../../components/pages/Dashboard/trades"
import PublicWebsocket from "../../websocket/public.websocket"
import UserWebsocket from "../../websocket/user.websocket"
import css from "./style.module.css"

export default function Dashboard(props: any) {
    const router = useRouter()
    const [navbar, setNavbar] = useState(true)
    const [active, setActive] = useState("home")
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState({ image: "/anime-girl.gif" })
    const [logs, setLogs] = useState<Array<string>>([])
    const [marketData, setMarketData] = useState<any>({})
    const [marketDataSocketConnected, setMarketDataSocketConnected] = useState(false)
    const [optionChainData, setOptionChainData] = useState<any>({})
    const [currentTime, setCurrentTime] = useState("")
    const [indexLTP, setIndexLTP] = useState<any>({})
    const [indies, setIndies] = useState<any>(["BANKNIFTY", "NIFTY", "FINNIFTY"])
    const [indiesConfig, setIndiesConfig] = useState<any>({})
    const [isTodayHoliday, setIsTodayHoliday] = useState(false)

    const navbarState = () => {
        localStorage.setItem("navbar", JSON.stringify(!navbar))
        setNavbar(!navbar)
    }
    const onNavbarItemClick = (e: string) => {
        setActive(e)
        router.push(`/dashboard/${e}`)
    }

    async function socketInitializer() {
        const publicWebSocket = new PublicWebsocket(props.token, setMarketData, setLogs)
        const userWebsocket = new UserWebsocket(props.token, setLogs)
        publicWebSocket.connect()
        userWebsocket.connect()
    }

    useEffect(() => {
        socketInitializer()
    }, [])

    useEffect(() => {
        if (loading) return

        indies.map((index: any, i: any) => {
            if (!marketData[indiesConfig[index].name]) return
            setIndexLTP((prev: any) => {
                if (typeof marketData[indiesConfig[index].name].lp == "undefined") return prev
                return { ...prev, [indiesConfig[index].name]: marketData[indiesConfig[index].name].lp }
            })
        })
    }, [marketData])

    useEffect(() => {
        setNavbar(JSON.parse(localStorage.getItem("navbar") || "false"))
        setActive(props.query.page || "home")
        router.events.on("routeChangeStart", (url) => {
            const activePage = url.split("/")[2]
            setActive(activePage)
        })

        async function fetchData() {
            setLoading(true)
            const _userData = await fetch("/internalApi/user/get")
            const _data = await _userData.json()
            setIsTodayHoliday(_data.data.todayHoliday)
            setUser(_data.data)
            await fetch("/api/optionChain")
                .then((res) => res.json())
                .then((d: any) => {
                    setOptionChainData(d)
                    setIndies(d.indies)
                    setIndiesConfig(d.indiesConfig)
                    d.indies.map((index: any, i: any) => {
                        setIndexLTP((prev: any) => {
                            return { ...prev, [d.indiesConfig[index].name]: d.indexLTP.filter((x: any) => x.trueDataSymbol == d.indiesConfig[index].name)[0].ltp }
                        })
                    })
                })
            setLoading(false)
        }

        if (loading) {
            fetchData()
        }
    }, [])
    useEffect(() => {
        setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString())
        }, 500)
    }, [])
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
                                <div className="material-symbols-rounded ">home</div>
                            </div>
                            <div className={css.navbar_vertical_item_text}>Home</div>
                        </div>
                        <div className={`${css.navbar_vertical_item} ${active == "positions" && css.active_navbar_item}`} onClick={() => onNavbarItemClick("positions")}>
                            <div className={css.navbar_vertical_item_icon}>
                                <div className="material-symbols-rounded ">work</div>
                            </div>
                            <div className={css.navbar_vertical_item_text}>Positions</div>
                        </div>
                        <div className={`${css.navbar_vertical_item} ${active == "trades" && css.active_navbar_item}`} onClick={() => onNavbarItemClick("trades")}>
                            <div className={css.navbar_vertical_item_icon}>
                                <div className="material-symbols-rounded ">trending_up</div>
                            </div>
                            <div className={css.navbar_vertical_item_text}>Trades</div>
                        </div>
                        <div className={`${css.navbar_vertical_item} ${active == "orders" && css.active_navbar_item}`} onClick={() => onNavbarItemClick("orders")}>
                            <div className={css.navbar_vertical_item_icon}>
                                <div className="material-symbols-rounded ">grading</div>
                            </div>
                            <div className={css.navbar_vertical_item_text}>Orders</div>
                        </div>

                        <div className="divider margin-top-n-bottom" />
                        <div className={`${css.navbar_vertical_item} ${active == "optionChain" && css.active_navbar_item}`} onClick={() => onNavbarItemClick("optionChain")}>
                            <div className={css.navbar_vertical_item_icon}>
                                <div className="material-symbols-rounded ">link</div>
                            </div>
                            <div className={css.navbar_vertical_item_text}>Option Chain</div>
                        </div>
                        <div className={`${css.navbar_vertical_item} ${active == "alerts" && css.active_navbar_item}`} onClick={() => onNavbarItemClick("alerts")}>
                            <div className={css.navbar_vertical_item_icon}>
                                <div className="material-symbols-rounded">alarm</div>
                            </div>
                            <div className={css.navbar_vertical_item_text}>Alerts</div>
                        </div>
                        <div className="divider margin-top-n-bottom" />
                        <div className={`${css.navbar_vertical_item} ${active == "settings" && css.active_navbar_item}`} onClick={() => onNavbarItemClick("settings")}>
                            <div className={css.navbar_vertical_item_icon}>
                                <div className="material-symbols-rounded">settings</div>
                            </div>
                            <div className={css.navbar_vertical_item_text}>Settings</div>
                        </div>
                        <div className={`${css.navbar_vertical_item} ${active == "logs" && css.active_navbar_item}`} onClick={() => onNavbarItemClick("logs")}>
                            <div className={css.navbar_vertical_item_icon}>
                                <div className="material-symbols-rounded">data_object</div>
                            </div>
                            <div className={css.navbar_vertical_item_text}>Logs</div>
                        </div>
                        <div className={css.navbar_lock_unlock} onClick={navbarState}>
                            {navbar ? <div className="material-symbols-rounded">lock</div> : <div className="material-symbols-rounded">lock_open</div>}
                        </div>
                    </div>
                </div>
                <div className={`${css.content} ${navbar && css.content_when_navbar_vertical_is_locked}`}>
                    <div className={css.content_header}>
                        <div className={css.content_header_left}>
                            <div className={css.content_header_title}>{active}</div>
                        </div>
                        <div className={css.content_header_right}>
                            <div className={css.content_header_right_index_current_price}>
                                {/* {marketData["NIFTY BANK"] && <div dangerouslySetInnerHTML={{ __html: marketData["NIFTY BANK"].lp }}></div>} */}
                                {/* BANK NIFTY : 3333.3 <br />
                                NIFTY : 3333.3 <br />
                                FIN NIFTY : 3333.3 <br /> */}
                                {!loading &&
                                    indies.map((index: any, i: any) => {
                                        return (
                                            <div key={i}>
                                                {indiesConfig[index].name}: {indexLTP[indiesConfig[index].name]} <br />
                                            </div>
                                        )
                                    })}
                            </div>
                            <div className={css.content_header_right_time}>{currentTime}</div>
                            {/* <Grid>
                                <Avatar size="xl" src={user.picture} color="gradient" bordered />
                            </Grid> */}

                            <div className={css.profile_wrapper}>
                                <div className={css.circle}>
                                    <Image className={css.profile_image} src={user.image ? user.image : "/anime-girl.gif"} alt="user-profile-image" width={60} height={60} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={css.contentBody}>
                        {loading && <Loading />}
                        {active == "home" && <Home />}
                        {active == "trades" && <Trades />}
                        {active == "orders" && <Orders />}
                        {active == "positions" && <Positions />}
                        {active == "optionChain" && <OptionChain marketData={marketData} optionChainData={optionChainData} user={user} indexLTP={indexLTP} />}
                        {active == "alerts" && <Alerts marketData={marketData} indexLTP={indexLTP} />}
                        {active == "settings" && <Settings />}
                        {active == "logs" && <Logs logs={logs} />}
                        <NotificationComponent />
                        <NotificationSender />
                        {/* <button onClick={() => somethingIDK()}>Something IDK</button> */}
                    </div>
                </div>
            </div>
            {isTodayHoliday && (
                <div className={css.footerNotification}>
                    {" "}
                    <div className={css.footerText}>
                        <a className="uppercase big-text">Today is Holiday</a>
                    </div>
                </div>
            )}
        </>
    )
}

export const getServerSideProps = async (context: any) => {
    const forwarded = context.req.headers["x-real-ip"]
    const token = context.req.cookies["fno.one"] || null
    const ip = forwarded ? forwarded.split(/, /)[0] : context.req.connection.remoteAddress
    if (ip === "103.62.95.22" || ip === "::ffff:127.0.0.1") {
        if (!token) {
            return {
                redirect: {
                    destination: "/api/login",
                    permanent: false,
                },
            }
        } else {
            return {
                props: {
                    ip: ip,
                    query: context.query,
                    token: token,
                },
            }
        }
    }
    return {
        redirect: {
            destination: "/404",
            permanent: false,
            query: context.query,
        },
    }
}
