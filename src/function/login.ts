//* import library
import { Response , Request } from "express"
import bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"

//* import model
import User_member from "../model/user-member"

export default async function Login(req:Request ,res:Response){
      const {username , password} = req.body
      
      if (!username || !password){
            res.status(400).json({"message":"please input username or password"})
      }else{
            try {
                  const existUser = await User_member.findOne({username:{$eq:username}})
            
                  if (!existUser) {
                        res.status(400).json({"message":"don't exisit user in database"})
                  }else {
                        const hashPassword = existUser.password
                        const checkPassword = await bcrypt.compare(String(password),hashPassword)
                        
                        if (!checkPassword) {
                              res.status(400).json({"message":"password invalid"})
                        }else {
                              const payload:{displayName:string, username:string} = {
                                    "displayName":existUser.displayName,
                                    "username": existUser.username
                              }
                              const secret:string = process.env.SECRET_TOKEN as string
                              const accessToken = jwt.sign(payload,secret,{
                                    "algorithm":"HS256",
                                    expiresIn: "1h"
                              })

                              const refreshToken = jwt.sign(payload,secret,{
                                    "algorithm":"HS256",
                                    expiresIn: "1d"
                              })
                              
                              res.status(200).json({
                                    "message":"login success",
                                    "accessToken":accessToken,
                                    "refreshToken":refreshToken
                              })
                        }
                  }
            }catch(err:any){
                  console.log(err)
                  res.status(500).json({"message":"occurred error in server"})
            }
      }
}