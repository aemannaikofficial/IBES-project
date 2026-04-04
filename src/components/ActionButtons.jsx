import { User, Pen } from "@phosphor-icons/react";

const ActionButtons = () => {
  return (
    <section className="action-buttons">
      <button className="btn btn-outline">
        <User weight="fill" className="btn-icon" />
        Leader Module
      </button>
      <button className="btn btn-outline">
        <Pen weight="fill" className="btn-icon" />
        Teacher Applicant Forms
      </button>
    </section>
  );
};

export default ActionButtons;
