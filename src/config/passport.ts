//* import library
import Facebook from "passport-facebook"
import passport from "passport"

//* declare value
const FacebookStrategy = Facebook.Strategy

//* set app_id and app_secret
const FACEBOOK_APP_ID:string = process.env.FACEBOOK_APP_ID as string
const FACEBOOK_APP_SECRET:string = process.env.FACEBOOK_APP_SECRET as string


export default function setPassport() {
      passport.use(new FacebookStrategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: "http://localhost:5000/facebook/callback"
          },
      
          function(accessToken, refreshToken, profile, done) {
            // console.log("accessToken = ",accessToken)
            // console.log("refreshToken = ",refreshToken)
            // console.log("payload = ",profile)
            // console.log(profile)
            const profileCustom = {
              "facebookId": profile.id,
              "facebookName": profile.displayName,
            }
            console.log(profile)
            done(undefined,profileCustom);
          }
      ))
}