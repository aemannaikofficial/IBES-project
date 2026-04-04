import React, { useState } from 'react';
import { UserPlus, Trash, GraduationCap, EnvelopeSimple, UsersThree, ShieldCheck } from "@phosphor-icons/react";

const AdminLeaderManagement = ({ leaders, setLeaders }) => {
  const [newLeader, setNewLeader] = useState({
    name: "",
    email: "",
    programmes: []
  });
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const availableProgrammes = [
    "Doctor of Business Administration (DBA) Mixed Mode",
    "Doctor of Business Administration by (Research)",
    "Doctor of Education (EdD) Mixed Mode",
    "Doctor of Education (EdD) Research Mode",
    "Mastère TESOL",
    "Master of Business Administration",
    "Master of Education - M.Ed",
    "Bachelors of Arts(Hons) in Business Administration",
    "Bachelor of Arts in Education",
    "Bachelor of Science (Hons) in Computer Science"
  ];

  const handleToggleProgramme = (prog) => {
    setNewLeader(prev => ({
      ...prev,
      programmes: prev.programmes.includes(prog)
        ? prev.programmes.filter(p => p !== prog)
        : [...prev.programmes, prog]
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!newLeader.name || !newLeader.email || newLeader.programmes.length === 0) {
      alert("Please fill in all fields and assign at least one programme.");
      return;
    }

    if (leaders.some(l => l.email.toLowerCase() === newLeader.email.toLowerCase())) {
      alert("A Programme Leader with this email already exists.");
      return;
    }

    setLeaders(prev => [...prev, newLeader]);
    setNotification(`✅ ${newLeader.name} has been successfully registered.`);
    
    // Clear and hide form
    setNewLeader({ name: "", email: "", programmes: [] });
    setIsAdding(false);

    setTimeout(() => setNotification(""), 3000);
  };

  const handleDelete = (email) => {
    if (window.confirm("Are you sure you want to remove this Programme Leader?")) {
      setLeaders(prev => prev.filter(l => l.email !== email));
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 🏙️ Card Header Stats */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', backgroundColor: 'white', padding: isMobile ? '20px' : '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: 'var(--ibes-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <UsersThree size={28} weight="duotone" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: isMobile ? '18px' : '20px', fontWeight: '700', color: '#0f172a' }}>Academic Board</h2>
            {!isMobile && <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Registered Programme leaders and their authorizations.</p>}
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          style={{ width: isMobile ? '100%' : 'auto', backgroundColor: isAdding ? '#f1f5f9' : 'var(--ibes-navy)', color: isAdding ? '#475569' : 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', fontSize: '14px' }}
        >
          {isAdding ? "Cancel Registration" : <><UserPlus weight="bold" /> Register Leader</>}
        </button>
      </div>

      {notification && (
        <div className="fade-in" style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 20px', borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={20} /> {notification}
        </div>
      )}

      {/* 📝 Registration Form */}
      {isAdding && (
        <div className="fade-in" style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a' }}>
            <UserPlus size={24} color="var(--ibes-red)" /> Assign New Administrative Privileges
          </h3>
          
          <form onSubmit={handleRegister} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Leader Full Name & Title</label>
              <input 
                type="text" className="ibes-input" 
                value={newLeader.name} 
                onChange={(e) => setNewLeader(prev => ({...prev, name: e.target.value}))}
                placeholder="Dr. John Smith" 
                required 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Official Academic Email</label>
              <input 
                type="email" className="ibes-input" 
                value={newLeader.email} 
                onChange={(e) => setNewLeader(prev => ({...prev, email: e.target.value}))}
                placeholder="john.smith@ibesuni.fr" 
                required 
              />
            </div>
            
            <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Assign Authorized Programmes</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
                {availableProgrammes.map(prog => (
                  <label key={prog} style={{ 
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', 
                    borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer',
                    backgroundColor: newLeader.programmes.includes(prog) ? '#eff6ff' : 'white',
                    borderColor: newLeader.programmes.includes(prog) ? 'var(--ibes-navy)' : '#e2e8f0',
                    transition: 'all 0.2s', fontSize: '13px'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={newLeader.programmes.includes(prog)} 
                      onChange={() => handleToggleProgramme(prog)}
                      style={{ accentColor: 'var(--ibes-navy)' }}
                    />
                    {prog}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2', marginTop: '12px' }}>
              <button 
                type="submit" 
                style={{ width: '100%', backgroundColor: 'var(--ibes-navy)', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 31, 154, 0.2)' }}
              >
                Register & Authorize Leader
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📋 Leaders List */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#334155', fontWeight: '600' }}>Registered Personnel Ledger</h3>
        </div>
        
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '700px' : 'auto' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ padding: '16px 24px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Member Details</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Authorization Scope</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Management</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--ibes-red)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>
                        {leader.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px' }}>{leader.name}</div>
                        <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <EnvelopeSimple size={14} /> {leader.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {leader.programmes.slice(0, 2).map((p, i) => (
                        <span key={i} style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: '500' }}>
                          {p}
                        </span>
                      ))}
                      {leader.programmes.length > 2 && (
                        <span style={{ fontSize: '11px', color: 'var(--ibes-navy)', fontWeight: '600', alignSelf: 'center' }}>
                          +{leader.programmes.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDelete(leader.email)}
                      style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLeaderManagement;
