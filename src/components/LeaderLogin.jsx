import React, { useState } from 'react';
import { LockKey, User, SignIn, ArrowLeft } from '@phosphor-icons/react';
import { validateAuth } from '../config/userRegistry';

const LeaderLogin = ({ onLogin, setActiveView, leaders }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 🔥 Using centralized auth registry
    const user = validateAuth('leader', email, password, leaders);

    if (user) {
      onLogin('leader', user.name);
    } else {
      setError('Invalid leader credentials. Please check your email and password.');
    }
  };

  return (
    <div className="login-wrapper fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top left, var(--ibes-red-light), #f8fafc)',
      padding: '24px' 
    }}>
      <button 
        onClick={() => setActiveView('landing')}
        style={{ marginBottom: '24px', background: 'none', border: 'none', color: 'var(--ibes-navy)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}
      >
        <ArrowLeft weight="bold" /> Back to Home
      </button>

      <div className="ibes-card" style={{ maxWidth: '440px', width: '100%', padding: '0', overflow: 'hidden', border: 'none' }}>
        {/* 🎓 Academic Branded Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--ibes-navy), var(--ibes-navy-dark))', 
          padding: '48px 32px', 
          color: 'white', 
          textAlign: 'center',
          position: 'relative' 
        }}>
          <div style={{ 
            width: '64px', 
            height: '4px', 
            background: 'var(--ibes-red)', 
            margin: '0 auto 24px auto',
            borderRadius: '2px'
          }}></div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', letterSpacing: '-0.5px', color: 'white' }}>IBES Portal</h1>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Academic Portal • Leader Access</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '40px 32px' }}>
          {error && (
            <div style={{ 
              backgroundColor: '#fef2f2', 
              color: 'var(--ibes-error)', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              fontSize: '14px', 
              marginBottom: '24px', 
              border: '1px solid rgba(217, 48, 37, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}>
              <span style={{ fontSize: '18px' }}>⚠️</span> {error}
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--ibes-text-light)', textTransform: 'uppercase' }}>Academic Email</label>
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ibes-navy)', opacity: 0.6 }} />
              <input
                type="email"
                className="ibes-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="leader@ibesuni.fr"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--ibes-text-light)', textTransform: 'uppercase' }}>Access Key</label>
            <div style={{ position: 'relative' }}>
              <LockKey size={20} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ibes-navy)', opacity: 0.6 }} />
              <input
                type="password"
                className="ibes-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-premium" style={{ 
            width: '100%', 
            height: '52px', 
            fontSize: '16px',
            backgroundColor: 'var(--ibes-navy)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            Secure Entry <SignIn size={20} weight="bold" />
          </button>
        </form>

        <div style={{ padding: '24px 32px', borderTop: '1px solid #f1f5f9', textAlign: 'center', backgroundColor: '#f8fafc' }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ibes-text-light)' }}>
            Administrative Staff? <button onClick={() => setActiveView('adminVerify')} style={{ background: 'none', border: 'none', color: 'var(--ibes-navy)', textDecoration: 'underline', cursor: 'pointer', fontWeight: '600', padding: 0 }}>Switch to Admin Hub</button>
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ibes-text-light)' }}>
            Authorized Academic Personnel Only.<br/>
            Access is monitored for security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaderLogin;
