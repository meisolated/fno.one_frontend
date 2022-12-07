import Head from "next/head"
export default function Page404() {
    return (
        <div>
            <Head>
                <title>404</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h1>404</h1>
                <p>Page not found</p>
            </main>
        </div>
    )
}
