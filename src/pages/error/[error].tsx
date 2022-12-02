import Head from "next/head"
import css from "./style.module.css"

export default function Error(props: any) {
    const errorsList = {
        sessionTimeout: {
            title: "Session Timeout",
            description: "Your session has timed out. Please login again.",
        },
        serverMaintenance: {
            title: "Server Maintenance",
            description: "The server is currently under maintenance. Please try again later.",
        },
        404: {
            title: "Page Not Found",
            description: "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
        },
        userNotFound: {
            title: "User Not Found",
            description: "The user you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
        },

    }
    const err = props.query.error || "404"
    //@ts-ignore
    const error = (errorsList[err] !== undefined) ? errorsList[err] : errorsList["404"]
    return (
        <div>
            <Head>
                <title>{error.title}</title>
            </Head>
            <div className={css.background}>
                <div className={css.error_wrapper}>
                    <h1>{error.title}</h1>
                    <h2>{error.description}</h2>

                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context: any) {
    const query = context.query
    return {
        props: {
            query
        }
    }
}