const express = require("express");
const router = express.Router();
const {
  Register,
  LogIn,
} = require("../../../business-logic-layer/Auth/Post/Auth_Post_BL");

router.post("/Register", async (req, res) => {
  try {
    const { FirstName, LastName, Email, Password } = req.body;
    const post = await Register(FirstName, LastName, Email, Password);

    if (post.Status) {
      return res
        .status(201)
        .json({ UserID: post.ID, Name: FirstName, Token: post.Token });
    } else {
      return res.status(400).json({ Error: post.error });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ Error: error.message || "Internal server error" });
  }
});

router.post("/LogIn", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const post = await LogIn(Email, Password);
    if (post.Status) {
      return res.status(200).json({
        UserID: post.UserID,
        UserRole: post.UserRole,
        UserName: post.UserName,
        Token: post.Token,
      });
    } else {
      return res.status(400).json({ Error: post.error });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ Error: error.message || "Internal server error" });
  }
});

module.exports = router;
