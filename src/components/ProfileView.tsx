import React, { useState } from 'react';
import { User, Shield, Building, Phone, Mail, Bell, CheckCircle2, FileText, ChevronRight, ArrowLeftRight, Lock } from 'lucide-react';
import { Issue, UserProfile, UserRole } from '../types';

interface ProfileViewProps {
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  currentUser: UserProfile;
  userRole: UserRole;
  onOpenLoginModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  issues,
  onSelectIssue,
  currentUser,
  userRole,
  onOpenLoginModal,
}) => {
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  // Filter reports
  const myReports = issues.filter((i) =>
    userRole === 'member'
      ? i.reporterName.includes('Alex') || (i.reporterUnit && i.reporterUnit.includes('402'))
      : true
  );

  return (
    <div className="space-y-5 pb-8 max-w-3xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm text-white ${
              userRole === 'secretary' ? 'bg-[#0f172a]' : 'bg-[#2563eb]'
            }`}>
              {userRole === 'secretary' ? 'AS' : 'AM'}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {currentUser.name}
              </h1>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>{currentUser.societyName} • {currentUser.unit || 'Estate Office'}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  userRole === 'secretary'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  <Shield className="w-3 h-3" />
                  <span>{currentUser.designation}</span>
                </span>
                <span className="text-[11px] text-slate-400">ID: {currentUser.id}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenLoginModal}
            className="self-start sm:self-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-200/80"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
            <span>Switch Role / Portal</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50 rounded-2xl">
            <div className="text-xl font-bold text-slate-900">
              {userRole === 'member' ? myReports.length : issues.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {userRole === 'member' ? 'My Reports' : 'Total Managed'}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <div className="text-xl font-bold text-emerald-600">
              {issues.filter((i) => i.status === 'Resolved').length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Resolved</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <div className="text-xl font-bold text-blue-600">
              {userRole === 'member' ? '42' : '98.2%'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {userRole === 'member' ? 'Civic Score' : 'SLA Rate'}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
          Contact & Credentials
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <div>
                <div className="text-[11px] text-slate-400">Email Address</div>
                <div className="font-semibold text-slate-800 text-xs sm:text-sm">{currentUser.email}</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Verified
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-400" />
              <div>
                <div className="text-[11px] text-slate-400">Phone Contact</div>
                <div className="font-semibold text-slate-800 text-xs sm:text-sm">{currentUser.phone}</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Relevant Issues List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            {userRole === 'member' ? 'My Reported Complaints' : 'Recent Society Escalations'}
          </h3>
          <span className="text-xs text-slate-500 font-semibold">{myReports.length} items</span>
        </div>

        {myReports.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            No complaints found for this profile.
          </div>
        ) : (
          <div className="space-y-2.5">
            {myReports.slice(0, 4).map((issue) => (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer transition-all"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{issue.title}</h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {issue.id} • {issue.date}
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
          Alert Preferences
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer">
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">SMS Ticket Status Alerts</div>
              <div className="text-[11px] text-slate-500">Receive instant text when status moves to In Progress or Resolved</div>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer border-t border-slate-100">
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">Emergency & Maintenance Broadcasts</div>
              <div className="text-[11px] text-slate-500">Water shutdown alerts, AGM circulars, and security notices</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
