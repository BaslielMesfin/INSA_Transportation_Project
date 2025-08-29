const Company = require('../../models/Company') ;

exports.getAllCompanies = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    
    const companies = await Company.getAllCompanies(filters);
    
    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCompanies = companies.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      companies: paginatedCompanies,
      total: companies.length,
      totalPages: Math.ceil(companies.length / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateCompanyStatus = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { status } = req.body;
    
    if (!['approved', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const company = await Company.updateCompanyStatus(companyId, status, req.user.id);
    
    res.json({
      success: true,
      message: `Company ${status} successfully`,
      company
    });
  } catch (error) {
    console.error('Error updating company status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getCompanyDetails = async (req, res) => {
  try {
    const { companyId } = req.params;
    
    const company = await Company.getCompanyDetails(companyId);
    
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    res.json({ success: true, company });
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};