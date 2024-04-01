"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// interface
// import { Route } from "./interface/route.interface";
// router
const normalRoute_1 = __importDefault(require("./router/normalRoute"));
const userRoute_1 = __importDefault(require("./router/userRoute"));
const authRoute_1 = __importDefault(require("./router/authRoute"));
const boardgameRoute_1 = __importDefault(require("./router/boardgameRoute"));
const forgetPasswordRoute_1 = __importDefault(require("./router/forgetPasswordRoute"));
const partyRoute_1 = __importDefault(require("./router/partyRoute"));
const scoreRoute_1 = __importDefault(require("./router/scoreRoute"));
// middleware
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
// enviroment variable
const variable_1 = require("./config/variable");
const app = (0, express_1.default)();
function initialConnectDatabase() {
    mongoose_1.default.set("strictQuery", false);
    mongoose_1.default.connect(variable_1.URL_MONGODB).then(() => {
        console.log("connect to mongodb datasbase successful");
    });
}
function initialMiddleware() {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true, limit: "100mb" }));
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)("dev"));
    app.use(express_1.default.static("public"));
    app.set("view engine", "ejs");
}
function initialRoutes() {
    app.use(normalRoute_1.default);
    app.use(userRoute_1.default);
    app.use(authRoute_1.default);
    app.use(boardgameRoute_1.default);
    app.use(forgetPasswordRoute_1.default);
    app.use(partyRoute_1.default);
    app.use(scoreRoute_1.default);
}
function initialErrorMiddleware() {
    app.use(error_middleware_1.default);
}
initialMiddleware();
initialConnectDatabase();
initialRoutes();
initialErrorMiddleware();
exports.default = app;
