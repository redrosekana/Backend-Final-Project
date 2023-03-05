// import library
import express, { Router , Request, Response } from "express"

// import functional
import Register from "../function/register"
import Login from "../function/login"
import Member from "../function/member"
import RenewToken from "../function/renewToken"
import Facebook from "../function/facebook"
import SendEmail from "../function/sendEmail"
import VerifyEmail from "../function/verifyEmail"
import ResetPassword from "../function/resetPassword"
import UpdatePassword from "../function/updatePassword"
import UpdateUserMember from "../function/updateUserMember"
import RecommendGuest from "../function/recommendGuest"

import BoardGames from "../function/boardGame"
import PopularBoardGame from "../function/popularBoardGame"


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
router.post("/email",SendEmail)
router.get("/email",VerifyEmail)
router.post("/password",ResetPassword)

router.post("/auth/password",checkAccessToken,checkUser,UpdatePassword)
router.patch("/auth/user/member",checkAccessToken,checkUser,UpdateUserMember)

router.get("/member",checkAccessToken,checkUser,Member)
router.get("/token",checkRefreshToken,RenewToken)
router.post("/facebook",Facebook)


router.get("/guest",RecommendGuest)
router.get("/popular",PopularBoardGame)
router.get("/boardgames",BoardGames)


export default router
