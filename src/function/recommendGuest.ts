// import library
import { Request, Response } from "express"

// import model
import recommend_guests from "../model/recommend-guest"
import boardgames from "../model/boardgames"

// declare interface for ResultBoardGameRecommend
interface ResultBoardGameRecommendProps {
    id:string
    name:string
    minplayers:number
    maxplayers:number
    minage:number
    playingtime:number
    yearpublished:number
    description:string
    image:string
}

export default async function RecommendGuest(req:Request, res:Response){
    // ประกาศตัวแปรเก็บข้อมูลเกมที่จะแสดง
    const ResultBoardGameRecommend:any[] = []
    let relationBoardGame:string[] = []

    // ดึงค่าที่ส่งมา
    const { boardgameName } = req.query
    
    if (!boardgameName) {
        res.status(400).json({message:"need a boardgameName field"})
    }else {
        try {
            const boardgame = await recommend_guests.findOne({game:{$eq:boardgameName}})
            
            if (!boardgame) {
                res.send(400).json({message:"don't exist boardgame in database"})
            }else {
                relationBoardGame = [...boardgame["recommend"]]
                const currentData = await boardgames.findOne({name:{$eq:boardgame.game}}).select("-_id id name minplayers maxplayers playingtime minage yearpublished description image")
                
                for (let i=0;i<relationBoardGame.length;i++) {
                    const information = await boardgames.findOne({name:{$eq:relationBoardGame[i]}}).select("-_id id name minplayers maxplayers playingtime minage yearpublished description image")
                    
                    if (!!information) {
                        const body:ResultBoardGameRecommendProps = {
                            id:information!.id,
                            name:information!.name,
                            minplayers:information!.minplayers,
                            maxplayers:information!.maxplayers,
                            minage:information!.minage,
                            playingtime:information!.playingtime,
                            yearpublished:information!.yearpublished,
                            description:information!.description,
                            image:information!.image
                        }
                        ResultBoardGameRecommend.push(body)
                    }
                }

                const result = {
                    currentData:currentData,
                    recommend:ResultBoardGameRecommend
                }

                res.status(200).json(result)
            }

            
        }catch(err) {
            console.log(err)
            res.status(500).json({message:"occurred error in server"})
        }
    }
}
