//* import library
import { Request, Response} from "express"
import * as jwt from "jsonwebtoken"

export default function RenewToken(req:Request, res:Response){
    
    const secret_accessToken:string = process.env.SECRET_ACCESSTOKEN as string
    const secret_refreshToken:string = process.env.SECRET_REFRESHTOKEN as string
    console.log("payload old",req.payload)
    
    const selectUser = req.payload
    const payload = {}
    
    if (selectUser.username){
        Object.assign(payload,{
            "displayName":req.payload.displayName,
            "username":req.payload.username
        })
    }else {
        Object.assign(payload,{
            "facebookId": req.payload.facebookId,
            "facebookName": req.payload.facebookName,
              
        })
    }

    console.log("payload renew = ",payload)

    const accessToken = jwt.sign(payload,secret_accessToken,{
        "algorithm":"HS256",
        expiresIn: "10000ms"
    })
    //"10000ms"
    //"1800000ms"

    const refreshToken = jwt.sign(payload,secret_refreshToken,{
        "algorithm":"HS256",
        expiresIn: "20000ms"
    })
    //"20000ms"
    //"2700000ms"
    res.status(200).json({
        "message":"renew token success",
        "accessToken":accessToken,
        "refreshToken":refreshToken
    })
}