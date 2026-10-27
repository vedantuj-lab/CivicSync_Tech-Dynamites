import React, { useState, useEffect } from 'react';
import { civicStore, CivicSyncState } from './services/store';
import { UserProfile, PublicAlert } from './types/civic';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPortal } from './components/auth/LoginPortal';
import { CitizenLogin } from './components/auth/CitizenLogin';
import { OrgAdminLogin } from './components/auth/OrgAdminLogin';
import { FieldStaffLogin } from './components/auth/FieldStaffLogin';
import { PlatformAdminLogin } from './components/auth/PlatformAdminLogin';
import { CitizenWorkspace } from './components/citizen/CitizenWorkspace';
import { OrgAdminWorkspace } from './components/org-admin/OrgAdminWorkspace';
import { FieldStaffWorkspace } from './components/field-staff/FieldStaffWorkspace';
import { SuperAdminWorkspace } from './components/super-admin/SuperAdminWorkspace';
import { PublicAlertsView } from './components/alerts/PublicAlertsView';
import { InteractiveMap } from './components/common/InteractiveMap';
import { ArrowLeft, LogOut, LayoutDashboard, MapPin, Shield } from 'lucide-react';

export default function App() {
  const [storeState, setStoreState] = useState<CivicSyncState>(civicStore.getState());
  // Use hash-based route for bulletproof iframe persistence on page refreshes
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/';
  });
  const [selectedAlert, setSelectedAlert] = useState<PublicAlert | null>(null);

  // Sync with store
  useEffect(() => {
    const unsub = civicStore.subscribe(() => {
      setStoreState({ ...civicStore.getState() });
    });
    return () => unsub();
  }, []);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setCurrentPath(hash || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  const currentUser = storeState.users.find(u => u.id === storeState.currentUserId) || null;

  const handleSignOut = () => {
    // Clear current user
    civicStore.setCurrentUser('');
    navigate('/');
  };

  const handleLoginSuccess = (user: UserProfile) => {
    civicStore.setCurrentUser(user.id);
    // Redirect to correct dashboard
    const roleSlug = user.role.replace('_', '-');
    navigate(`/${roleSlug}/dashboard`);
  };

  // Route Guards for Protected Workspaces
  const isCitizenRoute = currentPath.startsWith('/citizen');
  const isOrgAdminRoute = currentPath.startsWith('/organization-admin');
  const isFieldStaffRoute = currentPath.startsWith('/field-staff');
  const isSuperAdminRoute = currentPath.startsWith('/platform-admin');

  // Check if unauthenticated trying to access protected route
  useEffect(() => {
    if ((isCitizenRoute || isOrgAdminRoute || isFieldStaffRoute || isSuperAdminRoute) && !currentUser) {
      navigate('/login');
    }
  }, [currentPath, currentUser]);

  // Extract report ID if path is /citizen/reports/:id
  const reportMatch = currentPath.match(/\/citizen\/reports\/([^/]+)/);
  const selectedReportId = reportMatch && reportMatch[1] !== 'new' ? reportMatch[1] : undefined;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#C8F169] selection:text-[#171A19]">
      {/* Persistent Authenticated Banner if viewing public routes while signed in */}
      {currentUser && (currentPath === '/' || currentPath === '/alerts' || currentPath === '/map' || currentPath.startsWith('/login')) && (
        <div className="bg-[#171A19] border-b border-stone-800 text-[#C8F169] text-xs py-2 px-4 flex items-center justify-between sticky top-0 z-50 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8F169] animate-pulse" />
            <span>
              Signed in as <strong>{currentUser.name}</strong> ({currentUser.role.replace('_', ' ').toUpperCase()})
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/${currentUser.role.replace('_', '-')}/dashboard`)}
              className="px-3 py-1 rounded bg-[#C8F169] text-[#171A19] font-bold text-[11px] hover:bg-[#b5e057] transition cursor-pointer"
            >
              Return to Workspace &rarr;
            </button>
            <button
              onClick={handleSignOut}
              className="text-stone-400 hover:text-rose-400 text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. PUBLIC LANDING PAGE (/) */}
      {currentPath === '/' && (
        <LandingPage
          alerts={storeState.alerts}
          reports={storeState.reports}
          categories={storeState.categories}
          currentUser={currentUser}
          onNavigate={navigate}
          onSelectAlert={(alt) => {
            setSelectedAlert(alt);
            navigate('/alerts');
          }}
        />
      )}

      {/* PUBLIC ALERTS VIEW (/alerts) */}
      {currentPath === '/alerts' && (
        <div>
          <div className="bg-[#171A19] text-white p-4 border-b border-stone-800 flex justify-between items-center px-4 sm:px-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs font-bold text-[#C8F169] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Public Home</span>
            </button>
            <span className="text-xs font-mono text-stone-400">Public Advisory Portal</span>
          </div>
          <PublicAlertsView
            alerts={storeState.alerts}
            currentUser={currentUser}
            selectedAlert={selectedAlert}
            onCloseSelectedAlert={() => setSelectedAlert(null)}
          />
        </div>
      )}

      {/* PUBLIC CITY MAP VIEW (/map) */}
      {currentPath === '/map' && (
        <div className="bg-[#171A19] min-h-screen text-white p-6 sm:p-10">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-xs font-bold text-[#C8F169] hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Public Home</span>
              </button>
              <span className="text-xs font-mono text-stone-400">Open GIS Infrastructure Grid</span>
            </div>

            <div>
              <h1 className="font-heading text-3xl font-extrabold text-white flex items-center gap-3">
                <MapPin className="w-7 h-7 text-[#C8F169]" />
                <span>Metropolitan Civic Issue Map</span>
              </h1>
              <p className="text-xs text-stone-400 mt-1">
                Displaying community reports. Click any pin to inspect ticket details.
              </p>
            </div>

            <InteractiveMap
              reports={storeState.reports}
              height="600px"
            />
          </div>
        </div>
      )}

      {/* 2. SEPARATE LOGIN PORTAL (/login) */}
      {currentPath === '/login' && (
        <LoginPortal
          onNavigate={navigate}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* 3. FOUR DISTINCT ROLE LOGIN SCREENS */}
      {currentPath === '/login/citizen' && (
        <CitizenLogin
          onNavigate={navigate}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentPath === '/login/organization-admin' && (
        <OrgAdminLogin
          onNavigate={navigate}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentPath === '/login/field-staff' && (
        <FieldStaffLogin
          onNavigate={navigate}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentPath === '/login/platform-admin' && (
        <PlatformAdminLogin
          onNavigate={navigate}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* 4. FOUR DISTINCT AUTHENTICATED WORKSPACES */}
      {isCitizenRoute && currentUser && currentUser.role === 'citizen' && (
        <CitizenWorkspace
          currentUser={currentUser}
          currentSubpath={currentPath}
          reports={storeState.reports}
          alerts={storeState.alerts}
          categories={storeState.categories}
          notifications={storeState.notifications}
          selectedReportId={selectedReportId}
          onNavigate={navigate}
          onSignOut={handleSignOut}
        />
      )}

      {isOrgAdminRoute && currentUser && currentUser.role === 'org_admin' && (
        <OrgAdminWorkspace
          currentUser={currentUser}
          currentSubpath={currentPath}
          reports={storeState.reports}
          alerts={storeState.alerts}
          departments={storeState.departments}
          categories={storeState.categories}
          users={storeState.users}
          onNavigate={navigate}
          onSignOut={handleSignOut}
          onOpenReportDetail={(rep) => navigate(`/organization-admin/reports`)}
        />
      )}

      {isFieldStaffRoute && currentUser && currentUser.role === 'field_staff' && (
        <FieldStaffWorkspace
          currentUser={currentUser}
          currentSubpath={currentPath}
          reports={storeState.reports}
          onNavigate={navigate}
          onSignOut={handleSignOut}
          onOpenReportDetail={(rep) => navigate(`/field-staff/work`)}
        />
      )}

      {isSuperAdminRoute && currentUser && currentUser.role === 'super_admin' && (
        <SuperAdminWorkspace
          currentUser={currentUser}
          currentSubpath={currentPath}
          organizations={storeState.organizations}
          users={storeState.users}
          categories={storeState.categories}
          auditLogs={storeState.auditLogs}
          onNavigate={navigate}
          onSignOut={handleSignOut}
        />
      )}
    </div>
  );
}
