import React from 'react';
import { UserCircle, GraduationCap, ArrowLeft } from "@phosphor-icons/react";

const ApplicationChoice = ({ setActiveView }) => {
  return (
    <div className="choice-container fade-in">
      <div className="choice-header">
        <button className="back-to-home" onClick={() => setActiveView('landing')}>
          <ArrowLeft weight="bold" /> Back to Home
        </button>
      </div>
      
      <div className="choice-content">
        <h1 className="choice-title">Select Application Type</h1>
        <p className="choice-subtitle">Choose the role you are applying for to proceed with the official registration.</p>
        
        <div className="choice-grid">
          <div className="choice-card clickable" onClick={() => setActiveView('applicantForm')}>
            <div className="choice-icon blue">
              <UserCircle weight="duotone" size={64} />
            </div>
            <h3>Tutor / Supervisor</h3>
            <p>Approved Centre Appointment Application</p>
            <div className="choice-btn">Select Role</div>
          </div>

          <div className="choice-card clickable" onClick={() => setActiveView('leaderForm')}>
            <div className="choice-icon red">
              <GraduationCap weight="duotone" size={64} />
            </div>
            <h3>Module Leader</h3>
            <p>Supervisor / Academic Appointment Application</p>
            <div className="choice-btn red-btn">Select Role</div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .choice-container {
          min-height: 100vh;
          background: #f8fafc;
          padding: 40px;
          display: flex;
          flex-direction: column;
        }

        .back-to-home {
          background: none;
          border: none;
          color: var(--ibes-navy);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: var(--transition);
        }

        .back-to-home:hover { opacity: 0.7; }

        .choice-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          max-width: 1000px;
          margin: 0 auto;
        }

        .choice-title {
          font-family: var(--font-display);
          font-size: 36px;
          color: var(--ibes-navy-dark);
          margin-bottom: 12px;
        }

        .choice-subtitle {
          color: var(--ibes-text-light);
          font-size: 18px;
          margin-bottom: 48px;
        }

        .choice-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          width: 100%;
        }

        .choice-card {
          background: white;
          padding: 48px 32px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .choice-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0, 31, 154, 0.1);
          border-color: var(--ibes-red);
        }

        .choice-icon {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .choice-icon.blue { background: #eff6ff; color: #1e40af; }
        .choice-icon.red { background: var(--ibes-red-light); color: var(--ibes-red); }

        .choice-card h3 {
          font-family: var(--font-display);
          font-size: 24px;
          margin-bottom: 8px;
          color: var(--ibes-navy-dark);
        }

        .choice-card p {
          color: var(--ibes-text-light);
          margin-bottom: 32px;
          font-size: 15px;
        }

        .choice-btn {
          background: var(--ibes-navy);
          color: white;
          padding: 12px 32px;
          border-radius: 8px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 14px;
        }

        .choice-btn.red-btn {
          background: var(--ibes-red);
          color: white;
        }

        @media (max-width: 768px) {
          .choice-grid { grid-template-columns: 1fr; }
          .choice-container { padding: 20px; }
        }
      ` }} />
    </div>
  );
};

export default ApplicationChoice;
