import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Layers,
  LogOut,
  RefreshCw,
  ExternalLink,
  MapPin,
  Menu,
  X
} from 'lucide-react';
import { UserProfile, InAppNotification } from '../../types/civic';
import { DEMO_USERS, civicStore } from '../../services/store';

interface NavbarProps {
  currentUser: UserProfile | null;
  activeView: string;
  onNavigate: (view: string) => void;
  onSwitchUser: (userId: string) => void;
  onLogout: () => void;
  notifications: InAppNotification[];
  onOpenReportFromNotif?: (reportId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeView,
  onNavigate,
  onSwitchUser,
  onLogout,
  notifications,
  onOpenReportFromNotif
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(
    (n) => !n.read && (n.recipientUserId === currentUser?.id || n.recipientUserId === 'all')
  ).length;

  const handleMarkAllRead = () => {
    if (currentUser) {
      civicStore.markAllNotificationsRead(currentUser.id);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all CivicSync data back to standard demo baseline?')) {
      civicStore.resetToSampleData();
      alert('Data reset to baseline sample dataset.');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#171A19]/95 backdrop-blur-md border-b border-stone-800 text-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8F169] to-[#9ADBC0] flex items-center justify-center text-[#171A19] font-black text-xl shadow-md shadow-[#C8F169]/10">
              CS
            </div>
            <div>
              <div className="font-heading font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
                CivicSync
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#C8F169]/15 text-[#C8F169] border border-[#C8F169]/30">
                  Gov Unified
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">One Alert. One Source. A Safer Community.</p>
            </div>
          </div>

          {/* Navigation Links (Public / Landing) */}
          {!currentUser ? (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
              <button
                onClick={() => onNavigate('landing')}
                className={`hover:text-white transition ${activeView === 'landing' ? 'text-[#C8F169]' : ''}`}
              >
                Public Home
              </button>
              <button
                onClick={() => onNavigate('public_alerts')}
                className={`hover:text-white transition ${activeView === 'public_alerts' ? 'text-[#C8F169]' : ''}`}
              >
                Live Alerts
              </button>
              <button
                onClick={() => onNavigate('public_map')}
                className={`hover:text-white transition ${activeView === 'public_map' ? 'text-[#C8F169]' : ''}`}
              >
                Public Issue Map
              </button>
              <button
                onClick={() => onNavigate('how_it_works')}
                className="hover:text-white transition"
              >
                How It Works
              </button>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-4 text-xs font-medium">
              <span className="px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 border border-stone-700 font-mono">
                Role: <span className="text-[#C8F169] uppercase font-bold">{currentUser.role.replace('_', ' ')}</span>
              </span>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeView === 'dashboard'
                    ? 'bg-[#C8F169] text-[#171A19] font-semibold'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('public_alerts')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeView === 'public_alerts'
                    ? 'bg-[#C8F169] text-[#171A19] font-semibold'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                Public Alerts
              </button>
              <button
                onClick={() => onNavigate('public_map')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeView === 'public_map'
                    ? 'bg-[#C8F169] text-[#171A19] font-semibold'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                City Map
              </button>
            </div>
          )}

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-stone-200 hover:border-stone-500 transition"
                title="Switch Demonstration Role"
              >
                <Layers className="w-3.5 h-3.5 text-[#C8F169]" />
                <span className="hidden sm:inline font-medium">Role Switch:</span>
                <span className="text-[#C8F169] font-semibold">
                  {currentUser ? currentUser.name.split(' ')[0] : 'Guest'}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-stone-800 text-[11px] font-mono text-stone-400">
                    SELECT DEMONSTRATION PROFILE
                  </div>
                  <div className="space-y-1 py-1">
                    {DEMO_USERS.map((usr) => (
                      <button
                        key={usr.id}
                        onClick={() => {
                          onSwitchUser(usr.id);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ${
                          currentUser?.id === usr.id
                            ? 'bg-[#C8F169]/15 border border-[#C8F169]/40 text-white'
                            : 'hover:bg-stone-800 text-stone-300'
                        }`}
                      >
                        <img
                          src={usr.avatarUrl}
                          alt={usr.name}
                          className="w-8 h-8 rounded-full object-cover border border-stone-600"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate text-white">{usr.name}</p>
                          <p className="text-[10px] text-[#C8F169] uppercase font-mono tracking-wider">
                            {usr.role.replace('_', ' ')}
                          </p>
                        </div>
                        {currentUser?.id === usr.id && (
                          <CheckCircle2 className="w-4 h-4 text-[#C8F169]" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex justify-between items-center px-2">
                    <button
                      onClick={() => {
                        handleResetData();
                        setUserDropdownOpen(false);
                      }}
                      className="text-[11px] text-stone-400 hover:text-white flex items-center gap-1.5 py-1"
                    >
                      <RefreshCw className="w-3 h-3 text-stone-400" />
                      Reset Demo Data
                    </button>
                    {currentUser && (
                      <button
                        onClick={() => {
                          onLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 py-1"
                      >
                        <LogOut className="w-3 h-3" />
                        Sign Out
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            {currentUser && (
              <button
                onClick={() => setNotifDrawerOpen(true)}
                className="relative p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-stone-700 transition"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C8F169] text-[#171A19] font-bold text-[10px] flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* CTA or Profile Action */}
            {!currentUser ? (
              <button
                onClick={() => onNavigate('auth')}
                className="px-4 py-2 rounded-lg bg-[#C8F169] text-[#171A19] text-xs font-bold hover:bg-[#b8e357] transition shadow-md shadow-[#C8F169]/20"
              >
                Sign In / Join
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border border-[#C8F169]/50 object-cover cursor-pointer"
                  onClick={() => onNavigate('dashboard')}
                />
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 bg-stone-900 border-b border-stone-800 space-y-2">
            <button
              onClick={() => {
                onNavigate('landing');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded text-sm text-stone-200 hover:bg-stone-800"
            >
              Public Home
            </button>
            <button
              onClick={() => {
                onNavigate('public_alerts');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded text-sm text-stone-200 hover:bg-stone-800"
            >
              Public Alerts
            </button>
            <button
              onClick={() => {
                onNavigate('public_map');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded text-sm text-stone-200 hover:bg-stone-800"
            >
              Interactive City Map
            </button>
            {currentUser && (
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded text-sm font-bold text-[#C8F169] bg-[#C8F169]/10"
              >
                My Dashboard ({currentUser.role.replace('_', ' ')})
              </button>
            )}
          </div>
        )}
      </header>

      {/* Notification Slide-Over Drawer */}
      {notifDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setNotifDrawerOpen(false)}
          />
          <div className="relative w-full max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#C8F169]" />
                <h3 className="font-heading font-bold text-base text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#C8F169] text-[#171A19]">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-stone-400 hover:text-white transition"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setNotifDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-sm">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-stone-600" />
                  No notifications to display.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      civicStore.markNotificationRead(notif.id);
                      if (notif.relatedEntityId && onOpenReportFromNotif) {
                        onOpenReportFromNotif(notif.relatedEntityId);
                        setNotifDrawerOpen(false);
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer ${
                      notif.read
                        ? 'bg-stone-900/60 border-stone-800 text-stone-400'
                        : 'bg-stone-800/80 border-[#C8F169]/40 text-stone-200 shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        {notif.type === 'alert' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : notif.type === 'assignment' ? (
                          <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-[#C8F169] shrink-0" />
                        )}
                        <h4 className="text-xs font-semibold text-white">{notif.title}</h4>
                      </div>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed mb-2">{notif.message}</p>
                    {notif.relatedEntityId && (
                      <div className="text-[11px] text-[#C8F169] font-mono flex items-center gap-1 hover:underline">
                        <span>Inspect record #{notif.relatedEntityId}</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
