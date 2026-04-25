import { useState, useRef } from "react";
import { UploadSimple, UserCircle, Briefcase, GraduationCap, FileText } from "@phosphor-icons/react";

const LeaderModuleForm = ({ onSubmit, programmes = [] }) => {
  const formRef = useRef(null);
  
  const [formData, setFormData] = useState({
    fullName: "", dateOfBirth: "", submissionDate: "", gender: "", homeAddress: "", contactNumber: "",
    occupation: "", employer: "", workAddress: "", workTelephone: "", workEmail: "", approvedCentre: "",
    ibesProgrammes: "", ibesModules: "", employmentHistory: "", profAchieved: "", profWorkingTowards: "",
    teachAchieved: "", teachWorkingTowards: "", teachingEvidence: "", researchEvidence: "", professionalMembership: "",
    profilePicture: null, resumeCV: null, idPassport: null, certificates: null, transcripts: null,
  });

  const [fileNames, setFileNames] = useState({
    profilePicture: "", resumeCV: "", idPassport: "", certificates: "", transcripts: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileNames((prev) => ({ ...prev, [fieldName]: files[0].name }));
      setFormData((prev) => ({ ...prev, [fieldName]: files[0] }));
    } else {
      setFileNames((prev) => ({ ...prev, [fieldName]: "" }));
      setFormData((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleClear = () => {
    setFormData({
      fullName: "", dateOfBirth: "", submissionDate: "", gender: "", homeAddress: "", contactNumber: "",
      occupation: "", employer: "", workAddress: "", workTelephone: "", workEmail: "", approvedCentre: "",
      ibesProgrammes: "", ibesModules: "", employmentHistory: "", profAchieved: "", profWorkingTowards: "",
      teachAchieved: "", teachWorkingTowards: "", teachingEvidence: "", researchEvidence: "", professionalMembership: "",
      profilePicture: null, resumeCV: null, idPassport: null, certificates: null, transcripts: null,
    });
    setFileNames({ profilePicture: "", resumeCV: "", idPassport: "", certificates: "", transcripts: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { ...formData, applicationType: "Leader Module" };
    onSubmit(finalData);
  };

  const renderFileInput = (id, label, fieldName, accept, helpText) => (
    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
      <label>{label} <span className="req">*</span></label>
      <div className="premium-file-upload">
        <div className="upload-button-wrapper">
          <label htmlFor={id}>
            <UploadSimple weight="bold" size={18} /> Browse File
            <input 
              id={id} type="file" 
              accept={accept} 
              style={{ display: 'none' }} 
              onChange={(e) => handleFileChange(e, fieldName)} 
              required={!formData[fieldName]}
            />
          </label>
        </div>
        <div className="upload-info" style={{ flex: 1, textAlign: 'right' }}>
          {fileNames[fieldName] ? (
            <div className="upload-filename" title={fileNames[fieldName]}>{fileNames[fieldName]}</div>
          ) : (
            <div className="form-help-text">No file chosen. {helpText}</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="premium-form-container fade-in">
      <div className="form-header-premium">
        <div className="header-text-content">
          <h1>Module Leader Application</h1>
          <p>Submit your professional qualifications to act as a Module Leader for IBES. All fields marked with an asterisk (*) are required.</p>
        </div>
        <div className="header-logo-container">
          <img src="https://ibesuni.fr/portal/assets/emails/ibes.jpg" alt="IBES Logo" style={{ maxWidth: '180px', height: 'auto' }} />
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit}>
        
        {/* 👤 Applicant Profile */}
        <div className="form-section">
          <div className="section-header">
            <h2><UserCircle size={28} weight="duotone" color="var(--ibes-navy)" /> Applicant Profile</h2>
            <p>Personal details and contact information.</p>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name <span className="req">*</span></label>
              <input type="text" className="ibes-input" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Dr. Jane Smith" />
            </div>
            <div className="form-group">
              <label>Gender <span className="req">*</span></label>
              <div className="radio-options-grid">
                <label className="premium-radio-label">
                  <input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} required /> Male
                </label>
                <label className="premium-radio-label">
                  <input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} required /> Female
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Date of Birth <span className="req">*</span></label>
              <input type="date" className="ibes-input" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contact Number <span className="req">*</span></label>
              <input type="text" className="ibes-input" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required placeholder="+44 123 456 789" />
            </div>
            <div className="form-group">
              <label>Full Home Address <span className="req">*</span></label>
              <input type="text" className="ibes-input" name="homeAddress" value={formData.homeAddress} onChange={handleChange} required placeholder="123 Example Street" />
            </div>
            <div className="form-group">
              <label>Form Submission Date <span className="req">*</span></label>
              <input type="date" className="ibes-input" name="submissionDate" value={formData.submissionDate} onChange={handleChange} required />
            </div>
          </div>
        </div>

        {/* 💼 Professional Information */}
        <div className="form-section">
          <div className="section-header">
            <h2><Briefcase size={28} weight="duotone" color="var(--ibes-navy)" /> Professional Information</h2>
            <p>Current employment details and operational center.</p>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Occupation / Job Title <span className="req">*</span></label>
              <input type="text" className="ibes-input" name="occupation" value={formData.occupation} onChange={handleChange} required placeholder="Professor" />
            </div>
            <div className="form-group">
              <label>Employer <span className="req">*</span></label>
              <input type="text" className="ibes-input" name="employer" value={formData.employer} onChange={handleChange} required placeholder="University Exchange" />
            </div>
            <div className="form-group">
              <label>Work Telephone <span className="req">*</span></label>
              <input type="text" className="ibes-input" name="workTelephone" value={formData.workTelephone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Work Office E-Mail <span className="req">*</span></label>
              <input type="email" className="ibes-input" name="workEmail" value={formData.workEmail} onChange={handleChange} required placeholder="office@university.edu" />
            </div>
          </div>
          <div className="form-grid single-col" style={{ marginTop: '1.5rem', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Work Address <span className="req">*</span></label>
              <input type="text" className="ibes-input" name="workAddress" value={formData.workAddress} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Approved Centre <span className="req">*</span></label>
              <input type="text" className="ibes-input" name="approvedCentre" value={formData.approvedCentre} onChange={handleChange} required />
            </div>
          </div>
        </div>

        {/* 🎓 Program Alignment */}
        <div className="form-section">
          <div className="section-header">
            <h2><GraduationCap size={28} weight="duotone" color="var(--ibes-navy)" /> IBES Deliverables</h2>
            <p>Select the relevant program pathways you are applying for.</p>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>IBES Programme <span className="req">*</span></label>
              <select className="ibes-input" name="ibesProgrammes" value={formData.ibesProgrammes} onChange={handleChange} required>
                <option value="" disabled hidden>-- Select Official Programme --</option>
                {programmes.map(prog => (
                  <option key={prog} value={prog}>{prog}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>IBES Module(s) <span className="req">*</span></label>
              <select className="ibes-input" name="ibesModules" value={formData.ibesModules} onChange={handleChange} required>
                <option value="" disabled hidden>-- Select Module Alignment --</option>
                <option value="Advanced Research Methods">Advanced Research Methods</option>
                <option value="Strategic Leadership">Strategic Leadership</option>
                <option value="Global Economics">Global Economics</option>
                <option value="Information Systems">Information Systems</option>
              </select>
            </div>
          </div>
        </div>

        {/* 📜 Experience */}
        <div className="form-section">
          <div className="section-header">
            <h2><FileText size={28} weight="duotone" color="var(--ibes-navy)" /> Qualifications & Experience</h2>
            <p>Provide evidence of academia and industry leadership.</p>
          </div>
          <div className="form-grid single-col" style={{ gap: '1.5rem' }}>
            <div className="form-group">
              <label>Employment History (Most recent first) <span className="req">*</span></label>
              <textarea className="ibes-input" name="employmentHistory" value={formData.employmentHistory} onChange={handleChange} required />
            </div>
            <div className="form-grid" style={{ gap: '1.5rem', marginTop: 0 }}>
              <div className="form-group">
                <label>Professional Quals: Achieved <span className="req">*</span></label>
                <textarea className="ibes-input" name="profAchieved" value={formData.profAchieved} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Professional Quals: Working Towards <span className="req">*</span></label>
                <textarea className="ibes-input" name="profWorkingTowards" value={formData.profWorkingTowards} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-grid" style={{ gap: '1.5rem', marginTop: 0 }}>
              <div className="form-group">
                <label>Teaching Quals: Achieved <span className="req">*</span></label>
                <textarea className="ibes-input" name="teachAchieved" value={formData.teachAchieved} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Teaching Quals: Working Towards <span className="req">*</span></label>
                <textarea className="ibes-input" name="teachWorkingTowards" value={formData.teachWorkingTowards} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Evidence of Teaching and Assessing <span className="req">*</span></label>
              <textarea className="ibes-input" name="teachingEvidence" value={formData.teachingEvidence} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Evidence of Research & Scholarly Activity <span className="req">*</span></label>
              <textarea className="ibes-input" name="researchEvidence" value={formData.researchEvidence} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Relevant Professional Memberships <span className="req">*</span></label>
              <textarea className="ibes-input" name="professionalMembership" value={formData.professionalMembership} onChange={handleChange} required />
            </div>
          </div>
        </div>

        {/* 📎 Document Vault */}
        <div className="form-section">
          <div className="section-header">
            <h2><FileText size={28} weight="duotone" color="var(--ibes-navy)" /> Required Documentation</h2>
            <p>Upload all relevant documentation to support your leader application.</p>
          </div>
          <div className="form-grid" style={{ gap: '1.5rem' }}>
            {renderFileInput("lProfilePic", "Profile Picture", "profilePicture", "image/*", "Max 10MB")}
            {renderFileInput("lResume", "Resume / CV", "resumeCV", ".pdf,.doc,.docx", "PDF/Word file")}
            {renderFileInput("lPassport", "ID / Passport", "idPassport", ".pdf,image/*", "PDF/Image")}
            {renderFileInput("lCerts", "Certified Certificates", "certificates", ".pdf,image/*", "PDF/Image")}
            {renderFileInput("lTranscripts", "Certified Transcripts", "transcripts", ".pdf,image/*", "PDF/Image")}
          </div>
        </div>
        
        {/* 🚀 Submission */}
        <div className="form-footer-actions">
          <button type="button" className="btn-clear" onClick={handleClear} style={{ color: '#64748b', fontWeight: '500' }}>Reset Form Fields</button>
          <button type="submit" className="btn-premium" style={{ minWidth: '180px', backgroundColor: 'var(--ibes-red)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', padding: '12px 24px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(231, 1, 57, 0.2)' }}>
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaderModuleForm;
