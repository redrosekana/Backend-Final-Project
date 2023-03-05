// import library
import { Request, Response } from "express"

// import model
import Recommend_guest from "../model/recommend-guest"

export default async function BoardGames(req:Request, res:Response){
    try {
        const data = await Recommend_guest.find({})
        const result = data.map(e => e.game)

        res.status(200).json(result)
    }catch(err) {
        console.log(err)
        res.status(500).json({message:"occurred error in server"})
    }
}

