import express, { Express } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

// interface
// import { Route } from "./interface/route.interface";

// router
import NormalRoute from "./router/normalRoute";
import UserRoute from "./router/userRoute";
import AuthRoute from "./router/authRoute";
import BoardgameRoute from "./router/boardgameRoute";
import ForgetPasswordRoute from "./router/forgetPasswordRoute";
import PartyRoute from "./router/partyRoute";
import ScoreRoute from "./router/scoreRoute";

// middleware
import ErrorMiddleware from "./middleware/error.middleware";

// enviroment variable
import { URL_MONGODB } from "./config/variable";

const app = express();

function initialConnectDatabase() {
  mongoose.set("strictQuery", false);
  mongoose.connect(URL_MONGODB).then(() => {
    console.log("connect to mongodb datasbase successful");
  });
}

function initialMiddleware() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true, limit: "100mb" }));
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.static("public"));
  app.set("view engine", "ejs");
}

function initialRoutes() {
  app.use(NormalRoute);
  app.use(UserRoute);
  app.use(AuthRoute);
  app.use(BoardgameRoute);
  app.use(ForgetPasswordRoute);
  app.use(PartyRoute);
  app.use(ScoreRoute);
}

function initialErrorMiddleware() {
  app.use(ErrorMiddleware);
}

initialMiddleware();
initialConnectDatabase();
initialRoutes();
initialErrorMiddleware();

export default app;
