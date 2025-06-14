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
            // compare encrypted password in db with the encryption of the inserted one
            !crypto.timingSafeEqual(
              Buffer.from(db_hashedPassword, "hex"),
              hashedPassword
            )
          )
            // password wrong
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
    const sql = "SELECT * FROM card";

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const cards = rows.map(
          (card) => new Card(card.id, card.name, card.image, card.index)
        );

        const threeCards = [];
        for (let i = 0; i < 2; i++) {
          const index = Math.floor(Math.random() * cards.length);
          const threeCards = [...cards.filter((card) => index === card.id)];
        }
        resolve(threeCards);
      }
    });
  });
};
