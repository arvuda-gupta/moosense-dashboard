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

export default function Sidebar({ isOpen }) {
  return (
    <aside className={cn(
      "flex flex-col h-screen bg-card border-r border-border transition-all duration-300 z-20 shrink-0",
      isOpen ? "w-64" : "w-20"
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
  );
}
