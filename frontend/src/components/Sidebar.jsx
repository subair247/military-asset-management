import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  ArrowLeftRight, 
  ClipboardList 
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Purchases', path: '/purchases', icon: ShoppingCart },
    { name: 'Transfers', path: '/transfers', icon: ArrowLeftRight },
    { name: 'Assignments', path: '/assignments', icon: ClipboardList },
  ];

  return (
    <aside style={{
      width: '240px',
      backgroundColor: '#0f172a',
      color: '#fff',
      minHeight: 'calc(100vh - 60px)',
      padding: '20px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              color: isActive ? '#ffffff' : '#94a3b8',
              backgroundColor: isActive ? '#059669' : 'transparent',
              transition: 'all 0.2s ease'
            })}
          >
            <Icon size={18} />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </aside>
  );
};

export default Sidebar;