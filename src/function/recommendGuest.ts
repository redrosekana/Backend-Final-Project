import { Request, Response } from "express"
import Boardgames from "../model/boardgames"

export default async function RecommendGuest(req:Request, res:Response){
      // console.log("input game =",req.query.name)
      const inputGame = req.query.game
      const payload = await Boardgames.findOne({name:{$eq:inputGame}})
      if (!payload) {
            res.status(400).json({message:"don't exist game in database"})
       }else {
            res.status(200).json({
                  "message":"input boardgame: "+ inputGame,
                  payload
            })
       }
}
