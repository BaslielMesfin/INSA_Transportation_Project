const Analytics = require('../../models/Analytics');

exports.getSystemAnalytics = async (req, res) => {
  try {
    console.log('Fetching system analytics...');
    
    const stats = await Analytics.getSystemStats();
    const companyPerformance = await Analytics.getCompanyPerformance();
    const recentActivity = await Analytics.getRecentActivity();
    
    res.json({
      success: true, 
      analytics: {
        overview: stats,
        companyPerformance,
        recentActivity,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching analytics',
      error: error.message 
    });
  }
};

// Simple analytics endpoint for basic stats
exports.getBasicAnalytics = async (req, res) => {
  try {
    console.log('Fetching basic analytics...');
    
    const stats = await Analytics.getSystemStats();
    
    res.json({
      success: true,
      analytics: {
        overview: stats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching basic analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching basic analytics',
      error: error.message 
    });
  }
};