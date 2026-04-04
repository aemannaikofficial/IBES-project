import { ClipboardText, HourglassMedium, CheckCircle, XCircle, GraduationCap, UserCircle } from "@phosphor-icons/react";

const StatPill = ({ label, value, color, bg }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    backgroundColor: bg,
    borderRadius: '8px',
    gap: '8px',
  }}>
    <span style={{ fontSize: '13px', color: '#5f6368', fontWeight: '500' }}>{label}</span>
    <span style={{ fontSize: '20px', fontWeight: '700', color }}>{value}</span>
  </div>
);

const FormBreakdownCard = ({ title, icon, iconColor, iconBg, applications, borderColor }) => {
  const total     = applications.length;
  const pending   = applications.filter(a => a.status === 'pending').length;
  const approved  = applications.filter(a => a.status === 'approved').length;
  const rejected  = applications.filter(a => a.status === 'rejected').length;
  const forwarded = applications.filter(a => a.currentStep === 3).length;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '14px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      border: `1px solid #e8eaed`,
      borderTop: `4px solid ${borderColor}`,
      overflow: 'hidden',
      flex: 1,
      minWidth: '280px',
    }}>
      {/* Card Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '20px 24px',
        borderBottom: '1px solid #f1f3f4',
        backgroundColor: '#fafafa',
      }}>
        <div style={{
          width: '44px', height: '44px',
          backgroundColor: iconBg,
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: iconColor, flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#202124' }}>{title}</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#5f6368' }}>{total} total submission{total !== 1 ? 's' : ''}</p>
        </div>
        <span style={{
          marginLeft: 'auto',
          fontSize: '28px',
          fontWeight: '800',
          color: borderColor,
          lineHeight: 1,
        }}>{total}</span>
      </div>

      {/* Stats Grid */}
      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <StatPill label="⏳ Pending Review"    value={pending}   color="var(--ibes-red)" bg="var(--ibes-red-light)" />
        <StatPill label="🔁 With Leader"       value={forwarded} color="var(--ibes-navy)" bg="#eef2ff" />
        <StatPill label="✅ Approved"           value={approved}  color="#10b981" bg="#ecfdf5" />
        <StatPill label="✕ Rejected"           value={rejected}  color="#ef4444" bg="#fef2f2" />
      </div>
    </div>
  );
};

const DashboardCards = ({ stats, applications = [] }) => {
  const teacherApps = applications.filter(a => a.applicationType === 'Teacher Applicant');
  const leaderApps  = applications.filter(a => a.applicationType === 'Leader Module');

  // Overall summary cards (top row)
  const overallCards = [
    { title: "Total Applications", value: stats.total,    icon: <ClipboardText size={26} />, color: "var(--ibes-navy)", bg: "#eef2ff" },
    { title: "Pending Review",     value: stats.pending,  icon: <HourglassMedium size={26} />, color: "var(--ibes-red)", bg: "var(--ibes-red-light)" },
    { title: "Approved",           value: stats.approved, icon: <CheckCircle size={26} />,  color: "#10b981", bg: "#ecfdf5" },
    { title: "Rejected",           value: stats.rejected || 0, icon: <XCircle size={26} />,   color: "#ef4444", bg: "#fef2f2" },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '32px' }}>

      {/* ── Overall Summary Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {overallCards.map((card, i) => (
          <div key={i} style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            border: '1px solid #e8eaed',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div style={{
              backgroundColor: card.bg,
              color: card.color,
              padding: '10px',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#202124', lineHeight: 1.1 }}>{card.value}</div>
              <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '2px' }}>{card.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Per-Form Breakdown ── */}
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Submissions by Form Type
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <FormBreakdownCard
            title="Tutor & Supervisor Form"
            icon={<UserCircle size={24} weight="duotone" />}
            iconColor="var(--ibes-navy)"
            iconBg="#eef2ff"
            borderColor="var(--ibes-navy)"
            applications={teacherApps}
          />
          <FormBreakdownCard
            title="Module Leader Form"
            icon={<GraduationCap size={24} weight="duotone" />}
            iconColor="var(--ibes-red)"
            iconBg="var(--ibes-red-light)"
            borderColor="var(--ibes-red)"
            applications={leaderApps}
          />
        </div>
      </div>

    </div>
  );
};

export default DashboardCards;
