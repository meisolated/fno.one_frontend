import axios from "axios"
export default function handler(req, res) {
    axios.get("http://localhost:3011/accept_access", { params: req.query })
    res.status(200).json({ status: "Not Found", code: 404 })
}
