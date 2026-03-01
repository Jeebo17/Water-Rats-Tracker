import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  UserCheck,
  LogOut
} from 'lucide-react';
import Logo from '../assets/WaterRatsBadge.png'
import { logout } from '../util/auth';

interface HeaderProps {
  Public?: boolean;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ Public, children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center space-x-3">
              <img src={Logo} alt="Water Rats Logo" className="w-10 h-10 md:w-12 md:h-12" />
              <div>
                <h1 className="text-lg md:text-xl font-bold">Water Rats</h1>
                {!Public && <p className="text-blue-100 text-xs md:text-sm hidden md:block">Session Tracker</p>}
              </div>
            </div>
            
            {!Public && (
              <div className="hidden md:flex space-x-2">
                <NavItem to="/" icon={<Home className="w-4 h-4" />} label="Dashboard" />
                <NavItem to="/sessions" icon={<Calendar className="w-4 h-4" />} label="Sessions" />
                <NavItem to="/leaders" icon={<UserCheck className="w-4 h-4" />} label="Leaders" />
                <div onClick={logout} className="cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-lg text-sm bg-cyan-700 hover:bg-red-500 transition-colors">
                  <LogOut className="w-4 h-4" />
                </div>
              </div>
            )}

            {/* Mobile logout */}
            {!Public && (
              <div onClick={logout} className="md:hidden cursor-pointer flex justify-center items-center p-2 rounded-lg text-sm bg-cyan-700 hover:bg-red-500 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-4 md:py-6 pb-20 md:pb-6">
        {children ?? <Outlet />}
      </main>

      {/* Mobile bottom navigation */}
      {!Public && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
          <div className="flex justify-around items-center h-14">
            <BottomNavItem to="/" icon={<Home className="w-5 h-5" />} label="Dashboard" />
            <BottomNavItem to="/sessions" icon={<Calendar className="w-5 h-5" />} label="Sessions" />
            <BottomNavItem to="/leaders" icon={<UserCheck className="w-5 h-5" />} label="Leaders" />
          </div>
        </div>
      )}
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

const BottomNavItem: React.FC<Omit<NavItemProps, 'mobile'>> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center py-1 px-3 text-xs transition-colors ${
          isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
        }`
      }
    >
      {icon}
      <span className="mt-0.5">{label}</span>
    </NavLink>
  );
};

export default Header;