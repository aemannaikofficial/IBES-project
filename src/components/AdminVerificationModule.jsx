import React, { useState } from 'react';
import { CaretLeft, CheckCircle, DownloadSimple, UserCirclePlus, UsersThree, ShieldCheck, Bell } from '@phosphor-icons/react';
import { getLeadersForProgramme } from '../config/userRegistry';

const DataRow = ({ label, value }) => (
  <div className="data-row-responsive" style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) 2fr', gap: '8px 16px', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
    <div style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>{label}</div>
    <div style={{ color: '#0f172a', fontSize: '14px', fontWeight: '500', wordBreak: 'break-word' }}>{value || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Specified</span>}</div>
  </div>
);

const AdminVerificationModule = ({ applications, setApplications, initialTab = "new" }) => {
  const [viewingApp, setViewingApp] = useState(null);
  const [selectedLeader, setSelectedLeader] = useState("");
  const [notification, setNotification] = useState("");
  const [activeTab, setActiveTab] = useState(initialTab);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  // Sync activeTab if initialTab prop changes
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const newApps = applications.filter(app => app.currentStep === 2 && app.status !== 'rejected');
  const forwardedApps = applications.filter(app => app.currentStep === 3);
  const confirmedApps = applications.filter(app => app.currentStep === 4 || app.status === 'rejected');

  console.log("[DEBUG] Verification Module:", { counts: { new: newApps.length, forwarded: forwardedApps.length, confirmed: confirmedApps.length }, activeTab });

  const handleVerify = async (id) => {
    if (!selectedLeader) {
      alert("Please select a Programme Leader to assign this application.");
      return;
    }

    const appToVerify = applications.find(a => a.id === id);
    setNotification(`📨 Notifying ${selectedLeader} via secure channels...`);

    try {
      // 1. Trigger Backend Email Notification
      const response = await fetch(`${import.meta.env.PROD ? '' : 'http://localhost:5000'}/api/notify-leader`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaderName: selectedLeader,
          applicantName: appToVerify.fullName,
          programmeName: appToVerify.ibesprogrammes || appToVerify.ibesProgrammes
        })
      });

      const data = await response.json();
      console.log("Leader Notification API:", data);

      // 2. Set Local In-App Notification
      const notifKey = `ibes_notif_${selectedLeader}`;
      const existing = JSON.parse(localStorage.getItem(notifKey) || "[]");
      const newNotif = {
        id: Date.now(),
        applicantName: appToVerify.fullName,
        programme: appToVerify.ibesprogrammes || appToVerify.ibesProgrammes,
        timestamp: new Date().toLocaleString(),
        read: false
      };
      localStorage.setItem(notifKey, JSON.stringify([...existing, newNotif]));

      // 3. Update Application State
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, currentStep: 3, status: "pending", assignedLeader: selectedLeader } : app
        )
      );

      setNotification(`✅ ${selectedLeader} has been assigned & notified!`);

      setTimeout(() => {
        setViewingApp(null);
        setSelectedLeader("");
        setNotification("");
      }, 2800);

    } catch (error) {
      console.error("Verification Routing Error:", error);
      setNotification(`⚠️ Saved locally, but network notification failed.`);
      
      // Still update locally so workflow isn't blocked
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, currentStep: 3, status: "pending", assignedLeader: selectedLeader } : app
        )
      );
      
      setTimeout(() => {
        setViewingApp(null);
        setSelectedLeader("");
        setNotification("");
      }, 3500);
    }
  };

  const handleReject = (id) => {
    if (window.confirm("Are you sure you want to permanently reject this application?")) {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "rejected" } : app
        )
      );
      setViewingApp(null);
    }
  };

  const renderFilePreview = (fileData) => {
    if (!fileData) return <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>Document omitted</span>;
    const files = Array.isArray(fileData) ? fileData : [fileData];
    if (files.length === 0) return <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>Document omitted</span>;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
        {files.map((file, i) => {
          const isPlaceholder = file && file.isFilePlaceholder;
          const isRealFile = file instanceof File;
          const url = isRealFile ? URL.createObjectURL(file) : null;
          const isImage = (file.type || "").startsWith('image/');

          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              {isImage && isRealFile && (
                <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                   <img src={url} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              {isImage && isPlaceholder && (
                <div style={{ width: '40px', height: '40px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', border: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '10px' }}>
                  IMG
                </div>
              )}
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name || "Unknown File"}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                  {file.size ? `${(file.size / 1024).toFixed(1)} KB` : "Unknown Size"}
                  {isPlaceholder && <span style={{ color: '#ef4444', marginLeft: '6px' }}>(Cleared on refresh)</span>}
                </p>
              </div>
              {isRealFile ? (
                <a href={url} download={file.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: 'var(--ibes-navy)', flexShrink: 0, transition: 'background 0.2s' }} title="Download File">
                  <DownloadSimple size={16} weight="bold" />
                </a>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  };

  if (viewingApp) {
    return (
      <div className="fade-in">
        <button 
          onClick={() => setViewingApp(null)} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer', marginBottom: '24px', transition: 'all 0.2s', fontSize: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc' }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
        >
          <CaretLeft weight="bold" /> Back to Application Queue
        </button>

        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden', paddingBottom: '24px' }}>
          
          {/* Detailed Header Overlay */}
          <div style={{ padding: '32px 40px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', position: 'relative' }}>
             <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', backgroundColor: 'var(--ibes-navy)' }}></div>
             <div style={{ display: 'inline-block', backgroundColor: 'var(--ibes-navy)', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
              {viewingApp.applicationType || "General Record"}
            </div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: isMobile ? '22px' : '28px', color: '#0f172a', fontWeight: '800' }}>{viewingApp.fullName || "Unnamed Applicant"}</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: isMobile ? '14px' : '15px' }}>Application Phase 2: Administrative Document Review</p>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>System Intake Date: {viewingApp.dateSubmitted}</p>
          </div>

          <div style={{ padding: isMobile ? '0 20px' : '0 40px' }}>
            
            <div style={{ marginTop: '32px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', color: '#0f172a', fontWeight: '700', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '8px' }}>Core Profile Data</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0' }}>
                <DataRow label="Gender Profile" value={viewingApp.gender} />
                {viewingApp.dateOfBirth && <DataRow label="Date of Birth" value={viewingApp.dateOfBirth} />}
                <DataRow label="Address Details" value={viewingApp.homeAddress} />
                <DataRow label="Contact Routing" value={viewingApp.contactNumber} />
                <DataRow label="Current Occupation" value={viewingApp.occupation} />
                <DataRow label="External Employer" value={viewingApp.employer} />
                <DataRow label="Assoc. Centre" value={viewingApp.approvedCentre} />
                <DataRow label="IBES Programme" value={viewingApp.ibesprogrammes || viewingApp.ibesProgrammes} />
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', color: '#0f172a', fontWeight: '700', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>Secured Documents</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(200px, 1fr) 2fr', gap: '16px', alignItems: 'start', marginBottom: '16px' }}>
                <div style={{ fontWeight: '500', color: '#202124', marginTop: isMobile ? '10px' : '0' }}>Profile Visual</div>
                <div>{renderFilePreview(viewingApp.profilePicture)}</div>
                <div style={{ fontWeight: '500', color: '#202124' }}>Official Resume</div>
                <div>{renderFilePreview(viewingApp.resumeCV)}</div>
                <div style={{ fontWeight: '500', color: '#202124' }}>Identity Govt. Issue</div>
                <div>{renderFilePreview(viewingApp.idPassport)}</div>
                <div style={{ fontWeight: '500', color: '#202124' }}>Academic Certs.</div>
                <div>{renderFilePreview(viewingApp.certificates)}</div>
                <div style={{ fontWeight: '500', color: '#202124' }}>Full Transcripts</div>
                <div>{renderFilePreview(viewingApp.transcripts)}</div>
              </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '16px', color: '#0f172a', fontWeight: '700', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>Employment & Capabilities</h3>
              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1e293b' }}>Employment History Trace</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{viewingApp.employmentHistory || "No record."}</p>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1e293b' }}>Professional Qualifications</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                     <strong>Achieved:</strong> {viewingApp.professionalQualifications || viewingApp.profAchieved || "N/A"}
                     {(viewingApp.workingTowards1 || viewingApp.profWorkingTowards) && <><br/><br/><strong>Working Towards:</strong> {viewingApp.workingTowards1 || viewingApp.profWorkingTowards}</>}
                  </p>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1e293b' }}>Teaching Portfolio Summary</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{viewingApp.teachingEvidence || "N/A"}</p>
                </div>
              </div>
            </div>

            {viewingApp.signature && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '16px', color: '#0f172a', fontWeight: '700', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>Legally Binding Authorizations</h3>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <p style={{ margin: '0 0 16px 0', color: '#64748b', fontStyle: 'italic', fontSize: '14px' }}>E-Signature obtained confirming truth of aforementioned document packet.</p>
                  <img src={viewingApp.signature} alt="E-Signature" style={{ border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '8px', maxWidth: '300px', padding: '12px' }} />
                </div>
              </div>
            )}

             {/* Action Routing Matrix */}
             <div style={{ padding: '32px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <ShieldCheck size={28} color="var(--ibes-navy)" />
                 <h3 style={{ margin: 0, color: 'var(--ibes-navy-dark)', fontSize: '18px' }}>Route Application to Programme Leader</h3>
               </div>
               
               <p style={{ margin: 0, color: '#475569', fontSize: '14px' }}>
                 Matches identified for: <strong style={{ color: '#0f172a' }}>{viewingApp.ibesprogrammes || viewingApp.ibesProgrammes}</strong>
               </p>

               <div style={{ position: 'relative', maxWidth: '500px' }}>
                 <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Available Authorizers</label>
                 <select 
                   value={selectedLeader}
                   onChange={(e) => setSelectedLeader(e.target.value)}
                   style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', backgroundColor: 'white', color: '#0f172a' }}
                 >
                   <option value="" disabled>-- Internal Routing Destination --</option>
                   {getLeadersForProgramme(viewingApp.ibesprogrammes || viewingApp.ibesProgrammes).map(leader => (
                     <option key={leader} value={leader}>{leader}</option>
                   ))}
                 </select>
               </div>
               
               {notification && (
                 <div className="fade-in" style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                   {notification}
                 </div>
               )}

               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
                 <button 
                   type="button" 
                   onClick={() => handleReject(viewingApp.id)}
                   style={{ flex: isMobile ? '1' : 'none', padding: '12px 24px', backgroundColor: 'transparent', border: '1px solid var(--ibes-red)', color: 'var(--ibes-red)', fontWeight: '700', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px', whiteSpace: 'nowrap' }}
                   onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--ibes-red-light)'; }}
                   onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                 >
                   Terminate Verification
                 </button>
                 <button 
                   type="button" 
                   onClick={() => handleVerify(viewingApp.id)}
                   style={{ 
                     flex: isMobile ? '1' : 'none',
                     padding: '12px 24px', backgroundColor: 'var(--ibes-navy)', border: 'none', color: 'white', 
                     fontWeight: '700', borderRadius: '8px', cursor: selectedLeader ? 'pointer' : 'not-allowed', 
                     transition: 'all 0.2s', fontSize: '14px', opacity: selectedLeader ? 1 : 0.5,
                     boxShadow: selectedLeader ? '0 4px 12px rgba(0, 31, 154, 0.2)' : 'none',
                     whiteSpace: 'nowrap'
                   }}
                 >
                   Verify & Notify Leader
                 </button>
               </div>
             </div>

          </div>
        </div>
      </div>
    );
  }

  // Queue Tabbing View 
  return (
    <div>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        
        {/* Tab Controls */}
        <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', padding: '0 8px', WebkitOverflowScrolling: 'touch' }}>
          <button 
            onClick={() => setActiveTab('new')}
            style={{ padding: '20px 16px', border: 'none', borderBottom: activeTab === 'new' ? '3px solid var(--ibes-navy)' : '3px solid transparent', backgroundColor: 'transparent', color: activeTab === 'new' ? 'var(--ibes-navy)' : '#64748b', fontWeight: activeTab === 'new' ? '700' : '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
          >
            <UserCirclePlus size={20} /> New Assignables <span style={{ backgroundColor: activeTab === 'new' ? 'var(--ibes-navy)' : '#cbd5e1', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>{newApps.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('forwarded')}
            style={{ padding: '20px 16px', border: 'none', borderBottom: activeTab === 'forwarded' ? '3px solid var(--ibes-navy)' : '3px solid transparent', backgroundColor: 'transparent', color: activeTab === 'forwarded' ? 'var(--ibes-navy)' : '#64748b', fontWeight: activeTab === 'forwarded' ? '700' : '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
          >
            <UsersThree size={20} /> Authorizer Pending <span style={{ backgroundColor: activeTab === 'forwarded' ? 'var(--ibes-navy)' : '#cbd5e1', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>{forwardedApps.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('confirmed')}
            style={{ padding: '20px 16px', border: 'none', borderBottom: activeTab === 'confirmed' ? '3px solid var(--ibes-navy)' : '3px solid transparent', backgroundColor: 'transparent', color: activeTab === 'confirmed' ? 'var(--ibes-navy)' : '#64748b', fontWeight: activeTab === 'confirmed' ? '700' : '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
          >
            <CheckCircle size={20} /> Concluded Files <span style={{ backgroundColor: activeTab === 'confirmed' ? 'var(--ibes-navy)' : '#cbd5e1', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>{confirmedApps.length}</span>
          </button>
        </div>

        {activeTab === 'confirmed' && confirmedApps.some(a => a.status === 'approved') && (
          <div style={{ padding: '16px 24px', backgroundColor: '#eff6ff', borderBottom: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bell size={20} color="#2563eb" weight="bold" />
            <p style={{ margin: 0, color: '#1e40af', fontWeight: '600', fontSize: '14px' }}>Programme Leaders have finalized decisions. Internal history updated.</p>
          </div>
        )}

        {activeTab === 'new' && (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {newApps.length === 0 ? (
               <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                 <p style={{ color: '#64748b', margin: 0, fontWeight: '500' }}>The administrative validation queue is completely empty.</p>
               </div>
            ) : (
              <div style={{ minWidth: isMobile ? '600px' : 'auto' }}>
                <div style={{ display: 'flex', padding: '16px 24px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', backgroundColor: '#f8fafc' }}>
                  <div style={{ flex: '1.5' }}>Candidate Subject</div>
                  <div style={{ flex: '1' }}>Submission Age</div>
                  <div style={{ flex: '1', textAlign: 'right' }}>Security</div>
                </div>
                {newApps.map(app => (
                  <div key={app.id} style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                    <div style={{ flex: '1.5' }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#0f172a', fontWeight: '600' }}>{app.fullName || 'Unnamed Subject'}</h4>
                      <span style={{ fontSize: '12px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: '500' }}>{app.applicationType || 'General Form'}</span>
                    </div>
                    <div style={{ flex: '1', color: '#475569', fontSize: '14px' }}>{app.dateSubmitted}</div>
                    <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button 
                        onClick={() => setViewingApp(app)}
                        style={{ backgroundColor: 'white', border: '1px solid #cbd5e1', color: 'var(--ibes-navy)', padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        Inspect Full File
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Similar table styling applied to other tabs implicitly via identical logic structures. */}
        {activeTab === 'forwarded' && (
          <div style={{}}>
            {forwardedApps.length === 0 ? (
               <div style={{ padding: '80px 40px', textAlign: 'center' }}>
                 <p style={{ color: '#64748b', margin: 0, fontWeight: '500' }}>No files currently escalated to Academic Board routing.</p>
               </div>
            ) : (
              <div>
                <div style={{ display: 'flex', padding: '16px 24px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', backgroundColor: '#f8fafc' }}>
                  <div style={{ flex: '1.5' }}>Candidate Subject</div>
                  <div style={{ flex: '1' }}>Current Escrow Destination</div>
                  <div style={{ flex: '1', textAlign: 'right' }}>Status Hold</div>
                </div>
                {forwardedApps.map(app => (
                  <div key={app.id} style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ flex: '1.5' }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#0f172a', fontWeight: '600' }}>{app.fullName || 'Unnamed'}</h4>
                      <button onClick={() => setViewingApp(app)} style={{ background: 'none', border: 'none', color: '#2563eb', padding: 0, fontSize: '13px', fontWeight: '500', cursor: 'pointer', textDecoration: 'underline' }}>View Locked File</button>
                    </div>
                    <div style={{ flex: '1', color: '#0f172a', fontWeight: '500', fontSize: '14px' }}>{app.assignedLeader}</div>
                    <div style={{ flex: '1', textAlign: 'right' }}>
                      <span style={{ fontSize: '12px', color: '#d97706', fontWeight: '600', backgroundColor: '#fef3c7', padding: '6px 12px', borderRadius: '4px' }}>Ext. Queue Locked</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Confirmed Tab Table */}
        {activeTab === 'confirmed' && (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {confirmedApps.length === 0 ? (
               <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                 <p style={{ color: '#64748b', margin: 0, fontWeight: '500' }}>No definitively closed applications currently in ledger.</p>
               </div>
            ) : (
              <div style={{ minWidth: isMobile ? '600px' : 'auto' }}>
                <div style={{ display: 'flex', padding: '16px 24px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', backgroundColor: '#f8fafc' }}>
                  <div style={{ flex: '1.5' }}>Candidate Identification</div>
                  <div style={{ flex: '1' }}>Authorized Origin</div>
                  <div style={{ flex: '1', textAlign: 'right' }}>Concluded Outcome</div>
                </div>
                {confirmedApps.map(app => (
                  <div key={app.id} style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f1f5f9', backgroundColor: app.status === 'rejected' ? '#fef2f2' : 'white' }}>
                    <div style={{ flex: '1.5' }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#0f172a', fontWeight: '600' }}>{app.fullName}</h4>
                      <button onClick={() => setViewingApp(app)} style={{ background: 'none', border: 'none', color: '#2563eb', padding: 0, fontSize: '13px', fontWeight: '500', cursor: 'pointer', textDecoration: 'underline' }}>View Historical File</button>
                    </div>
                    <div style={{ flex: '1', color: '#475569', fontSize: '13px' }}>{app.assignedLeader || "SysAdmin"}</div>
                    <div style={{ flex: '1', textAlign: 'right' }}>
                      <span style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', backgroundColor: app.status === 'approved' ? '#dcfce3' : '#fee2e2', color: app.status === 'approved' ? '#16a34a' : '#ef4444' }}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerificationModule;
