import { NextFunction, Request, Response } from "express"
import { verifyToken } from "../lib/jwt"

const MISSING_AUTH = 'Missing authorization header'

export default function tokenValidator() {
    return async function (req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            res.status(401).json({ message: MISSING_AUTH })
            return
        }

        const [bearer, token] = authHeader.split(' ')

        if (bearer !== 'Bearer'){
            res.status(401).json({ message: MISSING_AUTH })
            return
        }

        try {
            const tokenPayload = verifyToken(token)
            req.user = tokenPayload
        } catch (err) {
            res.status(401).json({ message: MISSING_AUTH })
            return
        }
        return next()
    }
}