import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        /** read token from header */ 
        const header = req.headers.authorization
        const [bearer, token] = header ? header.split(" "): []

        // verify token
        const signature = process.env.SECRET || ""
        const isVerified = jwt.verify(token, signature)

        if (!isVerified) {
            res.status(401).json({
                message: "Unauthorized"
            })
        }

        next()
    } catch (error) {
        res.status(401).json({
            message: error
        })
    }
}

export { verifyToken }