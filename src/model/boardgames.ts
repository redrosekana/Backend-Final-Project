// import library
import { Schema, model } from "mongoose"

// declare interface for model
interface BoardgamesInterfaceModel {
    id:string
    name:string
    rank:number
    geek_rating:number
    avg_rating:number
    usersrated:number
    category:string[]
    mechanic:string[]
    weight:number
    minplayers:number
    maxplayers:number
    playingtime:number
    minage:number
    yearpublished:number
    designer:string[]
    artist:string[]
    publisher:string[]
    description:string
    image:string
}

const boardgamesSchema = new Schema<BoardgamesInterfaceModel>({
    id:{type:String},
    name:{type:String},
    rank:{type:Number},
    geek_rating:{type:Number},
    avg_rating:{type:Number},
    usersrated:{type:Number},
    category:{type:[String]},
    mechanic:{type:[String]},
    weight:{type:Number},
    minplayers:{type:Number},
    maxplayers:{type:Number},
    playingtime:{type:Number},
    minage:{type:Number},
    yearpublished:{type:Number},
    designer:{type:[String]},
    artist:{type:[String]},
    publisher:{type:[String]},
    description:{type:String},
    image:{type:String},
})

const boardgames = model<BoardgamesInterfaceModel>("boardgames",boardgamesSchema)
export default boardgames