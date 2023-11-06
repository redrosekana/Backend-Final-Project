"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// router
const normalRoute_1 = __importDefault(require("./router/normalRoute"));
const userRoute_1 = __importDefault(require("./router/userRoute"));
const authRoute_1 = __importDefault(require("./router/authRoute"));
const boardgameRoute_1 = __importDefault(require("./router/boardgameRoute"));
const forgetPasswordRoute_1 = __importDefault(require("./router/forgetPasswordRoute"));
const partyRoute_1 = __importDefault(require("./router/partyRoute"));
// middleware
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
// enviroment variable
const variable_1 = require("./config/variable");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.initialMiddleware();
        this.initialConnectDatabase();
        this.initialRoutes([
            new userRoute_1.default(),
            new authRoute_1.default(),
            new boardgameRoute_1.default(),
            new forgetPasswordRoute_1.default(),
            new normalRoute_1.default(),
            new partyRoute_1.default(),
        ]);
        this.initialErrorMiddleware();
    }
    initialConnectDatabase() {
        mongoose_1.default.set("strictQuery", false);
        mongoose_1.default.connect(variable_1.URL_MONGODB).then(() => {
            console.log("connect to mongodb datasbase successful");
        });
    }
    initialMiddleware() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true, limit: "100mb" }));
        this.app.use((0, cors_1.default)());
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use(express_1.default.static("public"));
        this.app.set("view engine", "ejs");
    }
    initialErrorMiddleware() {
        this.app.use(error_middleware_1.default);
    }
    initialRoutes(routes) {
        routes.forEach((route) => {
            this.app.use("/", route.router);
        });
    }
    listen() {
        this.app.listen(variable_1.PORT, () => {
            console.log(`connect to port ${variable_1.PORT}`);
        });
    }
}
exports.default = App;
