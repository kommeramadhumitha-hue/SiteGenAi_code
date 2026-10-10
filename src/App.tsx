import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ProjectProvider } from './context/ProjectContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FaqPage } from './pages/FaqPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { GeneratorPage } from './pages/GeneratorPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { RepairPage } from './pages/RepairPage';
import { QualityPage } from './pages/QualityPage';
import { MarketingPage } from './pages/MarketingPage';
import { ExportPage } from './pages/ExportPage';
import { DeployPage } from './pages/DeployPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AppLayout } from './components/layout/AppLayout';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SettingsProvider>
          <ProjectProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Dedicated Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* Templates preview page is public or semi-public; using template sends to generator which is protected */}
                <Route
                  path="/templates"
                  element={
                    <AppLayout>
                      <TemplatesPage />
                    </AppLayout>
                  }
                />

                {/* In-App Protected Workspace Pages */}
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/generator" element={<GeneratorPage />} />
                  <Route path="/repair" element={<RepairPage />} />
                  <Route path="/marketing" element={<MarketingPage />} />
                  <Route path="/quality" element={<QualityPage />} />
                  <Route path="/export" element={<ExportPage />} />
                  <Route path="/deploy" element={<DeployPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </ProjectProvider>
        </SettingsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
