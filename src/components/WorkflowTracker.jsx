import { 
  Buildings, 
  User, 
  CheckCircle, 
  UsersThree, 
  FilePdf 
} from "@phosphor-icons/react";

const WorkflowTracker = ({ currentStep }) => {
  const steps = [
    {
      id: 1,
      title: "Learning Centre",
      desc: "Submits Signed Application Form",
      Icon: Buildings,
    },
    {
      id: 2,
      title: "Admin Team (Ms Indah)",
      desc: "Verifies Documents",
      Icon: User,
    },
    {
      id: 3,
      title: "All OK?",
      desc: "Forward to Programme Leaders",
      Icon: CheckCircle,
    },
    {
      id: 4,
      title: "Programme Leaders",
      desc: "Review & Approve Application",
      Icon: UsersThree,
    },
    {
      id: 5,
      title: "Distribution",
      desc: "Distribute 3 Copies of Approved Form",
      Icon: FilePdf,
    },
  ];

  return (
    <div className="workflow-stepper">
      <h3 className="section-title">Centre Tutor / Supervisor Appointment Portal</h3>
      <div className="steps-container">
        {steps.map((step, index) => {
          const isActive = currentStep >= step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className={`step-item ${isActive ? "active" : ""} ${isCurrent ? "current" : ""}`}>
              <div className="step-box">
                <div className="step-icon">
                  <step.Icon weight={isActive ? "fill" : "regular"} />
                </div>
                <div className="step-content">
                  <h4 className="step-title">{step.title}</h4>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </div>

              {/* Connector line for all but the last step */}
              {index < steps.length - 1 && (
                <div className="step-connector-arrow">
                  <div className="step-connector-shaft"></div>
                  <div className="step-connector-head"></div>
                </div>
              )}

              {/* PDF Distribution visuals for the last step */}
              {index === steps.length - 1 && (
                <div className="pdfs-container">
                  <div className="pdf-item">
                    <FilePdf weight="fill" className="pdf-icon" />
                    <span className="pdf-label">To Tutor</span>
                  </div>
                  <div className="pdf-item">
                    <FilePdf weight="fill" className="pdf-icon" />
                    <span className="pdf-label">To Learning Centre</span>
                  </div>
                  <div className="pdf-item">
                    <FilePdf weight="fill" className="pdf-icon" />
                    <span className="pdf-label">To Admin Team</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowTracker;
