// import library
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcrypt"

// import model 
import user_members from "../model/user-member";

export default async function UpdatePassword(req:Request, res:Response) {
    const { password } = req.body

    if (!password) {
        res.status(400).json({message:"need password"})
    }else {
        try {
            const saltRounds:number = Number(process.env.SALTROUNDS)
            const hashPassword = await bcrypt.hash(String(password),saltRounds)

            const result = req.user
            const member = await user_members.findOne({username:{$eq:result.username}})
            await user_members.findByIdAndUpdate(member?._id,{password:hashPassword})
            
            res.status(200).json({message:"success change a user password"})
            
        }catch(err:any) {
            res.status(500).json({
                "message":"occurred error in server"
            })
        }
    }
}