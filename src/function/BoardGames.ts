// import library
import { Request, Response } from "express"
import csv from "csv-parser"
import * as path from "path"
import * as fs from "fs"

// import model
import Boardgames from "../model/boardgames"

// import helper
import { convertStringToArray } from "../helper/convertStringToArray"

async function BoardGames(req:Request, res:Response){
    try {
        fs.createReadStream(path.resolve(__dirname,"../../public/csv/games-cleaned.csv"))
        .pipe(csv())
        .on('data', async (data:any) => {
            data.category = convertStringToArray(data.category)
            data.mechanic = convertStringToArray(data.mechanic)
            data.designer = convertStringToArray(data.designer)
            data.artist = convertStringToArray(data.artist)
            data.publisher = convertStringToArray(data.publisher)
            await Boardgames.create(data)
        })
        res.status(200).json({message:"success insert the popular boardgame"})
    }catch(err) {
        console.log(err)
        res.status(500).json({message:"occurred error in server"})
    }
}
export default BoardGames
