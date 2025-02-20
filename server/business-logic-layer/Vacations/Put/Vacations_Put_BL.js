const {
  getVacById,
  updateVacation,
} = require("../../../data-accsess-layer/Vacations/Vacations");

const fs = require("fs").promises;
const path = require("path");

async function updateByIdWithOldImage(
  vacation_destination,
  vacation_description,
  vacation_start_date,
  vacation_end_date,
  vacation_price,
  vacations_id,
  vacation_image
) {
  return updateVacation(
    vacation_destination,
    vacation_description,
    vacation_start_date,
    vacation_end_date,
    vacation_price,
    vacations_id,
    vacation_image
  );
}

async function updateByIdWithNewImage(
  vacation_destination,
  vacation_description,
  vacation_start_date,
  vacation_end_date,
  vacation_price,
  vacations_id,
  vacation_image
) {
  try {
    const vac = await getVacById(vacations_id);

    const oldImageFileName = vac.data.vacation_image.slice(
      vac.data.vacation_image.lastIndexOf("/") + 1
    );
    const oldImagePath = path.join(
      process.cwd(),
      "files",
      "images",
      oldImageFileName
    );

    await fs.unlink(oldImagePath);

    const newFileName = `${vacations_id}_${Date.now()}_${vacation_image.name}`;
    const newFilePath = path.join(
      process.cwd(),
      "files",
      "images",
      newFileName
    );

    await vacation_image.mv(newFilePath);

    const newImageUrl = `files/images/${newFileName}`;

    return updateVacation(
      vacation_destination,
      vacation_description,
      vacation_start_date,
      vacation_end_date,
      vacation_price,
      vacations_id,
      newImageUrl
    );
  } catch (error) {
    return { success: false, message: error || "Error" };
  }
}

module.exports = {
  updateByIdWithOldImage,
  updateByIdWithNewImage,
};
