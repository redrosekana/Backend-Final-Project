// import library
import { Request, Response } from "express"
import csv from "csv-parser"
import * as path from "path"
import * as fs from "fs"

// import model
import Recommend_guest from "../model/recommend-guest"

// import helper
import { convertStringToArray } from "../helper/convertStringToArray"

async function RecommendGuest(req:Request, res:Response){
    try {
        fs.createReadStream(path.resolve(__dirname,"../../public/csv/item-based.csv"))
        .pipe(csv())
        .on('data', async (data) => {
            data.recommend = convertStringToArray(data.recommend)
            await Recommend_guest.create(data)
        })
        res.status(200).json({message:"success insert the boardgame for a guest"})
    }catch(err) {
        console.log(err)
        res.status(500).json({message:"occurred error in server"})
    }
}

export default RecommendGuest
