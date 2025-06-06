import React, { Suspense, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './stores/authStore';
import { logSecurityEvent, sanitizeError, SECURITY_CONSTANTS } from './utils/security/validation';
import { generateSecurityHeaders, warnIfInsecure, buildCSP, CSPConfig } from './utils/security/encryption';

// Layouts
import { Header } from './components/Header';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages (Lazy Loaded)
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const TaxCalculatorPage = React.lazy(() => import('./pages/TaxCalculatorPage'));
const TaxResultsPage = React.lazy(() => import('./pages/TaxResultsPage'));
const AdminDashboardPage = React.lazy(() => import('./pages/AdminDashboardPage'));
const AdminAffiliatesPage = React.lazy(() => import('./pages/AdminAffiliatesPage'));
const AdminSettingsPage = React.lazy(() => import('./pages/AdminSettingsPage'));
const AdminUsersPage = React.lazy(() => import('./pages/AdminUsersPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));


interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorId?: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const loggedEvent = logSecurityEvent({ 
      level: SECURITY_CONSTANTS.LOG_LEVELS.ERROR,
      message: 'Unhandled application error caught by ErrorBoundary',
      data: {
        error: error.message,
        componentStack: errorInfo.componentStack,
      },
    });
    // logSecurityEvent is void, so we can't directly get an ID from it.
    // If an ID is needed, it should be generated separately or returned by logSecurityEvent.
    // For now, let's assume no ID is returned.
    this.setState({ errorId: undefined }); 
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const sanitizedMessage = sanitizeError(new Error('An unexpected error occurred.'));
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-gray-700 mb-2">{sanitizedMessage}</p>
          {this.state.errorId && <p className="text-sm text-gray-500">Error ID: {this.state.errorId}</p>}
          <p className="text-gray-600 mt-4">
            Please try refreshing the page or contact support if the problem persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}


function App() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));
  const isAdmin = user?.role === 'admin';


  useEffect(() => {
    // Initial language setup
    const savedLanguage = localStorage.getItem('i18nextLng') || 'en';
    i18n.changeLanguage(savedLanguage);

    // Log application startup
    logSecurityEvent({
      level: SECURITY_CONSTANTS.LOG_LEVELS.INFO,
      message: 'Application started',
      data: { userAgent: navigator.userAgent, language: savedLanguage }
    });

    // Warn if running in an insecure context (HTTP)
    warnIfInsecure();

    const cspConfig: CSPConfig = {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], 
      styleSrc: ["'self'", "'unsafe-inline'"], 
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"], 
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"], 
      upgradeInsecureRequests: true,
    };
    const headers = generateSecurityHeaders({ enableCSP: true, reportOnly: false });
    
    let cspMetaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspMetaTag) {
      cspMetaTag = document.createElement('meta');
      cspMetaTag.setAttribute('http-equiv', 'Content-Security-Policy');
      document.head.appendChild(cspMetaTag);
    }
    cspMetaTag.setAttribute('content', buildCSP(cspConfig));
    
    logSecurityEvent({
      level: SECURITY_CONSTANTS.LOG_LEVELS.INFO,
      message: 'Conceptual security headers and CSP meta tag applied.',
      data: { headers: Object.keys(headers), csp: cspMetaTag.getAttribute('content') }
    });

  }, [i18n]);

  return (
    <Router>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Suspense fallback={<div className="text-center py-10">{t('common.loading')}</div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                
                <Route 
                  path="/calculator" 
                  element={
                    <ProtectedRoute
                      isAuthenticated={isAuthenticated}
                      element={<TaxCalculatorPage />}
                    />
                  } 
                />
                <Route 
                  path="/results" 
                  element={
                    <ProtectedRoute
                      isAuthenticated={isAuthenticated}
                      element={<TaxResultsPage />}
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
                      element={<AdminDashboardPage />}
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
                      element={<AdminAffiliatesPage />}
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
                      element={<AdminSettingsPage />}
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
                      element={<AdminUsersPage />}
                    />
                  } 
                />
                
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </main>
          <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600 border-t">
            © {new Date().getFullYear()} {t('appName', {defaultValue: 'Swiss Tax Calculator AI'})}. {t('footer.allRightsReserved', {defaultValue: 'All rights reserved.'})}
          </footer>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
