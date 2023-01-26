//* import library
import express, { Router} from "express"


//* import functional
import Register from "../function/register"
import Login from "../function/login"
import Game from "../function/game"
import RenewToken from "../function/renewToken"
import ManageFacebook from "../function/manageFacebook"


//* import middleware
import checkAccessToken from "../middleware/check-accessToken"
import checkUser from "../middleware/check-user"
import checkRefreshToken from "../middleware/check-refreshToken"

const router:Router = express.Router()

router.post("/register",Register)
router.post("/loginMember",Login)
router.get("/user",checkAccessToken,checkUser,Game)
router.get("/renewUser",checkRefreshToken,RenewToken)

router.post("/facebook",ManageFacebook)


export default router
//5583083095147918
//5583336948455866
//5583336948455866
