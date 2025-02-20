const express = require("express");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const AuthController = require("./controllers-layer/Auth/Auth_Controller");
const VacationsController = require("./controllers-layer/Vacations/Vacation_Controller");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(fileUpload());
app.use(express.json());
app.use(
  "/files/images",
  express.static(path.join(__dirname, "files", "images"))
);
app.use("/Auth", AuthController);
app.use("/Vacations", VacationsController);

app.use("*", (req, res) => {
  res.status(404).send(`Route not found ${req.originalUrl}`);
});

app
  .listen(3001, () => {
    console.log("Listening on 3001");
  })
  .on("error", (err) => {
    err.code === "EADDRINUSE"
      ? console.log("Error: Address in use")
      : console.log("Error: Unknown error");
  });
