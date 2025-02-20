const {
  add,
  addLike,
  removeLike,
} = require("../../../data-accsess-layer/Vacations/Vacations");

const path = require("path");

async function addVac(
  vacation_destination,
  vacation_description,
  vacation_start_date,
  vacation_end_date,
  vacation_price,
  vacation_image
) {
  try {
    const newFileName = `${Date.now()}_${vacation_image.name}`;

    const newFilePath = path.join(
      process.cwd(),
      "files",
      "images",
      newFileName
    );

    await vacation_image.mv(newFilePath);

    const newImageUrl = `files/images/${newFileName}`;

    const addVacation = await add(
      vacation_destination,
      vacation_description,
      vacation_start_date,
      vacation_end_date,
      vacation_price,
      newImageUrl
    );

    return addVacation;
  } catch (error) {
    return { success: false, message: error };
  }
}

async function likeVac(vacationId, userId) {
  return addLike(vacationId, userId);
}

async function unLikeVac(vacationId, userId) {
  return removeLike(vacationId, userId);
}

module.exports = {
  addVac,
  likeVac,
  unLikeVac,
};
