import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationDrawer } from './components/NavigationDrawer';
import { HomeView } from './components/HomeView';
import { ReportIssueView } from './components/ReportIssueView';
import { TrackStatusView } from './components/TrackStatusView';
import { MapView } from './components/MapView';
import { ProfileView } from './components/ProfileView';
import { IssueDetailModal } from './components/IssueDetailModal';
import { LoginModal } from './components/LoginModal';
import { BroadcastNoticeModal } from './components/BroadcastNoticeModal';
import { PayDuesModal } from './components/PayDuesModal';
import { PresentationView } from './components/PresentationView';
import { DatabaseModal } from './components/DatabaseModal';
import { Issue, ActiveTab, IssueStatus, UserRole, UserProfile, SocietyNotice, FacilityItem } from './types';
import { INITIAL_ISSUES, DEFAULT_MEMBER, DEFAULT_SECRETARY, INITIAL_NOTICES, INITIAL_FACILITIES } from './data/mockData';
import { Smartphone, Monitor, Wifi, Battery, Signal, Shield, User, Database } from 'lucide-react';
import {
  fetchIssuesFromDatabase,
  createIssueInDatabase,
  updateIssueStatusInDatabase,
  upvoteIssueInDatabase,
  addIssueCommentInDatabase,
  fetchNoticesFromDatabase,
  createNoticeInDatabase,
  fetchFacilitiesFromDatabase,
  updateFacilityStatusInDatabase,
  recordDuesPaymentInDatabase,
} from './lib/supabaseService';
import { SUPABASE_PROJECT_ID } from './lib/supabase';

const STORAGE_KEY = 'urban_resolve_issues_v1';
const ROLE_STORAGE_KEY = 'urban_resolve_role_v1';
const USER_STORAGE_KEY = 'urban_resolve_user_v1';
const NOTICES_STORAGE_KEY = 'urban_resolve_notices_v1';
const FACILITIES_STORAGE_KEY = 'urban_resolve_facilities_v1';
const DUES_STORAGE_KEY = 'urban_resolve_dues_paid_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isPayDuesModalOpen, setIsPayDuesModalOpen] = useState(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);

  // User Role & Profile State
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(ROLE_STORAGE_KEY);
      if (saved === 'secretary' || saved === 'member') return saved;
    } catch {
      // Ignore parse errors
    }
    return 'member';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore parse errors
    }
    return DEFAULT_MEMBER;
  });

  // Notices State
  const [notices, setNotices] = useState<SocietyNotice[]>(() => {
    try {
      const saved = localStorage.getItem(NOTICES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore parse errors
    }
    return INITIAL_NOTICES;
  });

  // Facilities State
  const [facilities, setFacilities] = useState<FacilityItem[]>(() => {
    try {
      const saved = localStorage.getItem(FACILITIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore parse errors
    }
    return INITIAL_FACILITIES;
  });

  // Maintenance Dues Paid State
  const [duesPaid, setDuesPaid] = useState<boolean>(() => {
    try {
      return localStorage.getItem(DUES_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Issues State
  const [issues, setIssues] = useState<Issue[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore localstorage parse issues
    }
    return INITIAL_ISSUES;
  });

  // Persist State to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
    } catch {
      // Ignore storage errors
    }
  }, [issues]);

  useEffect(() => {
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, userRole);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } catch {
      // Ignore
    }
  }, [userRole, currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(notices));
    } catch {
      // Ignore
    }
  }, [notices]);

  useEffect(() => {
    try {
      localStorage.setItem(FACILITIES_STORAGE_KEY, JSON.stringify(facilities));
    } catch {
      // Ignore
    }
  }, [facilities]);

  useEffect(() => {
    try {
      localStorage.setItem(DUES_STORAGE_KEY, String(duesPaid));
    } catch {
      // Ignore
    }
  }, [duesPaid]);

  // Initial fetch from Supabase PostgreSQL database
  useEffect(() => {
    let isMounted = true;
    const loadFromDb = async () => {
      try {
        const [dbIssues, dbNotices, dbFacilities] = await Promise.all([
          fetchIssuesFromDatabase(),
          fetchNoticesFromDatabase(),
          fetchFacilitiesFromDatabase(),
        ]);
        if (!isMounted) return;
        if (dbIssues && dbIssues.length > 0) {
          setIssues(dbIssues);
        }
        if (dbNotices && dbNotices.length > 0) {
          setNotices(dbNotices);
        }
        if (dbFacilities && dbFacilities.length > 0) {
          setFacilities(dbFacilities);
        }
      } catch (err) {
        console.warn('Supabase initial fetch skipped or failed:', err);
      }
    };
    loadFromDb();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handlers for Role & Login Switching
  const handleSelectRole = (role: UserRole, user?: UserProfile) => {
    setUserRole(role);
    if (user) {
      setCurrentUser(user);
    } else if (role === 'secretary') {
      setCurrentUser(DEFAULT_SECRETARY);
    } else {
      setCurrentUser(DEFAULT_MEMBER);
    }
  };

  const handleBroadcastNotice = (newNotice: SocietyNotice) => {
    setNotices((prev) => [newNotice, ...prev]);
    createNoticeInDatabase(newNotice).catch((err) =>
      console.warn('Notice write to Supabase bypassed:', err)
    );
  };

  const handleToggleFacility = (facilityId: string) => {
    let nextStatus: FacilityItem['status'] = 'Open';
    setFacilities((prev) =>
      prev.map((f) => {
        if (f.id === facilityId) {
          nextStatus =
            f.status === 'Open'
              ? 'Maintenance'
              : f.status === 'Maintenance'
              ? 'Booked'
              : 'Open';
          return { ...f, status: nextStatus };
        }
        return f;
      })
    );
    updateFacilityStatusInDatabase(facilityId, nextStatus).catch((err) =>
      console.warn('Facility update to Supabase bypassed:', err)
    );
  };

  const handleCreateIssue = (newIssue: Issue) => {
    setIssues((prev) => [newIssue, ...prev]);
    createIssueInDatabase(newIssue).catch((err) =>
      console.warn('Issue write to Supabase bypassed:', err)
    );
  };

  const handleUpdateStatus = (issueId: string, newStatus: IssueStatus, note?: string) => {
    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const timeStr = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    updateIssueStatusInDatabase(issueId, newStatus, note).catch((err) =>
      console.warn('Status update to Supabase bypassed:', err)
    );

    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          const updatedTimeline = [
            ...item.timeline,
            {
              status: newStatus,
              label:
                newStatus === 'Resolved'
                  ? 'Issue Resolved & Closed'
                  : newStatus === 'In Progress'
                  ? 'Technician / Work In Progress'
                  : 'Status Updated',
              date: `${todayStr}, ${timeStr}`,
              note: note || `Status updated to ${newStatus} by ${currentUser.name}.`
            }
          ];

          return {
            ...item,
            status: newStatus,
            timeline: updatedTimeline
          };
        }
        return item;
      })
    );

    // Also update selectedIssue state if modal is open
    setSelectedIssue((current) => {
      if (current && current.id === issueId) {
        const updatedTimeline = [
          ...current.timeline,
          {
            status: newStatus,
            label:
              newStatus === 'Resolved'
                ? 'Issue Resolved & Closed'
                : newStatus === 'In Progress'
                ? 'Technician / Work In Progress'
                : 'Status Updated',
            date: `${todayStr}, ${timeStr}`,
            note: note || `Status updated to ${newStatus} by ${currentUser.name}.`
          }
        ];
        return {
          ...current,
          status: newStatus,
          timeline: updatedTimeline
        };
      }
      return current;
    });
  };

  const handleUpvoteIssue = (issueId: string) => {
    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          const newVotes = item.upvotes + 1;
          upvoteIssueInDatabase(issueId, newVotes).catch((err) =>
            console.warn('Upvote to Supabase bypassed:', err)
          );
          return { ...item, upvotes: newVotes };
        }
        return item;
      })
    );

    setSelectedIssue((current) => {
      if (current && current.id === issueId) {
        return { ...current, upvotes: current.upvotes + 1 };
      }
      return current;
    });
  };

  const handleAddComment = (issueId: string, commentText: string) => {
    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const timeStr = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const isStaff = userRole === 'secretary';
    const authorLabel = isStaff
      ? `${currentUser.name} (Hon. Sec.)`
      : `${currentUser.name} (${currentUser.unit || 'Resident'})`;

    const newCommentObj = {
      id: `c-${Date.now()}`,
      author: authorLabel,
      text: commentText,
      date: `${todayStr}, ${timeStr}`,
      isStaff
    };

    addIssueCommentInDatabase(issueId, newCommentObj).catch((err) =>
      console.warn('Comment to Supabase bypassed:', err)
    );

    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          return {
            ...item,
            comments: [...(item.comments || []), newCommentObj]
          };
        }
        return item;
      })
    );

    setSelectedIssue((current) => {
      if (current && current.id === issueId) {
        return {
          ...current,
          comments: [...(current.comments || []), newCommentObj]
        };
      }
      return current;
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Banner Toolbar with Active Role Indicator & Portal Switcher */}
      <div className="bg-[#0f172a] text-slate-300 px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white tracking-wide">Aapli Society Management</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">Maple Heights Housing Society</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Supabase Database Indicator & SQL Tool */}
          <button
            onClick={() => setIsDatabaseModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold transition-colors border border-emerald-500/30"
            title="View Supabase PostgreSQL Status & Copy Schema SQL"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase DB</span>
            <span className="font-mono text-[10px] text-emerald-300/80 hidden sm:inline">{SUPABASE_PROJECT_ID}</span>
          </button>

          {/* Active Persona Pill in Top Toolbar */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors"
          >
            {userRole === 'secretary' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Secretary Mode: {currentUser.name}</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-blue-300" />
                <span>Member Mode: {currentUser.name}</span>
              </>
            )}
            <span className="text-blue-400 underline ml-1 font-normal">Switch</span>
          </button>

          {/* Display Mode (Mobile frame vs Fluid) */}
          <div className="hidden md:flex items-center gap-1 border-l border-slate-700 pl-2.5">
            <button
              onClick={() => setIsMobileFrame(true)}
              className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] transition-colors ${
                isMobileFrame ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'
              }`}
              title="Mobile Device Mockup"
            >
              <Smartphone className="w-3 h-3" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => setIsMobileFrame(false)}
              className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] transition-colors ${
                !isMobileFrame ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'
              }`}
              title="Fluid Bento Grid"
            >
              <Monitor className="w-3 h-3" />
              <span>Fluid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container Wrapper */}
      <div className={isMobileFrame ? 'py-6 px-4 flex justify-center items-start min-h-[calc(100vh-42px)]' : ''}>
        <div
          className={
            isMobileFrame
              ? 'w-full max-w-[420px] bg-white rounded-[40px] shadow-2xl border-[8px] border-slate-800 overflow-hidden relative min-h-[780px]'
              : 'min-h-screen bg-[#F8FAFC]'
          }
        >
          {/* Simulated Mobile Status Bar */}
          {isMobileFrame && (
            <div className="bg-white px-7 pt-3 pb-1 flex items-center justify-between text-xs text-slate-800 font-semibold select-none border-b border-slate-100">
              <span>9:41</span>
              <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto" />
              <div className="flex items-center gap-1.5">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {/* Main Top Header */}
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            isMobileFrame={isMobileFrame}
            setIsMobileFrame={setIsMobileFrame}
            currentUser={currentUser}
            userRole={userRole}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
          />

          {/* Slide-out / Drop-down Navigation Drawer */}
          <NavigationDrawer
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setIsMenuOpen(false);
            }}
            currentUser={currentUser}
            userRole={userRole}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
          />

          {/* Main Content Area */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-16">
            {activeTab === 'home' && (
              <HomeView
                issues={issues}
                onNavigate={(tab) => setActiveTab(tab)}
                onSelectIssue={(issue) => setSelectedIssue(issue)}
                userRole={userRole}
                currentUser={currentUser}
                onSwitchRole={(role) => handleSelectRole(role)}
                onOpenLoginModal={() => setIsLoginModalOpen(true)}
                notices={notices}
                facilities={facilities}
                onToggleFacility={handleToggleFacility}
                onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
                duesPaid={duesPaid}
                onOpenPayDuesModal={() => setIsPayDuesModalOpen(true)}
                onQuickUpdateStatus={(issueId, status) => handleUpdateStatus(issueId, status)}
              />
            )}

            {activeTab === 'report' && (
              <ReportIssueView
                onIssueCreated={(newIssue) => {
                  handleCreateIssue(newIssue);
                }}
                onCancel={() => setActiveTab('track')}
              />
            )}

            {activeTab === 'track' && (
              <TrackStatusView
                issues={issues}
                onSelectIssue={(issue) => setSelectedIssue(issue)}
                onUpvoteIssue={handleUpvoteIssue}
              />
            )}

            {activeTab === 'map' && (
              <MapView
                issues={issues}
                onSelectIssue={(issue) => setSelectedIssue(issue)}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                issues={issues}
                onSelectIssue={(issue) => setSelectedIssue(issue)}
                currentUser={currentUser}
                userRole={userRole}
                onOpenLoginModal={() => setIsLoginModalOpen(true)}
              />
            )}

            {activeTab === 'presentation' && (
              <PresentationView onNavigate={(tab) => setActiveTab(tab)} />
            )}
          </main>
        </div>
      </div>

      {/* Detailed Issue & Timeline Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onUpdateStatus={handleUpdateStatus}
        onAddComment={handleAddComment}
        onUpvote={handleUpvoteIssue}
        userRole={userRole}
        currentUser={currentUser}
      />

      {/* Role Selection & Login Gateway Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentRole={userRole}
        onSelectRole={handleSelectRole}
        onOpenDatabaseModal={() => {
          setIsLoginModalOpen(false);
          setIsDatabaseModalOpen(true);
        }}
      />

      {/* Secretary Broadcast Urgent Notice Modal */}
      <BroadcastNoticeModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onBroadcast={handleBroadcastNotice}
        authorName={currentUser.name}
      />

      {/* Member Pay Dues & Receipt Modal */}
      <PayDuesModal
        isOpen={isPayDuesModalOpen}
        onClose={() => setIsPayDuesModalOpen(false)}
        unit={currentUser.unit || 'Tower B - Flat 402'}
        residentName={currentUser.name}
        onPaymentSuccess={() => {
          setDuesPaid(true);
          const receiptNo = `MH-${Date.now().toString().slice(-6)}`;
          recordDuesPaymentInDatabase(
            currentUser.id,
            currentUser.name,
            currentUser.unit || 'Tower B - Flat 402',
            180.00,
            receiptNo
          ).catch((err) => console.warn('Dues record to Supabase bypassed:', err));
        }}
      />

      {/* Database & SQL Schema Manager Modal */}
      <DatabaseModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
      />
    </div>
  );
}
