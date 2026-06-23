import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PawPrint, 
  RadioTower
} from 'lucide-react';
import { cn } from '../../utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Cows', href: '/cows', icon: PawPrint },
  { name: 'Devices', href: '/devices', icon: RadioTower },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={cn(
        "flex flex-col h-full bg-card border-r border-border shrink-0 z-30",
        "fixed inset-y-0 left-0 w-64 -translate-x-full transition-transform duration-300 ease-in-out md:translate-x-0",
        "md:static md:transition-all md:duration-300",
        isOpen 
          ? "translate-x-0 w-64 md:w-64" 
          : "-translate-x-full md:w-20"
      )}>
        {/* Brand */}
        <div className="flex items-center h-16 px-6 border-b border-border shrink-0">
          <div className="flex items-center gap-2 font-bold text-xl text-primary tracking-tight">
            <PawPrint className="w-6 h-6 text-primary" />
            {isOpen && <span>MOOSense</span>}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-none">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsOpen(false);
                }
              }}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={!isOpen ? item.name : undefined}
            >
              <item.icon className={cn(
                "shrink-0",
                isOpen ? "w-5 h-5" : "w-6 h-6 mx-auto"
              )} />
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
