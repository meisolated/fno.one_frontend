
export default function handler(req, res) {
    const loginUrl = "https://api.fyers.in/api/v2/generate-authcode?client_id=6UL65YECYS-100&redirect_uri=https://fno.one/api/callback&response_type=code&state=EpHAgErSAbsItYPTicTOUSCHIPOLoqUiDEoUsebAgNEYnoZenI"
    res.redirect(loginUrl)
}

