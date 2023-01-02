//* import library
import { Schema, model } from "mongoose"

//* import interface model
import {UserMemeberInterfaceModel} from "./interface-model/interface"

const userMemberSchema = new Schema<UserMemeberInterfaceModel>({
      displayName:{type:String},
      username:{type:String},
      password:{type:String},
      email:{type:String},
      lat:{type:String},
      lon:{type:String},
})

const User_member = model<UserMemeberInterfaceModel>("user-member",userMemberSchema)

export default User_member