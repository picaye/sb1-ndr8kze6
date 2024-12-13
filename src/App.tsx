import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { PersonalInfoForm } from './components/PersonalInfoForm';
import { FinancialInfoForm } from './components/FinancialInfoForm';
import { TaxOptimizationResults } from './components/TaxOptimizationResults';
import { LoginForm } from './components/auth/LoginForm';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ContactPage } from './components/ContactPage';
import { AboutPage } from './components/AboutPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { useAuthStore } from './stores/authStore';

export default function App() {
  const { isAuthenticated, isAdmin } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/" element={<PersonalInfoForm />} />
            <Route path="/financial-info" element={<FinancialInfoForm />} />
            <Route path="/results" element={<TaxOptimizationResults />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin requireAuth>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}