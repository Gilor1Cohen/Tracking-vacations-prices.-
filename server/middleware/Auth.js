const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

function verifyToken(req) {
  if (!req.headers.authorization) {
    throw new Error("You are not logged-in.");
  }

  const Token = req.headers.authorization.split(" ")[1];
  if (!Token) {
    throw new Error("You are not logged-in.");
  }

  return jwt.verify(Token, process.env.SECRET_KEY);
}

function handleError(res, error) {
  if (error.name === "JsonWebTokenError") {
    return res.status(403).json({ message: "Token is invalid." });
  }
  if (error.name === "TokenExpiredError") {
    return res.status(403).json({ message: "Token has expired." });
  }
  if (error.message === "You are not logged-in.") {
    return res.status(401).send("You are not logged-in.");
  }
  return res.status(500).json({ message: "Internal Server Error" });
}

function isAuth(req, res, next) {
  try {
    const decoded = verifyToken(req);
    req.user = decoded;
    next();
  } catch (error) {
    handleError(res, error);
  }
}

function isAdmin(req, res, next) {
  try {
    const decoded = verifyToken(req);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = { isAuth, isAdmin };
