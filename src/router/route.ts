// import library
import express, { Router , Request, Response } from "express"

// import functional
import Register from "../function/register"
import Login from "../function/login"
import Game from "../function/game"
import RenewToken from "../function/renewToken"
import ManageFacebook from "../function/manageFacebook"
import Email from "../function/email"
import VerifyEmail from "../function/verifyEmail"
import UpdatePassword from "../function/updatePassword"
import RecommendGuest from "../function/recommendGuest"
import BoardGames from "../function/BoardGames"

// import middleware
import checkAccessToken from "../middleware/check-accessToken"
import checkUser from "../middleware/check-user"
import checkRefreshToken from "../middleware/check-refreshToken"

const router:Router = express.Router()

// your welcome
router.get("/",(req:Request,res:Response) => {
    res.status(200).json({message:"Hello Your Welcome to Api Boardgame Recommu"})
})

router.post("/register",Register)
router.post("/login",Login)
router.post("/email",Email)
router.get("/email",VerifyEmail)
router.post("/password",UpdatePassword)

router.get("/user",checkAccessToken,checkUser,Game)
router.get("/renew",checkRefreshToken,RenewToken)
router.post("/facebook",ManageFacebook)

router.get("/boardgames",BoardGames)
router.get("/guest",RecommendGuest)


export default router
