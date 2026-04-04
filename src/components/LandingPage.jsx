import React from 'react';

const LandingPage = ({ setActiveView, isLoggedIn, userRole }) => {
  return (
    <div className="portal-index fade-in">
      {/* 🏙️ Branded Header */}
      <header className="portal-header">
        <div className="header-container">
          <div className="logo-section">
            <img src="https://ibesuni.fr/portal/assets/emails/ibes.jpg" alt="IBES Official Logo" className="official-logo" />
          </div>
          <div className="auth-section">
            <button className="login-trigger" onClick={() => {
              if (isLoggedIn) {
                setActiveView(userRole === 'admin' ? 'dashboard' : 'programmeLeader');
              } else {
                setActiveView('adminVerify');
              }
            }}>
              {isLoggedIn ? 'LOGIN' : 'LOGIN'}
            </button>
          </div>
        </div>
      </header>

      {/* 🏔️ Hero Section */}
      <section className="hero-landing" style={{ backgroundImage: 'url("/ibes-hero-bg.png")' }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-slogan-styled">
              <span className="brand-red">Developing</span> people with <span className="brand-red">skills</span> and <br />
              <span className="brand-red">knowledge</span> that equip them for current and <br />
              <span className="brand-red">future employment</span>
            </h1>
            
            <div className="hero-action">
              <button className="cta-application-btn" onClick={() => setActiveView('applicationChoice')}>
                APPLICATION FORM
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🏢 Sticky Footer (Optional Branded Index) */}
      <footer className="portal-footer">
        <p>Copyright © {new Date().getFullYear()} IBES - Institut Brittany d'Enseignement Supérieur. All rights reserved.</p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .portal-index {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          font-family: var(--font-main);
        }

        /* Header Styles */
        .portal-header {
          background: white;
          min-height: 100px;
          border-bottom: 3px solid var(--ibes-red);
          display: flex;
          align-items: center;
          z-index: 110;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }

        .header-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
        }

        .official-logo {
          height: 80px; /* Reduced for better balance */
          width: auto;
          display: block;
        }

        .login-trigger {
          background-color: #0021a5; /* IBES Official Navy */
          color: white;
          border: none;
          padding: 12px 36px;
          font-weight: 700;
          font-size: 15px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 1px;
          box-shadow: 0 4px 12px rgba(0, 33, 165, 0.2);
        }

        .login-trigger:hover {
          background-color: #001a84;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 33, 165, 0.3);
        }

        /* Hero Styles */
        .hero-landing {
          flex: 1;
          background-size: cover;
          background-position: center;
          position: relative;
          min-height: calc(100vh - 130px);
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5); /* Slightly darker for multiple buttons */
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .hero-content {
          text-align: center;
          max-width: 1100px;
        }

        .hero-slogan-styled {
          color: white;
          font-size: 52px;
          font-weight: 700;
          line-height: 1.25;
          margin-bottom: 50px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          font-family: var(--font-display);
        }

        .hero-slogan-styled .brand-red {
          color: var(--ibes-red); /* Official Red */
        }

        /* CTA Button Styles */
        .hero-action {
          display: flex;
          gap: 24px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-application-btn {
          background-color: #0021a5;
          color: white;
          border: 2px solid transparent;
          padding: 18px 40px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 1px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          text-transform: uppercase;
        }

        .cta-application-btn:hover {
          background-color: #001a84;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.4);
        }

        .cta-application-btn.gold-variant {
          background-color: #ffc107;
          color: #0021a5;
        }

        .cta-application-btn.gold-variant:hover {
          background-color: #f9bc06;
          box-shadow: 0 8px 25px rgba(255, 193, 7, 0.2);
        }

        /* Footer Styles */
        .portal-footer {
          background: #1a202c;
          color: rgba(255, 255, 255, 0.6);
          padding: 20px;
          text-align: center;
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .hero-slogan-styled { font-size: 38px; }
          .official-logo { height: 50px; }
        }

        @media (max-width: 768px) {
          .hero-slogan-styled { font-size: 28px; }
          .cta-application-btn { padding: 14px 40px; font-size: 16px; }
          .portal-header { padding: 10px 20px; }
        }
      ` }} />
    </div>
  );
};

export default LandingPage;
