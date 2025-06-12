import crypto from "crypto";
import sqlite from "sqlite3";

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
