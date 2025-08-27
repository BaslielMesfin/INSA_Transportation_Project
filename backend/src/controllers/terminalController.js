const Terminal = require('../models/terminalModel');

// Fetch all terminals
exports.getTerminals = async (req, res) => {
  try {
    const terminals = await Terminal.getAllTerminals();
    res.status(200).json({ success: true, terminals });
  } catch (err) {
    console.error('Error fetching terminals:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
