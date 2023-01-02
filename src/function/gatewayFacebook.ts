//* import library
import { Request, Response } from "express"
import * as jwt from "jsonwebtoken"

//* import model
import facebook_member from "../model/user-facebook"


interface AddInfo {
  facebookId: string
  facebookName: string
}

export default async function GatewayFacebook(req:Request, res:Response) {
      //console.log(req.user)
      
      try {
            const existFacebookMember = await facebook_member.findOne({"facebookId":{$eq:req.user.facebookId}})
            //console.log(existFacebookMember)

            if (!existFacebookMember){
                  const addInfo:AddInfo = {
                        facebookId: req.user.facebookId,
                        facebookName: req.user.facebookName
                  }
                  
                  await facebook_member.create(addInfo)
            }

            const secretToken:string = process.env.SECRET_TOKEN as string
            const payload = req.user
            const accessToken:string = jwt.sign(payload,secretToken,{
                  "algorithm":"HS256",
                  expiresIn: "108000000ms"
            })

            const refreshToken:string = jwt.sign(payload,secretToken,{
                  "algorithm":"HS256",
                  expiresIn: "10h"
            })
            
            res.redirect(`http://localhost:5173?accessToken=${accessToken}&refreshToken=${refreshToken}`)
      }catch(err:any) {
            console.log(err)
            res.status(500).json({"message":"occurred error in server"})
      }
}