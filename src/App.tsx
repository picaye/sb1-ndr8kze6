import React, { Suspense, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './stores/authStore';
// Security-related imports removed for simplification

// Layouts
import { Header } from './components/Header';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Import existing components directly
import { PersonalInfoForm } from './components/PersonalInfoForm';
import { FinancialInfoForm } from './components/FinancialInfoForm';
import { TaxOptimizationResults } from './components/TaxOptimizationResults';
import { LoginForm } from './components/auth/LoginForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { AdminDashboard } from './components/admin/AdminDashboard';
// AffiliateManagement import removed
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminUserList } from './components/admin/AdminUserList';


// Simplified ErrorBoundary for basic error catching
class SimpleErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error | null; errorInfo?: ErrorInfo | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean; error: Error } {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("SimpleErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong.</h1>
          <p className="text-gray-700 mb-2">We've logged the error and are looking into it.</p>
          <p className="text-gray-600 mt-4">
            Please try refreshing the page. If the problem persists, please try again later.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-left bg-gray-100 p-4 rounded">
              <summary className="cursor-pointer font-semibold">Error Details (Dev Mode)</summary>
              <pre className="mt-2 text-sm whitespace-pre-wrap">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}


// Simple inline components for routes
const CalculatorFormsPage = () => (
  <div className="space-y-8">
    <PersonalInfoForm />
  </div>
);

const FinancialInfoPage = () => (
  <div className="space-y-8">
    <FinancialInfoForm />
  </div>
);


const ResultsPage = () => <TaxOptimizationResults />;
const LoginPageComponent = () => <LoginForm />;
const ForgotPasswordPageComponent = () => <ForgotPasswordForm />;
const AdminDashboardPageComponent = () => <AdminDashboard />;
const AdminAffiliatesPlaceholderPage = () => (
  <div>
    <h1 className="text-xl font-bold">Affiliate Management</h1>
    <p>This page is under construction.</p>
  </div>
);
const AdminSettingsPageComponent = () => <AdminSettings />;
const AdminUsersPageComponent = () => <AdminUserList />;

const AboutPlaceholderPage = () => (
  <div>
    <h1 className="text-xl font-bold">About Us</h1>
    <p>Information about the Swiss Tax Calculator AI will be here.</p>
  </div>
);

const ContactPlaceholderPage = () => (
  <div>
    <h1 className="text-xl font-bold">Contact Us</h1>
    <p>Contact information will be available here.</p>
  </div>
);


const NotFoundPageComponent = () => (
  <div className="text-center py-10">
    <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
    <p className="mt-4">The page you are looking for does not exist.</p>
  </div>
);


function App() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));
  const isAdmin = user?.role === 'admin';


  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng') || 'en';
    i18n.changeLanguage(savedLanguage);
    console.log("App initialized, language set to:", savedLanguage);
    // Security-related useEffect logic removed
  }, [i18n]);

  return (
    <Router>
      <SimpleErrorBoundary>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Suspense fallback={<div className="text-center py-10">{t('common.loading')}</div>}>
              <Routes>
                <Route path="/" element={<Navigate to="/calculator" replace />} />
                <Route path="/about" element={<AboutPlaceholderPage />} />
                <Route path="/contact" element={<ContactPlaceholderPage />} />
                <Route path="/login" element={<LoginPageComponent />} />
                <Route path="/forgot-password" element={<ForgotPasswordPageComponent />} />
                
                <Route path="/calculator" element={<CalculatorFormsPage />} />
                <Route path="/financial-info" element={<FinancialInfoPage />} />

                <Route
                  path="/results"
                  element={
                    <ProtectedRoute
                      isAuthenticated={isAuthenticated}
                      element={<ResultsPage />}
                    />
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute
                      isAuthenticated={isAuthenticated}
                      isAdminRoute={true}
                      isAdmin={isAdmin}
                      element={<AdminDashboardPageComponent />}
                    />
                  }
                />
                <Route
                  path="/admin/affiliates"
                  element={
                    <ProtectedRoute
                      isAuthenticated={isAuthenticated}
                      isAdminRoute={true}
                      isAdmin={isAdmin}
                      element={<AdminAffiliatesPlaceholderPage />}
                    />
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute
                      isAuthenticated={isAuthenticated}
                      isAdminRoute={true}
                      isAdmin={isAdmin}
                      element={<AdminSettingsPageComponent />}
                    />
                  }
                />
                  <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute
                      isAuthenticated={isAuthenticated}
                      isAdminRoute={true}
                      isAdmin={isAdmin}
                      element={<AdminUsersPageComponent />}
                    />
                  }
                />

                <Route path="/404" element={<NotFoundPageComponent />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </main>
          <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600 border-t">
            © {new Date().getFullYear()} {t('appName', {defaultValue: 'Swiss Tax Calculator AI'})}. {t('footer.allRightsReserved', {defaultValue: 'All rights reserved.'})}
          </footer>
        </div>
      </SimpleErrorBoundary>
    </Router>
  );
}

export default App;
