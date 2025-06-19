// imports
import express from "express";
import morgan from "morgan";
import LocalStrategy from "passport-local";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import {
  getCard,
  getUser,
  listCards,
  getIndex,
  addGame,
  addRound,
  saveResult,
  getGames,
  getCardById,
} from "./dao.mjs";
import { check, validationResult } from "express-validator";

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

passport.use(
  // remember to pass the "email" field to this API
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

app.use(
  session({
    secret: "secret!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate("session"));

// static requests middleware
app.use(express.static("public"));

// save ids of cards already given in the game
const givenCards = [];

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

app.get("/api/session/current", isLoggedIn, (req, res) => {
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

/* ROUTES */
app.get("/api/cards", (request, response) => {
  listCards()
    .then((cards) => {
      // reset the saved cards when calling for a new game
      givenCards.length = 0;
      cards.forEach((card) => {
        if (!givenCards.includes(card.id)) {
          givenCards.push(card.id);
        }
      });
      cards.sort((a, b) => a.index - b.index);
      response.json(cards);
    })
    .catch((err) => {
      console.error(err);
      response.status(500).end();
    });
});

app.get("/api/card", async (request, response) => {
  try {
    const card = await getCard(givenCards);
    if (card?.error) {
      res.status(500).json({ error: card.error });
    } else {
      if (!givenCards.includes(card.id)) {
        givenCards.push(card.id);
      }
      // send index later at the end of the round
      response.json({
        id: card.id,
        name: card.name,
        image: card.image,
      });
    }
  } catch (err) {
    console.error(err);
    response.status(500).end();
  }
});

/*
app.get("/api/card/:cardId", async (request, response) => {
  try {
    const card = await getCardById(request.params.cardId);
    if (card?.error) {
      res.status(500).json({ error: card.error });
    } else if (card === null) {
      response.status(404).json({ error: "Card not found" });
    } else {
      response.json(card);
    }
  } catch (err) {
    console.error(err);
    response.status(500).end();
  }
});
*/

app.get("/api/card/:cardId/index", async (request, response) => {
  try {
    const index = await getIndex(request.params.cardId);
    if (index?.error) {
      res.status(500).json({ error: index.error });
    } else {
      response.json(index);
    }
  } catch (err) {
    console.error(err);
    response.status(500).end();
  }
});

app.post(
  "/api/:userId/cards",
  [
    /*check('text').notEmpty(),
  check('email').isEmail(),
  check('score').isNumeric(),  */
    check("gameDate").isISO8601(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const newGame = req.body;

    const userId = req.params.userId;

    try {
      const gameId = await addGame(newGame, userId);
      res.status(201).json({ gameId: gameId }).end();
    } catch (e) {
      console.error(`ERROR: ${e.message}`);
      res.status(503).json({ error: "Impossible to create the game." });
    }
  }
);

app.post(
  "/api/game/:gameId/round",
  [
    /*check('text').notEmpty(),
  check('email').isEmail(),
  check('score').isNumeric(),  
    check("gameDate").isISO8601(), */
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const newRound = req.body;
    const gameId = req.params.gameId;

    try {
      const id = await addRound(newRound, gameId);
      res.status(201).location(id).end();
    } catch (e) {
      console.error(`ERROR: ${e.message}`);
      res.status(503).json({ error: "Impossible to create the round." });
    }
  }
);

app.put("/api/game/:gameId", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const gameId = req.params.gameId;
  const outcome = req.body.outcome;

  try {
    await saveResult(gameId, outcome);
    res.status(204).end();
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
    res.status(503).json({ error: "Impossible to save the game result." });
  }
});

app.get("/api/user/:userId/profile", async (req, res) => {
  const userId = req.params.userId;

  getGames(userId)
    .then((games) => {
      res.status(200).json(games);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Unable to retrieve user profile." });
    });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
