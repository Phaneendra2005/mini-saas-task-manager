import { useNavigate } from 'react-router-dom';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="border-b border-ink-700 bg-ink-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="#0a0a0f" />
              <rect x="8" y="1" width="5" height="5" rx="1" fill="#0a0a0f" opacity="0.5" />
              <rect x="1" y="8" width="5" height="5" rx="1" fill="#0a0a0f" opacity="0.5" />
              <rect x="8" y="8" width="5" height="5" rx="1" fill="#0a0a0f" />
            </svg>
          </div>
          <span
            className="font-display font-semibold text-lg tracking-tight"
            style={{ color: '#e8e8f0' }}
          >
            Taskly
          </span>
        </div>

        {/* User info + logout */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-xs font-mono text-gray-500 hidden sm:block truncate max-w-[180px]">
              {user.email}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-body font-medium text-gray-400
              hover:text-amber-400 transition-colors duration-200 px-3 py-1.5 rounded-lg
              hover:bg-ink-800 border border-transparent hover:border-ink-600"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
