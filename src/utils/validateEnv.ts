import { str, cleanEnv, num, port } from "envalid";

export const validateEnv = () => {
  cleanEnv(process.env, {
    URL_MONGODB: str(),
    PORT: port(),
    SALT: num(),
    SECRET_ACCESSTOKEN: str(),
    SECRET_REFRESHTOKEN: str(),
    SECRET_EMAIL: str(),
    PASSWORD_EMAIL: str(),
    URL_FRONTEND: str(),
    URL_POPULARBOARDGAME: str(),
  });
};
