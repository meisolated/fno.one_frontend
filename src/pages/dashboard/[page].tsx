import { useEffect, useState } from "react"

import Head from "next/head"
import Home from "../../components/dashboard/home"
import Image from "next/image"
import Loading from "../../components/loading"
import Logs from "../../components/dashboard/logs"
import OptionChain from "../../components/dashboard/optionChain"
import Orders from "../../components/dashboard/orders"
import Positions from "../../components/dashboard/positions"
import Settings from "../../components/dashboard/settings"
import Trades from "../../components/dashboard/trades"
import css from "./style.module.css"
import io from "socket.io-client"
import { useRouter } from "next/router"

export default function Dashboard(props: any) {
    const [navbar, setNavbar] = useState(true)
    const router = useRouter()
    const [active, setActive] = useState("home")
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState({ picture: "/anime-girl.gif" })
    const [logs, setLogs] = useState<Array<string>>([])
    const [marketData, setMarketData] = useState<any>({})
    const [marketDataSocketConnected, setMarketDataSocketConnected] = useState(false)

    const navbarState = () => {
        localStorage.setItem("navbar", JSON.stringify(!navbar))
        setNavbar(!navbar)
    }
    const onNavbarItemClick = (e: string) => {
        setActive(e)
        router.push(`/dashboard/${e}`)
    }

    const playSound = () => {
        const audio = new Audio("https://fno.one/mp3/ding.mp3")
        audio.play()
    }
    async function socketInitializer() {
        // Public Socket
        const publicSocket = io("wss://fno.one/public", {
            transports: ["websocket"],
            upgrade: false,
            path: "/socket",
            query: {
                sessionId: props.token,
            },
        })
        publicSocket.on("connect", () => {
            setLogs((logs: any) => {
                return [...logs, "Public Socket Connected"]
            })
        })
        publicSocket.on("disconnect", () => {
            setLogs((logs: any) => {
                return [...logs, "Public Socket Disconnected"]
            })
        })
        publicSocket.emit("subscribeMarketDataUpdate", { sessionId: props.token })
        publicSocket.on("marketDataUpdate", (data: any) => {
            const parsedData = JSON.parse(data)
            const symbol = parsedData.symbol || parsedData.Symbol
            setMarketData((marketData: any) => {
                return { ...marketData, [symbol]: parsedData }
            })
            // if (!marketDataSocketConnected) {
            //     setMarketDataSocketConnected(() => true)
            //     console.log("Market Data Socket Connected")

            //     console.log(marketDataSocketConnected)
            //     setLogs((logs: any) => {
            //         return [...logs, "Market Data Socket Connected"]
            //     })
            // } else {

            // }
        })

        // User Socket
        const userSocket = io("wss://fno.one/user", {
            transports: ["websocket"],
            upgrade: false,
            path: "/socket",
            query: {
                sessionId: props.token,
            },
        })
        userSocket.on("connect", () => {
            setLogs((logs: any) => {
                return [...logs, "User Socket Connected"]
            })
        })
        userSocket.on("disconnect", () => {
            setLogs((logs: any) => {
                return [...logs, "User Socket Disconnected"]
            })
        })
        userSocket.on("error", (err: any) => {
            setLogs((logs: any) => {
                return [...logs, "User Socket Error: " + err]
            })
        })
        setInterval(() => {
            userSocket.emit("ping", "ping")
        }, 6000)
        userSocket.on("pong", (data: any) => {
            console.log(data)
            return
        })
        userSocket.emit("subscribeOrderUpdate", { sessionId: props.token })
        userSocket.on("orderUpdate", (data: any) => {
            const parsedData = JSON.parse(data)
            const message = parsedData.message
            console.log(parsedData)
            setLogs((orderUpdates) => {
                return [...orderUpdates, message]
            })
            if (message.includes("CONFIRMED")) {
                playSound()
            }
        })
    }

    useEffect(() => {
        socketInitializer()
    }, [])

    useEffect(() => {
        setNavbar(JSON.parse(localStorage.getItem("navbar") || "false"))
        setActive(props.query.page || "home")
        router.events.on("routeChangeStart", (url) => {
            const activePage = url.split("/")[2]
            setActive(activePage)
        })

        async function fetchData() {
            setLoading(true)
            const _userData = await fetch("/internal_api/user")
            const _data = await _userData.json()
            // setUser({ picture: _data.data.image })
            setLoading(false)
        }

        if (loading) {
            setLoading(false)
            fetchData()
        }
    }, [])
    // if (loading) return <Loading />

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
                        <div className={`${css.navbar_vertical_item} ${active == "option_chain" && css.active_navbar_item}`} onClick={() => onNavbarItemClick("option_chain")}>
                            <div className={css.navbar_vertical_item_icon}>
                                <div className="material-symbols-rounded ">link</div>
                            </div>
                            <div className={css.navbar_vertical_item_text}>Option Chain</div>
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
                            {marketData["NIFTY BANK"] && <div dangerouslySetInnerHTML={{ __html: marketData["NIFTY BANK"].lp }}></div>}
                            {/* <Grid>
                                <Avatar size="xl" src={user.picture} color="gradient" bordered />
                            </Grid> */}

                            <div className={css.profile_wrapper}>
                                <div className={css.circle}>
                                    <Image className={css.profile_image} src={user.picture} alt="user-profile-image" width={60} height={60} />
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
                        {active == "settings" && <Settings user={user} />}
                        {active == "option_chain" && <OptionChain marketData={marketData} />}
                        {active == "logs" && <Logs logs={logs} />}
                        {/* <button onClick={() => requestUserNotificationPermission()}>Request Notification Permission</button> */}
                        {/* <button onClick={() => somethingIDK()}>Something IDK</button> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = async (context: any) => {
    const forwarded = context.req.headers["x-real-ip"]
    const token = context.req.cookies["fno.one"] || null
    const ip = forwarded ? forwarded.split(/, /)[0] : context.req.connection.remoteAddress
    if (ip === "103.62.93.150" || ip === "::ffff:127.0.0.1") {
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
