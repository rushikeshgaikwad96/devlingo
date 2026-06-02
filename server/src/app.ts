import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import lessonRoutes from "./routes/lessonRoutes";

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/lessons", lessonRoutes);

app.get("/",(req, res) => {
    res.json({ message: "DevLingo API is running!"});
});

export default app;