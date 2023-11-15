import * as dotenv from "dotenv";
dotenv.config();

const URL_MONGODB: string = process.env.URL_MONGODB as string;
const PORT: number = parseInt(process.env.PORT as string);
const SALT: number = parseInt(process.env.SALT as string);
const SECRET_ACCESSTOKEN = process.env.SECRET_ACCESSTOKEN as string;
const SECRET_REFRESHTOKEN = process.env.SECRET_REFRESHTOKEN as string;
const SECRET_EMAIL = process.env.SECRET_EMAIL as string;
const PASSWORD_EMAIL = process.env.PASSWORD_EMAIL as string;
const URL_FRONTEND = process.env.URL_FRONTEND as string;
const URL_POPULARBOARDGAME = process.env.URL_POPULARBOARDGAME as string;
const URL_CLOUDSTORAGE = process.env.URL_CLOUDSTORAGE as string;

export {
  URL_MONGODB,
  PORT,
  SALT,
  SECRET_ACCESSTOKEN,
  SECRET_REFRESHTOKEN,
  SECRET_EMAIL,
  PASSWORD_EMAIL,
  URL_FRONTEND,
  URL_POPULARBOARDGAME,
  URL_CLOUDSTORAGE,
};
