
function Dashboard() {
  return (
    <section className="dashboard">
      <h2>Admin Dashboard</h2>
      <p>
        Overview of rainwater harvesting operations and pending work.
      </p>

      <div className="stats">
        <div className="stat-card">
          <p>Total Systems</p>
          <h2>24</h2>
        </div>

        <div className="stat-card">
          <p>Active Systems</p>
          <h2>19</h2>
        </div>

        <div className="stat-card">
          <p>Pending Inspections</p>
          <h2>4</h2>
        </div>

        <div className="stat-card">
          <p>Pending Maintenance</p>
          <h2>3</h2>
        </div>
      </div>

      <div className="tables">
        <section className="table-card">
          <h3>Recent Inspections</h3>
          <p>Review the latest inspection records.</p>

          <div className="table-row">
            <strong>SYSTEM</strong>
            <strong>DETAILS</strong>
            <strong>STATUS</strong>
          </div>

          <div className="table-row">
            <span>RWH-001</span>
            <span>Routine roof inspection</span>
            <span className="status completed">Completed</span>
          </div>

          <div className="table-row">
            <span>RWH-003</span>
            <span>Filter and inlet check</span>
            <span className="status pending">Pending</span>
          </div>
        </section>

        <section className="table-card">
          <h3>Maintenance Tasks</h3>
          <p>Track ongoing maintenance work.</p>

          <div className="table-row">
            <strong>TASK ID</strong>
            <strong>DETAILS</strong>
            <strong>STATUS</strong>
          </div>

          <div className="table-row">
            <span>MNT-001</span>
            <span>Replace first-flush valve</span>
            <span className="status progress">In Progress</span>
          </div>

          <div className="table-row">
            <span>MNT-002</span>
            <span>Clean sediment filter</span>
            <span className="status pending">Pending</span>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Dashboard;
