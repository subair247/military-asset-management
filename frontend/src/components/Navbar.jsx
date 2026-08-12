import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Shield } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-slate-900 text-white h-16 flex items-center justify-between px-6 border-b border-slate-800">
      <div className="flex items-center space-x-3">
        <Shield className="w-6 h-6 text-emerald-500" />
        <span className="font-bold text-lg tracking-wide uppercase">Military Asset Core</span>
      </div>
      {user && (
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-sm font-semibold">{user.username}</p>
            <p className="text-xs text-slate-400 font-mono">{user.role}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
};