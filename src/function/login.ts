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
                        res.status(400).json({"message":"don't exist user in database"})
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

                              const secret_accessToken:string = process.env.SECRET_ACCESSTOKEN as string
                              const secret_refreshToken:string = process.env.SECRET_REFRESHTOKEN as string
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