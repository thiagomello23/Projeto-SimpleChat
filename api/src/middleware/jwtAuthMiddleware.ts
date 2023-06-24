
import jwt from "jsonwebtoken"
import * as dotenv from 'dotenv'
dotenv.config()

async function jwtAuthMiddleware(req: any, res: any, next: any) {

    const token = req.headers["authorization"];

    if(!token) {
        return res.status(200).json({error: true, msg: "Token invalido"})
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET!);
        next();
    } catch(e) {
        return res.status(200).json({error: true, msg: "Token invalido"})
    }
}

export default jwtAuthMiddleware;