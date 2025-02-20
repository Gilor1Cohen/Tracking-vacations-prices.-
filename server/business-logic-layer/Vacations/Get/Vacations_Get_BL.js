const {
  getMax,
  getPage,
  getLikes,
  checkUserLike,
  getVacById,
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
} = require("../../../data-accsess-layer/Vacations/Vacations");

async function getPageOfVacations(
  numOfPage,
  userId,
  liked,
  notStarted,
  happeningNow
) {
  try {
    const offset = (numOfPage - 1) * 10;

    let vacationsData;

    if (!liked && !notStarted && !happeningNow) {
      vacationsData = await getPage(offset);
    } else if (liked === true && !notStarted && !happeningNow) {
      vacationsData = await getVacationsWithLikes(userId, offset);
    } else if (!liked && notStarted === true && !happeningNow) {
      vacationsData = await getVacationsNotStarted(offset);
    } else if (liked === true && notStarted === true && !happeningNow) {
      vacationsData = await getVacationsNotStartedWithLikes(userId, offset);
    } else if (!liked && !notStarted && happeningNow === true) {
      vacationsData = await getVacationsHappeningNow(offset);
    } else if (liked === true && !notStarted && happeningNow === true) {
      vacationsData = await getVacationsHappeningNowWithLikes(userId, offset);
    } else {
      throw new Error("Invalid filter combination");
    }

    if (!vacationsData) {
      return { Success: false, message: "No vacations found." };
    }

    if (vacationsData.Data.length < 1) {
      return { Success: true, data: vacationsData.Data };
    }

    for (const vacation of vacationsData.Data) {
      try {
        vacation.likesCount = await getLikes(vacation.vacations_id);
        vacation.userLiked = await checkUserLike(userId, vacation.vacations_id);
      } catch (error) {
        throw new Error(error);
      }
    }

    return { Success: true, data: vacationsData.Data };
  } catch (error) {
    return { Success: false, message: "An unexpected error occurred." };
  }
}

async function getMaxVacations(userId, liked, notStarted, happeningNow) {
  try {
    let get;

    if (!liked && !notStarted && !happeningNow) {
      get = await getMax();
    } else if (liked === true && !notStarted && !happeningNow) {
      get = await getMaxWithLikes(userId);
    } else if (!liked && notStarted === true && !happeningNow) {
      get = await getMaxNotStarted();
    } else if (liked === true && notStarted === true && !happeningNow) {
      get = await getMaxNotStartedWithLikes(userId);
    } else if (!liked && !notStarted && happeningNow === true) {
      get = await getMaxHappeningNow();
    } else if (liked === true && !notStarted && happeningNow === true) {
      get = await getMaxHappeningNowWithLikes(userId);
    } else {
      throw new Error("Invalid filter combination");
    }

    return { ID: get.ID };
  } catch (error) {
    return { Success: false, message: "An unexpected error occurred." };
  }
}

async function getById(id) {
  try {
    const getVacData = await getVacById(id);

    return {
      success: true,
      vacation: { ...getVacData.data },
    };
  } catch (error) {
    return { success: false, message: "An unexpected error occurred." };
  }
}

async function getReportsData(Page) {
  return reportsData(Page);
}

async function getReportsDataAsCSV() {
  return reportsDataAsCSV();
}

module.exports = {
  getPageOfVacations,
  getMaxVacations,
  getById,
  getReportsData,
  getReportsDataAsCSV,
};
