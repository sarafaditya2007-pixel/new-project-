import React, { useState } from 'react';
import { X, MapPin, Calendar, User, ThumbsUp, Send, CheckCircle2, Clock, AlertTriangle, Building, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Issue, IssueStatus, UserRole, UserProfile } from '../types';
import { CATEGORIES_CONFIG } from '../data/mockData';

interface IssueDetailModalProps {
  issue: Issue | null;
  onClose: () => void;
  onUpdateStatus: (issueId: string, newStatus: IssueStatus, note?: string) => void;
  onAddComment: (issueId: string, commentText: string) => void;
  onUpvote: (issueId: string) => void;
  userRole?: UserRole;
  currentUser?: UserProfile;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  onClose,
  onUpdateStatus,
  onAddComment,
  onUpvote,
  userRole = 'member',
  currentUser,
}) => {
  const [newComment, setNewComment] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [showAdminControls, setShowAdminControls] = useState(userRole === 'secretary');

  if (!issue) return null;

  const cat = CATEGORIES_CONFIG[issue.category] || CATEGORIES_CONFIG.Other;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(issue.id, newComment.trim());
    setNewComment('');
  };

  const handleStatusChange = (status: IssueStatus) => {
    if (status === 'Resolved') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 }
        });
      } catch {
        // Safe fallback
      }
    }
    onUpdateStatus(issue.id, status, adminNote || undefined);
    setAdminNote('');
  };

  // Timeline steps representation
  const steps = [
    { key: 'Submitted', title: 'Issue Reported' },
    { key: 'Pending', title: 'Triaged & Review' },
    { key: 'In Progress', title: 'Action In Progress' },
    { key: 'Resolved', title: 'Resolved & Closed' },
  ];

  const getStepStatus = (stepKey: string) => {
    if (issue.status === 'Resolved') return 'completed';
    if (issue.status === 'In Progress') {
      if (stepKey === 'Resolved') return 'upcoming';
      return 'completed';
    }
    // Pending
    if (stepKey === 'Submitted') return 'completed';
    if (stepKey === 'Pending') return 'active';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-blue-600">
              {issue.id}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${cat.badgeBg} ${cat.badgeText}`}>
              <span>{cat.iconEmoji}</span> {issue.category}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              issue.status === 'Resolved'
                ? 'bg-emerald-100 text-emerald-800'
                : issue.status === 'In Progress'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {issue.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          {/* Title & Society */}
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {issue.title}
            </h2>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-sm text-slate-500 mt-2">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                {issue.societyName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {issue.address}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {issue.date}
              </span>
            </div>
          </div>

          {/* Photo attachment */}
          {issue.photoUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-60 bg-slate-100">
              <img
                src={issue.photoUrl}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 text-sm leading-relaxed text-slate-700">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Issue Details
            </h4>
            <p>{issue.description}</p>

            <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-200/60 text-xs text-slate-500">
              <div>
                Reported by: <span className="font-semibold text-slate-700">{issue.reporterName}</span> ({issue.reporterUnit})
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Priority:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  issue.priority === 'Urgent' ? 'bg-rose-100 text-rose-800' :
                  issue.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {issue.priority}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Tracking Stepper */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Resolution Progress Tracker</span>
              <span className="text-xs font-normal text-slate-500">
                Department: <span className="font-medium text-slate-800">{issue.assignedDepartment || 'Operations'}</span>
              </span>
            </h3>

            <div className="space-y-3 relative before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {issue.timeline.map((event, idx) => (
                <div key={idx} className="relative flex items-start gap-3 pl-1">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold z-10 shrink-0 mt-0.5 ring-4 ring-white">
                    ✓
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{event.label}</span>
                      <span className="text-[11px] text-slate-400">{event.date}</span>
                    </div>
                    {event.note && (
                      <p className="text-xs text-slate-600 mt-0.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {event.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upvote & Me Too button */}
          <div className="flex items-center justify-between p-3 bg-blue-50/70 border border-blue-100 rounded-2xl">
            <div className="text-xs text-blue-900">
              <span className="font-bold">{issue.upvotes} residents</span> have confirmed or upvoted this complaint.
            </div>
            <button
              type="button"
              onClick={() => onUpvote(issue.id)}
              className="px-3.5 py-1.5 bg-white hover:bg-blue-100/50 text-blue-600 font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs border border-blue-200 transition-all active:scale-95"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>I Have This Too (+1)</span>
            </button>
          </div>

          {/* Resident Comments & Updates */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center justify-between">
              <span>Discussion & Updates</span>
              <span className="text-xs text-slate-400">{issue.comments?.length || 0} messages</span>
            </h3>

            <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
              {issue.comments && issue.comments.length > 0 ? (
                issue.comments.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3 rounded-xl text-xs ${
                      c.isStaff
                        ? 'bg-blue-50/80 border border-blue-200/80'
                        : 'bg-slate-50 border border-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-semibold ${c.isStaff ? 'text-blue-700 flex items-center gap-1' : 'text-slate-800'}`}>
                        {c.isStaff && <ShieldCheck className="w-3 h-3" />}
                        {c.author}
                      </span>
                      <span className="text-[10px] text-slate-400">{c.date}</span>
                    </div>
                    <p className="text-slate-600">{c.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-3 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No resident notes added yet. Add an update below.
                </div>
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add resident update or verification note..."
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Post</span>
              </button>
            </form>
          </div>

          {/* Society Admin / Committee Simulation Panel */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAdminControls(!showAdminControls)}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <span>{showAdminControls ? 'Hide' : 'Show'} Society Committee Actions</span>
              <span>{showAdminControls ? '▲' : '▼'}</span>
            </button>

            {showAdminControls && (
              <div className="mt-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2.5 animate-in fade-in">
                <div className="font-semibold text-slate-700">
                  Update Issue Status (Manager Action)
                </div>
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Optional status note (e.g. Electrician scheduled for 3 PM)"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange('Pending')}
                    className="flex-1 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg font-semibold text-slate-700"
                  >
                    Set Pending
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('In Progress')}
                    className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold shadow-xs"
                  >
                    Set In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('Resolved')}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
