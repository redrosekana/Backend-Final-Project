// import library
import { Request, Response } from "express"

export default async function Member(req:Request, res:Response){
    res.status(200).json({
        "message":"boardgame popular",
        ...req["user"]
    })
}
