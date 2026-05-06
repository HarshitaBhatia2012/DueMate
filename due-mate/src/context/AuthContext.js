import React, { createContext, useContext } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { isLoaded: isAuthLoaded, isSignedIn, signOut } = useClerkAuth();
  const { isLoaded: isUserLoaded, user } = useUser();

  const loading = !isAuthLoaded || !isUserLoaded;

  const login = async () => {
    window.location.href = '/login';
  };

  const register = async () => {
    window.location.href = '/signup';
  };

  const logout = async () => {
    await signOut();
  };

  const value = {
    isAuthenticated: isSignedIn,
    user: user ? {
      username: user.username || user.firstName || 'User',
      email: user.primaryEmailAddress?.emailAddress,
      avatar: user.imageUrl,
      ...user
    } : null,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
