"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//* import library
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const passport_1 = __importDefault(require("passport"));
//* declare value
const FacebookStrategy = passport_facebook_1.default.Strategy;
//* set app_id and app_secret
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
function setPassport() {
    passport_1.default.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:5000/facebook/callback"
    }, function (accessToken, refreshToken, profile, done) {
        // console.log("accessToken = ",accessToken)
        // console.log("refreshToken = ",refreshToken)
        // console.log("payload = ",profile)
        // console.log(profile)
        const profileCustom = {
            "facebookId": profile.id,
            "facebookName": profile.displayName,
        };
        console.log(profile);
        done(undefined, profileCustom);
    }));
}
exports.default = setPassport;
