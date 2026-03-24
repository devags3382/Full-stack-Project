import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './features/auth/Login';
import LoginSuccess from './features/auth/LoginSuccess';
import Dashboard from './features/products/Dashboard';
import Profile from './features/profile/Profile';
import Navbar from './components/Navbar';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {isAuthenticated && <Navbar />}
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/login-success" element={<LoginSuccess />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Fallback to dashboard or login */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
