export default function Auth(props: any) {
    return <></>
}

export async function getServerSideProps(context: any) {
    const forwarded = context.req.headers["x-real-ip"]
    const token = context.req.cookies["fno.one"] || null
    const ip = forwarded ? forwarded.split(/, /)[0] : context.req.connection.remoteAddress
    if (ip === "103.62.93.150" || ip === "::ffff:127.0.0.1" || ip == "172.30.14.138") {
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
}
