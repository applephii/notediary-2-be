import express from "express";
import cors from "cors";
import noteRouter from "./route/NoteRoute.js";
import userRouter from "./route/UserRoute.js";
import "dotenv/config";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true,
}));
// app.use(cors());

app.use(express.json());
app.get("/", (req, res) => res.render("index"));
app.use(noteRouter);
app.use(userRouter);

app.listen(3000, () => console.log("Server is connected..."));