import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import { registerServiceWorker, requestNotificationPermission } from './services/notifications';

import './App.css';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Register service worker and request notification permission
    registerServiceWorker();
    if (isAuthenticated) {
      requestNotificationPermission();
    }
  }, [isAuthenticated]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/" /> : <Auth />}
        />
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminPanel />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
