const express = require("express");
const VacationDeleteController = require("./Delete/Vacations_Delete_Controller");
const VacationGetController = require("./Get/Vacations_Get_Controller");
const VacationPostController = require("./Post/Vacations_Post_Controller");
const VacationPutController = require("./Put/Vacations_Put_Controller");
const router = express.Router();

router.use("/Delete", VacationDeleteController);
router.use("/Get", VacationGetController);
router.use("/Post", VacationPostController);
router.use("/Put", VacationPutController);

module.exports = router;
