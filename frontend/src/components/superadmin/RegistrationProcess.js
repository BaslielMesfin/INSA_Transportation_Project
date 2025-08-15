// src/components/superadmin/RegistrationProcess.js
import React from 'react';

function RegistrationProcess() {
  return (
    <div className="registration-process">
      <h1>Company Registration Process</h1>
      
      <div className="process-steps">
        <div className="step">
          <h3>Step 1: Physical Registration</h3>
          <p>Company representatives visit our headquarters to submit registration documents in person.</p>
        </div>
        
        <div className="step">
          <h3>Step 2: Document Verification</h3>
          <p>Superadmin staff verify all submitted documents and company information.</p>
        </div>
        
        <div className="step">
          <h3>Step 3: Company Registration in System</h3>
          <p>Once documents are verified, the superadmin registers the company in the system.</p>
        </div>
        
        <div className="step">
          <h3>Step 4: Admin Account Creation</h3>
          <p>The superadmin creates an admin account for the company with login credentials.</p>
        </div>
        
        <div className="step">
          <h3>Step 5: Account Activation</h3>
          <p>The company admin receives their login credentials via email and can access the system.</p>
        </div>
      </div>
      
      <div className="notes">
        <h3>Important Notes</h3>
        <ul>
          <li>All companies must complete physical registration before being added to the system.</li>
          <li>Admin accounts can only be created by superadmins.</li>
          <li>Companies must provide valid email addresses for account creation.</li>
          <li>Login credentials will be sent to the registered email address.</li>
        </ul>
      </div>
    </div>
  );
}

export default RegistrationProcess;