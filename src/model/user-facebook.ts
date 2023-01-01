//* import library
import { Schema, model } from "mongoose"

//* import interface model
import { FacebookMemeberInterfaceModel } from "./interface-model/interface"

const facebookMemberSchema = new Schema<FacebookMemeberInterfaceModel>({
      facebookId:{type:String},
      facebookName:{type:String},
      displayName:{type:String},
      lat:{type:String},
      lon:{type:String},
})

const facebook_member = model<FacebookMemeberInterfaceModel>("facebook-member",facebookMemberSchema)
export default facebook_member