import React, { useState } from 'react';
import { X, Megaphone, AlertTriangle, Calendar, ShieldCheck, Send } from 'lucide-react';
import { SocietyNotice } from '../types';

interface BroadcastNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcast: (notice: SocietyNotice) => void;
  authorName: string;
}

export const BroadcastNoticeModal: React.FC<BroadcastNoticeModalProps> = ({
  isOpen,
  onClose,
  onBroadcast,
  authorName,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Maintenance' | 'Emergency' | 'Meeting' | 'Security'>('Maintenance');
  const [isUrgent, setIsUrgent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newNotice: SocietyNotice = {
      id: `not-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: `${authorName} (Hon. Sec.)`,
      urgent: isUrgent,
    };

    onBroadcast(newNotice);
    setTitle('');
    setContent('');
    setIsUrgent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0f172a]">Broadcast Society Notice</h3>
            <p className="text-xs text-slate-500">Send an instant alert to all flat owners and tenants</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notice Headline / Subject *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Water Booster Pump Maintenance Schedule"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 outline-none bg-white"
              >
                <option value="Maintenance">Maintenance & Works</option>
                <option value="Emergency">Emergency Alert</option>
                <option value="Meeting">General Body Meeting</option>
                <option value="Security">Security & Access</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-xl w-full cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 h-4 w-4"
                />
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Mark as High Priority
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notice Content & Action Steps *
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide exact timings, affected towers/blocks, and instructions for residents..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-200 flex items-center gap-2 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast to Residents</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
