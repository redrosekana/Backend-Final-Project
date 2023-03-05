// import library
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken"
import axios from "axios"

// import model
import facebook_members from "../model/user-facebook";

export default async function Facebook(req:Request, res:Response) {
    const {userId , accessTokenFacebook} = req.body
    
    if (!userId || !accessTokenFacebook){
        res.status(400).json({
            "message": "need userId and accessTokenFacebook"
        })
    }else {
        const secret_accessToken:string = process.env.SECRET_ACCESSTOKEN as string
        const secret_refreshToken:string = process.env.SECRET_REFRESHTOKEN as string

        try{
            const result = await axios.get(`https://graph.facebook.com/v4.0/${userId}?fields=id,name,email&access_token=${accessTokenFacebook}`)
            
            const facebookId = result.data.id
            const facebookName = result.data.name

            const existUser = await facebook_members.findOne({facebookId:{$eq:facebookId}})
            
            if (!existUser) {
                await facebook_members.create({
                    facebookId:facebookId,
                    facebookName:facebookName
                })
            }

            const payload = { facebookName }
            
            const accessToken = jwt.sign(payload,secret_accessToken,{
                algorithm:"HS256",
                expiresIn: "1800000ms"
            })
            const refreshToken = jwt.sign(payload,secret_refreshToken,{
                algorithm:"HS256",
                expiresIn: "2700000ms"
            })

            res.status(200).json({
                message:"success login facebook",
                accessToken,
                refreshToken
            })
        }catch(err){
            console.log(err)
            res.status(500).json({
                message:"occurred error in server"
            })
        }   
    }
}

// สำหรับ accessToken
//"10000ms"
//"1800000ms"

// สำหรับ refreshToken
//"20000ms"
//"2700000ms"