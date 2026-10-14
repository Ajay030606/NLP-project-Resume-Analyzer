import { FileText, Home, Upload, BarChart3, Briefcase } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, backendStatus }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'upload', label: 'Resume Upload', icon: Upload },
    { id: 'dashboard', label: 'Analysis Dashboard', icon: BarChart3 },
    { id: 'recommendations', label: 'Job Recommendations', icon: Briefcase },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand" onClick={() => setActiveTab('home')}>
          <div className="brand-icon">
            <FileText size={20} />
          </div>
          <div>
            <span>ResumeAI</span>
            <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--gray-500)', fontWeight: 500 }}>
              NLP Mini Project
            </span>
          </div>
        </div>

        <div className="nav-links">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div
          className={`server-status ${
            backendStatus === 'online' ? 'status-online' : 'status-offline'
          }`}
          title={backendStatus === 'online' ? 'Flask Backend Connected' : 'Flask Backend Disconnected'}
        >
          <span className="status-dot"></span>
          <span>{backendStatus === 'online' ? 'Flask API Online' : 'Flask API Offline'}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
