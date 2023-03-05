// import library
import { Request, Response } from "express"
import bcrypt from "bcrypt"

// import model
import user_members from "../model/user-member"

// declare interface
interface RegisterMember {
	displayName:string
	username:string
	password:string
	email:string
}

export default async function Register(req:Request, res:Response){
	let {displayName , username , password , email} = req.body
	
	if (!displayName || !username || !password || !email ) {
		res.status(400).json({message:"need additnal information"})
	}else{
		try {
			const repeatdisplayName = await user_members.findOne({displayName:displayName.trim()})
			const repeatUsername = await user_members.findOne({username:username.trim()})
			const repeatEmail = await user_members.findOne({email:email.trim()})
			
			if (repeatdisplayName) {
				res.status(400).json({message:"displayName repeated"})
			}else if (repeatUsername) {
				res.status(400).json({message:"username repeated"})
			}else if (repeatEmail) {
				res.status(400).json({message:"email repeated"})
			}else {

				const saltRounds:number = Number(process.env.SALTROUNDS)
				const hashPassword:string = await bcrypt.hash(String(password),saltRounds)
				const user:RegisterMember = {
					displayName:displayName.trim(), 
					username:username.trim(), 
					password:hashPassword.trim(), 
					email:email.trim()
				}

				await user_members.create(user)
				res.status(200).json({message:"register success"})
			}
		}catch(err:any) {
			console.log(err)
			res.status(500).json({message:"occurred error in server"})
		}
	}
}