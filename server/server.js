import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routes/users/usersRouter.js";
import healthStatsRouter from "./routes/healthStatsRoutes.js";
import session from "express-session";
import bodyParser from "body-parser";
import connectDB from "../server/db/mongooseDB.js";

const app = express();
dotenv.config();
connectDB();

const PORT = process.env.PORT;
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "Your secret key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, //Set to true in production with HTTPS
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});


app.use(cors({ origin: "*" }));
app.use(express.json());

app.get(`/`, (req, res) => {
  res.send("Backend server running!");
});

// app.use('/api/v1/register', usersRouter);
// app.use('/api/v1/login', usersRouter);
app.use(`/api/v1/users`, usersRouter);
app.use(`/api/v1/stats`, healthStatsRouter);

const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(400).json({ message: "Unauthorised" });
  }
};

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));