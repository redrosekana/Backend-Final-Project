import { Request, Response } from "express";

import user_members from "../model/user-member";

export default async function UpdateUserMember(req:Request, res:Response) {
    const { displayName, email } = req.body
    
    if (!displayName && !email) {
        res.status(200).json({message:"need least one field for update information"})
    }else {
        try {
            const information:any = req.user
            const member = await user_members.findOne({username:{$eq:information.username}}).select("-_id -__v -password")
            await user_members.findOneAndUpdate({username:{$eq:member?.username}},{
                displayName:displayName,
                email:email
            })
            
            res.status(200).json({message:"update user member success"})
        }catch(err:any) {
            res.status(500).json({
                "message":"occurred error in server"
            })
        }
    }
    
    
}