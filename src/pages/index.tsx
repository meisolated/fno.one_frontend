export default function Home() {
    return <div></div>
}

export const getServerSideProps = async (context: any) => {
    const forwarded = context.req.headers["x-real-ip"]
    const ip = forwarded ? forwarded.split(/, /)[0] : context.req.connection.remoteAddress
    if (ip === "103.62.95.22" || ip === "::ffff:127.0.0.1") {
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
