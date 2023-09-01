import { useRouter } from "next/router"
import { useEffect } from "react"
import Loading from "../../components/Loading"

export default function Dashboard(props: any) {
    const router = useRouter()
    useEffect(() => {
        router.push("/dashboard/home")
    }, [])

    return (
        <div style={{ width: "100%", height: "100%", position: "absolute", alignItems: "center", textAlign: "center" }}>
            <Loading />
        </div>
    )
}
