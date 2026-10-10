import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RotateCw } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <RotateCw className="w-6 h-6 animate-spin text-indigo-600 mb-3" />
        <span className="text-xs font-semibold text-slate-500">Checking authentication session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save target path so user returns here after login
    return <Navigate to="/auth" state={{ from: location.pathname + location.search }} replace />;
  }

  return <>{children}</>;
};
