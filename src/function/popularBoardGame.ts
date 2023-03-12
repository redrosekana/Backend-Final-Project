// import library
import { Request , Response } from "express";
import axios from "axios";
import convert from "xml-js"

// declare interface
interface PopularBoardGameItem {
    name:string
    picture:string
    year:string
    id:string
}

export default async function PopularBoardGame(req:Request , res:Response) {
    const resultPopularBoardGame:PopularBoardGameItem[] = []
    const url:string = process.env.API_POPULARBOARDGAME as string
    
    try {   
        const result = await axios.get(url)
        const jsonObject = convert.xml2js(result.data)
        
        for (let i=0;i<jsonObject.elements[0].elements.length;i++) {
            // เอาแค่ 10 อันดับ
            if (i === 15) break
            const body:PopularBoardGameItem = {
                name:jsonObject.elements[0].elements[i].elements[1].attributes.value,
                picture:jsonObject.elements[0].elements[i].elements[0].attributes.value,
                year:jsonObject.elements[0].elements[i].elements[2].attributes.value,
                id:jsonObject.elements[0].elements[i].attributes.id
            }
            resultPopularBoardGame.push(body)
        }

        res.status(200).json(resultPopularBoardGame)
        
    }catch(err) {
        console.log(err)
        res.status(500).json({meesage:"occurred error in server"})
    }
}