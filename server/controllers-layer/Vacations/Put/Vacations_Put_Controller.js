const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../../../middleware/Auth");

const {
  updateByIdWithOldImage,
  updateByIdWithNewImage,
} = require("../../../business-logic-layer/Vacations/Put/Vacations_Put_BL");

router.put("/UpdateVacation/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const {
      vacation_destination,
      vacation_description,
      vacation_start_date,
      vacation_end_date,
      vacation_price,
    } = req.body;

    const vacations_id = req.params.id;

    const vacation_image = req.files?.vacation_image || req.body.vacation_image;

    if (
      !vacation_destination ||
      !vacation_description ||
      !vacation_start_date ||
      !vacation_end_date ||
      !vacation_price ||
      !vacations_id ||
      !vacation_image
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (typeof vacation_image === "string") {
      const update = await updateByIdWithOldImage(
        vacation_destination,
        vacation_description,
        vacation_start_date,
        vacation_end_date,
        vacation_price,
        vacations_id,
        vacation_image
      );

      if (update.success) {
        return res.status(200).json(update.message);
      } else {
        throw new Error(update.message);
      }
    } else {
      const update = await updateByIdWithNewImage(
        vacation_destination,
        vacation_description,
        vacation_start_date,
        vacation_end_date,
        vacation_price,
        vacations_id,
        vacation_image
      );

      if (update.success) {
        return res.status(200).json(update.message);
      } else {
        throw new Error(update.message);
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message || error });
  }
});

module.exports = router;
