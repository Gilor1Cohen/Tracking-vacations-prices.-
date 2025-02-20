const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const {
  findUserByEmail,
  createUser,
} = require("../../../data-accsess-layer/Users/Users");

async function Register(firstName, lastName, email, password) {
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await createUser(firstName, lastName, email, hashedPassword);

    const token = jwt.sign(
      { Id: userId, Name: firstName },
      process.env.SECRET_KEY,
      {
        expiresIn: "10m",
      }
    );

    return { Status: true, Token: token, ID: userId };
  } catch (e) {
    return {
      Status: false,
      error: e.message || "An unexpected error occurred",
    };
  }
}

async function LogIn(email, password) {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error("User does not exist");
    }

    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch) {
      throw new Error("Invalid Password");
    }

    const token = jwt.sign(
      { Id: user.user_id, role: user.user_role, Name: user.user_first_name },
      process.env.SECRET_KEY,
      {
        expiresIn: "10m",
      }
    );

    return {
      Status: true,
      Token: token,
      UserID: user.user_id,
      UserRole: user.user_role,
      UserName: user.user_first_name,
    };
  } catch (e) {
    return {
      Status: false,
      error: e.message || "An unexpected error occurred",
    };
  }
}

module.exports = {
  Register,
  LogIn,
};
