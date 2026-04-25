import { useState, useRef, useEffect } from "react";
import { UploadSimple, UserCircle, Briefcase, GraduationCap, FileText, PenNib } from "@phosphor-icons/react";
import SignatureCanvas from "react-signature-canvas";

const TeacherApplicantForm = ({ onSubmit, leaders, isGeneral, programmes = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const formRef = useRef(null);
  const sigCanvas = useRef(null);
  
  const [formData, setFormData] = useState({
    fullName: "", gender: "", homeAddress: "", contactNumber: "",
    occupation: "", employer: "", workAddress: "", workTelephone: "",
    workEmail: "", approvedCentre: "", ibesprogrammes: "", ibesModules: "",
    employmentHistory: "", professionalQualifications: "", workingTowards1: "",
    teachingQualifications: "", workingTowards2: "", teachingEvidence: "",
    researchActivity: "", professionalMembership: "",
    profilePicture: null, resumeCV: [], idPassport: [], certificates: [], transcripts: [], signature: null,
  });
  
  useEffect(() => {
    if (isGeneral) {
      setFormData(prev => ({ ...prev, ibesprogrammes: "General / All Programmes" }));
    }
  }, [isGeneral]);

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
      const names = Array.from(files).map((f) => f.name).join(", ");
      setFileNames((prev) => ({ ...prev, [fieldName]: names }));
      
      if (fieldName === 'profilePicture') {
        setFormData((prev) => ({ ...prev, [fieldName]: files[0] }));
      } else {
        setFormData((prev) => ({ ...prev, [fieldName]: Array.from(files) }));
      }
    } else {
      setFileNames((prev) => ({ ...prev, [fieldName]: "" }));
      setFormData((prev) => ({ ...prev, [fieldName]: fieldName === 'profilePicture' ? null : [] }));
    }
  };

  const handleClear = () => {
    setFormData({
      fullName: "", gender: "", homeAddress: "", contactNumber: "",
      occupation: "", employer: "", workAddress: "", workTelephone: "",
      workEmail: "", approvedCentre: "", ibesprogrammes: "", ibesModules: "",
      employmentHistory: "", professionalQualifications: "", workingTowards1: "",
      teachingQualifications: "", workingTowards2: "", teachingEvidence: "",
      researchActivity: "", professionalMembership: "",
      profilePicture: null, resumeCV: [], idPassport: [], certificates: [], transcripts: [], signature: null,
    });
    setFileNames({ profilePicture: "", resumeCV: "", idPassport: "", certificates: "", transcripts: "" });
    if (sigCanvas.current) sigCanvas.current.clear();
  };

  const handleNext = () => {
    const missingDocs = [];
    if (!formData.profilePicture) missingDocs.push("Profile Picture");
    if (!formData.resumeCV || formData.resumeCV.length === 0) missingDocs.push("Resume / CV");
    if (!formData.idPassport || formData.idPassport.length === 0) missingDocs.push("ID / Passport");
    if (!formData.certificates || formData.certificates.length === 0) missingDocs.push("Certificates");
    if (!formData.transcripts || formData.transcripts.length === 0) missingDocs.push("Transcripts");
    
    if (missingDocs.length > 0) {
      alert(`Please upload the following required documents:\n- ${missingDocs.join('\n- ')}`);
      return;
    }

    if (formRef.current && formRef.current.reportValidity()) {
      setCurrentPage(2);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sigCanvas.current && sigCanvas.current.isEmpty()) {
      alert("Please provide an e-signature before submitting.");
      return;
    }
    const finalData = { ...formData, applicationType: "Teacher Applicant" };
    if (sigCanvas.current) {
      finalData.signature = sigCanvas.current.getCanvas().toDataURL("image/png");
    }

    // Trigger Distribution Notification (Change 5)
    const progLeaders = leaders.filter(l => l.programmes.includes(formData.ibesprogrammes));
    const recipientEmails = (progLeaders.length > 0 ? progLeaders : leaders).map(l => l.email);
    
    // Always include Learning Center
    recipientEmails.push("learningcenter@ibes.fr");

    try {
      await fetch(`${import.meta.env.PROD ? '' : 'http://localhost:5000'}/api/notify-form-distributed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName: formData.fullName,
          programmeName: formData.ibesprogrammes,
          recipientEmails: recipientEmails
        })
      });
    } catch (err) {
      console.error("Distribution notification failed", err);
    }

    onSubmit(finalData);
  };

  const renderFileInput = (id, label, fieldName, isMultiple, accept, maxText) => (
    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
      <label>{label} <span className="req">*</span></label>
      <div className="premium-file-upload">
        <div className="upload-button-wrapper">
          <label htmlFor={id}>
            <UploadSimple weight="bold" size={18} />
            Browse Files
            <input 
              id={id} type="file" 
              multiple={isMultiple} accept={accept}
              style={{ display: 'none' }} 
              onChange={(e) => handleFileChange(e, fieldName)} 
            />
          </label>
        </div>
        <div className="upload-info" style={{ flex: 1, textAlign: 'right' }}>
          {fileNames[fieldName] ? (
            <div className="upload-filename" title={fileNames[fieldName]}>{fileNames[fieldName]}</div>
          ) : (
            <div className="form-help-text">No file chosen. {maxText}</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="premium-form-container fade-in">
      {/* 🟦 Form Header */}
      <div className="form-header-premium">
        <div className="header-text-content">
          <h1>Tutor & Supervisor Appointment</h1>
          <p>Complete this professional portal form to submit your academic credentials to the IBES Academic Board for review and approval.</p>
        </div>
        <div className="header-logo-container">
          <img src="https://ibesuni.fr/portal/assets/emails/ibes.jpg" alt="IBES Logo" style={{ maxWidth: '180px', height: 'auto' }} />
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit}>
        
        {currentPage === 1 && (
          <>
            {/* 👤 Section 1: Applicant Profile */}
            <div className="form-section">
              <div className="section-header">
                <h2><UserCircle size={28} weight="duotone" color="var(--ibes-navy)" /> Applicant Profile</h2>
                <p>Personal details and contact information.</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name & Title <span className="req">*</span></label>
                  <input type="text" className="ibes-input" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Dr. John Doe" />
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
                  <label>Contact Number <span className="req">*</span></label>
                  <input type="text" className="ibes-input" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required placeholder="+33 X XX XX XX XX" />
                </div>
              </div>

              <div className="form-grid single-col" style={{ marginTop: '1.5rem' }}>
                <div className="form-group">
                  <label>Full Home Address (Inc. Postcode) <span className="req">*</span></label>
                  <input type="text" className="ibes-input" name="homeAddress" value={formData.homeAddress} onChange={handleChange} required placeholder="123 Academic Way, Paris, 75001" />
                </div>
              </div>
            </div>

            {/* 💼 Section 2: Professional Information */}
            <div className="form-section">
              <div className="section-header">
                <h2><Briefcase size={28} weight="duotone" color="var(--ibes-navy)" /> Professional Information</h2>
                <p>Current employment and center details.</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Occupation / Job Title <span className="req">*</span></label>
                  <input type="text" className="ibes-input" name="occupation" value={formData.occupation} onChange={handleChange} required placeholder="Senior Lecturer" />
                </div>

                <div className="form-group">
                  <label>Employer <span className="req">*</span></label>
                  <input type="text" className="ibes-input" name="employer" value={formData.employer} onChange={handleChange} required placeholder="University Name" />
                </div>

                <div className="form-group">
                  <label>Work Telephone <span className="req">*</span></label>
                  <input type="text" className="ibes-input" name="workTelephone" value={formData.workTelephone} onChange={handleChange} required placeholder="Work extension/phone" />
                </div>

                <div className="form-group">
                  <label>Work Office E-Mail <span className="req">*</span></label>
                  <input type="email" className="ibes-input" name="workEmail" value={formData.workEmail} onChange={handleChange} required placeholder="academic@university.edu" />
                </div>
              </div>

              <div className="form-grid single-col" style={{ marginTop: '1.5rem', gap: '1.5rem' }}>
                <div className="form-group">
                  <label>Work Address (Inc. Postcode) <span className="req">*</span></label>
                  <input type="text" className="ibes-input" name="workAddress" value={formData.workAddress} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Approved Centre (If different to employer) <span className="req">*</span></label>
                  <input type="text" className="ibes-input" name="approvedCentre" value={formData.approvedCentre} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* 🎓 Section 3: Programme Selection */}
            <div className="form-section">
              <div className="section-header">
                <h2><GraduationCap size={28} weight="duotone" color="var(--ibes-navy)" /> IBES Deliverables</h2>
                <p>Select the program and modules you are applying to teach.</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>IBES Programme <span className="req">*</span></label>
                  <select className="ibes-input" name="ibesprogrammes" value={formData.ibesprogrammes} onChange={handleChange} required style={{ cursor: 'pointer' }}>
                    <option value="" disabled hidden>-- Select Official Programme --</option>
                    <option value="General / All Programmes">General / All Programmes</option>
                    {programmes.map(prog => (
                      <option key={prog} value={prog}>{prog}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>IBES Module(s) <span className="req">*</span></label>
                  <select className="ibes-input" name="ibesModules" value={formData.ibesModules} onChange={handleChange} required style={{ cursor: 'pointer' }}>
                    <option value="" disabled hidden>-- Select Module Alignment --</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Applied Project">Applied Project</option>
                    <option value="Data Structures (Bridging Module)">Data Structures (Bridging Module)</option>
                    <option value="Database Programming">Database Programming</option>
                    <option value="Programming Languages (Bridging Module)">Programming Languages (Bridging Module)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 📜 Section 4: Qualifications & Experience */}
            <div className="form-section">
              <div className="section-header">
                <h2><FileText size={28} weight="duotone" color="var(--ibes-navy)" /> Qualifications & Experience</h2>
                <p>Detail your academic background and professional history.</p>
              </div>

              <div className="form-grid single-col" style={{ gap: '1.5rem' }}>
                <div className="form-group">
                  <label>Employment History (Most recent first) <span className="req">*</span></label>
                  <textarea className="ibes-input" name="employmentHistory" value={formData.employmentHistory} onChange={handleChange} required placeholder="e.g. 2020-Present: Senior Lecturer at Oxford University..." />
                </div>

                <div className="form-grid" style={{ gap: '1.5rem', marginTop: 0 }}>
                  <div className="form-group">
                    <label>Professional Qualifications: Achieved (with dates) <span className="req">*</span></label>
                    <textarea className="ibes-input" name="professionalQualifications" value={formData.professionalQualifications} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Professional Qualifications: Working Towards <span className="req">*</span></label>
                    <textarea className="ibes-input" name="workingTowards1" value={formData.workingTowards1} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-grid" style={{ gap: '1.5rem', marginTop: 0 }}>
                  <div className="form-group">
                    <label>Teaching Qualifications: Achieved (with dates) <span className="req">*</span></label>
                    <textarea className="ibes-input" name="teachingQualifications" value={formData.teachingQualifications} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Teaching Qualifications: Working Towards <span className="req">*</span></label>
                    <textarea className="ibes-input" name="workingTowards2" value={formData.workingTowards2} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Evidence of Teaching and Assessing <span className="req">*</span></label>
                  <textarea className="ibes-input" name="teachingEvidence" value={formData.teachingEvidence} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Evidence of Research & Scholarly Activity <span className="req">*</span></label>
                  <textarea className="ibes-input" name="researchActivity" value={formData.researchActivity} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Relevant Professional Memberships <span className="req">*</span></label>
                  <textarea className="ibes-input" name="professionalMembership" value={formData.professionalMembership} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* 📎 Section 5: Document Vault */}
            <div className="form-section">
              <div className="section-header">
                <h2><FileText size={28} weight="duotone" color="var(--ibes-navy)" /> Required Documentation</h2>
                <p>Securely upload copies of your files. PDFs or Images, Max 10MB per file.</p>
              </div>

              <div className="form-grid" style={{ gap: '1.5rem' }}>
                {renderFileInput("tProfilePic", "Profile Picture", "profilePicture", false, "image/*", "Max 10MB Image")}
                {renderFileInput("tResume", "Resume / CV", "resumeCV", true, "*/*", "Up to 10 files")}
                {renderFileInput("tPassport", "Copy of ID / Passport", "idPassport", true, "*/*", "Up to 10 files")}
                {renderFileInput("tCerts", "Certified Certificates", "certificates", true, "*/*", "Up to 10 files")}
                {renderFileInput("tTranscripts", "Certified Transcripts", "transcripts", true, "*/*", "Up to 10 files")}
              </div>
            </div>
            
            {/* 🚀 Next Button Footer */}
            <div className="form-footer-actions">
              <button type="button" className="btn-clear" onClick={handleClear} style={{ color: '#64748b', fontWeight: '500' }}>Clear Form Data</button>
              <button type="button" className="btn-premium btn-premium-primary" onClick={handleNext} style={{ minWidth: '160px', backgroundColor: 'var(--ibes-navy)' }}>
                Continue to Authorization
              </button>
            </div>
          </>
        )}

        {currentPage === 2 && (
          <>
            <div className="form-section" style={{ minHeight: '50vh' }}>
              <div className="section-header">
                <h2><PenNib size={28} weight="duotone" color="var(--ibes-navy)" /> Application Authorization</h2>
                <p>Final declaration and digital signature step.</p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--ibes-navy-dark)' }}>Support of the Approved Centre:</h4>
                <p style={{ lineHeight: '1.8', color: '#334155', marginBottom: '1.5rem', fontWeight: '500' }}>
                  I support the application of <strong style={{ borderBottom: '1px solid #333', padding: '0 10px' }}>{formData.fullName || "[Applicant Name]"}</strong> as Approved Centre
                  Supervisor and agree to the applicant undertaking ongoing academic and
                  professional development to support relevant IBES programmes.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '13px', color: '#64748b' }}>Name & Title</span>
                    <strong style={{ display: 'block', fontSize: '15px' }}>{formData.fullName || "-"}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '13px', color: '#64748b' }}>Approved Centre</span>
                    <strong style={{ display: 'block', fontSize: '15px' }}>{formData.approvedCentre || "-"}</strong>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Applicant E-Signature <span className="req">*</span></label>
                <p className="form-help-text">Please draw your signature inside the box below to authorize this document.</p>
                <div style={{ border: '2px solid #cbd5e1', borderRadius: '8px', marginTop: '12px', backgroundColor: '#ffffff', overflow: 'hidden' }}>
                  <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{ width: 800, height: 250, className: 'sigCanvas', style: { width: '100%', cursor: 'crosshair' } }}
                  />
                </div>
                <div style={{ marginTop: '12px', textAlign: 'right' }}>
                  <button type="button" className="btn-clear" style={{ padding: '6px 16px', fontSize: '13px', backgroundColor: '#f1f5f9' }} onClick={() => sigCanvas.current.clear()}>
                    Reset Canvas
                  </button>
                </div>
              </div>
            </div>

            <div className="form-footer-actions">
              <button type="button" className="btn-clear" onClick={() => { setCurrentPage(1); window.scrollTo(0, 0); }} style={{ color: 'var(--ibes-navy)' }}>← Back to Form</button>
              <div className="action-buttons-group" style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn-clear" onClick={handleClear} style={{ color: '#64748b' }}>Clear Data</button>
                <button type="submit" className="btn-premium" style={{ minWidth: '180px', backgroundColor: 'var(--ibes-red)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', padding: '12px 24px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(231, 1, 57, 0.2)' }}>
                  Submit Official Application
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default TeacherApplicantForm;
