// import library
import * as fs from "fs"
import * as path from "path"
import csv from "csv-parser"

// import helper
import { convertStringToArray } from "./convertStringToArray"

// import model
import Boardgames from "../model/boardgames"
import Recommend_guest from "../model/recommend-guest"

// สำหรับอ่านไฟล์ games-cleaned.csv
export const ReadFileGamesCleaned = () => {
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
}

// สำหรับอ่านไฟล์ item-based.csv
export const ReadFileItemBased = () => {
    fs.createReadStream(path.resolve(__dirname,"../../public/csv/item-based.csv"))
    .pipe(csv())
    .on('data', async (data:any) => {
        data.recommend = convertStringToArray(data.recommend)
        await Recommend_guest.create(data)
    })
}