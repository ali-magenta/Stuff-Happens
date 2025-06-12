// imports
import express from "express";
import morgan from "morgan";
import LocalStrategy from "passport-local";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import { getUser } from "./dao.mjs";

// init express
const app = new express();
const port = 3001;

// middlewares
app.use(express.json());
app.use(morgan("dev"));

// allow requests from React server running on localhost:5173
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

// ?? TOLOOK
passport.use(
  new LocalStrategy({ usernameField: "email" }, async function verify(
    username,
    password,
    cb
  ) {
    const user = await getUser(username, password);
    if (!user) return cb(null, false, "Incorrect username or password.");

    return cb(null, user);
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

// middleware to check if user is authenticated
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

// ?? TOLOOK
app.use(
  session({
    secret: "secret!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate("session"));

/* AUTHENTICATION ROUTES */
app.post("/api/login", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).send(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});

app.get("/api/session/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user); // user is stored in the session by passport
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

app.post("/api/logout", isLoggedIn, (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
