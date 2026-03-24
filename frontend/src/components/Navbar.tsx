import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white shadow-sm outline outline-1 outline-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="flex items-center text-blue-600 font-bold text-xl">
                <ShoppingBag className="w-6 h-6 mr-2" />
                BusyBrains
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/dashboard" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Dashboard
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center text-gray-500 hover:text-gray-700">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-2">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
                {user?.role === 'ROLE_ADMIN' && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    Admin
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
