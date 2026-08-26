const reportModel = require('../models/reportModel');
const createApiError = require('../utils/apiError');

async function getStatistics(req, res, next) {
  try {
    // Only allow admin and lurah to see statistics (assuming this is required)
    if (!req.user || !['admin', 'lurah'].includes(req.user.role)) {
      throw createApiError('Unauthorized access to statistics.', 403);
    }

    const kelurahanId = req.user.kelurahanId || null;
    const stats = await reportModel.getStatistics(kelurahanId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getStatistics
};
