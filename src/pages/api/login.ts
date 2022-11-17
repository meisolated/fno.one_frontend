import axios from "axios"
import { deleteCookie } from "cookies-next"
export default async function handler(req: any, res: any) {
    await res.redirect("https://api.fyers.in/api/v2/generate-authcode?client_id=6UL65YECYS-100&redirect_uri=https://fno.one/internal_api/accept_access&response_type=code&state=EpHAgErSAbsItYPTicTOUSCHIPOLoqUiDEoUsebAgNEYnoZenI")
    // if (req.cookies["fno.one"]) {
    //     const response = await axios.get("http://fno.one/internal_api/accept_access", { params: { cookies: req.cookies } })
    //     if (response.data.code === 200) {
    //         await res.redirect("https://fno.one")
    //     }
    //     else if (response.data.code === 401) {
    //         deleteCookie("fno.one")
    //         await res.redirect("https://fno.one/error/sessionTimeout")

    //     }
    //     else {
    //         res.send({ code: 500, message: "Something went wrong " + response.data.message })
    //     }
    // } else {
    //     const loginUrl = "https://api.fyers.in/api/v2/generate-authcode?client_id=6UL65YECYS-100&redirect_uri=https://fno.one/internal_api/accept_access&response_type=code&state=EpHAgErSAbsItYPTicTOUSCHIPOLoqUiDEoUsebAgNEYnoZenI"
    //     res.redirect(loginUrl)
    // }
}