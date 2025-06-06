import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Minimal ErrorBoundary to catch errors within this minimal app
class MinimalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("MinimalApp Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', border: '1px solid red', margin: '20px' }}>
          <h1>Minimal App Error!</h1>
          <p>Something went wrong in the minimal app setup.</p>
          <p>Check the console for details.</p>
          {this.state.error && <pre style={{ textAlign: 'left', background: '#f0f0f0', padding: '10px' }}>{this.state.error.message}\n{this.state.error.stack}</pre>}
        </div>
      );
    }
    return this.props.children;
  }
}


function AppMinimal() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Ensure i18n is initialized, or set a default language
    if (!i18n.isInitialized) {
      i18n.changeLanguage('en').catch(err => console.error("Error changing language in MinimalApp:", err));
      console.log("MinimalApp: i18n initialized, language set to 'en'");
    } else {
      console.log("MinimalApp: i18n already initialized, current language:", i18n.language);
    }
  }, [i18n]);

  return (
    <MinimalErrorBoundary>
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <header style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
          <h1>{t('minimalApp.title', { defaultValue: 'Minimal Tax App Test' })}</h1>
        </header>
        <main>
          <p style={{ fontSize: '1.2em', color: 'green' }}>
            {t('minimalApp.works', { defaultValue: 'Minimal App Works! If you see this, basic React and i18n are functioning.' })}
          </p>
          <p style={{ marginTop: '10px', fontSize: '0.9em' }}>
            Current Language: {i18n.language}
          </p>
          <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <p>Next steps:</p>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li>Replace `App.tsx` content in `main.tsx` with `AppMinimal` from `App.minimal.tsx`.</li>
              <li>If this page loads without the "Application Error", the issue is in the original `App.tsx`'s complex imports or logic.</li>
              <li>If this page *still* shows "Application Error", the problem might be in `main.tsx`, `index.css`, `i18n/index.ts`, or the Vite/React setup itself.</li>
            </ul>
          </div>
        </main>
        <footer style={{ padding: '10px', background: '#f0f0f0', marginTop: '20px', fontSize: '0.8em' }}>
          <p>&copy; {new Date().getFullYear()} Minimal Test</p>
        </footer>
      </div>
    </MinimalErrorBoundary>
  );
}

export default AppMinimal;
