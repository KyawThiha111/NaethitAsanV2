import notiCollection from "../../models/NOTI/messagenoti.js";

export const getNotiCount = async (req, res) => {
    try {
      const notiDoc = await notiCollection.findOne({});
  
      if (!notiDoc) {
        return res.status(404).json({
          success: false,
          message: "Notification count not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        count: notiDoc.count,
      });
    } catch (error) {
      console.error("Error fetching notification count:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

export const resetNotiCount = async (req, res) => {
  try {
    const updated = await notiCollection.findOneAndUpdate(
      {},
      { $set: { count: 0 } },
      { new: true } // return the updated document
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "No notification collection found to reset.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification count reset to 0.",
      count: updated.count,
    });
  } catch (error) {
    console.error("Error resetting noti count:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

