const db = require("../Database");

async function getPage(offset) {
  try {
    const [get] = await db.query("SELECT * FROM vacations LIMIT 10 OFFSET ?;", [
      offset,
    ]);

    return { Status: true, Data: get };
  } catch (error) {
    return { e: error.message || "error" };
  }
}

async function getVacationsWithLikes(userId, offset) {
  try {
    const [get] = await db.query(
      `
      SELECT vacations.* 
      FROM vacations
      JOIN follow ON vacations.vacations_id = follow.vacations_id
      WHERE follow.user_id = ? 
      LIMIT 10 OFFSET ?;
    `,
      [userId, offset]
    );

    return { Status: true, Data: get };
  } catch (error) {
    return { e: error.message || "error" };
  }
}

async function getVacationsNotStarted(offset) {
  try {
    const [get] = await db.query(
      `
      SELECT * 
      FROM vacations 
      WHERE vacation_start_date > NOW()
      LIMIT 10 OFFSET ?;
    `,
      [offset]
    );

    return { Status: true, Data: get };
  } catch (error) {
    return { e: error.message || "error" };
  }
}

async function getVacationsNotStartedWithLikes(userId, offset) {
  try {
    const [get] = await db.query(
      `
      SELECT vacations.* 
      FROM vacations
      JOIN follow ON vacations.vacations_id = follow.vacations_id
      WHERE follow.user_id = ? AND vacations.vacation_start_date > NOW()
      LIMIT 10 OFFSET ?;
    `,
      [userId, offset]
    );

    return { Status: true, Data: get };
  } catch (error) {
    return { e: error.message || "error" };
  }
}

async function getVacationsHappeningNow(offset) {
  try {
    const [get] = await db.query(
      `
      SELECT * 
      FROM vacations 
      WHERE vacation_start_date <= NOW() AND vacation_end_date >= NOW()
      LIMIT 10 OFFSET ?;
    `,
      [offset]
    );

    return { Status: true, Data: get };
  } catch (error) {
    return { e: error.message || "error" };
  }
}

async function getVacationsHappeningNowWithLikes(userId, offset) {
  try {
    const [get] = await db.query(
      `
      SELECT vacations.* 
      FROM vacations
      JOIN follow ON vacations.vacations_id = follow.vacations_id
      WHERE follow.user_id = ? AND vacations.vacation_start_date <= NOW() AND vacations.vacation_end_date >= NOW()
      LIMIT 10 OFFSET ?;
    `,
      [userId, offset]
    );

    return { Status: true, Data: get };
  } catch (error) {
    return { e: error.message || "error" };
  }
}

async function getLikes(vacationId) {
  try {
    const [result] = await db.query(
      "SELECT COUNT(*) AS followersCount FROM follow WHERE vacations_id = ?;",
      [vacationId]
    );

    return result[0].followersCount;
  } catch (error) {
    throw new Error("Failed to get likes count from database");
  }
}

async function checkUserLike(userId, vacationId) {
  try {
    const [result] = await db.query(
      "SELECT * FROM follow WHERE user_id = ? AND vacations_id = ?;",
      [userId, vacationId]
    );

    return result.length > 0;
  } catch (error) {
    throw new Error("Failed to check user like in database");
  }
}

async function getMax() {
  try {
    const [result] = await db.query("SELECT COUNT(*) as total FROM vacations;");

    return { ID: result[0].total };
  } catch (error) {
    return { e: error.message || "error" };
  }
}

async function getMaxWithLikes(userId) {
  try {
    const [result] = await db.query(
      `
      SELECT COUNT(*) as total
      FROM vacations
      WHERE EXISTS (
        SELECT 1
        FROM follow
        WHERE follow.vacations_id = vacations.vacations_id AND follow.user_id = ?
      )
    `,
      [userId]
    );

    return { ID: result[0].total };
  } catch (error) {
    return { e: error.message || "An error occurred" };
  }
}

async function getMaxNotStarted() {
  try {
    const [result] = await db.query(
      `
      SELECT COUNT(*) as total
      FROM vacations
      WHERE vacation_start_date > NOW()
    `
    );
    return { ID: result[0].total };
  } catch (error) {
    return { e: error.message || "An error occurred" };
  }
}

async function getMaxNotStartedWithLikes(userId) {
  try {
    const [result] = await db.query(
      `
      SELECT COUNT(*) as total
      FROM vacations
      WHERE vacation_start_date > NOW()
      AND EXISTS (
        SELECT 1
        FROM follow
        WHERE follow.vacations_id = vacations.vacations_id AND follow.user_id = ?
      )
    `,
      [userId]
    );
    return { ID: result[0].total };
  } catch (error) {
    return { e: error.message || "An error occurred" };
  }
}

async function getMaxHappeningNow() {
  try {
    const [result] = await db.query(
      `
      SELECT COUNT(*) as total
      FROM vacations
      WHERE vacation_start_date <= NOW() AND vacation_end_date >= NOW()
    `
    );
    return { ID: result[0].total };
  } catch (error) {
    return { e: error.message || "An error occurred" };
  }
}

async function getMaxHappeningNowWithLikes(userId) {
  try {
    const [result] = await db.query(
      `
      SELECT COUNT(*) as total
      FROM vacations
      WHERE vacation_start_date <= NOW() AND vacation_end_date >= NOW()
      AND EXISTS (
        SELECT 1
        FROM follow
        WHERE follow.vacations_id = vacations.vacations_id AND follow.user_id = ?
      )
    `,
      [userId]
    );
    return { ID: result[0].total };
  } catch (error) {
    return { e: error.message || "An error occurred" };
  }
}

async function getVacById(id) {
  try {
    const [result] = await db.query(
      "SELECT * FROM vacations WHERE vacations_id = ?;",
      [id]
    );

    if (result.length > 0) {
      return { success: true, data: result[0] };
    } else {
      return { success: false, message: "Vacation not found." };
    }
  } catch (error) {
    return { success: false, message: "An error occurred." };
  }
}

async function getImgUrlFromVac(id) {
  try {
    const [vacation] = await db.query(
      "SELECT vacation_image FROM vacations WHERE vacations_id = ?;",
      [id]
    );

    return { success: true, url: vacation[0].vacation_image };
  } catch (error) {
    return { success: false, message: "An error occurred." };
  }
}

async function deleteVacation(id) {
  try {
    const [deleteVac] = await db.query(
      "DELETE FROM vacations WHERE vacations_id = ?;",
      [id]
    );

    if (deleteVac.affectedRows > 0) {
      return { success: true, message: "Vacation deleted successfully." };
    } else {
      return {
        success: false,
        message: "No vacation found with the given ID.",
      };
    }
  } catch (error) {
    return { success: false, message: "An error occurred during deletion." };
  }
}

async function updateVacation(
  vacation_destination,
  vacation_description,
  vacation_start_date,
  vacation_end_date,
  vacation_price,
  vacations_id,
  vacation_image
) {
  try {
    const [result] = await db.query(
      `
      UPDATE vacations 
      SET 
      vacation_destination = ?, vacation_description = ?, 
      vacation_start_date = ?, vacation_end_date = ?, 
      vacation_price = ?, vacation_image= ? 
      WHERE vacations_id = ?;
`,
      [
        vacation_destination,
        vacation_description,
        vacation_start_date,
        vacation_end_date,
        vacation_price,
        vacation_image,
        vacations_id,
      ]
    );

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Vacation not found or no changes made.",
      };
    }

    return {
      success: true,
      message: "Vacation updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred while updating the vacation.",
    };
  }
}

async function add(
  vacation_destination,
  vacation_description,
  vacation_start_date,
  vacation_end_date,
  vacation_price,
  newImageUrl
) {
  try {
    const [addVac] = await db.query(
      `
      INSERT INTO vacations  
      (vacation_destination, vacation_description, vacation_start_date, vacation_end_date, vacation_price, vacation_image) 
      VALUES (?, ?, ?, ?, ?, ?);
      `,
      [
        vacation_destination,
        vacation_description,
        vacation_start_date,
        vacation_end_date,
        vacation_price,
        newImageUrl,
      ]
    );

    if (addVac.affectedRows === 1) {
      return { success: true, insertId: addVac.insertId };
    } else {
      throw new Error("Failed to insert vacation");
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function addLike(vacationId, userId) {
  try {
    const [result] = await db.query(
      "INSERT INTO follow (vacations_id, user_id) VALUES (?, ?);",
      [vacationId, userId]
    );

    if (result.affectedRows > 1) {
      return { success: true, message: "Like added successfully." };
    } else {
      return { success: false, message: "Failed to add like." };
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function removeLike(vacationId, userId) {
  try {
    const [result] = await db.query(
      "DELETE FROM follow WHERE vacations_id = ? AND user_id = ?;",
      [vacationId, userId]
    );

    if (result.affectedRows > 1) {
      return { success: true, message: "Vacation unLiked successfully." };
    } else {
      return { success: false, message: "Failed to unLike vacation." };
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function reportsData(Page) {
  try {
    const [get] = await db.query(
      `
      SELECT vacations.vacation_destination, COUNT(follow.vacations_id) AS likes_count 
      FROM vacations 
      LEFT JOIN follow 
      ON vacations.vacations_id = follow.vacations_id GROUP BY vacations.vacation_destination 
      LIMIT 10 
      OFFSET ?;
      `,
      [(Page - 1) * 10]
    );

    if (get.length === 0) {
      throw new Error("No data found.");
    }

    return { success: true, data: get };
  } catch (error) {
    return { success: false, message: "An error occurred." };
  }
}

async function reportsDataAsCSV() {
  try {
    const [get] = await db.query(
      `
      SELECT vacations.vacation_destination, COUNT(follow.vacations_id) AS likes_count 
      FROM vacations 
      LEFT JOIN follow 
      ON vacations.vacations_id = follow.vacations_id 
      GROUP BY vacations.vacation_destination;
      `
    );

    if (get.length === 0) {
      throw new Error("No data found.");
    }

    return { success: true, data: get };
  } catch (error) {
    return { success: false, message: "An error occurred." };
  }
}

module.exports = {
  getPage,
  getLikes,
  checkUserLike,
  getMax,
  getVacById,
  getImgUrlFromVac,
  deleteVacation,
  updateVacation,
  add,
  addLike,
  removeLike,
  reportsData,
  reportsDataAsCSV,
  getVacationsWithLikes,
  getVacationsNotStarted,
  getVacationsNotStartedWithLikes,
  getVacationsHappeningNow,
  getVacationsHappeningNowWithLikes,
  getMaxWithLikes,
  getMaxNotStarted,
  getMaxNotStartedWithLikes,
  getMaxHappeningNow,
  getMaxHappeningNowWithLikes,
};
