import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import authMiddleware from "./middlewares/auth.js";
import restrictTo from "./middlewares/restrictTo.js";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", authMiddleware, restrictTo("admin"), profileRoutes);

export default app;

