import app from "./app";
import * as dotenv from "dotenv";

import { PORT } from "./config/variable";

dotenv.config();
app.listen(PORT, () => console.log("Connect to port " + PORT));
