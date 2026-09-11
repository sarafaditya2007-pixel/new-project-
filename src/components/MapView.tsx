import React, { useState } from 'react';
import { MapPin, Layers, Info, CheckCircle2, Clock, AlertCircle, ChevronRight, X } from 'lucide-react';
import { Issue, IssueCategory } from '../types';
import { CATEGORIES_CONFIG } from '../data/mockData';

interface MapViewProps {
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
}

export const MapView: React.FC<MapViewProps> = ({ issues, onSelectIssue }) => {
  const [selectedPin, setSelectedPin] = useState<Issue | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const visibleIssues = issues.filter(
    (i) => filterCategory === 'All' || i.category === filterCategory
  );

  return (
    <div className="space-y-4 pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Society & Neighborhood Map
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-1">
          Geographic visual representation of active maintenance requests & resolutions.
        </p>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setFilterCategory('All')}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filterCategory === 'All'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Categories ({issues.length})
        </button>
        {Object.keys(CATEGORIES_CONFIG).slice(0, 6).map((catKey) => {
          const count = issues.filter((i) => i.category === catKey).length;
          return (
            <button
              key={catKey}
              onClick={() => setFilterCategory(catKey)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                filterCategory === catKey
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{CATEGORIES_CONFIG[catKey].iconEmoji}</span>
              <span>{catKey}</span>
              {count > 0 && <span className="opacity-75">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 shadow-md h-[440px] sm:h-[500px]">
        {/* Stylized Society Blueprint Layout */}
        <div className="absolute inset-0 bg-[#0F172A] opacity-95">
          {/* Subtle grid lines */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Roads & Pathways */}
          <div className="absolute top-1/2 left-0 right-0 h-10 bg-slate-800/80 -translate-y-1/2 border-y border-slate-700/60 flex items-center justify-around">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">5th Avenue Main Boulevard</span>
          </div>
          <div className="absolute top-0 bottom-0 left-1/3 w-10 bg-slate-800/80 border-x border-slate-700/60 flex items-center justify-center">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase -rotate-90 whitespace-nowrap">
              Oak Street Walkway
            </span>
          </div>
          <div className="absolute top-0 bottom-0 right-1/4 w-8 bg-slate-800/50 border-x border-slate-700/40" />

          {/* Society Zones & Blocks */}
          {/* Tower A & B */}
          <div className="absolute top-8 left-8 w-32 h-28 bg-blue-950/70 border border-blue-500/30 rounded-2xl p-2.5 shadow-inner">
            <span className="text-[11px] font-bold text-blue-300 block">Tower A & B</span>
            <span className="text-[9px] text-blue-400">Residential Units</span>
          </div>

          {/* Block C & D */}
          <div className="absolute bottom-8 left-8 w-36 h-28 bg-blue-950/70 border border-blue-500/30 rounded-2xl p-2.5 shadow-inner">
            <span className="text-[11px] font-bold text-blue-300 block">Block C & D</span>
            <span className="text-[9px] text-blue-400">Pump & Utility Hub</span>
          </div>

          {/* Central Green Park */}
          <div className="absolute top-10 left-[42%] w-40 h-32 bg-emerald-950/60 border border-emerald-500/30 rounded-3xl p-3 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-300 block">Central Park</span>
              <span className="text-[9px] text-emerald-400">Kids Play & Jogging Track</span>
            </div>
            <span className="text-lg opacity-40">🌳🌳</span>
          </div>

          {/* Club House & Pool */}
          <div className="absolute bottom-8 right-8 w-40 h-32 bg-indigo-950/70 border border-indigo-500/30 rounded-2xl p-3">
            <span className="text-[11px] font-bold text-indigo-300 block">Clubhouse & Pool</span>
            <span className="text-[9px] text-indigo-400">Community Hall</span>
          </div>

          {/* Gate 1 & Gate 2 */}
          <div className="absolute top-4 right-1/4 translate-x-1/2 bg-slate-800 text-slate-300 border border-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
            Visitor Gate 1
          </div>
          <div className="absolute bottom-3 left-1/3 -translate-x-1/2 bg-slate-800 text-slate-300 border border-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
            Service Gate 2
          </div>
        </div>

        {/* Map Pins */}
        {visibleIssues.map((issue) => {
          const coords = issue.mapCoords || { x: 50, y: 50 };
          const isSelected = selectedPin?.id === issue.id;

          const pinColors = {
            Resolved: 'bg-emerald-500 shadow-emerald-500/50',
            'In Progress': 'bg-amber-500 shadow-amber-500/50',
            Pending: 'bg-rose-500 shadow-rose-500/50',
          };

          return (
            <button
              key={issue.id}
              onClick={() => setSelectedPin(issue)}
              style={{ top: `${coords.y}%`, left: `${coords.x}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none"
              title={`${issue.title} (${issue.status})`}
            >
              <div className="relative flex items-center justify-center">
                {/* Pulsing ring for active issues */}
                {issue.status !== 'Resolved' && (
                  <span className={`absolute w-8 h-8 rounded-full animate-ping opacity-30 ${pinColors[issue.status]}`} />
                )}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-transform ${
                    pinColors[issue.status]
                  } ${isSelected ? 'scale-125 ring-3 ring-white' : 'group-hover:scale-110'}`}
                >
                  <MapPin className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </button>
          );
        })}

        {/* Map Legend */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-xs border border-slate-700/80 rounded-xl p-2.5 text-white text-xs space-y-1 z-30">
          <div className="font-semibold text-slate-300 text-[11px] mb-1">Status Legend</div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-300 text-[10px]">Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-300 text-[10px]">In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300 text-[10px]">Resolved</span>
          </div>
        </div>

        {/* Floating Selected Pin Card Popup */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 z-40 text-slate-900 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  CATEGORIES_CONFIG[selectedPin.category]?.badgeBg || 'bg-slate-100'
                } ${CATEGORIES_CONFIG[selectedPin.category]?.badgeText || 'text-slate-700'}`}>
                  {selectedPin.category}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  selectedPin.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedPin.status === 'In Progress'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {selectedPin.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-slate-400 hover:text-slate-600 p-1 -m-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
              {selectedPin.title}
            </h4>

            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{selectedPin.address}</span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 font-medium">
                {selectedPin.id}
              </span>
              <button
                onClick={() => onSelectIssue(selectedPin)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <span>View Timeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
