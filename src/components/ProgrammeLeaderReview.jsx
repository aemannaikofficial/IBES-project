import React, { useState, useEffect } from 'react';
import { CaretLeft, CheckCircle, DownloadSimple, UserCheck, Bell, SignOut, DotsThree, Trash, EnvelopeSimple, ChartPie, ClipboardText, HourglassMedium, XCircle, ArrowRight, MagnifyingGlass, FileText, UserCircle } from '@phosphor-icons/react';
import { generateTutorApprovalPDFs } from '../utils/pdfGenerator';

const DataRow = ({ label, value }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '16px', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
    <div style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>{label}</div>
    <div style={{ color: '#0f172a', fontSize: '14px', fontWeight: '500' }}>{value || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>N/A</span>}</div>
  </div>
);

const ProgrammeLeaderReview = ({ applications, setApplications, userRole, userName, handleLogout }) => {
  const [viewingApp, setViewingApp] = useState(null);
  const [notification, setNotification] = useState("");
  const [inAppNotifs, setInAppNotifs] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  
  // 🧭 Local Navigation Hub
  const [activeTab, setActiveTab] = useState('queue'); // 'queue', 'leaderRegistry', 'tutorRegistry'
  const [registryFilter, setRegistryFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

  // Sync Unread notifications
  useEffect(() => {
    if (!userName) return;
    const notifKey = `ibes_notif_${userName}`;
    const stored = JSON.parse(localStorage.getItem(notifKey) || "[]");
    const unread = stored.filter(n => !n.read);
    setInAppNotifs(unread);
  }, [userName]);

  const dismissNotif = (id) => {
    const notifKey = `ibes_notif_${userName}`;
    const stored = JSON.parse(localStorage.getItem(notifKey) || "[]");
    const updated = stored.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(notifKey, JSON.stringify(updated));
    setInAppNotifs(prev => prev.filter(n => n.id !== id));
  };

  const handleDecision = async (decision) => {
    if (!viewingApp) return;

    setNotification(`📧 Processing your ${decision}...`);

    try {
      const response = await fetch(`${import.meta.env.PROD ? '' : 'http://localhost:5000'}/api/notify-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaderName: userName || "Programme Leader",
          applicantName: viewingApp.fullName,
          decision: decision
        })
      });

      if (!response.ok) throw new Error("Admin notification failed.");

      // 📄 Automated PDF Generation logic for Tutors
      if (decision === 'approve' && viewingApp.applicationType === 'Teacher Applicant') {
        setNotification(`📄 Generating Official Approval Copies...`);
        try {
          await generateTutorApprovalPDFs(viewingApp, userName);
          setNotification(`✅ Approved & 3 PDF Records Generated!`);
        } catch (pdfErr) {
          console.error("PDF Generation Error:", pdfErr);
          setNotification(`⚠️ Approved, but PDF generation failed. Check console.`);
        }
      } else {
        setNotification(`✅ Admin notified of your ${decision === 'approve' ? 'Approval' : 'Rejection'}!`);
      }

      // Store local notif for the admin
      const adminNotifKey = 'ibes_notif_admin';
      const existingAdminNotifs = JSON.parse(localStorage.getItem(adminNotifKey) || "[]");
      const newAdminNotif = {
        id: Date.now(),
        applicantName: viewingApp.fullName,
        leaderName: userName || "Programme Leader",
        decision: decision,
        timestamp: new Date().toLocaleString(),
        read: false
      };
      localStorage.setItem(adminNotifKey, JSON.stringify([...existingAdminNotifs, newAdminNotif]));

      setApplications((prev) =>
        prev.map((app) =>
          app.id === viewingApp.id
            ? { ...app, status: decision === 'approve' ? 'approved' : 'rejected', currentStep: 4 }
            : app
        )
      );

      setNotification(`✅ Admin notified of your ${decision === 'approve' ? 'Approval' : 'Rejection'}!`);
      setTimeout(() => { setViewingApp(null); setNotification(""); }, 2500);

    } catch (error) {
      console.error("Admin Notification Error:", error);
      setNotification(`⚠️ Saved local decision. Network notification failed.`);
      setApplications((prev) =>
        prev.map((app) => app.id === viewingApp.id ? { ...app, status: decision === 'approve' ? 'approved' : 'rejected', currentStep: 4 } : app)
      );
      setTimeout(() => { setViewingApp(null); setNotification(""); }, 3000);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("🗑️ Are you sure you want to permanently delete this application record? This action cannot be undone.")) {
      setApplications(prev => prev.filter(app => app.id !== id));
      setNotification("✅ Application record permanently removed.");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const renderFilePreview = (fileData) => {
    if (!fileData) return <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>No document provided</span>;
    const files = Array.isArray(fileData) ? fileData : [fileData];
    if (files.length === 0) return <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>No documents uploaded</span>;

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

  const pendingApps = applications.filter(app =>
    app.currentStep === 3 &&
    (userRole === 'admin' || app.assignedLeader === userName)
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      
      {/* 🧭 Left Sidebar (Navy/Slate Professional Theme) */}
      <div style={{ 
        width: '280px', 
        backgroundColor: 'var(--ibes-navy)', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '24px 20px',
        boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
        zIndex: 10
      }}>
        {/* Sidebar Logo */}
        <div style={{ marginBottom: '40px', backgroundColor: 'white', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <img src="https://ibesuni.fr/portal/assets/emails/ibes.jpg" alt="IBES" style={{ height: '54px', width: 'auto', objectFit: 'contain' }} />
        </div>

        {/* Navigation Wrapper */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', padding: '0 8px' }}>
            Academic Gateway
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => { setActiveTab('queue'); setViewingApp(null); }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
                backgroundColor: activeTab === 'queue' ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '10px', border: 'none', 
                color: activeTab === 'queue' ? 'white' : '#94a3b8', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'queue' ? '600' : '500', fontSize: '15px', transition: 'all 0.2s' 
              }}>
              <UserCheck size={20} color={activeTab === 'queue' ? 'var(--ibes-red)' : 'currentColor'} weight={activeTab === 'queue' ? 'fill' : 'regular'} /> Pending Reviews
            </button>

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '8px 0' }}></div>

            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', margin: '4px 0 8px 8px' }}>
              Academic Registries
            </div>

            <button 
              onClick={() => { setActiveTab('leaderForm'); setViewingApp(null); setRegistryFilter('all'); }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
                backgroundColor: activeTab === 'leaderForm' ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '10px', border: 'none', 
                color: activeTab === 'leaderForm' ? 'white' : '#94a3b8', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'leaderForm' ? '600' : '500', fontSize: '15px', transition: 'all 0.2s'
              }}>
              <CheckCircle size={20} color={activeTab === 'leaderForm' ? 'var(--ibes-red)' : 'currentColor'} weight={activeTab === 'leaderForm' ? 'fill' : 'regular'} /> Leader Module Form
            </button>
            <button 
              onClick={() => { setActiveTab('tutorForm'); setViewingApp(null); setRegistryFilter('all'); }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
                backgroundColor: activeTab === 'tutorForm' ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '10px', border: 'none', 
                color: activeTab === 'tutorForm' ? 'white' : '#94a3b8', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'tutorForm' ? '600' : '500', fontSize: '15px', transition: 'all 0.2s'
              }}>
              <EnvelopeSimple size={20} color={activeTab === 'tutorForm' ? 'var(--ibes-red)' : 'currentColor'} weight={activeTab === 'tutorForm' ? 'fill' : 'regular'} /> Tutor/Supervisor Form
            </button>
          </div>
        </div>

        {/* User Badge Profile Bottom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', padding: '0 8px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--ibes-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '18px' }}>
              {userName?.charAt(0) || "P"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '15px', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName || "Programme Leader"}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Academic Board</p>
            </div>
          </div>
          <button 
            onClick={() => handleLogout('programmeLeader')} 
            style={{ width: '100%', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', fontWeight: '600', transition: 'all 0.2s' }}
          >
            <SignOut size={18} weight="bold" /> Secure Logout
          </button>
        </div>
      </div>

      {/* 📄 Right Main Content Pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        
        {/* Top App Header */}
        <header style={{ padding: '24px 40px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#0f172a', fontWeight: '700' }}>
              {viewingApp ? "Application Analysis" : (
                activeTab === 'queue' ? "Academic Quality Assurance" : 
                (activeTab === 'leaderForm' ? "Leader Module Form" : "Tutor / Supervisor Form")
              )}
            </h1>
            <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifs(!showNotifs)}
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', height: '48px', width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Bell size={24} weight="duotone" color="var(--ibes-navy)" />
                {inAppNotifs.length > 0 && (
                  <span style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#ef4444', color: 'white', fontSize: '11px', fontWeight: 'bold', minWidth: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid white' }}>
                    {inAppNotifs.length}
                  </span>
                )}
              </div>
            </button>

            {showNotifs && (
              <div className="fade-in" style={{ position: 'absolute', right: 0, top: '60px', width: '380px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', zIndex: 1000, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Inbox Alerts</h4>
                  <button onClick={() => setShowNotifs(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>✕</button>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {inAppNotifs.length === 0 ? (
                    <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                      <EnvelopeSimple size={40} color="#cbd5e1" style={{ marginBottom: '12px' }} />
                      <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: '500' }}>You're all caught up!</p>
                    </div>
                  ) : (
                    inAppNotifs.map(n => (
                      <div key={n.id} style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', position: 'relative' }}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6', marginTop: '6px' }}></span>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Assigned by Administration</p>
                        </div>
                        <p style={{ margin: '0 0 2px 18px', fontSize: '13px', color: '#475569' }}>{n.applicantName}</p>
                        <p style={{ margin: '0 0 0 18px', fontSize: '11px', color: '#94a3b8' }}>{n.timestamp}</p>
                        <button onClick={() => dismissNotif(n.id)} style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>✕</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content Engine */}
        <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          
          {notification && (
            <div className="fade-in" style={{ backgroundColor: notification.includes('✅') ? '#ecfdf5' : '#fef2f2', color: notification.includes('✅') ? '#065f46' : '#991b1b', padding: '16px 24px', borderRadius: '12px', border: `1px solid ${notification.includes('✅') ? '#a7f3d0' : '#fecaca'}`, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600' }}>
              {notification}
            </div>
          )}

          {!viewingApp ? (
            /* 📥 QUEUE VIEW OR REGISTRY VIEWS */
            <div className="fade-in">
              
              {activeTab === 'queue' ? (
                /* 📨 PENDING QUALITY QUEUE */
                <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                  <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Pending Academic Quality Reviews</h2>
                  </div>
                  
                  {pendingApps.length === 0 ? (
                    <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '40px', backgroundColor: '#f1f5f9', color: '#94a3b8', marginBottom: '24px' }}>
                        <CheckCircle size={40} weight="duotone" />
                      </div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#334155' }}>Queue clear</h3>
                      <p style={{ margin: 0, color: '#64748b' }}>No applications currently awaiting your rigorous academic review.</p>
                    </div>
                  ) : (
                    <div style={{ padding: '0 24px 24px 24px' }}>
                      <div style={{ display: 'flex', padding: '16px 20px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <div style={{ flex: '1.5' }}>Applicant Target</div>
                        <div style={{ flex: '2' }}>Pathway Programme</div>
                        <div style={{ flex: '1', textAlign: 'right' }}>Action</div>
                      </div>
                      {pendingApps.map(app => (
                        <div key={app.id} style={{ display: 'flex', alignItems: 'center', padding: '20px', borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                          <div style={{ flex: '1.5' }}>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#0f172a', fontWeight: '600' }}>{app.fullName || 'Unnamed'}</h4>
                            <span style={{ fontSize: '12px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: '500' }}>{app.applicationType || 'General'}</span>
                          </div>
                          <div style={{ flex: '2', color: '#475569', fontSize: '14px', paddingRight: '16px' }}>{app.ibesprogrammes || app.ibesProgrammes || "Not Specified"}</div>
                          <div style={{ flex: '1', textAlign: 'right' }}>
                            <button onClick={() => setViewingApp(app)} style={{ backgroundColor: 'white', border: '1px solid #cbd5e1', color: 'var(--ibes-navy)', padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Review File</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* 📊 FORMS ANALYTICS VIEW */
                <RegistryManagementView 
                  type={activeTab === 'leaderForm' ? "Leader Module" : "Teacher Applicant"} 
                  applications={applications}
                  registryFilter={registryFilter}
                  setRegistryFilter={setRegistryFilter}
                  setViewingApp={setViewingApp}
                  handleDelete={handleDelete}
                  userName={userName}
                />
              )}
            </div>
          ) : (
            /* 🔍 DETAIL REVIEW VIEW */
            <div className="fade-in">
              <button 
                onClick={() => setViewingApp(null)} 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer', marginBottom: '24px', transition: 'all 0.2s', fontSize: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc' }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
              >
                <CaretLeft weight="bold" /> Back to Queue
              </button>

              <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden', paddingBottom: '24px' }}>
                
                {/* Profile Header */}
                <div style={{ padding: '32px 40px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', position: 'relative' }}>
                   <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', backgroundColor: 'var(--ibes-red)' }}></div>
                   <div style={{ display: 'inline-block', backgroundColor: 'var(--ibes-navy)', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                    {viewingApp.applicationType || "General Document"}
                  </div>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a', fontWeight: '800' }}>{viewingApp.fullName || "Applicant"}</h2>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>Awaiting explicit final approval from assigned Module Leader.</p>
                </div>

                <div style={{ padding: '0 40px' }}>
                  
                  {/* Summary Block */}
                  <div style={{ marginTop: '32px', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '16px', color: '#0f172a', fontWeight: '700', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '8px' }}>Application Snapshot</h3>
                    <DataRow label="Target Programme" value={viewingApp.ibesprogrammes || viewingApp.ibesProgrammes} />
                    <DataRow label="Target Module(s)" value={viewingApp.ibesModules} />
                    <DataRow label="Current Occupation" value={viewingApp.occupation} />
                    <DataRow label="Employer" value={viewingApp.employer} />
                  </div>

                  {/* Documents Block */}
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '16px', color: '#0f172a', fontWeight: '700', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>Document Vault</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                       <div>
                         <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Curriculum Vitae / Resume</p>
                         {renderFilePreview(viewingApp.resumeCV)}
                       </div>
                       <div>
                         <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Academic Transcripts & Certificates</p>
                         {renderFilePreview(viewingApp.transcripts)}
                       </div>
                    </div>
                  </div>

                  {/* Text Evidence Block */}
                  <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '16px', color: '#0f172a', fontWeight: '700', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>Written Evidence</h3>
                    <div style={{ display: 'grid', gap: '24px' }}>
                      <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1e293b' }}>Teaching & Assessing Experience</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>{viewingApp.teachingEvidence || viewingApp.researchEvidence || "No evidence written in form."}</p>
                      </div>
                      <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1e293b' }}>Employment History</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{viewingApp.employmentHistory || "Not detailed."}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Tray */}
                  <div style={{ backgroundColor: '#f1f5f9', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#0f172a' }}>Final Adjudication</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Your decision will be recorded and sent to Central Admin.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <button 
                        onClick={() => handleDecision('reject')}
                        style={{ padding: '12px 24px', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', fontWeight: '700', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        ✕ Reject Application
                      </button>
                      <button 
                        onClick={() => handleDecision('approve')}
                        style={{ padding: '12px 24px', backgroundColor: '#10b981', border: 'none', color: 'white', fontWeight: '700', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#059669'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#10b981'; }}
                      >
                        ✓ Approve Application
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </main>
      </div>

    </div>
  );
};

// 🏛️ Registry Management Engine (Leader Portal Edition)
const RegistryManagementView = ({ type, applications, registryFilter, setRegistryFilter, setViewingApp, handleDelete, userName }) => {
  const filteredApps = applications.filter(app => 
    app.applicationType === type && 
    (app.assignedLeader === userName || !app.assignedLeader) // Leader see their own or unassigned modules
  );
  
  const total = filteredApps.length;
  const pendingCount = filteredApps.filter(app => app.status === 'pending').length;
  const rejectedCount = filteredApps.filter(app => app.status === 'rejected').length;
  const approvedCount = filteredApps.filter(app => app.status === 'approved').length;

  const displayApps = filteredApps.filter(app => {
    if (registryFilter === 'all') return true;
    return app.status === registryFilter;
  });

  const cardStyle = (filter) => ({
    backgroundColor: 'white',
    padding: '14px 18px',
    borderRadius: '12px',
    border: '1px solid',
    borderColor: registryFilter === filter ? 'var(--ibes-red)' : '#e2e8f0',
    boxShadow: registryFilter === filter ? '0 6px 14px rgba(0,0,0,0.07)' : '0 1px 3px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    transform: registryFilter === filter ? 'translateY(-2px)' : 'none'
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 📊 Statistical Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px' }}>
        <div onClick={() => setRegistryFilter('all')} style={cardStyle('all')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#64748b', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TOTAL</span>
            <ClipboardText size={16} color="var(--ibes-navy)" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{total}</div>
        </div>

        <div onClick={() => setRegistryFilter('pending')} style={cardStyle('pending')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#b45309', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PENDING</span>
            <HourglassMedium size={16} color="#b45309" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{pendingCount}</div>
        </div>

        <div onClick={() => setRegistryFilter('approved')} style={cardStyle('approved')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#15803d', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>APPROVED</span>
            <CheckCircle size={16} color="#15803d" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{approvedCount}</div>
        </div>

        <div onClick={() => setRegistryFilter('rejected')} style={cardStyle('rejected')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#b91c1c', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>REJECTED</span>
            <XCircle size={16} color="#b91c1c" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{rejectedCount}</div>
        </div>
      </div>

      {/* 📋 Registry Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: '700' }}>
            {registryFilter === 'all' ? `All ${type} Forms` : `${registryFilter.toUpperCase()} ${type} Forms`}
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{displayApps.length} Results Found</span>
        </div>

        {displayApps.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <MagnifyingGlass size={48} color="#e2e8f0" style={{ marginBottom: '16px' }} />
            <p style={{ margin: 0, color: '#94a3b8' }}>No records match your current filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', backgroundColor: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                  <th style={{ padding: '16px 24px', fontSize: '11px', color: '#64748b' }}>NAME / PROFILE</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', color: '#64748b' }}>STATUS</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', color: '#64748b', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {displayApps.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{app.fullName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{app.dateSubmitted}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
                        backgroundColor: app.status === 'pending' ? '#fffbeb' : (app.status === 'rejected' ? '#fef2f2' : '#f0fdf4'),
                        color: app.status === 'pending' ? '#b45309' : (app.status === 'rejected' ? '#b91c1c' : '#15803d'),
                        border: '1px solid currentColor'
                      }}>{app.status}</span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setViewingApp(app)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>View</button>
                        <button onClick={() => handleDelete(app.id)} style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgrammeLeaderReview;
