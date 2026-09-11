import React, { useState } from 'react';
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Zap,
  ShieldAlert,
  Shield,
  AlertTriangle,
  Activity,
  ChevronRight,
  User,
  Building,
  KeyRound,
  DollarSign,
  Megaphone,
  CreditCard,
  Lock,
  Sparkles,
  PhoneCall,
  Calendar,
  Layers,
  Send,
  ArrowLeftRight
} from 'lucide-react';
import { Issue, ActiveTab, IssuePriority, IssueStatus, UserRole, UserProfile, SocietyNotice, FacilityItem } from '../types';
import { CATEGORIES_CONFIG } from '../data/mockData';

interface HomeViewProps {
  issues: Issue[];
  onNavigate: (tab: ActiveTab) => void;
  onSelectIssue: (issue: Issue) => void;
  userRole: UserRole;
  currentUser: UserProfile;
  onSwitchRole: (role: UserRole) => void;
  onOpenLoginModal: () => void;
  notices: SocietyNotice[];
  facilities: FacilityItem[];
  onToggleFacility: (id: string) => void;
  onOpenBroadcastModal: () => void;
  duesPaid: boolean;
  onOpenPayDuesModal: () => void;
  onQuickUpdateStatus?: (issueId: string, status: IssueStatus) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  issues,
  onNavigate,
  onSelectIssue,
  userRole,
  currentUser,
  onSwitchRole,
  onOpenLoginModal,
  notices,
  facilities,
  onToggleFacility,
  onOpenBroadcastModal,
  duesPaid,
  onOpenPayDuesModal,
  onQuickUpdateStatus,
}) => {
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('Last 6 Months');

  // Compute dynamic stats based on issues
  const totalCount = 1284 + (issues.length - 6 > 0 ? issues.length - 6 : 0);
  const inProgressCount = 312 + issues.filter((i) => i.status === 'In Progress').length - 3;
  const resolvedCount = 972 + issues.filter((i) => i.status === 'Resolved').length - 2;

  const recentIssues = issues.slice(0, 4);

  // Issues reported by this resident's unit (or containing their name)
  const myUnitIssues = issues.filter(
    (i) =>
      (i.reporterUnit && i.reporterUnit.includes('402')) ||
      i.reporterName.includes('Alex') ||
      i.reporterName.includes('Aditya')
  );

  // Priority letter indicator for Bento tickets
  const getPriorityBadge = (priority: IssuePriority) => {
    if (priority === 'Urgent' || priority === 'High') {
      return (
        <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">
          H
        </div>
      );
    }
    if (priority === 'Medium') {
      return (
        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-bold shrink-0">
          M
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
        L
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ─────────────────────────────────────────────────────────────
          VIEW A: SOCIETY MEMBER HOMEPAGE (ONLY SHOWN FOR MEMBER)
          ───────────────────────────────────────────────────────────── */}
      {userRole === 'member' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Member Portal Banner & Quick Account Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-blue-50/90 border border-blue-100 rounded-2xl text-xs">
            <div className="flex items-center gap-2 text-blue-950 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
              <span>
                Logged in as <strong className="text-blue-900">{currentUser.name}</strong> ({currentUser.unit || 'Tower B - Flat 402'}) •{' '}
                <span className="text-blue-700 font-semibold">Society Member Portal</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSwitchRole('secretary')}
                className="text-blue-700 hover:text-blue-900 font-bold hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                title="Switch to Secretary Portal"
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span>Switch to Secretary View</span>
              </button>
              <span className="text-blue-300">•</span>
              <button
                onClick={onOpenLoginModal}
                className="text-slate-600 hover:text-slate-900 font-medium text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Change Account</span>
              </button>
            </div>
          </div>
          {/* Member Hero Bento */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Building className="w-3.5 h-3.5" />
                <span>Tower B • Flat 402 • Maple Heights</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                Welcome home, Alex Morgan
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
                Report maintenance issues, view ongoing repairs for your flat, pay quarterly dues, and stay updated with official committee notices.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => onNavigate('report')}
                className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-2xl shadow-md shadow-blue-200 active:scale-98 transition-all text-xs sm:text-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report an Issue</span>
              </button>
              <button
                onClick={onOpenPayDuesModal}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                  duesPaid
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>{duesPaid ? 'Dues Paid (Receipt)' : 'Pay Q3 Dues ($180)'}</span>
              </button>
            </div>
          </div>

          {/* Member Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Cell 1 (7 cols): My Unit Complaints & Live Progress */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      My Unit Complaints (Flat B-402)
                    </h2>
                    <p className="text-xs text-slate-500">Live ticket tracker for your residence</p>
                  </div>
                  <button
                    onClick={() => onNavigate('track')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    <span>Track All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {myUnitIssues.length === 0 ? (
                  <div className="p-6 bg-slate-50 rounded-2xl text-center">
                    <p className="text-xs text-slate-500">No active complaints logged for Flat B-402.</p>
                    <button
                      onClick={() => onNavigate('report')}
                      className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                    >
                      Report a new problem →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myUnitIssues.slice(0, 3).map((issue) => (
                      <div
                        key={issue.id}
                        onClick={() => onSelectIssue(issue)}
                        className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-slate-400 font-mono">
                            {issue.id}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              issue.status === 'Resolved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : issue.status === 'In Progress'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {issue.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {issue.title}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200/50">
                          <span>Department: {issue.assignedDepartment || 'Pending Assignment'}</span>
                          <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5">
                            Details <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Maintenance Fee Status Banner */}
              <div className="mt-5 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
                <div>
                  <span className="font-bold block">Quarterly Society Dues Status:</span>
                  <span className="text-[11px] text-emerald-800">
                    {duesPaid ? 'All dues cleared. Thank you for prompt payment!' : '$180 due by Sep 15 for Q3 2026.'}
                  </span>
                </div>
                <button
                  onClick={onOpenPayDuesModal}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs"
                >
                  {duesPaid ? 'View Receipt' : 'Pay Now'}
                </button>
              </div>
            </div>

            {/* Cell 2 (5 cols): Society Notices from Secretary */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-blue-600" />
                    <h3 className="text-base font-bold text-slate-900">
                      Official Society Notices
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {notices.length} Active
                  </span>
                </div>

                <div className="space-y-3">
                  {notices.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 rounded-2xl border text-xs ${
                        n.urgent
                          ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                          : 'bg-slate-50 border-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs">{n.title}</span>
                        {n.urgent && (
                          <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                            URGENT
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        {n.content}
                      </p>
                      <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between font-medium">
                        <span>Issued by: {n.author}</span>
                        <span>{n.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Society Security & Intercom Quick Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Security Gate Post 1</span>
                <a
                  href="tel:5557829011"
                  className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Guard Post</span>
                </a>
              </div>
            </div>

            {/* Cell 3 (6 cols): Facility Status & Booking */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Facility Live Availability
                </h3>
                <span className="text-xs text-slate-500">Hours & Access</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {facilities.map((fac) => (
                  <div key={fac.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{fac.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          fac.status === 'Open'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fac.status === 'Maintenance'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {fac.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">{fac.hours}</div>
                    {fac.bookingFee && (
                      <div className="text-[10px] font-semibold text-blue-600 mt-1">
                        Fee: {fac.bookingFee}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Cell 4 (6 cols): Recent Neighborhood Activity & Upvote */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Neighborhood Common Issues
                  </h3>
                  <p className="text-xs text-slate-500">Upvote issues you are also observing</p>
                </div>
                <button
                  onClick={() => onNavigate('track')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  View Map
                </button>
              </div>

              <div className="space-y-2.5">
                {recentIssues.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => onSelectIssue(issue)}
                    className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {issue.title}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {issue.societyName} • {issue.status}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 shrink-0">
                      {issue.upvotes} votes
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW B: SOCIETY SECRETARY HOMEPAGE (ONLY SHOWN FOR SECRETARY)
          ───────────────────────────────────────────────────────────── */}
      {userRole === 'secretary' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Secretary Portal Banner & Quick Account Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900 text-white border border-slate-800 rounded-2xl text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>
                Logged in as <strong className="text-white">{currentUser.name}</strong> •{' '}
                <span className="text-blue-400 font-semibold">Hon. General Secretary & Estate Committee</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSwitchRole('member')}
                className="text-blue-400 hover:text-blue-300 font-bold hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                title="Switch to Member Portal"
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span>Switch to Member View</span>
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={onOpenLoginModal}
                className="text-slate-400 hover:text-white font-medium text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3 h-3 text-slate-500" />
                <span>Change Account</span>
              </button>
            </div>
          </div>

          {/* Secretary Command Header */}
          <div className="bg-[#0f172a] text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Shield className="w-3.5 h-3.5" />
                <span>Executive Committee Control • Hon. Secretary</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Estate Control Center — Arthur Sterling
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                Oversee complaint triage, assign work orders to contractors, broadcast urgent alerts to residents, and audit recovery collections.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={onOpenBroadcastModal}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-2xl shadow-md shadow-blue-500/30 active:scale-98 transition-all text-xs sm:text-sm"
              >
                <Megaphone className="w-4 h-4" />
                <span>Broadcast Notice</span>
              </button>
              <button
                onClick={() => onNavigate('track')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-2xl text-xs sm:text-sm border border-white/15 transition-colors"
              >
                <Layers className="w-4 h-4" />
                <span>Manage Tickets</span>
              </button>
            </div>
          </div>

          {/* Secretary Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Bento Cell 1 (8 cols): Collection Analytics */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      Collection & Resolution Analytics
                    </h2>
                    <p className="text-xs text-slate-500">
                      Maintenance dues recovery and tickets resolution trend
                    </p>
                  </div>
                  <select
                    value={analyticsTimeframe}
                    onChange={(e) => setAnalyticsTimeframe(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                  >
                    <option>Last 6 Months</option>
                    <option>Year 2026</option>
                  </select>
                </div>

                {/* Bar Chart Visualization */}
                <div className="h-32 sm:h-36 flex items-end gap-3 px-2 pt-6">
                  <div className="flex-grow bg-blue-50 rounded-t-xl h-[40%] relative group hover:bg-blue-100 transition-colors">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] bg-slate-800 text-white px-2 py-0.5 rounded whitespace-nowrap z-10 transition-opacity">
                      Jan: 84 resolved
                    </div>
                  </div>
                  <div className="flex-grow bg-blue-100 rounded-t-xl h-[55%] relative group hover:bg-blue-200 transition-colors">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] bg-slate-800 text-white px-2 py-0.5 rounded whitespace-nowrap z-10 transition-opacity">
                      Feb: 112 resolved
                    </div>
                  </div>
                  <div className="flex-grow bg-blue-200 rounded-t-xl h-[65%] relative group hover:bg-blue-300 transition-colors">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] bg-slate-800 text-white px-2 py-0.5 rounded whitespace-nowrap z-10 transition-opacity">
                      Mar: 146 resolved
                    </div>
                  </div>
                  <div className="flex-grow bg-blue-400 rounded-t-xl h-[85%] relative group hover:bg-blue-500 transition-colors">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] bg-slate-800 text-white px-2 py-0.5 rounded whitespace-nowrap z-10 transition-opacity">
                      Apr: 210 resolved
                    </div>
                  </div>
                  <div className="flex-grow bg-blue-600 rounded-t-xl h-[70%] relative group hover:bg-blue-700 transition-colors">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] bg-slate-800 text-white px-2 py-0.5 rounded whitespace-nowrap z-10 transition-opacity">
                      May: 185 resolved
                    </div>
                  </div>
                  <div className="flex-grow bg-blue-500 rounded-t-xl h-[95%] relative group">
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-white border border-blue-200 shadow-md px-2.5 py-1 rounded-lg text-xs font-bold text-blue-700 whitespace-nowrap z-10">
                      Jun: $38.2k (972 resolved)
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-6 mt-3 px-2 text-[10px] text-slate-400 uppercase font-bold tracking-widest text-center">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
                <div className="p-3 bg-slate-50/80 rounded-2xl">
                  <div className="text-xl font-extrabold text-slate-900 leading-none">
                    {totalCount.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 mt-1">
                    Total Reported
                  </div>
                </div>
                <div className="p-3 bg-amber-50/70 rounded-2xl">
                  <div className="text-xl font-extrabold text-amber-800 leading-none">
                    {inProgressCount.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-medium text-amber-700 mt-1">
                    In Progress
                  </div>
                </div>
                <div className="p-3 bg-emerald-50/70 rounded-2xl">
                  <div className="text-xl font-extrabold text-emerald-800 leading-none">
                    {resolvedCount.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-medium text-emerald-700 mt-1">
                    Resolved
                  </div>
                </div>
                <div className="p-3 bg-blue-50/70 rounded-2xl">
                  <div className="text-xl font-extrabold text-blue-800 leading-none">
                    3.8 hrs
                  </div>
                  <div className="text-[11px] font-medium text-blue-700 mt-1">
                    Avg Response
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Cell 2 (4 cols): Live Security Feed */}
            <div className="lg:col-span-4 bg-[#0f172a] text-white rounded-3xl p-6 sm:p-7 relative overflow-hidden border border-slate-800 flex flex-col justify-between shadow-xs">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Live Security Sentry Feed
                  </h2>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate">Main Gate Entry</p>
                      <p className="text-[11px] text-white/50 truncate">Vehicle Plate: KA-05-MM-1234</p>
                    </div>
                    <span className="text-[10px] font-mono text-white/40 shrink-0">12:04 PM</span>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate">Visitor Alert</p>
                      <p className="text-[11px] text-white/50 truncate">Unidentified entry attempt at South Gate</p>
                    </div>
                    <span className="text-[10px] font-mono text-white/40 shrink-0">11:58 AM</span>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate">Patrol Check</p>
                      <p className="text-[11px] text-white/50 truncate">Area 4 perimeter scan complete</p>
                    </div>
                    <span className="text-[10px] font-mono text-white/40 shrink-0">11:45 AM</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs relative z-10">
                <span className="text-white/60 text-[11px]">Guard Post #1 Connected</span>
                <span className="text-emerald-400 text-xs font-semibold">● 100% Monitored</span>
              </div>
            </div>

            {/* Bento Cell 3 (3 cols): Facility Management Controls */}
            <div className="col-span-1 md:col-span-6 lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Facility Operations
                  </h3>
                  <span className="text-[10px] text-slate-500 font-medium">Click to toggle</span>
                </div>

                <div className="space-y-3">
                  {facilities.map((fac) => (
                    <div
                      key={fac.id}
                      onClick={() => onToggleFacility(fac.id)}
                      className="flex justify-between items-center text-xs p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      title="Click to toggle status (Secretary Control)"
                    >
                      <span className="text-slate-700 font-medium">{fac.name}</span>
                      <span
                        className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded cursor-pointer ${
                          fac.status === 'Open'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fac.status === 'Maintenance'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {fac.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#2563eb] text-white rounded-2xl p-4 mt-4 shadow-sm">
                <p className="text-[11px] opacity-80 mb-1 uppercase tracking-wider font-semibold">
                  Society Energy Consumption
                </p>
                <p className="text-2xl font-extrabold tracking-tight">
                  2.4k <span className="text-xs font-normal opacity-80">kW/h</span>
                </p>
              </div>
            </div>

            {/* Bento Cell 4 (5 cols): Maintenance Tickets Triage */}
            <div className="col-span-1 md:col-span-6 lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Maintenance Tickets Triage
                  </h3>
                  <button
                    onClick={() => onNavigate('track')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    <span>View All ({issues.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {recentIssues.map((issue) => (
                    <div
                      key={issue.id}
                      onClick={() => onSelectIssue(issue)}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-100/70 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {getPriorityBadge(issue.priority)}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {issue.title}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {issue.reporterUnit || issue.societyName} • {issue.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {issue.status !== 'Resolved' && onQuickUpdateStatus && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickUpdateStatus(issue.id, 'Resolved');
                            }}
                            className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectIssue(issue);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-xs font-bold px-1 py-1"
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Assigned SLA Target: 4.0 hrs</span>
                <span className="font-semibold text-emerald-600">● 100% On Schedule</span>
              </div>
            </div>

            {/* Bento Cell 5 (4 cols): Financial Health */}
            <div className="col-span-1 lg:col-span-4 bg-[#dcfce7] rounded-3xl p-6 border border-emerald-200 flex flex-col justify-between text-emerald-900 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    Financial Health & Recovery
                  </h3>
                  <p className="text-xs text-emerald-800/80 mt-0.5">
                    Society reserve & dues reconciliation
                  </p>
                </div>
                <div className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  Stable
                </div>
              </div>

              <div className="my-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-emerald-950 tracking-tight">
                    98.2%
                  </span>
                  <span className="text-xs text-emerald-800 font-semibold">
                    Recovery Rate
                  </span>
                </div>
                <p className="text-xs text-emerald-800/75 mt-1 leading-relaxed">
                  Budget utilization is 12% below projections for Q2. Zero critical escalations pending.
                </p>
              </div>

              <div className="pt-3 border-t border-emerald-300/50 flex items-center justify-between text-xs text-emerald-900 font-semibold">
                <span>Reserve Fund: $242,500</span>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:underline text-emerald-800"
                >
                  Audit Logs →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
