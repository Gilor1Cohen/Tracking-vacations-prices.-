const db = require("../Database");

async function findUserByEmail(email) {
  const [rows] = await db.query("SELECT * FROM users WHERE user_email = ?", [
    email,
  ]);
  return rows[0];
}

async function createUser(firstName, lastName, email, hashedPassword) {
  const [result] = await db.query(
    "INSERT INTO users (user_first_name, user_last_name, user_email, user_password, user_role) VALUES (?, ?, ?, ?, ?)",
    [firstName, lastName, email, hashedPassword, "user"]
  );
  return result.insertId;
}

module.exports = {
  findUserByEmail,
  createUser,
};
