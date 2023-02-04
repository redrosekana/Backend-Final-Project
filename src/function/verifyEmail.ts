//* import library
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken"

export default function VerifyEmail(req:Request, res:Response) {
    const secret_waitemail = process.env.SECRET_WAITEMAIL as string

    const {token} = req.query
    
    try {
        const decode = jwt.verify(token as string,secret_waitemail)
        console.log(decode)

        res.status(200).json({
            "message":"ok"
        })
    }catch(err:any) {
        const message = err.message
        console.log(message)
        
        if (message === "invalid signature") {
            res.status(400).json({
                "message":"invalid signature"
            })
        }else if (message === "jwt expired") {
            res.status(400).json({
                "message":"jwt expired token"
            })
        }else if (message === "jwt malformed") {
            res.status(400).json({
                "message":"jwt malformed"
            })
        }else {
            res.status(500).json({
                "message":"occurred error in server"
            })
        }
    }
}