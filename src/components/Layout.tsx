import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  MapPin, 
  PoundSterling,
  Waves
} from 'lucide-react';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Waves className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">Water Rats</h1>
                <p className="text-blue-100 text-sm">Session Tracker</p>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-2">
              <NavItem to="/" icon={<Home className="w-4 h-4" />} label="Dashboard" />
              <NavItem to="/sessions" icon={<Calendar className="w-4 h-4" />} label="Sessions" />
              {/* <NavItem to="/leaders" icon={<UserCheck className="w-4 h-4" />} label="leaders" /> */}
              <NavItem to="/destinations" icon={<MapPin className="w-4 h-4" />} label="Destinations" />
              <NavItem to="/finances" icon={<PoundSterling className="w-4 h-4" />} label="Finances" />
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <div className="grid grid-cols-4 gap-2">
              <NavItem to="/" icon={<Home className="w-5 h-5" />} label="Dashboard" mobile />
              <NavItem to="/sessions" icon={<Calendar className="w-5 h-5" />} label="Sessions" mobile />
              {/* <NavItem to="/leaders" icon={<UserCheck className="w-5 h-5" />} label="leaders" mobile /> */}
              <NavItem to="/destinations" icon={<MapPin className="w-5 h-5" />} label="Destinations" mobile />
              <NavItem to="/finances" icon={<PoundSterling className="w-5 h-5" />} label="Finances" mobile />
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  mobile?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, mobile }) => {
  const baseClasses = mobile 
    ? "flex flex-col items-center space-y-1 p-3 rounded-lg text-xs hover:bg-blue-700 transition-colors"
    : "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors";
    
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
      `${baseClasses} ${
        isActive ? 'bg-blue-700' : ''
      } transition-all duration-200`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export default Layout;