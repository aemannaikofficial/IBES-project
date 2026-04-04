import { CaretRight, CaretLeft, SignOut } from "@phosphor-icons/react";

const Sidebar = ({ activeView, setActiveView, isLoggedIn, userRole, onLogout }) => {
  const isAdmin = userRole === 'admin';
  const isLeader = userRole === 'leader';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" style={{ padding: '0 20px 20px', backgroundColor: 'transparent' }}>
        <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <img src="https://ibesuni.fr/portal/assets/emails/ibes.jpg" alt="IBES Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {/* Portal Home (Always visible) */}
          <li className={`nav-item ${activeView === 'landing' ? 'active' : ''}`} onClick={() => setActiveView('landing')} style={{ cursor: 'pointer' }}>
            {activeView === 'landing' ? <CaretLeft weight="bold" /> : <CaretRight weight="bold" />}
            <a href="#" onClick={(e) => e.preventDefault()}>Portal Home</a>
          </li>

          {/* Dashboard (Admin/Public) */}
          {(!isLoggedIn || isAdmin) && (
            <li className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')} style={{ cursor: 'pointer' }}>
              {activeView === 'dashboard' ? <CaretLeft weight="bold" /> : <CaretRight weight="bold" />}
              <a href="#" onClick={(e) => e.preventDefault()}>Dashboard Stats</a>
            </li>
          )}

          {/* Admin Verification (Visible to Admin or Logged-out users) */}
          {(!isLoggedIn || isAdmin) && (
            <li className={`nav-item ${activeView === 'adminVerify' ? 'active' : ''}`} onClick={() => setActiveView('adminVerify')} style={{ cursor: 'pointer' }}>
              {activeView === 'adminVerify' ? <CaretLeft weight="bold" /> : <CaretRight weight="bold" />}
              <a href="#" onClick={(e) => e.preventDefault()}>Validation Queue</a>
            </li>
          )}

          {/* Concluded Files (Visible to Admin) */}
          {isAdmin && (
            <li className={`nav-item ${activeView === 'concluded' ? 'active' : ''}`} onClick={() => setActiveView('concluded')} style={{ cursor: 'pointer' }}>
              {activeView === 'concluded' ? <CaretLeft weight="bold" /> : <CaretRight weight="bold" />}
              <a href="#" onClick={(e) => e.preventDefault()}>Academic Archives</a>
            </li>
          )}

          {/* Programme Leader Review (Visible to Leaders, Admin, or Logged-out users) */}
          {(!isLoggedIn || isAdmin || isLeader) && (
            <li className={`nav-item ${activeView === 'programmeLeader' ? 'active' : ''}`} onClick={() => setActiveView('programmeLeader')} style={{ cursor: 'pointer' }}>
              {activeView === 'programmeLeader' ? <CaretLeft weight="bold" /> : <CaretRight weight="bold" />}
              <a href="#" onClick={(e) => e.preventDefault()}>{isLeader ? 'My Reviews' : 'Programme Leader Review'}</a>
            </li>
          )}

          {/* Global Admin Tools (Admin Only) */}
          {isAdmin && (
            <>
              <li className="nav-item">
                <CaretRight weight="bold" />
                <a href="#" onClick={(e) => e.preventDefault()}>Documents</a>
              </li>
              <li className="nav-item">
                <CaretRight weight="bold" />
                <a href="#" onClick={(e) => e.preventDefault()}>Administration</a>
              </li>
            </>
          )}
        </ul>
        
        <div className="sidebar-divider"></div>
        
        <ul>
          <li className="nav-item">
            <CaretRight weight="bold" />
            <a href="#" onClick={(e) => e.preventDefault()}>Profile</a>
          </li>
          {isLoggedIn && (
            <li className="nav-item" onClick={onLogout} style={{ cursor: 'pointer', color: '#d93025' }}>
              <SignOut weight="bold" />
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#d93025' }}>Logout</a>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
