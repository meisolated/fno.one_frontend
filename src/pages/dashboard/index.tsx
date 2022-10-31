import Head from "next/head"
import css from "./style.module.css"

export default function Dashboard() {
    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <div className={css.dashboard}>
                <div className={css.navbar_vertical}>
                    <div>Home</div>
                </div>
                <div className={css.content}>
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
