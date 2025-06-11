import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const token = searchParams.get('token');
      
      if (token) {
        localStorage.setItem('token', token);
        
        // Get user data
        const userData = await authService.getCurrentUser();
        setUser(userData.user);
        
        toast.success('Successfully signed in with Google!');
        navigate('/dashboard');
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      toast.error('Authentication failed. Please try again.');
      navigate('/auth');
    }
  };

  return <LoadingSpinner />;
};

export default AuthCallback;