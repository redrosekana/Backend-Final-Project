//* import library
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken"
import axios from "axios"

//* import model
import Facebook_member from "../model/user-facebook";

export default async function ManageFacebook(req:Request, res:Response) {
    const {userId,accessTokenFacebook} = req.body
    console.log(req.body)
    console.log(userId)
    console.log(accessTokenFacebook)
    
    const secret_accessToken:string = process.env.SECRET_ACCESSTOKEN as string
    const secret_refreshToken:string = process.env.SECRET_REFRESHTOKEN as string

    try{
        const result = await axios.get(`https://graph.facebook.com/v4.0/${userId}?fields=id,name,email&access_token=${accessTokenFacebook}`)
        console.log(result.data)


        const facebookId = result.data.id
        const facebookName = result.data.name

        const existUser = await Facebook_member.findOne({"facebookId":{$eq:facebookId}})
        console.log(existUser)
        
        if (!existUser) {
            const facebookUser = await Facebook_member.create({
                "facebookId":facebookId,
                "facebookName":facebookName
            })
            console.log("first add user")
        }

        const payload = {
            facebookName    
        }
        
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


        res.status(201).json({
            message:"success login facebook",
            accessToken,
            refreshToken
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            "message":"error in server"
        })
    }   
}