import crypto from "crypto";
import sqlite from "sqlite3";
import { Card } from "./DAOmodels.mjs";

// open the database
const db = new sqlite.Database("stuff.sqlite", (err) => {
  if (err) throw err;
});

export const getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        // user with entered email was not found
        resolve(false);
      } else {
        const salt = row.salt;
        const db_hashedPassword = row.password;
        const user = { id: row.id, email: row.email };

        crypto.scrypt(password, salt, 32, function (err, hashedPassword) {
          if (err) reject(err);
          if (
            // compare hashed password in db with the hash of the inserted one
            !crypto.timingSafeEqual(
              Buffer.from(db_hashedPassword, "hex"),
              hashedPassword
            )
          )
            // password dosn't match
            resolve(false);
          else resolve(user);
        });
      }
    });
  });
};

// get cards and return 3
export const listCards = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM card ORDER BY RANDOM() LIMIT 3";

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const cards = rows.map(
          (card) => new Card(card.id, card.name, card.image, card.index)
        );

        resolve(cards);
      }
    });
  });
};

// get card for a round
export const getCard = (givenIdList) => {
  return new Promise((resolve, reject) => {
    // create a placeholder list like "?, ?, ?, ..." to put in the query
    const placeholders = givenIdList.map(() => "?").join(",");
    const sql = `SELECT * FROM card where id NOT IN (${placeholders}) ORDER BY RANDOM() LIMIT 1`;

    db.get(sql, givenIdList, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(new Card(row.id, row.name, row.image, row.index));
      }
    });
  });
};

// get index for a selected card
export const getIndex = (id) => {
  return new Promise((resolve, reject) => {
    // "index" because it's a reserved word
    const sql = `SELECT "index" FROM card where id=?`;

    db.get(sql, id, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.index);
      }
    });
  });
};

// save a round
export const addRound = (round, gameId) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO round(outcome, roundNumber, cardId, gameId) VALUES (?, ?, ?, ?)";
    db.run(
      sql,
      [round.outcome, round.roundNumber, round.cardId, gameId],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

// save a game at its start
export const addGame = (game, userId) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO game(outcome, userId, card1, card2, card3, gameDate) VALUES (?, ?, ?, ?, ?, ?)";
    db.run(
      sql,
      [game.outcome, userId, game.card1, game.card2, game.card3, game.gameDate],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

// save the result at the end of a game
export const saveResult = (gameId, outcome) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE game SET outcome = ? WHERE id = ?";
    db.run(sql, [outcome, gameId], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
};

// get all games of a user and respective rounds: needed for the profile page
export const getGames = (userId) => {
  return new Promise((resolve, reject) => {
    // select all games of a user: join with the rounds of the game, and with cards for both game and rounds
    // order by descending game date for history, and by round
    const sql = `
      SELECT 
        g.id AS gameId, g.*, 
        c1.name AS card1Name, 
        c2.name AS card2Name, 
        c3.name AS card3Name,
        r.id AS roundId, 
        r.outcome AS roundOutcome, 
        r.roundNumber, 
        r.cardId,
        rc.name AS roundCardName
      FROM game g
      LEFT JOIN card c1 ON g.card1 = c1.id
      LEFT JOIN card c2 ON g.card2 = c2.id
      LEFT JOIN card c3 ON g.card3 = c3.id
      LEFT JOIN round r ON g.id = r.gameId
      LEFT JOIN card rc ON r.cardId = rc.id
      WHERE g.userId = ?
      ORDER BY g.gameDate DESC, r.roundNumber ASC
    `;

    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const games = [];
        let currentGame = null;

        rows.forEach((row) => {
          // create array of games, each with an empty array for the rounds
          // we have joins, so we need to check if the game wasn't already created from a previous row
          if (!currentGame || currentGame.id !== row.gameId) {
            currentGame = {
              id: row.gameId,
              outcome: row.outcome,
              gameDate: row.gameDate,
              card1: row.card1Name,
              card2: row.card2Name,
              card3: row.card3Name,
              rounds: [],
            };
            games.push(currentGame);
          }
          // add rounds to current game
          if (row.roundId) {
            currentGame.rounds.push({
              id: row.roundId,
              outcome: row.roundOutcome,
              roundNumber: row.roundNumber,
              cardName: row.roundCardName,
            });
          }
        });

        resolve(games);
      }
    });
  });
};
