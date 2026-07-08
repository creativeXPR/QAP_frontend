import '../App.css';

function PrincipalDashboard() {
  return (
    <div className="app-container">
      {/* Top Navigation */}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="logo-placeholder">🛡️</div>
          <div className="brand-text">
            <h1>DIRECTORATE OF QUALITY ASSURANCE</h1>
            <p>Quality Assurance... doing the right things right every time.</p>
          </div>
        </div>
        <div className="nav-actions">
          <button className="btn-primary">
            <span>📊</span> Analyze Data
          </button>
          <button className="btn-ghost">
            <span>👤</span> Profile
          </button>
          <div className="badge-principal">
            <span className="dot"></span> Principal Officer
          </div>
        </div>
      </nav>

      <main className="dashboard-content">
        {/* Header Section */}
        <header className="page-header">
          <h2>Principal Officer Dashboard</h2>
          <p>Quality Assurance Performance Overview</p>
        </header>

        {/* Overview Cards */}
        <section className="overview-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="icon blue">📅</span> Total Submissions
            </div>
            <h3>1,247</h3>
            <p className="trend positive">+12.7% <span>vs last month</span></p>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="icon blue">📈</span> Completion Rate
            </div>
            <h3>87.3%</h3>
            <p className="trend positive">+5.7% <span>vs last month</span></p>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="icon blue">⏱️</span> Recent Updates
            </div>
            <h3>1,247</h3>
            <p className="trend positive">+12.7% <span>vs last month</span></p>
          </div>
        </section>

        {/* Key Performance Section */}
        <section className="performance-section">
          <div className="section-header">
            <h3>Key Performance</h3>
            <p>At-a-glance performance metrics and trends</p>
          </div>
          <div className="performance-grid">
            <div className="stat-card">
              <div className="card-top-row">
                <div className="icon-box green">🎓</div>
                <div className="status-badge green">↗ Improving</div>
              </div>
              <p className="metric-title">Submission Completion Rate</p>
              <h3>1,247</h3>
              <p className="trend positive">+0.3% <span>from previous period</span></p>
              <p className="metric-desc">Overall submission compliance</p>
            </div>
            <div className="stat-card">
              <div className="card-top-row">
                <div className="icon-box green">🎓</div>
                <div className="status-badge green">↗ Improving</div>
              </div>
              <p className="metric-title">Academic Evaluation Score</p>
              <h3>4.2/5.0</h3>
              <p className="trend positive">+0.3% <span>from previous period</span></p>
              <p className="metric-desc">Average academic quality rating</p>
            </div>
            <div className="stat-card">
              <div className="card-top-row">
                <div className="icon-box orange">🏢</div>
                <div className="status-badge orange">− Stable</div>
              </div>
              <p className="metric-title">Administrative Service Rating</p>
              <h3>3.8/5.0</h3>
              <p className="trend neutral">+0.0% <span>from previous period</span></p>
              <p className="metric-desc">Administrative efficiency score</p>
            </div>
            <div className="stat-card">
              <div className="card-top-row">
                <div className="icon-box red">📊</div>
                <div className="status-badge red">↘ Declining</div>
              </div>
              <p className="metric-title">Infrastructure Assessment Status</p>
              <h3>32.1%</h3>
              <p className="trend negative">-3.1% <span>from previous period</span></p>
              <p className="metric-desc">Administrative efficiency score</p>
            </div>
          </div>
        </section>

        {/* Data Filters & Controls */}
        <section className="filters-section">
          <h3 className="section-title"><span className="blue-icon">⚗️</span> Data Filters & Controls</h3>
          <div className="filters-grid">
            <div className="input-group">
              <label>Search Metrics</label>
              <div className="input-wrapper">
                <span>🔍</span>
                <input type="text" placeholder="Search Keywords..." />
              </div>
            </div>
            <div className="input-group">
              <label>📅 Search Keywords...</label>
              <select defaultValue="Last 30 Days">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>All Time</option>
              </select>
            </div>
            <div className="input-group">
              <label>Category Filter</label>
              <select defaultValue="All Categories">
                <option>All Categories</option>
                <option>Academic</option>
                <option>Administrative</option>
              </select>
            </div>
            <div className="input-group">
              <label>👥 Departments/Faculties</label>
              <select defaultValue="All Departments">
                <option>All Departments</option>
                <option>Computer Science</option>
                <option>Mathematics</option>
              </select>
            </div>
          </div>
          <div className="filter-actions">
            <button className="btn-outline">Reset Filters</button>
            <button className="btn-primary">Apply Filters</button>
          </div>
        </section>

        {/* Chart Section Placeholder */}
        <section className="chart-section">
          <div className="chart-header">
            <div>
              <h3 className="section-title"><span className="blue-icon">⚗️</span> Submissions by Faculties</h3>
              <p className="metric-desc">Distribution of quality assurance submissions across departments</p>
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot blue"></span> Total</span>
              <span className="legend-item"><span className="dot green"></span> Completed</span>
              <span className="legend-item"><span className="dot orange"></span> Pending</span>
            </div>
          </div>
          
          {/* Mock Chart Area */}
          <div className="mock-chart">
            <div className="y-axis">
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
            <div className="bars-container">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bar-group">
                  <div className="bar blue-bar" style={{ height: '80%' }}></div>
                  <div className="bar green-bar" style={{ height: '60%' }}></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PrincipalDashboard;
