import React, { useState } from 'react';
import { ChartPie, HourglassMedium, XCircle, CheckCircle, ClipboardText, FileText, UserCircle, ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";

const AdminFormSummary = ({ applications, type }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filteredApps = applications.filter(app => app.applicationType === type);
  
  const total = filteredApps.length;
  const pendingCount = filteredApps.filter(app => app.status === 'pending').length;
  const rejectedCount = filteredApps.filter(app => app.status === 'rejected').length;
  const approvedCount = filteredApps.filter(app => app.status === 'approved').length;

  const displayApps = filteredApps.filter(app => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return app.status === 'pending';
    if (activeFilter === 'rejected') return app.status === 'rejected';
    if (activeFilter === 'approved') return app.status === 'approved';
    return true;
  });

  const isLeader = type === "Leader Module";

  const cardStyle = (filter) => ({
    backgroundColor: 'white',
    padding: '16px 20px',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    boxShadow: activeFilter === filter ? '0 6px 16px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: activeFilter === filter ? 'translateY(-3px)' : 'none',
    borderColor: activeFilter === filter ? 'var(--ibes-navy)' : '#e2e8f0'
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 🏷️ Page Header */}
      <div style={{ backgroundColor: 'white', padding: '24px 32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: isLeader ? 'rgba(231, 1, 57, 0.1)' : '#eff6ff', color: isLeader ? 'var(--ibes-red)' : 'var(--ibes-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isLeader ? <FileText size={28} /> : <UserCircle size={28} />}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{type} Analytics</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Interactive submission report for {type.toLowerCase()} registry.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
           <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>Official Registry Content</span>
           {activeFilter !== 'all' && (
             <button 
               onClick={() => setActiveFilter('all')}
               style={{ background: 'none', border: 'none', color: 'var(--ibes-red)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
             >
               Clear Filters
             </button>
           )}
        </div>
      </div>

      {/* 📊 Interactive Statistical Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        
        {/* Total Card */}
        <div onClick={() => setActiveFilter('all')} style={cardStyle('all')}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', backgroundColor: 'var(--ibes-navy)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</span>
            <ClipboardText size={18} color="var(--ibes-navy)" weight={activeFilter === 'all' ? "fill" : "duotone"} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{total}</div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '11px' }}>View all submissions.</p>
        </div>

        {/* Pending Card */}
        <div onClick={() => setActiveFilter('pending')} style={cardStyle('pending')}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', backgroundColor: 'var(--ibes-red)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#b45309', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending</span>
            <HourglassMedium size={18} color="var(--ibes-red)" weight={activeFilter === 'pending' ? "fill" : "duotone"} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{pendingCount}</div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '11px' }}>View pending files.</p>
        </div>

        {/* Approved Card */}
        <div onClick={() => setActiveFilter('approved')} style={cardStyle('approved')}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', backgroundColor: '#10b981' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#065f46', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Approved</span>
            <CheckCircle size={18} color="#10b981" weight={activeFilter === 'approved' ? "fill" : "duotone"} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{approvedCount}</div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '11px' }}>View approved files.</p>
        </div>

        {/* Rejected Card */}
        <div onClick={() => setActiveFilter('rejected')} style={cardStyle('rejected')}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', backgroundColor: '#64748b' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#475569', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rejected</span>
            <XCircle size={18} color="#64748b" weight={activeFilter === 'rejected' ? "fill" : "duotone"} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{rejectedCount}</div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '11px' }}>View rejected files.</p>
        </div>

      </div>

      {/* 📋 Detailed Breakdown Area */}
      <div className="fade-in" style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ArrowRight size={20} color="var(--ibes-red)" />
            {activeFilter === 'all' ? 'Complete Form Registry' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Applications`}
          </h3>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
            Showing {displayApps.length} results
          </div>
        </div>

        {displayApps.length === 0 ? (
          <div style={{ padding: '80px 40px', textAlign: 'center' }}>
            <MagnifyingGlass size={60} color="#e2e8f0" style={{ marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px 0', color: '#64748b' }}>No Matching Records</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>There are currently no records matching this specific filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ textAlign: 'left', backgroundColor: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                  <th style={{ padding: '16px 32px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name / Profile</th>
                  <th style={{ padding: '16px 32px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Submission Date</th>
                  <th style={{ padding: '16px 32px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Status</th>
                  <th style={{ padding: '16px 32px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Identity</th>
                </tr>
              </thead>
              <tbody>
                {displayApps.map((app, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s', backgroundColor: idx % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '16px 32px' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>{app.fullName}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{app.ibesprogrammes || "Special Entry"}</div>
                    </td>
                    <td style={{ padding: '16px 32px', fontSize: '14px', color: '#475569' }}>
                      {app.dateSubmitted}
                    </td>
                    <td style={{ padding: '16px 32px' }}>
                      <span style={{ 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        fontSize: '11px', 
                        fontWeight: '800', 
                        textTransform: 'uppercase',
                        backgroundColor: app.status === 'pending' ? '#fffbeb' : (app.status === 'rejected' ? '#fef2f2' : '#f0fdf4'),
                        color: app.status === 'pending' ? '#b45309' : (app.status === 'rejected' ? '#b91c1c' : '#15803d'),
                        border: '1px solid',
                        borderColor: app.status === 'pending' ? '#fde68a' : (app.status === 'rejected' ? '#fecaca' : '#bbf7d0')
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 32px', textAlign: 'right', fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                      ID: {app.id.toString().slice(-6)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 📊 Additional Visualization Hint */}
      <div style={{ backgroundColor: '#f8fafc', padding: '40px', borderRadius: '20px', border: '2px dashed #e2e8f0', textAlign: 'center' }}>
        <ChartPie size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
        <h4 style={{ margin: '0 0 8px 0', color: '#475569' }}>Decision Analytics</h4>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
          {approvedCount} applications ({total > 0 ? Math.round((approvedCount/total)*100) : 0}%) have successfully cleared the academic verification phase.
        </p>
      </div>

    </div>
  );
};

export default AdminFormSummary;
