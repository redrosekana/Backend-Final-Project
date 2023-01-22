//* import library
import { Request, Response, NextFunction } from "express"
import * as jwt from "jsonwebtoken"

export default async function checkToken(req:Request, res:Response, next:NextFunction) {
      let token:string | undefined = req.headers.authorization
      console.log("refreshtoken =",token)
      
      if (!token?.includes("Bearer ")){
            res.status(400).json({"message":"must pass Bearer in front of token or haven't token"})
      }else{
            const secret_refreshToken:string = process.env.SECRET_REFRESHTOKEN as string
            const separateToken:string[] = token.split(" ")
            token = separateToken[1]
            
            try {
                  const jwtDecode = jwt.verify(token,secret_refreshToken)
                  req.payload = jwtDecode
                  next()
            }catch(err:any) {
                  console.log(err.message)
                  if (err.message === "jwt expired"){
                        res.status(401).json({"message":"expired refreshToken"})
                  }else{
                        res.status(401).json({"message":"unauthorization refreshToken"})
                  }
            }
      }
}