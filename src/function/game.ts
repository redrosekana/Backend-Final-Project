import { Request, Response } from "express"

export default async function Game(req:Request, res:Response){
      console.log("message game =",req.proflie)
      res.status(200).json({
            "message":"boardgame popular",
            ...req["proflie"]
      })
}
