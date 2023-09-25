import App from "./app";
import * as dotenv from "dotenv";
import { validateEnv } from "./utils/validateEnv";

dotenv.config();
validateEnv();

const app = new App();
app.listen();
