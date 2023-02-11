import Head from "next/head"
import { useEffect } from "react"

interface Props {
    user: any
}

export default function Settings(props: Props) {
    useEffect(() => {
        console.log(props.user)
    }, [])
    return (
        <div>
            <Head>
                <title>Settings</title>
            </Head>
            <h1>Settings</h1>
        </div>
    )
}
