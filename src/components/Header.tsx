import React from 'react';
import { Landmark, Menu, X, Smartphone, Monitor, Shield, User, ArrowLeftRight, Presentation, Database } from 'lucide-react';
import { ActiveTab, UserProfile, UserRole } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  currentUser: UserProfile;
  userRole: UserRole;
  onOpenLoginModal: () => void;
  onOpenDatabaseModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMenuOpen,
  setIsMenuOpen,
  isMobileFrame,
  setIsMobileFrame,
  currentUser,
  userRole,
  onOpenLoginModal,
  onOpenDatabaseModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={() => {
            setActiveTab('home');
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2563eb] flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:bg-blue-700 transition-all">
            <Landmark className="w-5 h-5 stroke-[2.2] group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f172a] block leading-tight">
              Aapli Society<span className="text-blue-600">.</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
              Society Management Portal
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'home'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'report'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Report Issue
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'track'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Track Status
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'map'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Map View
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('presentation')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'presentation'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-700 bg-blue-50/80 hover:bg-blue-100 hover:text-blue-900 border border-blue-200/60'
            }`}
            title="View Project Presentation, Architecture & ER Diagram Slides"
          >
            <Presentation className={`w-4 h-4 ${activeTab === 'presentation' ? 'text-white' : 'text-blue-600'}`} />
            <span>PPT Deck</span>
          </button>
        </nav>

        {/* Right Controls: Active Role Badge, Switch Portal Button, Simulator Toggle & Hamburger */}
        <div className="flex items-center gap-2.5">
          {/* Active Persona Badge & Switch Button */}
          <button
            onClick={onOpenLoginModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-left group"
            title="Click to switch portal / change login"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${
              userRole === 'secretary' ? 'bg-[#0f172a]' : 'bg-[#2563eb]'
            }`}>
              {userRole === 'secretary' ? (
                <Shield className="w-3.5 h-3.5 text-blue-300" />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                <span>{currentUser.name}</span>
                <ArrowLeftRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {userRole === 'secretary' ? 'Hon. Secretary' : currentUser.unit || 'Resident'}
              </div>
            </div>
          </button>

          {/* Supabase DB Status & Schema Button */}
          {onOpenDatabaseModal && (
            <button
              onClick={onOpenDatabaseModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 transition-all text-xs font-bold group shadow-2xs"
              title="Supabase PostgreSQL Database Status & SQL Schema"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="hidden xl:inline">DB:</span>
              <span className="font-mono text-[11px] font-semibold hidden md:inline">hywzqdak...</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          )}

          {/* Device Frame Switcher */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? 'Switch to Full Width View' : 'Switch to Mobile App View'}
            className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-blue-600" />
                <span>Fluid</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                <span>Mobile</span>
              </>
            )}
          </button>

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
            className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 stroke-[2.2]" />
            ) : (
              <Menu className="w-6 h-6 stroke-[2.2]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
