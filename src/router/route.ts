//* import library
import express, { Router, Request, Response } from "express"
import axios from "axios"
import passport from "passport"

//* import functional
import Register from "../function/register"
import Login from "../function/login"
import GatewayFacebook from "../function/gatewayFacebook"
import Game from "../function/game"
import RenewToken from "../function/renewToken"
import MangeFacebooka from "../function/manageFacebook"


//* import middleware
import checkAccessToken from "../middleware/check-accessToken"
import checkUser from "../middleware/check-user"
import checkRefreshToken from "../middleware/check-refreshToken"

const router:Router = express.Router()

router.post("/register",Register)
router.post("/loginMember",Login)
router.get("/facebookMember",passport.authenticate("facebook"))
router.get('/facebook/callback',passport.authenticate("facebook", { successRedirect:"/gateway" , session:true }))
router.get("/gateway",GatewayFacebook)

router.get("/user",checkAccessToken,checkUser,Game)
router.get("/renewUser",checkRefreshToken,RenewToken)

router.post("/testfacebook",MangeFacebooka)


export default router
//5583083095147918
//5583336948455866
//5583336948455866
