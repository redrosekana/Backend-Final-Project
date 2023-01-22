//* import library
import { Request, Response } from "express"
import * as jwt from "jsonwebtoken"

//* import model
import Facebook_member from "../model/user-facebook"

//* declare interface
interface FacebookMember {
  facebookId: string
  facebookName: string
}

export default async function GatewayFacebook(req:Request, res:Response) {
      
      try {
            const existFacebookMember = await Facebook_member.findOne({"facebookId":{$eq:req.user.facebookId}})
            
            if (!existFacebookMember){
                  const addInfo:FacebookMember = {
                        facebookId: req.user.facebookId,
                        facebookName: req.user.facebookName
                  }
                  
                  await Facebook_member.create(addInfo)
            }

            const secret_accessToken:string = process.env.SECRET_ACCESSTOKEN as string
            const secret_refreshToken:string = process.env.SECRET_REFRESHTOKEN as string
            
            const payload = req.user
            const accessToken:string = jwt.sign(payload,secret_accessToken,{
                  "algorithm":"HS256",
                  expiresIn: "10000ms"
            })
            //"10000ms"
            //"1800000ms"
            const refreshToken:string = jwt.sign(payload,secret_refreshToken,{
                  "algorithm":"HS256",
                  expiresIn: "20000ms"
            })
            //"20000ms"
            //"2700000ms"
            
            const url_gateway = process.env.GATEWATFACEBOOK as string
            res.redirect(`${url_gateway}?accessToken=${accessToken}&refreshToken=${refreshToken}`)
      }catch(err:any) {
            console.log(err)
            res.status(500).json({"message":"occurred error in server"})
      }
}