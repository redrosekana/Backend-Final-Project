// import library
import { Request, Response } from "express"

// import model
import Recommend_guest from "../model/recommend-guest"
import Boardgames from "../model/boardgames"

// declare interface for ResultBoardGameRecommend
interface ResultBoardGameRecommendProps {
    id:string
    name:string
    minPlayers:number
    maxPlayers:number
    playingtime:number
    yearpublished:number
    description:string
    image:string
}

async function RecommendGuest(req:Request, res:Response){
    // ประกาศตัวแปรเก็บข้อมูลเกมที่จะแสดง
    const ResultBoardGameRecommend:ResultBoardGameRecommendProps[] = []
    let relationBoardGame:string[] = []

    const boardgameName = req.query.boardgameName
    
    try {
        const tmp = await Recommend_guest.find({game:{$eq:boardgameName}})
        relationBoardGame = [...tmp[0].recommend]

        for (let i=0;i<relationBoardGame.length;i++) {
            if (i === 10) break
            const information = await Boardgames.findOne({name:{$eq:relationBoardGame[i]}})
            const body:ResultBoardGameRecommendProps = {
                id:information!.id,
                name:information!.name,
                minPlayers:information!.minplayers,
                maxPlayers:information!.maxplayers,
                playingtime:information!.playingtime,
                yearpublished:information!.yearpublished,
                description:information!.description,
                image:information!.image
            }
            ResultBoardGameRecommend.push(body)
        }
        res.status(200).json(ResultBoardGameRecommend)
    }catch(err) {
        console.log(err)
        res.status(500).json({message:"occurred error in server"})
    }
}

export default RecommendGuest


// ส่วนที่ใช้อ่านไฟล์ csv มาเก็บในฐานข้อมูล
// fs.createReadStream(path.resolve(__dirname,"../../public/csv/item-based.csv"))
// .pipe(csv())
// .on('data', async (data) => {
//     data.recommend = convertStringToArray(data.recommend)
//     await Recommend_guest.create(data)
// })
