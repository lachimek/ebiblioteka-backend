import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import router from "./router";

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3005"], credentials: true }));
app.use("/api", router);
