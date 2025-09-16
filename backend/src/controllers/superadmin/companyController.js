const Company = require('../../models/Company');

exports.getAllCompanies = async (req, res) => {
  try {
    console.log('=== getAllCompanies called ===');
    console.log('Query params:', req.query);
    
    const { status, page = 1, limit = 10 } = req.query;

    const filters = {};
    if (status) filters.status = status;

    console.log('Filters:', filters);
    
    const companies = await Company.getAllCompanies(filters);
    console.log('Found companies:', companies.length);

    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCompanies = companies.slice(startIndex, endIndex);

    console.log('Returning paginated result');
    
    res.json({
      success: true,
      companies: paginatedCompanies,
      total: companies.length,
      totalPages: Math.ceil(companies.length / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('!!! Error fetching companies:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching companies',
      error: error.message
    });
  }
};

exports.updateCompanyStatus = async (req, res) => {
  try {
    console.log('=== updateCompanyStatus called ===');
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('User:', req.user);
    
    const { companyId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['approved', 'rejected', 'suspended', 'pending'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status. Must be: approved, rejected, suspended, or pending' 
      });
    }

    // Check if company exists
    const companyExists = await Company.findById(companyId);
    if (!companyExists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    const company = await Company.updateCompanyStatus(companyId, status, req.user.id);

    res.json({
      success: true,
      message: `Company status updated to ${status} successfully`,
      company
    });
  } catch (error) {
    console.error('!!! Error updating company status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating company status',
      error: error.message
    });
  }
};

exports.getCompanyDetails = async (req, res) => {
  try {
    console.log('=== getCompanyDetails called ===');
    console.log('Params:', req.params);
    
    const { companyId } = req.params;

    const company = await Company.getCompanyDetails(companyId);

    if (!company) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    res.json({ 
      success: true, 
      company 
    });
  } catch (error) {
    console.error('!!! Error fetching company details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching company details',
      error: error.message
    });
  }
};