import React from 'react';
import { Landmark, X, Home, PlusCircle, Search, MapPin, User, ShieldCheck, PhoneCall, Shield, ArrowLeftRight, Presentation, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, UserProfile, UserRole } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentUser: UserProfile;
  userRole: UserRole;
  onOpenLoginModal: () => void;
  onOpenDatabaseModal?: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  currentUser,
  userRole,
  onOpenLoginModal,
  onOpenDatabaseModal,
}) => {
  const menuItems: Array<{ id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'home', label: 'Home Dashboard', icon: Home },
    { id: 'report', label: 'Report Issue', icon: PlusCircle },
    { id: 'track', label: 'Track Status', icon: Search },
    { id: 'map', label: 'Map View', icon: MapPin },
    { id: 'profile', label: 'Profile & Settings', icon: User },
    { id: 'presentation', label: 'Project Slides & PPT', icon: Presentation },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Menu Panel */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-xl max-w-lg mx-auto md:max-w-xl rounded-b-3xl overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                  <Landmark className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight text-[#0f172a] block leading-none">
                    Aapli Society
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {userRole === 'secretary' ? 'Secretary Administration' : 'Member Portal'}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 stroke-[2]" />
              </button>
            </div>

            {/* Active User Card & Switch Button in Drawer */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                  userRole === 'secretary' ? 'bg-[#0f172a]' : 'bg-[#2563eb]'
                }`}>
                  {userRole === 'secretary' ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {userRole === 'secretary' ? 'Hon. Secretary' : currentUser.unit || 'Resident'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenLoginModal();
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
                <span>Switch Portal</span>
              </button>
            </div>

            {/* Menu Items List */}
            <div className="p-4 space-y-1.5">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </button>
                );
              })}
              {/* Database & SQL Setup Button */}
              {onOpenDatabaseModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenDatabaseModal();
                  }}
                  className="w-full text-left flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 font-bold shadow-2xs mt-2"
                >
                  <div className="flex items-center gap-3.5">
                    <Database className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div>Database & SQL Schema</div>
                      <div className="text-[10px] text-emerald-700 font-mono font-normal">Project: hywzqdaknoogcbdzsxcn</div>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </button>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-slate-700">Maple Heights Society</span>
              </div>
              <a
                href="tel:5557829011"
                className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Security Desk</span>
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
