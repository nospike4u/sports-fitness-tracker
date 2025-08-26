import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routes/users/usersRouter.js";
import healthStatsRouter from "./routes/healthStatsRoutes.js";
import oauthRouter from "./routes/oauthRoutes.js";
import fitbitRouter from "./routes/fitbitRoutes.js";
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


app.use(cors({ 
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.get(`/`, (req, res) => {
  res.send("Backend server running!");
});

// app.use('/api/v1/register', usersRouter);
// app.use('/api/v1/login', usersRouter);
app.use(`/api/v1/users`, usersRouter);
app.use(`/api/v1/stats`, healthStatsRouter);
app.use('/api/v1/oauth', oauthRouter);
app.use('/api/v1/fitbit', fitbitRouter);

const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(400).json({ message: "Unauthorised" });
  }
};

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));