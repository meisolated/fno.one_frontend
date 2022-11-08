import { useRouter } from "next/router"
import { useEffect } from "react"

export default function Dashboard(props: any) {

    const router = useRouter()
    useEffect(() => {
        router.push("/dashboard/home")
    }, [])

    return (
        <>
            <div>What you&rsquo;re looking for isn&rsquo;t here</div>
        </>
    )
}