// import library
import { Request, Response } from "express";
import * as bcrypt from "bcrypt"

// import model 
import user_members from "../model/user-member";

export default async function UpdatePassword(req:Request, res:Response) {
    const { oldPassword , newPassword } = req.body

    if (!oldPassword || !newPassword) {
        res.status(400).json({message:"need password that will change"})
    }else {
        try {
            const saltRounds:number = Number(process.env.SALTROUNDS)
            const hashNewPassword = await bcrypt.hash(String(newPassword),saltRounds)
            
            const result = req.user
            const member = await user_members.findOne({username:{$eq:result.username}})
            const compareOldPassword = await bcrypt.compare(String(oldPassword),member?.password as string)
            
            if (compareOldPassword) {
                await user_members.findByIdAndUpdate(member?._id,{password:hashNewPassword})
            
                res.status(200).json({message:"success change a user password"})
            }else {
                res.status(400).json({message:"old password invalid"})
            }
        }catch(err:any) {
            res.status(500).json({
                "message":"occurred error in server"
            })
        }
    }
}