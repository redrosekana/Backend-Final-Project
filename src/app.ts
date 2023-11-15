import express, { Express } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

// interface
import { Route } from "./interface/route.interface";

// router
import NormalRoute from "./router/normalRoute";
import UserRoute from "./router/userRoute";
import AuthRoute from "./router/authRoute";
import BoardgameRoute from "./router/boardgameRoute";
import ForgetPasswordRoute from "./router/forgetPasswordRoute";
import PartyRoute from "./router/partyRoute";

// middleware
import ErrorMiddleware from "./middleware/error.middleware";

// enviroment variable
import { URL_MONGODB, PORT } from "./config/variable";

export default class App {
  public app: Express;

  constructor() {
    this.app = express();
    this.initialMiddleware();
    this.initialConnectDatabase();
    this.initialRoutes([
      new UserRoute(),
      new AuthRoute(),
      new BoardgameRoute(),
      new ForgetPasswordRoute(),
      new NormalRoute(),
      new PartyRoute(),
    ]);
    this.initialErrorMiddleware();
  }

  private initialConnectDatabase() {
    mongoose.set("strictQuery", false);
    mongoose.connect(URL_MONGODB).then(() => {
      console.log("connect to mongodb datasbase successful");
    });
  }

  private initialMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true, limit: "100mb" }));
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(express.static("public"));
    this.app.set("view engine", "ejs");
  }

  private initialErrorMiddleware() {
    this.app.use(ErrorMiddleware);
  }

  private initialRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  public listen() {
    this.app.listen(PORT, () => {
      console.log(`connect to port ${PORT}`);
    });
  }
}
