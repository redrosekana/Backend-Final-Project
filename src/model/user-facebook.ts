// import library
import { Schema, model } from "mongoose"

// declare interface for model
interface FacebookMemeberInterfaceModel {
      facebookId:string
      facebookName:string
      displayName:string
      lat?:string
      lon?:string
}

const facebookMemberSchema = new Schema<FacebookMemeberInterfaceModel>({
      facebookId:{type:String},
      facebookName:{type:String},
      displayName:{type:String},
      lat:{type:String},
      lon:{type:String},
})

const Facebook_member = model<FacebookMemeberInterfaceModel>("facebook-member",facebookMemberSchema)
export default Facebook_member