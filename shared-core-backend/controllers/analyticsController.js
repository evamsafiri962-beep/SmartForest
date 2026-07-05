const { getAnalytics } = require("../services/analyticsServices");

exports.getAnalytics = async (req, res) => {
  try {
    const data = await getAnalytics();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};