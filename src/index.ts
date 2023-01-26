//* import library
import express , {Express} from "express"
import mongoose, { connect } from "mongoose"
import morgan from "morgan"
import cors from "cors"
import * as dotenv from "dotenv"

dotenv.config()

//* import mainpoint && config passport
import {default as route} from "./router/route"

//* declare value && configure value
const app:Express = express()
const port:string = String(process.env.PORT)
const secret:string = process.env.SECRET_SESSION as string

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(morgan("dev"))

//* set mongodb if don't set, it will occure in terminal 
mongoose.set("strictQuery",false)
const url_mongodb:string = String(process.env.URL_MONGODB)

//* connect to mongodb database
connect(url_mongodb)

app.use(route)

app.listen(port,():void => {
      console.log("connect to port 5000")
})
