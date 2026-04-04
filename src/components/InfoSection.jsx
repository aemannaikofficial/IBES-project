const InfoSection = () => {
  return (
    <section className="info-section">
      <div className="info-block dates-block">
        <h4 className="info-title">Upcoming Application Deadlines</h4>
        <div className="info-cards">
          <div className="info-card">
            <p className="info-main">11 September 2026</p>
          </div>
          <div className="info-card">
            <p className="info-sub">Institut Britany d'Enseignement</p>
          </div>
        </div>
      </div>
      
      <div className="info-block details-block">
        <h4 className="info-title">Institut Britany d'Enseignement...</h4>
        <div className="info-lines">
          <p>Britany</p>
          <p>Department (IBES)</p>
          <p>Supérieur (IBES)</p>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
