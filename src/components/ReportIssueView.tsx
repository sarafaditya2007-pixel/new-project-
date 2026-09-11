import React, { useState } from 'react';
import { Upload, CheckCircle2, Image as ImageIcon, Sparkles, Navigation, X, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Issue, IssueCategory, IssuePriority } from '../types';
import { POPULAR_SOCIETIES, CATEGORIES_CONFIG } from '../data/mockData';

interface ReportIssueViewProps {
  onIssueCreated: (newIssue: Issue) => void;
  onCancel: () => void;
}

const SAMPLE_PHOTOS = [
  { label: 'Pothole Sample', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80' },
  { label: 'Streetlight Sample', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80' },
  { label: 'Water Leak Sample', url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80' },
];

export const ReportIssueView: React.FC<ReportIssueViewProps> = ({
  onIssueCreated,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory | ''>('');
  const [societyName, setSocietyName] = useState('Maple Heights Society');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<IssuePriority>('Medium');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [reporterName, setReporterName] = useState('Alex Morgan');
  const [reporterUnit, setReporterUnit] = useState('Tower B - Apt 402');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setAddress(`Near Lat ${pos.coords.latitude.toFixed(4)}, Long ${pos.coords.longitude.toFixed(4)} (Maple Heights Precinct)`);
        },
        () => {
          setAddress('5th Ave & Main St, near Block B Gate');
        }
      );
    } else {
      setAddress('5th Ave & Main St, near Block B Gate');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please enter an issue title.');
      return;
    }
    if (!category) {
      setErrorMessage('Please select a category for routing.');
      return;
    }
    if (!societyName.trim()) {
      setErrorMessage('Please enter your society name.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please add description details.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const randomNum = Math.floor(1043 + Math.random() * 900);
      const generatedId = `URB-2026-${randomNum}`;
      const today = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const timeStr = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const newIssue: Issue = {
        id: generatedId,
        title: title.trim(),
        category: category as IssueCategory,
        societyName: societyName.trim(),
        address: address.trim() || 'Central Boulevard & Avenue 4',
        description: description.trim(),
        status: 'Pending',
        priority,
        date: today,
        timestamp: Date.now(),
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        reporterName: reporterName.trim() || 'Resident',
        reporterUnit: reporterUnit.trim() || 'Unassigned Unit',
        assignedDepartment: `${category} Services & Resolution Taskforce`,
        upvotes: 1,
        mapCoords: {
          x: 20 + Math.floor(Math.random() * 60),
          y: 20 + Math.floor(Math.random() * 60)
        },
        timeline: [
          {
            status: 'Submitted',
            label: 'Issue Logged & Dispatched',
            date: `${today}, ${timeStr}`,
            note: 'Ticket queued for society committee review.'
          },
          {
            status: 'Pending',
            label: 'Automated Triaging',
            date: `${today}, ${timeStr}`,
            note: `Assigned to ${category} operations desk.`
          }
        ],
        comments: []
      };

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback if blocked
      }

      setIsSubmitting(false);
      setSubmittedId(generatedId);
      onIssueCreated(newIssue);
    }, 600);
  };

  if (submittedId) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          Complaint Submitted!
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Your issue has been successfully routed to the maintenance department.
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6 text-left">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Tracking ID
          </div>
          <div className="text-xl font-mono font-bold text-blue-600">
            {submittedId}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Status: <span className="font-semibold text-slate-700">Pending Review</span> • Initial Response estimated within 4 hours.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-xs transition-colors"
          >
            Track Status Now
          </button>
          <button
            onClick={() => {
              setSubmittedId(null);
              setTitle('');
              setDescription('');
              setAddress('');
              setPhotoUrl('');
            }}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Report Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-2xl mx-auto">
      {/* Title & Subtitle - Exact match to Image 3 */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Report a New Issue
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-1">
          Give us the details and we'll route it to the right department.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Issue Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Issue Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Broken streetlight on Oak Street"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base transition-all"
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Category <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IssueCategory)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 text-sm sm:text-base bg-white transition-all appearance-none cursor-pointer"
              required
            >
              <option value="" disabled>Select a category</option>
              {Object.keys(CATEGORIES_CONFIG).map((catKey) => (
                <option key={catKey} value={catKey}>
                  {CATEGORIES_CONFIG[catKey].iconEmoji} {CATEGORIES_CONFIG[catKey].label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
              ▼
            </div>
          </div>
        </div>

        {/* Society Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-slate-800">
              Society Name <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-400">Auto-assigned</span>
          </div>
          <input
            type="text"
            value={societyName}
            onChange={(e) => setSocietyName(e.target.value)}
            placeholder="e.g. Maple Heights Society"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base transition-all"
            required
          />

          {/* Quick society tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {POPULAR_SOCIETIES.slice(0, 3).map((soc) => (
              <button
                key={soc}
                type="button"
                onClick={() => setSocietyName(soc)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  societyName === soc
                    ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {soc}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any details that would help — size, severity, how long it's been there..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base resize-y transition-all"
            required
          />
        </div>

        {/* Location & GPS */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-slate-800">
              Exact Location / Landmark
            </label>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Use Current GPS</span>
            </button>
          </div>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 5th Ave & Main St, near Block B Gate"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base transition-all"
          />
        </div>

        {/* Priority Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Urgency / Severity Level
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['Low', 'Medium', 'High', 'Urgent'] as IssuePriority[]).map((p) => {
              const isSelected = priority === p;
              const colorMap: Record<IssuePriority, string> = {
                Low: 'border-slate-300 text-slate-700 hover:bg-slate-50',
                Medium: 'border-blue-300 text-blue-700 hover:bg-blue-50',
                High: 'border-amber-400 text-amber-800 hover:bg-amber-50',
                Urgent: 'border-rose-400 text-rose-800 hover:bg-rose-50',
              };
              const activeColorMap: Record<IssuePriority, string> = {
                Low: 'bg-slate-100 border-slate-500 font-bold text-slate-900',
                Medium: 'bg-blue-100 border-blue-600 font-bold text-blue-800',
                High: 'bg-amber-100 border-amber-600 font-bold text-amber-900',
                Urgent: 'bg-rose-100 border-rose-600 font-bold text-rose-900',
              };
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-2 px-1 text-xs rounded-xl border transition-all text-center ${
                    isSelected ? activeColorMap[p] : colorMap[p]
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo Upload - Matches dashed dropzone from Image 3 */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Photo Upload
          </label>

          {photoUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 group h-44 bg-slate-100">
              <img
                src={photoUrl}
                alt="Issue preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPhotoUrl('')}
                className="absolute top-2 right-2 bg-slate-900/70 hover:bg-slate-900 text-white p-1.5 rounded-full backdrop-blur-xs transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-700">
                Click to upload or drag photo here
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                PNG, JPG or WebP (Max 5MB)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          )}

          {/* Quick preset photo buttons for instant test */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-slate-400 font-medium">Test photos:</span>
            {SAMPLE_PHOTOS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPhotoUrl(sample.url)}
                className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <ImageIcon className="w-3 h-3" />
                <span>{sample.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reporter Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Flat / Unit Number
            </label>
            <input
              type="text"
              value={reporterUnit}
              onChange={(e) => setReporterUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-3 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Routing to Department...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Submit Issue Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
