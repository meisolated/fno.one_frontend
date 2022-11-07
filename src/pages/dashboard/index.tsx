import Head from "next/head"
import { useState } from "react"
import { Home as HomeIcon, Settings as SettingsIcon, Trend as TrendIcon } from "../../assets/svg"
import css from "./style.module.css"
export default function Dashboard() {
    const [navbar, setNavbar] = useState(false)
    const navbarState = () => {
        setNavbar(!navbar)
    }

    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <div className={css.dashboard}>
                <div className={`${css.navbar_vertical} ${navbar && css.lock_navbar_vertical}`}>
                    <div className={css.logo}>FnO</div>
                    <div className="divider padding-left-right-20"></div>
                    <div className={css.navbar_vertical_items}>
                        <div className={css.navbar_vertical_item}>
                            <div className={css.navbar_vertical_item_icon}>
                                <HomeIcon />
                            </div>
                            <div className={css.navbar_vertical_item_text}>Home</div>
                        </div>
                        <div className={css.navbar_vertical_item}>
                            <div className={css.navbar_vertical_item_icon}>
                                <TrendIcon />
                            </div>
                            <div className={css.navbar_vertical_item_text}>Home</div>
                        </div>
                        <div className="divider padding-left-right-20"></div>
                        <div className={css.navbar_vertical_item}>
                            <div className={css.navbar_vertical_item_icon}>
                                <SettingsIcon />
                            </div>

                            <div className={css.navbar_vertical_item_text}>Home</div>
                        </div>

                    </div>
                </div>
                <div className={`${css.content} ${navbar && css.content_when_navbar_vertical_is_locked}`}>
                    <h1>Dashboard</h1>
                </div>
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
