// import library
import { Request, Response } from "express"
import csv from "csv-parser"
import * as path from "path"
import * as fs from "fs"

// import model
import Recommend_guest from "../model/recommend-guest"

async function RecommendGuest(req:Request, res:Response){
    try {
        fs.createReadStream(path.resolve(__dirname,"../../public/csv/item-based.csv"))
        .pipe(csv())
        .on('data', async (data:any) => {
            data.recommend = convertStringToArray(data.recommend)
            
            await Recommend_guest.create(data)
        })
        res.status(200).json({message:"success insert the boardgame for a guest"})
    }catch(err) {
        console.log(err)
        res.status(500).json({message:"occurred error in server"})
    }
}

// |(^\[\'|\'\]$)|(^\[\"|\"\]$)
const convertStringToArray = (value:string):string[] => {
    const tmp1 = value.replace(/(^(\"|\')|(\"|\')$)|(^\[\s*(\'|\")\s*|\s*(\'|\")\s*\]$)/ig,"")
    const tmp2 = tmp1.replace(/(\'|\")\s*\,\s*(\'|\")/ig,",")
    const tmp3 = tmp2.split(",")
    return tmp3
}

export default RecommendGuest
