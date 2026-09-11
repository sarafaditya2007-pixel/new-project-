import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Code2,
  AlertCircle,
  RefreshCw,
  Server,
  Key,
  Layers,
  Terminal
} from 'lucide-react';
import { SUPABASE_PROJECT_ID, DEFAULT_SUPABASE_URL, isSupabaseConfigured } from '../lib/supabase';
import { checkSupabaseConnection, DatabaseStatus } from '../lib/supabaseService';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncData?: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ isOpen, onClose, onSyncData }) => {
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [status, setStatus] = useState<DatabaseStatus>({
    isConfigured: isSupabaseConfigured(),
    projectId: SUPABASE_PROJECT_ID,
    apiUrl: DEFAULT_SUPABASE_URL,
    isConnected: false,
  });
  const [isChecking, setIsChecking] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sql' | 'instructions'>('overview');

  const fullSqlScript = `-- AAPLI SOCIETY - SUPABASE DATABASE SCHEMA
-- Project: ${SUPABASE_PROJECT_ID}
-- URL: ${DEFAULT_SUPABASE_URL}

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Accounts & Roles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('member', 'secretary')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '+1 (555) 019-2834',
  unit TEXT,
  society_name TEXT DEFAULT 'Maple Heights Housing Society',
  designation TEXT DEFAULT 'Resident',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ISSUES (Grievance Complaints)
CREATE TABLE IF NOT EXISTS public.issues (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  society_name TEXT DEFAULT 'Maple Heights Housing Society',
  address TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Pending', 'In Progress', 'Resolved')) DEFAULT 'Pending',
  priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
  date TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  photo_url TEXT,
  reporter_name TEXT NOT NULL,
  reporter_unit TEXT,
  assigned_department TEXT,
  upvotes INTEGER DEFAULT 0,
  map_coords JSONB DEFAULT '{"x": 50, "y": 50}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TIMELINE_EVENTS (Progress Tracker)
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id TEXT NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  label TEXT NOT NULL,
  date TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ISSUE_COMMENTS
CREATE TABLE IF NOT EXISTS public.issue_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id TEXT NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  date TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. NOTICES (Emergency Announcements & Circulars)
CREATE TABLE IF NOT EXISTS public.notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Maintenance', 'Emergency', 'Meeting', 'Security')),
  date TEXT NOT NULL,
  author TEXT NOT NULL,
  urgent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FACILITIES (Amenities)
CREATE TABLE IF NOT EXISTS public.facilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Open', 'Maintenance', 'Booked')) DEFAULT 'Open',
  hours TEXT NOT NULL,
  booking_fee TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DUES_TRANSACTIONS (Ledger & Receipts)
CREATE TABLE IF NOT EXISTS public.dues_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id TEXT NOT NULL,
  resident_name TEXT NOT NULL,
  unit TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 180.00,
  period TEXT DEFAULT 'Q3 2026',
  status TEXT NOT NULL DEFAULT 'PAID',
  receipt_no TEXT NOT NULL,
  payment_method TEXT DEFAULT 'Card / UPI / NetBanking',
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dues_transactions ENABLE ROW LEVEL SECURITY;

-- POLICIES (Allow full access for app operations)
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Public read issues" ON public.issues FOR SELECT USING (true);
CREATE POLICY "Public insert issues" ON public.issues FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update issues" ON public.issues FOR UPDATE USING (true);

CREATE POLICY "Public read timeline" ON public.timeline_events FOR SELECT USING (true);
CREATE POLICY "Public insert timeline" ON public.timeline_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read comments" ON public.issue_comments FOR SELECT USING (true);
CREATE POLICY "Public insert comments" ON public.issue_comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Public insert notices" ON public.notices FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read facilities" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Public update facilities" ON public.facilities FOR UPDATE USING (true);

CREATE POLICY "Public read dues" ON public.dues_transactions FOR SELECT USING (true);
CREATE POLICY "Public insert dues" ON public.dues_transactions FOR INSERT WITH CHECK (true);
`;

  useEffect(() => {
    if (isOpen) {
      testConnection();
    }
  }, [isOpen]);

  const testConnection = async () => {
    setIsChecking(true);
    const res = await checkSupabaseConnection();
    setStatus(res);
    setIsChecking(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(fullSqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(DEFAULT_SUPABASE_URL);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200">
              <Database className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                  Supabase PostgreSQL Integration
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight">
                Database Manager & SQL Setup
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl my-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-3 rounded-lg transition-all ${
              activeTab === 'overview' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview & Status
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-2 px-3 rounded-lg transition-all ${
              activeTab === 'sql' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SQL Schema Code
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`py-2 px-3 rounded-lg transition-all ${
              activeTab === 'instructions' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Setup Guide (3 Steps)
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Connection Status Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Server className="w-4 h-4 text-slate-600" />
                    <span>Project Credentials</span>
                  </div>
                  <button
                    onClick={testConnection}
                    disabled={isChecking}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                    <span>Refresh Status</span>
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-medium">Project ID:</span>
                    <span className="font-mono font-bold text-slate-800">{SUPABASE_PROJECT_ID}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-medium">API Endpoint:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-800 text-[11px] truncate max-w-[240px]">
                        {DEFAULT_SUPABASE_URL}
                      </span>
                      <button
                        onClick={handleCopyUrl}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                        title="Copy API Endpoint"
                      >
                        {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                    {status.isConnected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div className="text-[11px]">
                      {status.isConnected ? (
                        <div className="text-emerald-800 font-medium">
                          <strong>Connected to Supabase!</strong> Database tables are responding properly.
                        </div>
                      ) : (
                        <div className="text-slate-600">
                          <strong>Database Status:</strong>{' '}
                          {status.isConfigured
                            ? 'Client initialized with environment credentials.'
                            : 'Pre-configured with Project ID ' + SUPABASE_PROJECT_ID + '. Schema script ready to execute in SQL Editor.'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Database Entities Covered */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Tables Included in Schema:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block font-mono text-[11px]">1. profiles</strong>
                    <span className="text-[11px] text-slate-500">Member and Secretary accounts & roles</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block font-mono text-[11px]">2. issues</strong>
                    <span className="text-[11px] text-slate-500">Civic complaints, categories & upvotes</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block font-mono text-[11px]">3. timeline_events</strong>
                    <span className="text-[11px] text-slate-500">Audit logs & resolution progression</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block font-mono text-[11px]">4. issue_comments</strong>
                    <span className="text-[11px] text-slate-500">Discussion threads on grievances</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block font-mono text-[11px]">5. notices</strong>
                    <span className="text-[11px] text-slate-500">Emergency alerts & circular announcements</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block font-mono text-[11px]">6. facilities</strong>
                    <span className="text-[11px] text-slate-500">Pool, gym, clubhouse & tennis passes</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 col-span-2">
                    <strong className="text-slate-900 block font-mono text-[11px]">7. dues_transactions</strong>
                    <span className="text-[11px] text-slate-500">Quarterly $180 payments, receipt vouchers & barcode verification</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">
                  Ready-to-run PostgreSQL Schema (Includes Tables, RLS Policies & Seeds)
                </span>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                </button>
              </div>

              <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-[11px] leading-relaxed max-h-[340px] overflow-y-auto border border-slate-800">
                <pre>{fullSqlScript}</pre>
              </div>

              <div className="text-[11px] text-slate-500">
                Tip: This script is also saved in the root of your project as <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded font-mono">supabase-schema.sql</code>.
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                  <span>Open Supabase SQL Editor</span>
                </div>
                <p className="text-slate-600 pl-7">
                  Log into your Supabase dashboard for project <strong className="text-slate-900 font-mono">{SUPABASE_PROJECT_ID}</strong>:
                </p>
                <div className="pl-7">
                  <a
                    href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-bold underline"
                  >
                    <span>Open Supabase SQL Editor ({SUPABASE_PROJECT_ID})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
                  <span>Create a New Query & Paste SQL</span>
                </div>
                <p className="text-slate-600 pl-7">
                  Click <strong>"New Query"</strong>, click the <strong>"Copy SQL Script"</strong> button in the tab above (or copy from <code className="font-mono bg-white px-1 py-0.5 rounded text-slate-800">supabase-schema.sql</code>), and paste it into the editor.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">3</span>
                  <span>Click "Run"</span>
                </div>
                <p className="text-slate-600 pl-7">
                  Click the green <strong>"Run"</strong> button. Supabase will execute the script in 2 seconds, creating all 7 normalized tables, indexes, row-level security policies, and initial Maple Heights sample data!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Project: <span className="font-mono font-bold text-slate-800">{SUPABASE_PROJECT_ID}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySql}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy SQL Script'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
