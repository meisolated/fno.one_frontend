import axios from "axios"
import { setCookie } from "cookies-next"

export default async function handler(req: any, res: any) {
    // const cookies = req.cookies
    // const response = await axios.get("http://fno.one/internal_api/accept_access", { params: { ...req.query, cookies } })
    // if (response.data.code === 200) {
    //     if (cookies["fno.one"]) {
    //         return await res.redirect("https://fno.one")
    //     } else {
    //         setCookie("fno.one", response.data.cookie, { req, res, maxAge: response.data.maxAge, path: "/" })
    //         return await res.redirect("https://fno.one")
    //     }
    // }
    // else {
    //     res.send({ code: 500, message: "Something went wrong " + response.data.message })
    // }
    res.send({ code: 500, message: "Something went wrong " })
}