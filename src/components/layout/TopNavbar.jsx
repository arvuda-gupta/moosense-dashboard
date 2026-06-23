import { Search, Menu, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';

export default function TopNavbar({ sidebarOpen, setSidebarOpen }) {
  const [isDark, setIsDark] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (location.pathname !== '/cows' && location.pathname !== '/devices') {
      navigate(`/cows?search=${encodeURIComponent(val)}`);
    } else {
      if (val) {
        setSearchParams({ search: val });
      } else {
        setSearchParams({});
      }
    }
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search devices, cows, or alerts..."
            className="w-full bg-muted/50 border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors relative"
          title={isDark ? "Light Mode" : "Dark Mode"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}