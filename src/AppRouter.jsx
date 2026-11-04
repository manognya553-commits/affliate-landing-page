import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Landing Page
import App from './App';

// Auth Pages
import AffiliateSignUpPage from './pages/auth/AffiliateSignUpPage';
import AffiliateLoginPage from './pages/auth/AffiliateLoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Affiliate Pages
import ProgrammeTermsPage from './pages/affiliate/ProgrammeTermsPage';
import AffiliateOnboardingPage from './pages/affiliate/AffiliateOnboardingPage';
import AffiliateStatusPage from './pages/affiliate/AffiliateStatusPage';
import AffiliateDashboardPage from './pages/affiliate/AffiliateDashboardPage';
import AffiliateProfilePage from './pages/affiliate/AffiliateProfilePage';
import AffiliateServicesPage from './pages/affiliate/AffiliateServicesPage';
import AffiliateLeadsPage from './pages/affiliate/AffiliateLeadsPage';
import AffiliateEarningsPage from './pages/affiliate/AffiliateEarningsPage';
import AffiliateInvoicesPage from './pages/affiliate/AffiliateInvoicesPage';
import AffiliateLearnPage from './pages/affiliate/AffiliateLearnPage';
import AffiliateSupportPage from './pages/affiliate/AffiliateSupportPage';
import ComingSoonPage from './pages/affiliate/ComingSoonPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminAffiliatesPage from './pages/admin/AdminAffiliatesPage';
import AdminLeadsPage from './pages/admin/AdminLeadsPage';
import AdminApprovalsPage from './pages/admin/AdminApprovalsPage';
import AdminProvidersPage from './pages/admin/AdminProvidersPage';
import AdminFinancePage from './pages/admin/AdminFinancePage';
import AdminInvoicesPage from './pages/admin/AdminInvoicesPage';

// Layouts & Gates
import AffiliateLayout from './components/layout/AffiliateLayout';
import AdminLayout from './components/layout/AdminLayout';
import {
  RequireApprovedAffiliate,
  RequireIncompleteOnboarding,
  RequireStatusGate,
  RequireAdmin,
  RedirectIfAuthenticated,
} from './components/auth/RouteGate';

export default function AppRouter() {
  return (
    <Routes>
      {/* Landing page stays at / */}
      <Route path="/" element={<App />} />

      {/* Auth routes */}
      <Route
        path="/app/signup"
        element={
          <RedirectIfAuthenticated>
            <AffiliateSignUpPage />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/app/login"
        element={
          <RedirectIfAuthenticated>
            <AffiliateLoginPage />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/app/forgot-password"
        element={
          <RedirectIfAuthenticated>
            <ForgotPasswordPage />
          </RedirectIfAuthenticated>
        }
      />
      <Route path="/app/reset-password" element={<ResetPasswordPage />} />
      <Route path="/app/verify-email" element={<VerifyEmailPage />} />

      {/* Programme Terms (Publicly accessible placeholder) */}
      <Route path="/app/terms" element={<ProgrammeTermsPage />} />

      {/* Onboarding: only for authenticated affiliates whose profile is incomplete */}
      <Route
        path="/app/onboarding"
        element={
          <RequireIncompleteOnboarding>
            <AffiliateOnboardingPage />
          </RequireIncompleteOnboarding>
        }
      />

      {/* Status gate: for pending, info_requested, rejected, suspended */}
      <Route
        path="/app/status"
        element={
          <RequireStatusGate>
            <AffiliateStatusPage />
          </RequireStatusGate>
        }
      />

      {/* Affiliate Portal Shell: requires approved affiliate (or admin) */}
      <Route
        path="/app"
        element={
          <RequireApprovedAffiliate>
            <AffiliateLayout />
          </RequireApprovedAffiliate>
        }
      >
        <Route index element={<AffiliateDashboardPage />} />
        <Route path="profile" element={<AffiliateProfilePage />} />
        <Route path="services" element={<AffiliateServicesPage />} />
        <Route path="learn" element={<AffiliateLearnPage />} />
        <Route path="leads" element={<AffiliateLeadsPage />} />
        <Route path="earnings" element={<AffiliateEarningsPage />} />
        <Route path="invoices" element={<AffiliateInvoicesPage />} />
        <Route path="support" element={<AffiliateSupportPage />} />
      </Route>

      {/* Admin Login: public, but with admin redirection and affiliate-session switching */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Portal: requires role === 'admin' */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="affiliates" element={<AdminAffiliatesPage />} />
        <Route path="leads" element={<AdminLeadsPage />} />
        <Route path="providers" element={<AdminProvidersPage />} />
        <Route path="finance" element={<AdminFinancePage />} />
        <Route path="invoices" element={<AdminInvoicesPage />} />
        <Route path="approvals" element={<AdminApprovalsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
