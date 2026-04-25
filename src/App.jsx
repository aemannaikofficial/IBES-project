import { useState, useEffect } from "react";
import "./App.css";
import "./ApplicantForm.css";
import DashboardCards from "./components/DashboardCards";
import InfoSection from "./components/InfoSection";
import TeacherApplicantForm from "./components/TeacherApplicantForm";
import LeaderModuleForm from "./components/LeaderModuleForm";
import AdminVerificationModule from "./components/AdminVerificationModule";
import ProgrammeLeaderReview from "./components/ProgrammeLeaderReview";
import AdminLogin from "./components/AdminLogin";
import LeaderLogin from "./components/LeaderLogin";
import LandingPage from "./components/LandingPage";
import ApplicationChoice from "./components/ApplicationChoice";
import AdminLeaderManagement from "./components/AdminLeaderManagement";
import AdminFormSummary from "./components/AdminFormSummary";
import { LEADER_REGISTRY, DEFAULT_PROGRAMMES } from "./config/userRegistry";
import { CaretLeft, Bell, CheckCircle, ChartBar, Signature, EnvelopeSimple, SignOut, HouseLine, UsersThree, FileText, UserCircle, List, X, Briefcase } from "@phosphor-icons/react";
import ProgrammesList from "./components/ProgrammesList";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("ibes_admin_logged_in") === "true";
  });
  const [userRole, setUserRole] = useState(() => localStorage.getItem("ibes_user_role") || "");
  const [userName, setUserName] = useState(() => localStorage.getItem("ibes_user_name") || "");

  const [activeView, setActiveView] = useState("landing");
  const [applicantStep, setApplicantStep] = useState(0);

  const [adminNotifs, setAdminNotifs] = useState([]);
  const [showAdminNotifs, setShowAdminNotifs] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 1024;

  useEffect(() => {
    if (isLoggedIn && userRole === 'admin') {
      const fetchNotifs = () => {
        const notifKey = 'ibes_notif_admin';
        const stored = JSON.parse(localStorage.getItem(notifKey) || "[]");
        const unread = stored.filter(n => !n.read);
        setAdminNotifs(unread);
      };

      fetchNotifs();
      const interval = setInterval(fetchNotifs, 5000); 
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, userRole]);

  const dismissAdminNotif = (id) => {
    const notifKey = 'ibes_notif_admin';
    const stored = JSON.parse(localStorage.getItem(notifKey) || "[]");
    const updated = stored.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(notifKey, JSON.stringify(updated));
    setAdminNotifs(prev => prev.filter(n => n.id !== id));
  };

  const handleLogin = (role, name) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserName(name);
    localStorage.setItem("ibes_admin_logged_in", "true");
    localStorage.setItem("ibes_user_role", role);
    localStorage.setItem("ibes_user_name", name);

    if (role === 'leader') {
      setActiveView("programmeLeader");
    } else {
      setActiveView("adminVerify");
    }
  };

  const handleLogout = (redirectView) => {
    const view = typeof redirectView === 'string' ? redirectView : "adminVerify";
    setIsLoggedIn(false);
    setUserRole("");
    setUserName("");
    localStorage.removeItem("ibes_admin_logged_in");
    localStorage.removeItem("ibes_user_role");
    localStorage.removeItem("ibes_user_name");
    setActiveView(view);
  };

  const [applications, setApplications] = useState(() => {
    const savedApps = localStorage.getItem("ibes_apps");
    if (savedApps) {
      try { return JSON.parse(savedApps); } catch (e) { console.error("Parse failed", e); }
    }
    return [];
  });

  const [verifyAppId, setVerifyAppId] = useState(null);

  const [leaders, setLeaders] = useState(() => {
    const savedLeaders = localStorage.getItem("ibes_leaders");
    if (savedLeaders) {
      return JSON.parse(savedLeaders);
    }
    return LEADER_REGISTRY;
  });

  useEffect(() => {
    localStorage.setItem("ibes_leaders", JSON.stringify(leaders));
  }, [leaders]);

  const [programmes, setProgrammes] = useState(() => {
    const savedProgrammes = localStorage.getItem("ibes_programmes");
    if (savedProgrammes) {
      return JSON.parse(savedProgrammes);
    }
    return DEFAULT_PROGRAMMES;
  });

  useEffect(() => {
    localStorage.setItem("ibes_programmes", JSON.stringify(programmes));
  }, [programmes]);

  useEffect(() => {
    try {
      const serializableApps = applications.map(app => {
        const cleanApp = { ...app };
        for (const key in cleanApp) {
          if (cleanApp[key] instanceof File) {
            cleanApp[key] = { name: cleanApp[key].name, size: cleanApp[key].size, type: cleanApp[key].type, isFilePlaceholder: true };
          }
        }
        return cleanApp;
      });
      localStorage.setItem("ibes_apps", JSON.stringify(serializableApps));
    } catch (err) {
      console.error("Storage failed", err);
    }
  }, [applications]);

  const handleLoadSampleData = () => {
    const sampleData = [
      { id: 1, fullName: "John Doe", ibesprogrammes: "Doctor of Business Administration (DBA) Mixed Mode", status: "pending", currentStep: 2, dateSubmitted: "01/09/2026", applicationType: "Teacher" },
      { id: 2, fullName: "Jane Smith", ibesprogrammes: "Doctor of Education (EdD) Mixed Mode", status: "approved", currentStep: 4, dateSubmitted: "11/09/2026", applicationType: "Leader", assignedLeader: "Dr. Sarah Collins" },
      { id: 3, fullName: "Dr. Robert Wilson", ibesprogrammes: "Doctor of Education (EdD) Mixed Mode", status: "forwarded", currentStep: 3, dateSubmitted: "09/09/2026", applicationType: "Teacher", assignedLeader: "Dr. Alice Thompson" }
    ];
    setApplications(sampleData);
  };

  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    approved: applications.filter((app) => app.status === "approved").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
    submitted: applications.filter((app) => app.currentStep >= 2).length,
  };

  const handleFormSubmit = async (formData) => {
    const newApp = {
      id: Date.now(),
      ...formData,
      currentStep: 2,
      status: "pending",
      dateSubmitted: new Date().toLocaleDateString(),
    };
    setApplications((prev) => [...prev, newApp]);
    setApplicantStep(1);

    // 📩 Trigger Background Email Notifications
    try {
      const applicantEmail = formData.workEmail || formData.email || formData.personalEmail;
      
      const emailPromises = [];

      // 1. Notify Applicant
      if (applicantEmail) {
        emailPromises.push(
          fetch(`${import.meta.env.PROD ? '' : 'http://localhost:5000'}/api/notify-applicant`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              applicantName: formData.fullName || "Applicant", 
              applicantEmail: applicantEmail 
            })
          }).then(res => res.json()).then(data => console.log("Applicant Notify:", data))
        );
      } else {
        console.warn("No email found in formData. Applicant will not receive confirmation.");
      }

      // 2. Notify Admin
      emailPromises.push(
        fetch(`${import.meta.env.PROD ? '' : 'http://localhost:5000'}/api/notify-admin-new`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            applicantName: formData.fullName || "Unnamed", 
            applicationType: formData.applicationType || "General Form"
          })
        }).then(res => res.json()).then(data => console.log("Admin Notify:", data))
      );

      await Promise.allSettled(emailPromises);

    } catch (error) {
      console.error("Silent Error: Failed to dispatch background notifications:", error);
    }
  };

  // 🏛️ ADMIN Enterprise Layout Flag
  const isAdminConsole = isLoggedIn && userRole === 'admin' && 
    ['dashboard', 'adminVerify', 'manageLeaders', 'programmes', 'leaderFormsSummary', 'tutorFormsSummary'].includes(activeView);

  console.log("[DEBUG] App State:", { isLoggedIn, userRole, activeView, isAdminConsole, isMobile });

  return (
    <div className="app-container" style={{ backgroundColor: isAdminConsole ? '#f8fafc' : 'white', minHeight: '100vh' }}>
      
      {isAdminConsole ? (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
             {/* 🧭 Admin Left Sidebar */}
          <div style={{ 
            width: '280px', 
            backgroundColor: 'var(--ibes-navy)', 
            color: 'white', 
            display: 'flex', 
            flexDirection: 'column', 
            padding: '24px 20px', 
            boxShadow: '4px 0 24px rgba(0,0,0,0.1)', 
            zIndex: 100,
            position: isMobile ? 'fixed' : 'relative',
            height: '100vh',
            transition: 'transform 0.3s ease',
            transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
            left: 0,
            top: 0
          }}>
            
            <div style={{ marginBottom: '40px', backgroundColor: 'white', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', position: 'relative' }}>
              <img src="https://ibesuni.fr/portal/assets/emails/ibes.jpg" alt="IBES" style={{ height: '54px', width: 'auto', objectFit: 'contain' }} />
              {isMobile && (
                <button onClick={() => setIsSidebarOpen(false)} style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: 'var(--ibes-navy)', cursor: 'pointer' }}>
                  <X size={20} weight="bold" />
                </button>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', padding: '0 8px' }}>
                Central Administration
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  onClick={() => { setActiveView('dashboard'); if(isMobile) setIsSidebarOpen(false); }} 
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeView === 'dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '10px', border: 'none', color: activeView === 'dashboard' ? 'white' : '#94a3b8', cursor: 'pointer', textAlign: 'left', fontWeight: activeView === 'dashboard' ? '600' : '500', fontSize: '15px', transition: 'all 0.2s' }}
                >
                  <ChartBar size={20} color={activeView === 'dashboard' ? 'var(--ibes-red)' : 'currentColor'} weight={activeView === 'dashboard' ? 'fill' : 'regular'} /> Dashboard Overview
                </button>
                <button 
                  onClick={() => { setActiveView('adminVerify'); if(isMobile) setIsSidebarOpen(false); }} 
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeView === 'adminVerify' ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '10px', border: 'none', color: activeView === 'adminVerify' ? 'white' : '#94a3b8', cursor: 'pointer', textAlign: 'left', fontWeight: activeView === 'adminVerify' ? '600' : '500', fontSize: '15px', transition: 'all 0.2s' }}
                >
                  <Signature size={20} color={activeView === 'adminVerify' ? 'var(--ibes-red)' : 'currentColor'} weight={activeView === 'adminVerify' ? 'fill' : 'regular'} /> Validation Queue
                </button>

                <button 
                  onClick={() => { setActiveView('manageLeaders'); if(isMobile) setIsSidebarOpen(false); }} 
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeView === 'manageLeaders' ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '10px', border: 'none', color: activeView === 'manageLeaders' ? 'white' : '#94a3b8', cursor: 'pointer', textAlign: 'left', fontWeight: activeView === 'manageLeaders' ? '600' : '500', fontSize: '15px', transition: 'all 0.2s' }}
                >
                  <UsersThree size={20} color={activeView === 'manageLeaders' ? 'var(--ibes-red)' : 'currentColor'} weight={activeView === 'manageLeaders' ? 'fill' : 'regular'} /> Programme Leaders
                </button>

                <button 
                  onClick={() => { setActiveView('programmes'); if(isMobile) setIsSidebarOpen(false); }} 
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeView === 'programmes' ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '10px', border: 'none', color: activeView === 'programmes' ? 'white' : '#94a3b8', cursor: 'pointer', textAlign: 'left', fontWeight: activeView === 'programmes' ? '600' : '500', fontSize: '15px', transition: 'all 0.2s' }}
                >
                  <Briefcase size={20} color={activeView === 'programmes' ? 'var(--ibes-red)' : 'currentColor'} weight={activeView === 'programmes' ? 'fill' : 'regular'} /> Programmes
                </button>

                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '8px 0' }}></div>

                <button 
                  onClick={() => { setActiveView('leaderFormsSummary'); if(isMobile) setIsSidebarOpen(false); }} 
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeView === 'leaderFormsSummary' ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '10px', border: 'none', color: activeView === 'leaderFormsSummary' ? 'white' : '#94a3b8', cursor: 'pointer', textAlign: 'left', fontWeight: activeView === 'leaderFormsSummary' ? '600' : '500', fontSize: '15px', transition: 'all 0.2s' }}
                >
                  <FileText size={20} color={activeView === 'leaderFormsSummary' ? 'var(--ibes-red)' : 'currentColor'} weight={activeView === 'leaderFormsSummary' ? 'fill' : 'regular'} /> Leader Module form
                </button>

                <button 
                  onClick={() => { setActiveView('tutorFormsSummary'); if(isMobile) setIsSidebarOpen(false); }} 
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeView === 'tutorFormsSummary' ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '10px', border: 'none', color: activeView === 'tutorFormsSummary' ? 'white' : '#94a3b8', cursor: 'pointer', textAlign: 'left', fontWeight: activeView === 'tutorFormsSummary' ? '600' : '500', fontSize: '15px', transition: 'all 0.2s' }}
                >
                  <UserCircle size={20} color={activeView === 'tutorFormsSummary' ? 'var(--ibes-red)' : 'currentColor'} weight={activeView === 'tutorFormsSummary' ? 'fill' : 'regular'} /> Tutor/Supervisor form
                </button>

                <button 
                  onClick={() => { setActiveView('landing'); if(isMobile) setIsSidebarOpen(false); }} 
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'transparent', borderRadius: '10px', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', fontWeight: '500', fontSize: '15px', transition: 'all 0.2s' }}
                >
                  <HouseLine size={20} /> Back to Portal
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', padding: '0 8px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--ibes-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '18px' }}>
                  {userName ? userName.charAt(0) : "A"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '15px', color: 'white' }}>{userName || "System Admin"}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Superuser</p>
                </div>
              </div>
              <button 
                onClick={() => handleLogout('adminVerify')} 
                style={{ width: '100%', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', fontWeight: '600', transition: 'all 0.2s' }}
              >
                <SignOut size={18} weight="bold" /> Secure Logout
              </button>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            
            <header style={{ padding: isMobile ? '16px 20px' : '24px 40px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {isMobile && (
                  <button 
                    onClick={() => setIsSidebarOpen(true)}
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', height: '44px', width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <List size={24} weight="bold" color="var(--ibes-navy)" />
                  </button>
                )}
                <div>
                  <h1 style={{ margin: 0, fontSize: isMobile ? '18px' : '24px', color: '#0f172a', fontWeight: '700' }}>
                    {activeView === 'dashboard' ? 'Overview' : 
                      activeView === 'manageLeaders' ? 'Personnel' : 
                      activeView === 'programmes' ? 'Programmes' : 
                      activeView === 'leaderFormsSummary' ? 'Leader Module Forms' :
                     activeView === 'tutorFormsSummary' ? 'Tutor / Supervisor Forms' :
                     'Validation'}
                  </h1>
                  {!isMobile && (
                    <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                      {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
              
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowAdminNotifs(!showAdminNotifs)}
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', height: '48px', width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Bell size={24} weight="duotone" color="var(--ibes-navy)" />
                    {adminNotifs.length > 0 && (
                      <span style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#ef4444', color: 'white', fontSize: '11px', fontWeight: 'bold', minWidth: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid white' }}>
                        {adminNotifs.length}
                      </span>
                    )}
                  </div>
                </button>

                {showAdminNotifs && (
                  <div className="fade-in" style={{ position: 'absolute', right: 0, top: '60px', width: '380px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', zIndex: 1000, overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Leader Decisions</h4>
                      <button onClick={() => setShowAdminNotifs(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>✕</button>
                    </div>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {adminNotifs.length === 0 ? (
                        <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                          <EnvelopeSimple size={40} color="#cbd5e1" style={{ marginBottom: '12px' }} />
                          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: '500' }}>No fresh academic updates.</p>
                        </div>
                      ) : (
                        adminNotifs.map(n => (
                          <div key={n.id} style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', position: 'relative', backgroundColor: n.decision === 'approve' ? '#f0fdf4' : '#fef2f2' }}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '4px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: n.decision === 'approve' ? '#10b981' : '#ef4444', marginTop: '6px' }}></span>
                              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                {n.decision === 'approve' ? 'Module Assigned & Approved' : 'Application Rejected'}
                              </p>
                            </div>
                            <p style={{ margin: '0 0 2px 18px', fontSize: '13px', color: '#475569' }}><strong>Leader:</strong> {n.leaderName}</p>
                            <p style={{ margin: '0 0 2px 18px', fontSize: '13px', color: '#475569' }}><strong>Candidate:</strong> {n.applicantName}</p>
                            <p style={{ margin: '0 0 0 18px', fontSize: '11px', color: '#94a3b8' }}>{n.timestamp}</p>
                            <button onClick={() => dismissAdminNotif(n.id)} style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>✕</button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </header>

            <main style={{ flex: 1, padding: isMobile ? '20px' : '40px', overflowY: 'auto' }}>
              {isMobile && isSidebarOpen && (
                <div 
                  onClick={() => setIsSidebarOpen(false)}
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 90 }}
                />
              )}
              {/* Overall Dashboard View */}
              {activeView === 'dashboard' && (
                <div className="fade-in">
                  <DashboardCards stats={stats} applications={applications} />

                  <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden', marginTop: '32px' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                      <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Recent Registry Activity</h2>
                    </div>
                    {applications.length === 0 ? (
                      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                         <p style={{ color: '#64748b', marginBottom: '16px' }}>Database is empty.</p>
                         <button onClick={handleLoadSampleData} style={{ padding: '10px 20px', backgroundColor: 'var(--ibes-navy)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                           🔄 Populate Sample Data
                         </button>
                      </div>
                    ) : (
                      <div style={{ padding: '0 24px 24px 24px' }}>
                        <div style={{ display: 'flex', padding: '16px 20px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          <div style={{ flex: '1.5' }}>Applicant</div>
                          <div style={{ flex: '1' }}>Category</div>
                          <div style={{ flex: '1' }}>Date Submitted</div>
                          <div style={{ flex: '1', textAlign: 'right' }}>Current Status</div>
                        </div>
                        {applications.map((app) => (
                          <div key={app.id} style={{ display: 'flex', alignItems: 'center', padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ flex: '1.5', fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{app.fullName || "Unnamed"}</div>
                            <div style={{ flex: '1', color: '#475569', fontSize: '14px' }}>{app.applicationType || "General"}</div>
                            <div style={{ flex: '1', color: '#64748b', fontSize: '14px' }}>{app.dateSubmitted}</div>
                            <div style={{ flex: '1', textAlign: 'right' }}>
                              <span style={{ 
                                padding: '6px 12px', 
                                borderRadius: '20px', 
                                fontSize: '12px', 
                                fontWeight: '700', 
                                textTransform: 'uppercase',
                                backgroundColor: app.status === 'pending' ? '#fef3c7' : (app.status === 'rejected' ? '#fee2e2' : '#dcfce3'),
                                color: app.status === 'pending' ? '#d97706' : (app.status === 'rejected' ? '#ef4444' : '#16a34a')
                              }}>
                                {app.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: '32px' }}>
                     <InfoSection />
                  </div>
                </div>
              )}

              {/* Admin Verification Queue Content */}
              {activeView === 'adminVerify' && (
                <div className="fade-in" style={{ paddingBottom: '40px' }}>
                  <AdminVerificationModule
                    applications={applications}
                    setApplications={setApplications}
                    setActiveView={setActiveView}
                    userRole={userRole}
                    initialTab="new"
                    leaders={leaders}
                    verifyAppId={verifyAppId}
                    setVerifyAppId={setVerifyAppId}
                  />
                </div>
              )}

              {/* Specific Form Summaries */}
              {activeView === 'manageLeaders' && <AdminLeaderManagement leaders={leaders} setLeaders={setLeaders} programmes={programmes} />}
              {activeView === 'programmes' && <ProgrammesList leaders={leaders} setLeaders={setLeaders} programmes={programmes} setProgrammes={setProgrammes} />}
              {activeView === 'leaderFormsSummary' && <AdminFormSummary applications={applications} setApplications={setApplications} type="Leader Module" setActiveView={setActiveView} setVerifyAppId={setVerifyAppId} />}
              {activeView === 'tutorFormsSummary' && <AdminFormSummary applications={applications} setApplications={setApplications} type="Teacher Applicant" setActiveView={setActiveView} setVerifyAppId={setVerifyAppId} />}
            </main>
          </div>
        </div>
      ) : (
        /* 🌐 PUBLIC & NON-ADMIN VIEWS */
        <main className="full-width-content">
          {activeView === "landing" && (
            <LandingPage 
              setActiveView={setActiveView} 
              isLoggedIn={isLoggedIn} 
              userRole={userRole} 
            />
          )}
          {activeView === "applicationChoice" && <ApplicationChoice setActiveView={setActiveView} />}

          {/* Fallback routing for Admin unauthenticated */}
          {activeView === "adminVerify" && !isLoggedIn && (
            <AdminLogin onLogin={handleLogin} setActiveView={setActiveView} />
          )}

          {(activeView === "applicantForm" || activeView === "generalTutorForm") && (
            <div className="applicant-workflow-view fade-in">
              <div className="workflow-container">
                <div className="view-header">
                  <button className="back-btn" onClick={() => { setActiveView("applicationChoice"); setApplicantStep(0); }}>
                    <CaretLeft weight="bold" /> Back to Selection
                  </button>
                </div>
                {applicantStep === 0 ? (
                  <TeacherApplicantForm 
                    onSubmit={handleFormSubmit} 
                    leaders={leaders} 
                    isGeneral={activeView === "generalTutorForm"}
                    programmes={programmes}
                  />
                ) : (
                  <>
                    <div className="premium-form-container fade-in" style={{ padding: '60px 40px', textAlign: 'center' }}>
                      <div style={{ width: '80px', height: '80px', background: '#10b981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <CheckCircle weight="fill" size={48} />
                      </div>
                      <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#0f172a' }}>Submission Received</h1>
                      <p style={{ color: '#475569', fontSize: '16px', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                        The IBES Academic Board has received your Tutor/Supervisor application. Our admissions team will review your credentials and contact you via email shortly.
                      </p>
                      <button className="btn-premium btn-premium-primary" onClick={() => setApplicantStep(0)}>Submit Another Form</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeView === "leaderForm" && (
            <div className="applicant-workflow-view fade-in">
              <div className="workflow-container">
                <div className="view-header">
                  <button className="back-btn" onClick={() => { setActiveView("applicationChoice"); setApplicantStep(0); }}>
                    <CaretLeft weight="bold" /> Back to Selection
                  </button>
                </div>
                {applicantStep === 0 ? (
                  <LeaderModuleForm onSubmit={handleFormSubmit} programmes={programmes} />
                ) : (
                  <>
                    <div className="premium-form-container fade-in" style={{ padding: '60px 40px', textAlign: 'center' }}>
                      <div style={{ width: '80px', height: '80px', background: '#10b981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <CheckCircle weight="fill" size={48} />
                      </div>
                      <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#0f172a' }}>Response Recorded</h1>
                      <p style={{ color: '#475569', fontSize: '16px', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                        Your application for IBES Module Leader/Supervisor has been successfully submitted. You will be notified via the official registry once approval is granted.
                      </p>
                      <button className="btn-premium btn-premium-primary" onClick={() => setApplicantStep(0)}>New Submission</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {(activeView === "programmeLeader" || (activeView === "adminVerify" && isLoggedIn && userRole === "leader")) && (
            (isLoggedIn && userRole === "leader") ? (
              <ProgrammeLeaderReview
                applications={applications}
                setApplications={setApplications}
                setActiveView={setActiveView}
                userRole={userRole}
                userName={userName}
                handleLogout={handleLogout}
              />
            ) : (
              <LeaderLogin onLogin={handleLogin} setActiveView={setActiveView} leaders={leaders} />
            )
          )}
        </main>
      )}
    </div>
  );
}

export default App;
