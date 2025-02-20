const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../../../middleware/Auth");
const {
  deleteById,
} = require("../../../business-logic-layer/Vacations/Delete/Vacations_Delete_BL");

router.delete("/DeleteVacation/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(+id) || +id <= 0) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const deleteVac = await deleteById(id);
    if (deleteVac.success) {
      return res.status(200).json({ message: deleteVac.message });
    } else {
      return res.status(500).json({ message: deleteVac.message });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

module.exports = router;
