import { Request, Response } from "express"
import bcrypt from "bcrypt"

//* import model
import User_member from "../model/user-member"

//* declare interface
interface RegisterMember {
      displayName:string
      username:string
      password:string
      email:string
}

export default async function Register(req:Request, res:Response){
      let {displayName , username , password , email}:RegisterMember = req.body
      
      if (!displayName || !username || !password || !email ) {
            res.status(400).json({"message":"need additnal information"})
      }else{
            try {
                  const repeatdisplayName = await User_member.find({"displayName":displayName.trim()})
                  const repeatUsername = await User_member.find({"username":username.trim()})
                  const repeatEmail = await User_member.find({"email":email.trim()})
                  
                  console.log(repeatdisplayName)
                  if (repeatdisplayName.length > 0) {
                        res.status(400).json({"message":"displayName repeated"})
                  }else if (repeatUsername.length > 0) {
                        res.status(400).json({"message":"username repeated"})
                  }else if (repeatEmail.length > 0) {
                        res.status(400).json({"message":"email repeated"})
                  }else {

                        const saltRounds:number = Number(process.env.SALTROUNDS)
                        const hashPassword = await bcrypt.hash(String(password),saltRounds)
                        const user:RegisterMember = {
                              "displayName":displayName.trim(), 
                              "username":username.trim(), 
                              "password":hashPassword.trim(), 
                              "email":email.trim()
                        }

                        await User_member.create(user)
                        res.status(200).json({"message":"register success"})
                  }
            }catch(err:any) {
                  console.log(err)
                  res.status(500).json({"message":"occurred error in server"})
            }
      }
}