const Analytics = require('../../models/Analytics');

exports.getSystemAnalytics = async (req, res) => {
  try {
    const stats = await Analytics.getSystemStats();
    const companyPerformance = await Analytics.getCompanyPerformance();
    
    res.json({
      success: true,
      analytics: {
        overview: stats,
        companyPerformance,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};