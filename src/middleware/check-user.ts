//* import library
import { Response, Request, NextFunction } from "express";

//* import model
import User_member from "../model/user-member";
import Facebook_member from "../model/user-facebook";

export default async function checkUser(req:Request , res:Response , next:NextFunction){
      
      const selectUser = req.payload
      console.log("check-user = ",selectUser)
      
      try {
            if (selectUser.username) {
                  const result = await User_member.findOne({"username":selectUser.username})
                  console.log("usermember = ",result)
                  req.proflie = {
                        "displayName":result?.displayName,
                        "username":result?.username,
                        "email":result?.email
                  }
                  next()
            }else {
                  const result = await Facebook_member.findOne({"facebookId":selectUser.facebookId})
                  console.log("facebookmember = ",result)
                  req.proflie = {
                        "displayName":(result?.displayName ? result?.displayName : "guest"),
                        "facebookId":result?.facebookId,
                        "facebookName":result?.facebookName
                  }
                  next()
            }
      }catch(err:any){
            console.log(err)
            res.status(500).json({"message":"occurred error in server"})
      }
}