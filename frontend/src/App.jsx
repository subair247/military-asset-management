import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Purchases } from './pages/Purchases';
import { Transfers } from './pages/Transfers';
import Assignments from './pages/Assignments';

const ProtectedLayout = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/purchases" element={<ProtectedLayout><Purchases /></ProtectedLayout>} />
      <Route path="/transfers" element={<ProtectedLayout><Transfers /></ProtectedLayout>} />
      <Route path="/assignments" element={<ProtectedLayout><Assignments /></ProtectedLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;