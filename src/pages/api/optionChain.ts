import axios from "axios"
export default async function handler(req: any, res: any) {
    const cookie = req.cookies["fno.one"]
    const response = await axios.get("http://localhost:3011/optionChain", { params: { cookie, symbol: req.query.symbol }, })
    res.send(response.data)
}