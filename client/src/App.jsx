import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AgencyDashboard from './pages/Dashboards/AgencyDashboard';
import CustomerDashboard from './pages/Dashboards/CustomerDashboard';
import EditCar from './pages/EditCar';
import './App.css';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;

  return children;
};

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'agency') return <Navigate to="/agency-dashboard" />;
  return <Navigate to="/customer-dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', position: 'relative' }}>
          <Navbar />
          <main className="container" style={{ paddingTop: '2rem' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route path="/dashboard" element={<DashboardRedirect />} />
              
              <Route path="/agency-dashboard" element={
                <ProtectedRoute allowedRole="agency">
                  <AgencyDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/customer-dashboard" element={
                <ProtectedRoute allowedRole="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/edit-car/:id" element={
                <ProtectedRoute allowedRole="agency">
                  <EditCar />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
