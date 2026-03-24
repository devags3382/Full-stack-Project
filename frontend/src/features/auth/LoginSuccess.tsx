import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, type User } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const LoginSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        
        // Extract basic data (if role/name isn't in JWT, default it. In production, we'd fetch profile)
        const user: User = {
          id: decodedToken.id || 0,
          name: decodedToken.name || 'User',
          email: decodedToken.sub,
          role: decodedToken.role || 'ROLE_USER',
        };

        login(token, user);
        
        // Let's quickly fetch real profile to get proper ID and Name
        fetch('http://localhost:8080/api/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            login(token, { id: data.id, name: data.name, email: data.email, role: data.role });
            navigate('/dashboard');
        })
        .catch(() => {
            navigate('/dashboard');
        });

      } catch (err) {
        console.error('Invalid token', err);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [location, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-lg">Completing login...</span>
    </div>
  );
};

export default LoginSuccess;
