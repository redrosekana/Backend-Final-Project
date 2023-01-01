//* import library
import express, { Router, Request, Response } from "express"
import passport from "passport"

//* import functional
import Register from "../function/register"
import Login from "../function/login"
import GatewayFacebook from "../function/gatewayFacebook"
import Game from "../function/game"


//* import middleware
import checkToken from "../middleware/check-token"

const router:Router = express.Router()

router.post("/register",Register)
router.post("/loginMember",Login)
router.get("/facebookMember",passport.authenticate("facebook"))
router.get('/facebook/callback',passport.authenticate("facebook", { successRedirect:"/profile" , session:true }))
router.get("/profile",GatewayFacebook)

router.post("/popularBoardgame",checkToken,Game)


export default router
//5583083095147918
