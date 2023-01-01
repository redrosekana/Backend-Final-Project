import { Request, Response } from "express"

export default async function Game(req:Request, res:Response){
      console.log(req.payload)
      res.status(200).json({"message":"boardgame popular"})
}
