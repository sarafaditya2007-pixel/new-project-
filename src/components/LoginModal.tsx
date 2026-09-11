import React, { useState } from 'react';
import { X, User, Shield, Building, KeyRound, CheckCircle2, ArrowRight, Sparkles, Lock, Database, AlertCircle, Loader2 } from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { DEFAULT_MEMBER, DEFAULT_SECRETARY } from '../data/mockData';
import { loginWithSupabaseAuth } from '../lib/supabaseService';
import { SUPABASE_PROJECT_ID } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole, user: UserProfile) => void;
  onOpenDatabaseModal?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  onOpenDatabaseModal,
}) => {
  const [selectedTab, setSelectedTab] = useState<UserRole>(currentRole);

  // Form states for Member
  const [memberEmail, setMemberEmail] = useState('alex.morgan@mapleheights.org');
  const [memberUnit, setMemberUnit] = useState('Tower B - Flat 402');
  const [memberPass, setMemberPass] = useState('password123');

  // Form states for Secretary
  const [secEmail, setSecEmail] = useState('secretary@mapleheights.org');
  const [secId, setSecId] = useState('SEC-MH-01');
  const [secPass, setSecPass] = useState('password123');

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const email = selectedTab === 'member' ? memberEmail : secEmail;
    const password = selectedTab === 'member' ? memberPass : secPass;

    // Try Supabase auth first
    try {
      const authRes = await loginWithSupabaseAuth(email, password);
      if (authRes.success && authRes.user) {
        onSelectRole(authRes.user.role, authRes.user);
        setAuthLoading(false);
        onClose();
        return;
      }
    } catch {
      // ignore and fallback to local profile
    }

    // Standard fallback session
    if (selectedTab === 'member') {
      onSelectRole('member', {
        ...DEFAULT_MEMBER,
        email: memberEmail || DEFAULT_MEMBER.email,
        unit: memberUnit || DEFAULT_MEMBER.unit,
      });
    } else {
      onSelectRole('secretary', {
        ...DEFAULT_SECRETARY,
        email: secEmail || DEFAULT_SECRETARY.email,
      });
    }
    setAuthLoading(false);
    onClose();
  };

  const handleQuickMemberLogin = () => {
    onSelectRole('member', DEFAULT_MEMBER);
    onClose();
  };

  const handleQuickSecretaryLogin = () => {
    onSelectRole('secretary', DEFAULT_SECRETARY);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aapli Society Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Choose Your Login Portal
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Access customized tools designed specifically for society residents or the management committee.
          </p>
        </div>

        {/* Supabase Database Connection Badge */}
        <div className="mb-4 p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-emerald-950">Supabase Connected:</span>{' '}
              <span className="font-mono text-emerald-800 text-[11px]">{SUPABASE_PROJECT_ID}</span>
            </div>
          </div>
          {onOpenDatabaseModal && (
            <button
              type="button"
              onClick={onOpenDatabaseModal}
              className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
            >
              SQL Schema
            </button>
          )}
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{authError}</span>
          </div>
        )}

        {/* Two Doors Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setSelectedTab('member')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedTab === 'member'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Society Member</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTab('secretary')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedTab === 'secretary'
                ? 'bg-[#0f172a] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Secretary & Admin</span>
          </button>
        </div>

        {/* Tab 1: Society Member Login */}
        {selectedTab === 'member' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-300">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-950">Society Member Portal</h4>
                <p className="text-xs text-blue-900/80 mt-0.5 leading-relaxed">
                  For flat owners and tenants. Log complaints, check maintenance status, pay dues, and book clubhouse amenities.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Email
              </label>
              <input
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="alex.morgan@mapleheights.org"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Flat / Unit Number
              </label>
              <input
                type="text"
                value={memberUnit}
                onChange={(e) => setMemberUnit(e.target.value)}
                placeholder="e.g. Tower B - Flat 402"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resident Password / Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={memberPass}
                  onChange={(e) => setMemberPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="submit"
                disabled={authLoading}
                className="flex-1 py-3 px-4 bg-[#2563eb] hover:bg-blue-700 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In as Member</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleQuickMemberLogin}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs sm:text-sm font-semibold transition-colors"
                title="Instant login with demo profile"
              >
                1-Click Demo (Alex M.)
              </button>
            </div>
          </form>
        ) : (
          /* Tab 2: Society Secretary Login */
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-start gap-3 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Secretary & Committee Control</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Authorized access for Hon. Secretary, Treasurer & Estate Manager to triage tickets, broadcast notices, and oversee accounts.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Secretary Account Email
              </label>
              <input
                type="email"
                value={secEmail}
                onChange={(e) => setSecEmail(e.target.value)}
                placeholder="secretary@mapleheights.org"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Committee Registration / Secretarial ID
              </label>
              <input
                type="text"
                value={secId}
                onChange={(e) => setSecId(e.target.value)}
                placeholder="e.g. SEC-MH-01"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Master Security Passphrase
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={secPass}
                  onChange={(e) => setSecPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="submit"
                disabled={authLoading}
                className="flex-1 py-3 px-4 bg-[#0f172a] hover:bg-slate-800 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-slate-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>Sign In as Secretary</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleQuickSecretaryLogin}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs sm:text-sm font-semibold transition-colors"
                title="Instant login as Hon. Secretary"
              >
                1-Click Demo (Arthur S.)
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Maple Heights Society Administration</span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Active Session Protected
          </span>
        </div>
      </div>
    </div>
  );
};
