const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../../../middleware/Auth");
const {
  addVac,
  likeVac,
  unLikeVac,
} = require("../../../business-logic-layer/Vacations/Post/Vacations_Post_BL");

router.post("/AddVacation", isAuth, isAdmin, async (req, res) => {
  try {
    const {
      vacation_destination,
      vacation_description,
      vacation_start_date,
      vacation_end_date,
      vacation_price,
    } = req.body;

    const vacation_image = req.files.vacation_image;

    if (
      !vacation_destination ||
      !vacation_description ||
      !vacation_start_date ||
      !vacation_end_date ||
      !vacation_price ||
      !vacation_image
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const add = await addVac(
      vacation_destination,
      vacation_description,
      vacation_start_date,
      vacation_end_date,
      vacation_price,
      vacation_image
    );

    if (add.success) {
      return res.status(201).json(add.message);
    } else {
      throw new Error(add.message);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message || error });
  }
});

router.post("/Like/:vacation_id", isAuth, async (req, res) => {
  try {
    const { vacation_id } = req.params;
    const user_id = req.user.Id;

    if (!vacation_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const like = await likeVac(vacation_id, user_id);

    return res.status(200).json({ message: like.message });
  } catch (error) {
    return res.status(500).json({ message: error.message || error });
  }
});

router.post("/UnLike/:vacation_id", isAuth, async (req, res) => {
  try {
    const { vacation_id } = req.params;
    const user_id = req.user.Id;

    if (!vacation_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const unLike = await unLikeVac(vacation_id, user_id);

    return res.status(200).json({ message: unLike.message });
  } catch (error) {
    return res.status(500).json({ message: error.message || error });
  }
});

module.exports = router;
