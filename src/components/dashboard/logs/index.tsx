import Head from "next/head"
import { useEffect } from "react"
import css from "./style.module.css"
interface Props {
    logs: any
}

export default function Logs(props: Props) {
    useEffect(() => { }, [])
    return (
        <div>
            <Head>
                <title>Logs</title>
            </Head>
            <div className="container">
                <div className={css.logsList} >
                    {props.logs.map((log: any, index: number) => {
                        return (
                            <div key={index}>
                                <p>{log}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
