import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import io from "socket.io-client"
import userProfilePlaceholder from "../../assets/img/user_profile_placeholder.jpg"
import { Health as PositionsIcon, Home as HomeIcon, Lock as LockIcon, ReceiptItem as ReceiptItemIcon, Settings as SettingsIcon, Trend as TrendIcon, Unlock as UnlockIcon } from "../../assets/svg"
import Home from "../../components/dashboard/home"
import Orders from "../../components/dashboard/orders"
import Positions from "../../components/dashboard/positions"
import Settings from "../../components/dashboard/settings"
import Trades from "../../components/dashboard/trades"
import Loading from "../../components/loading"
import css from "./style.module.css"

export default function Dashboard(props: any) {
    const [navbar, setNavbar] = useState(true)
    const router = useRouter()
    const [active, setActive] = useState("home")
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState({ picture: userProfilePlaceholder })

    const navbarState = () => {
        localStorage.setItem("navbar", JSON.stringify(!navbar))
        setNavbar(!navbar)
    }
    const onNavbarItemClick = (e: string) => {
        setActive(e)
        router.push(`/dashboard/${e}`)
    }

    async function socketInitializer() {
        const socket = io("wss://fno.one", {
            transports: ["websocket"],
            upgrade: false,
            path: "/internal_api/socket.io/",
            query: {
                sessionId: props.token,
            },
        })
        socket.on("connect", () => {
            console.log("connected")
        })
        socket.on("disconnect", () => {
            console.log("disconnected")
        })
        socket.on("error", (err: any) => {
            console.log(err)
        })
        setInterval(() => {
            socket.emit("ping", "ping")
        }, 6000)
        socket.on("pong", (data: any) => {
            console.log(data)
        })
        socket.emit("subscribeOrderUpdate", { sessionId: props.token })
        socket.on("orderUpdate", (data: any) => {
            const parsedData = JSON.parse(data)
            console.log(parsedData)
        })


    }

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
            setUser({ ...user, picture: _data.data.image })
            setLoading(false)

        }
        socketInitializer()

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
                        <div className={`${css.navbar_vertical_item} ${active == "orders" && css.active_navbar_item}`} onClick={() => onNavbarItemClick("orders")}>
                            <div className={css.navbar_vertical_item_icon}>
                                <ReceiptItemIcon />
                            </div>
                            <div className={css.navbar_vertical_item_text}>Orders</div>
                        </div>
                        <div className={`${css.navbar_vertical_item} ${active == "positions" && css.active_navbar_item}`} onClick={() => onNavbarItemClick("positions")}>
                            <div className={css.navbar_vertical_item_icon}>
                                <PositionsIcon />
                            </div>
                            <div className={css.navbar_vertical_item_text}>Positions</div>
                        </div>
                        <div className="divider margin-top-n-bottom" />
                        <div className={`${css.navbar_vertical_item} ${active == "settings" && css.active_navbar_item}`} onClick={() => onNavbarItemClick("settings")}>
                            <div className={css.navbar_vertical_item_icon}>
                                <SettingsIcon />
                            </div>
                            <div className={css.navbar_vertical_item_text}>Settings</div>
                        </div>
                        <div className={css.navbar_lock_unlock} onClick={navbarState}>
                            {navbar ? <LockIcon /> : <UnlockIcon />}
                        </div>
                    </div>
                </div>
                <div className={`${css.content} ${navbar && css.content_when_navbar_vertical_is_locked}`}>
                    <div className={css.content_header}>
                        <div className={css.content_header_left}>
                            <div className={css.content_header_title}>{active}</div>
                        </div>
                        <div className={css.content_header_right}>
                            <div className={css.profile_wrapper}>
                                <div className={css.profile_image}>
                                    <Image src={user.picture} alt="user-profile-image" width={40} height={40} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={css.content_body}>
                        {loading && <Loading />}
                        {active == "home" && <Home />}
                        {active == "trades" && <Trades />}
                        {active == "orders" && <Orders />}
                        {active == "positions" && <Positions />}
                        {active == "settings" && <Settings />}
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
