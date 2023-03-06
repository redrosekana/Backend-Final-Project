import { Request, Response } from "express";

import user_members from "../model/user-member";
import facebook_members from "../model/user-facebook";

export default async function UpdateUserMember(req:Request, res:Response) {
    const { displayNameUser, email, displayNameFacebook } = req.body

    const information:any = req.user

    try {
        if (information.username) {
            if (!displayNameUser && !email) {
                res.status(200).json({message:"need least one field for update information"})
            }else {
                const repeatDisplayNameUser = await user_members.findOne({displayName:{$eq:displayNameUser}})
                const repeatEmail = await user_members.findOne({email:{$eq:email}})
                
                if (repeatDisplayNameUser) {
                    res.status(400).json({message:"displayName repeated"})
                }else if (repeatEmail) {
                    res.status(400).json({message:"email repeated"})
                }else {
                    const member = await user_members.findOne({username:{$eq:information.username}}).select("-_id -__v -password")
                    await user_members.findOneAndUpdate({username:{$eq:member?.username}},{
                        displayName:displayNameUser,
                        email:email
                    })
                    res.status(200).json({message:"update user member success"})
                }
            }
        }else {
            if (!displayNameFacebook) {
                res.status(200).json({message:"need least one field for update information"})
            }else {
                const repeatDisplayNameFacebook = await facebook_members.findOne({displayName:{$eq:displayNameFacebook}})
               
                if (repeatDisplayNameFacebook) {
                    res.status(400).json({message:"displayName repeated"})
                }else {
                    const member = await facebook_members.findOne({facebookId:{$eq:information.facebookId}}).select("-_id -__v -password")
                    await facebook_members.findOneAndUpdate({facebookId:{$eq:member?.facebookId}},{
                        displayName:displayNameFacebook,
                    })
                    res.status(200).json({message:"update facebook member success"})
                }
            }
        }
    }catch(err) {
        res.status(500).json({
            "message":"occurred error in server"
        })    
    }
}