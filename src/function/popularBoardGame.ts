// import library
import { Request , Response } from "express";
import axios from "axios";
import convert from "xml-js"

// declare interface
interface PopularBoardGameItem {
    name:string
    picture:string
    year:string
}

async function PopularBoardGame(req:Request , res:Response) {
    const resultPopularBoardGame:PopularBoardGameItem[] = []
    const url = process.env.API_POPULARBOARDGAME
    
    try {   
        const result = await axios({
            url:url,
            method:"get",
            timeout:20000
        })
        
        const jsonObject = convert.xml2js(result.data)

        for (let i=0;i<jsonObject.elements[0].elements.length;i++) {
            // เอาแค่ 10 อันดับ
            if (i === 10) break
            const body:PopularBoardGameItem = {
                name:jsonObject.elements[0].elements[i].elements[1].attributes.value,
                picture:jsonObject.elements[0].elements[i].elements[0].attributes.value,
                year:jsonObject.elements[0].elements[i].elements[2].attributes.value
            }
            resultPopularBoardGame.push(body)
        }

        res.status(200).json(resultPopularBoardGame)
        
    }catch(err) {
        console.log(err)
        res.status(500).json({meesage:"occurred error in server"})
    }
}

export default PopularBoardGame