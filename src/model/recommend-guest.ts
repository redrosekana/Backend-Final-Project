// import library
import { Schema , model } from "mongoose"

// declare interface for model
interface RecommendGuestModel {
    game:string
    recommend:string[]
}

const recommendGuestSchema = new Schema<RecommendGuestModel>({
    game:{type:String},
    recommend:{type:[String]}
})


const recommend_guests = model<RecommendGuestModel>("recommend-guest",recommendGuestSchema)
export default recommend_guests