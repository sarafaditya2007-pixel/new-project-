import React, { useState, useMemo } from 'react';
import { Search, MapPin, Filter, AlertCircle, ThumbsUp, MessageSquare, ArrowUpDown, CheckCircle2 } from 'lucide-react';
import { Issue, IssueStatus } from '../types';
import { CATEGORIES_CONFIG, POPULAR_SOCIETIES } from '../data/mockData';

interface TrackStatusViewProps {
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onUpvoteIssue: (issueId: string) => void;
  initialSearchQuery?: string;
}

export const TrackStatusView: React.FC<TrackStatusViewProps> = ({
  issues,
  onSelectIssue,
  onUpvoteIssue,
  initialSearchQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [statusFilter, setStatusFilter] = useState<'All' | IssueStatus>('All');
  const [societyFilter, setSocietyFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Filter and search logic
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Search matching ID, title, address, or society
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        issue.id.toLowerCase().includes(q) ||
        issue.title.toLowerCase().includes(q) ||
        issue.address.toLowerCase().includes(q) ||
        issue.societyName.toLowerCase().includes(q);

      // Status filter
      const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;

      // Society filter
      const matchesSociety = societyFilter === 'All' || issue.societyName === societyFilter;

      // Category filter
      const matchesCategory = categoryFilter === 'All' || issue.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesSociety && matchesCategory;
    });
  }, [issues, searchQuery, statusFilter, societyFilter, categoryFilter]);

  return (
    <div className="space-y-5 pb-8 max-w-2xl mx-auto">
      {/* Title & Subtitle - Exact match to Image 4 */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Complaints
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-1">
          Search by tracking ID, title, or address to check the status of a report.
        </p>
      </div>

      {/* Search Bar - Matches Image 4 */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter Tracking ID, e.g. CIV-2026-1042"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base bg-white transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>
        <button
          onClick={() => {}}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white p-3.5 rounded-xl shadow-xs transition-all shrink-0 focus:outline-none"
          title="Search complaints"
        >
          <Search className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Filter Tabs: All, Pending, In Progress, Resolved */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {(['All', 'Pending', 'In Progress', 'Resolved'] as const).map((st) => {
            const isSelected = statusFilter === st;
            const count = st === 'All' ? issues.length : issues.filter(i => i.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                <span>{st}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary filters: Society and Category */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Society:</span>
          </div>
          <select
            value={societyFilter}
            onChange={(e) => setSocietyFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Societies</option>
            {POPULAR_SOCIETIES.map((soc) => (
              <option key={soc} value={soc}>{soc}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            {Object.keys(CATEGORIES_CONFIG).map((catKey) => (
              <option key={catKey} value={catKey}>{catKey}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Complaints List - Matches Image 4 */}
      <div className="space-y-3.5">
        {filteredIssues.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No complaints found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              No reports match your current search query or filter selection. Try clearing filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setSocietyFilter('All');
                setCategoryFilter('All');
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const cat = CATEGORIES_CONFIG[issue.category] || CATEGORIES_CONFIG.Other;

            return (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group"
              >
                {/* Top Row: Category Tag & Status Badge (Image 4) */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  {/* Category Chip */}
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cat.badgeBg} ${cat.badgeText}`}>
                    <span>{cat.iconEmoji}</span>
                    <span>{issue.category}</span>
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      issue.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : issue.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                  {issue.title}
                </h3>

                {/* Society Name */}
                <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
                  {issue.societyName}
                </div>

                {/* Location with Pin */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{issue.address}</span>
                </div>

                {/* Footer: Tracking ID & Date */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                    {issue.id}
                  </span>

                  <div className="flex items-center gap-4">
                    {issue.comments && issue.comments.length > 0 && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{issue.comments.length}</span>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpvoteIssue(issue.id);
                      }}
                      className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors p-1 -m-1"
                      title="Confirm this issue / Upvote"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{issue.upvotes}</span>
                    </button>
                    <span>{issue.date}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
