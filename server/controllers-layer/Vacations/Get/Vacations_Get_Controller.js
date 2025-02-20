const express = require("express");
const router = express.Router();
const { parse } = require("json2csv");

const { isAuth, isAdmin } = require("../../../middleware/Auth");
const {
  getMaxVacations,
  getPageOfVacations,
  getById,
  getReportsData,
  getReportsDataAsCSV,
} = require("../../../business-logic-layer/Vacations/Get/Vacations_Get_BL");

router.get("/GetByPage/:Page", isAuth, async (req, res) => {
  try {
    const { Page } = req.params;
    const userId = req.user.Id;
    const { Liked, NotStarted, HappeningNow } = req.query;

    if (isNaN(+Page) || +Page <= 0) {
      return res.status(400).json({ Error: "Invalid page number" });
    }

    if (
      ![Liked, NotStarted, HappeningNow].every(
        (val) => val === "true" || val === "false"
      )
    ) {
      return res.status(400).json({
        Error: "Invalid filter values. Accepted values are 'true' or 'false'.",
      });
    }

    const liked = Liked === "true";
    const notStarted = NotStarted === "true";
    const happeningNow = HappeningNow === "true";

    const get = await getPageOfVacations(
      +Page,
      userId,
      liked,
      notStarted,
      happeningNow
    );

    if (get.Success) {
      return res.status(200).json({ Data: get.data });
    } else {
      throw new Error(get.message);
    }
  } catch (error) {
    return res.status(400).json({ Error: error });
  }
});

router.get("/GetMax", isAuth, async (req, res) => {
  try {
    const { Liked, NotStarted, HappeningNow } = req.query;
    const userId = req.user.Id;

    if (
      ![Liked, NotStarted, HappeningNow].every(
        (val) => val === "true" || val === "false"
      )
    ) {
      return res.status(400).json({
        Error: "Invalid filter values. Accepted values are 'true' or 'false'.",
      });
    }

    const liked = Liked === "true";
    const notStarted = NotStarted === "true";
    const happeningNow = HappeningNow === "true";

    const get = await getMaxVacations(userId, liked, notStarted, happeningNow);

    if (get.ID) {
      return res.status(200).json({ id: get.ID });
    } else {
      throw new Error(get.e);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ e: error | "error" });
  }
});

router.get("/GetById/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const get = await getById(id);

    if (get.success) {
      return res
        .status(200)
        .json({ vacation: get.vacation, imageFile: get.imageFile });
    } else {
      return res.status(400).json({ message: get.message });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.get("/Reports/:Page", isAuth, isAdmin, async (req, res) => {
  try {
    const { Page } = req.params;

    const get = await getReportsData(Page);

    if (get.success) {
      return res.status(200).json(get.data);
    } else {
      return res.status(400).json({ message: get.message });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.get("/DownloadCSV", isAuth, isAdmin, async (req, res) => {
  try {
    const get = await getReportsDataAsCSV();

    if (get.success) {
      const CSV = parse(get.data);

      res
        .header("Content-Type", "text/csv")
        .header("Content-Disposition", "attachment; filename=reports.csv");
      return res.status(200).send(CSV);
    } else {
      throw new Error(get.message);
    }
  } catch (error) {
    return res.status(400).send(error);
  }
});
module.exports = router;
