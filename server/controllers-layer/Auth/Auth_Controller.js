const express = require("express");
const AuthPostController = require("./Post/Auth_Post_Controller");

const router = express.Router();

router.use("/Post", AuthPostController);

module.exports = router;
