// import library
import { Schema, model } from "mongoose"

// declare interface for model
interface UserMemeberInterfaceModel {
      displayName:string
      username:string
      password:string
      email:string
      lat?:string
      lon?:string
}

const userMemberSchema = new Schema<UserMemeberInterfaceModel>({
      displayName:{type:String},
      username:{type:String},
      password:{type:String},
      email:{type:String},
      lat:{type:String},
      lon:{type:String},
})

const user_members = model<UserMemeberInterfaceModel>("user-member",userMemberSchema)

export default user_members