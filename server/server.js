import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Database
//import DB from "./db/dbConnection.js";
// Routes
// import imageRoutes from "./routes/imageRoutes.js";
// import clothesRouter from "./routes/clothesRouter.js";
// import usersRoutes from "./routes/usersRoutes.js";
// import authRoutes from "./routes/authRoutes.js";

// //API Routes
// import chatRouter from "./routes/chatRouter.js";
// import imageRouter from "./routes/imageRouter.js";
// import weatherRouter from "./routes/weatherRouter.js";

// // middlewares
// import errorHandler from "./middlewares/errorHandler.js";
// import validateProvider from "./middlewares/validateProvider.js";
// import validateMode from "./middlewares/validateMode.js";

dotenv.config();
const app = express();
const PORT = 8000;
//process.env.PORT;

//DB();
app.get("/", (req, res) => {
  res.send("Checking server");
});

// app.use(cors({ origin: "*" }), express.json());
// app.use(`/api/v1`, authRoutes);
// app.use(`/api/v1`, authRoutes);
// app.use(`/api/v1/users/`, usersRoutes);
// app.use(`/api/v1/clothes/`, clothesRouter);
// app.use(`/api/v1/images/`, imageRoutes);
// app.use(`/api/v1/weather/`,  weatherRouter);

// app.use("/api/v1/chat/completions", validateProvider, chatRouter);
// app.use("/api/v1/images/generations", validateMode, imageRouter);

app.use(`*`, (req, res) =>
  res.status(404).json({ message: "Page not found!" })
);
//app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});