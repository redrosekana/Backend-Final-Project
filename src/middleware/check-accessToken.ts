//* import library
import { Request, Response, NextFunction } from "express"
import * as jwt from "jsonwebtoken"

export default async function checkToken(req:Request, res:Response, next:NextFunction) {
      let token:string | undefined = req.headers.authorization
      // console.log("accesstoken =",token)
      
      if (!token?.includes("Bearer ")){
            res.status(400).json({"message":"must pass Bearer in front of token or haven't token"})
      }else{
            const secret_accessToken:string = process.env.SECRET_ACCESSTOKEN as string
            const separateToken:string[] = token.split(" ")
            token = separateToken[1]
            
            try {
                  const jwtDecode = jwt.verify(token,secret_accessToken)
                  req.payload = jwtDecode
                  next()
            }catch(err:any) {
                  console.log(err.message)
                  if (err.message === "jwt expired"){
                        res.status(401).json({"message":"expired accessToken"})
                  }else{
                        res.status(401).json({"message":"unauthorization accessToken"})
                  }
            }
      }
}