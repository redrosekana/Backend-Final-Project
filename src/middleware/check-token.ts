//* import library
import { Request, Response, NextFunction } from "express"
import * as jwt from "jsonwebtoken"

export default async function checkToken(req:Request, res:Response, next:NextFunction) {
      let token:string | undefined = req.headers.authorization
      
      if (!token?.includes("Bearer ")){
            res.status(400).json({"message":"must pass Bearer in front of token or haven't token"})
      }else{
            const secret:string = process.env.SECRET_TOKEN as string
            const separateToken:string[] = token.split(" ")
            token = separateToken[1]
            
            try {
                  const jwtDecode = jwt.verify(token,secret)
                  req.payload = jwtDecode
                  next()
            }catch(err:any) {
                  if (err.message === "invalid token"){
                        res.status(400).json({"message":"invalid accessToken"})
                  }else if (err.message === "jwt expired"){
                        res.status(400).json({"message":"expired accessToken"})
                  }else{
                        res.status(500).json({"message":"occurred error in server"})
                  }
            }
      }
      
      
}