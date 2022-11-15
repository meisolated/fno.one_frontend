import axios from "axios"
import { removeCookies } from "cookies-next"
export default async function handler(req: any, res: any) {
    if (req.cookies["fno.one"]) {
        const response = await axios.get("http://localhost:3011/accept_access", { params: { cookies: req.cookies } })
        if (response.data.code === 200) {
            console.log("login", response.data)
            await res.redirect("https://fno.one")

        }
        else if (response.data.code === 401) {
            removeCookies("fno.one")
            await res.redirect("https://fno.one/login")

        }
        else {
            res.send({ code: 500, message: "Something went wrong " + response.data.message })
        }
    } else {
        const loginUrl = "https://api.fyers.in/api/v2/generate-authcode?client_id=6UL65YECYS-100&redirect_uri=https://fno.one/api/callback&response_type=code&state=EpHAgErSAbsItYPTicTOUSCHIPOLoqUiDEoUsebAgNEYnoZenI"
        res.redirect(loginUrl)
    }
}