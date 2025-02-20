const {
  getImgUrlFromVac,
  deleteVacation,
} = require("../../../data-accsess-layer/Vacations/Vacations");

const fs = require("fs").promises;

async function deleteById(id) {
  try {
    const imgUrlResult = await getImgUrlFromVac(id);

    if (!imgUrlResult.success) {
      return {
        success: false,
        message: "Failed to retrieve image URL. Deletion aborted.",
      };
    }

    const imgUrl = imgUrlResult.url;

    if (imgUrl) {
      try {
        await fs.unlink(imgUrl);
      } catch (fileError) {
        return {
          success: false,
          message: "Vacation deleted, but image could not be deleted.",
        };
      }
    }

    const deleteResult = await deleteVacation(id);
    return deleteResult;
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred during deletion.",
    };
  }
}

module.exports = {
  deleteById,
};
