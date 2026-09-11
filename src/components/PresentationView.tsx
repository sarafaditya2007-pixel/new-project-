import React, { useState, useEffect } from 'react';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Printer,
  Copy,
  Check,
  LayoutGrid,
  Database,
  Cpu,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Users,
  Building2,
  ArrowRight,
  Layers,
  Sparkles,
  DollarSign,
  Activity,
  CheckCircle2,
  Clock,
  MapPin,
  Flame,
  Radio,
  Share2
} from 'lucide-react';
import { ActiveTab } from '../types';

interface PresentationViewProps {
  onNavigate?: (tab: ActiveTab) => void;
}

export const PresentationView: React.FC<PresentationViewProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'slide' | 'all'>('slide');
  const [copied, setCopied] = useState(false);

  const slides = [
    {
      id: 'title',
      title: 'Project Title & Executive Overview',
      subtitle: 'Aapli Society — Smart Housing Society & Civic Grievance Ecosystem',
      icon: Building2,
      tag: 'Slide 01 • Introduction'
    },
    {
      id: 'problem',
      title: 'Problem Statement & Challenges',
      subtitle: 'Pain Points in Modern Apartment Complex & Gated Society Operations',
      icon: AlertTriangle,
      tag: 'Slide 02 • Problem Analysis'
    },
    {
      id: 'features',
      title: 'Core Features & Solution Matrix',
      subtitle: 'Dual-Persona Architecture: Resident Member Portal vs. Secretary Command Center',
      icon: ShieldCheck,
      tag: 'Slide 03 • Functional Scope'
    },
    {
      id: 'er_diagram',
      title: 'Entity Relationship (ER) Diagram',
      subtitle: 'Database Entities, Cardinality, Foreign Keys & Normalized Relational Schema',
      icon: Database,
      tag: 'Slide 04 • Data Architecture'
    },
    {
      id: 'system_architecture',
      title: 'System Architecture Diagram',
      subtitle: 'Layered Full-Stack Blueprint: Presentation, Logic, State, and Gateway Tiers',
      icon: Cpu,
      tag: 'Slide 05 • System Blueprint'
    },
    {
      id: 'process_grievance',
      title: 'Process Diagram: Issue Resolution',
      subtitle: 'Lifecycle Flow: Discovery, Priority Triage, Vendor Dispatch & Resolution Audit',
      icon: GitBranch,
      tag: 'Slide 06 • Grievance Workflow'
    },
    {
      id: 'process_dues_notices',
      title: 'Process Diagram: Dues & Emergency Broadcast',
      subtitle: 'Automated Billing, Receipt Generation & Real-time Alert Propagation Pipelines',
      icon: Activity,
      tag: 'Slide 07 • Financial & Admin Workflow'
    },
    {
      id: 'tech_stack',
      title: 'Technology Stack & Future Roadmap',
      subtitle: 'Core Engineering Pillars, Performance Metrics & Next-Phase Enhancements',
      icon: Layers,
      tag: 'Slide 08 • Tech & Vision'
    }
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode === 'all') return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentSlide]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyDeck = () => {
    const deckText = `
# AAPLI SOCIETY — PROJECT PRESENTATION DECK
Smart Housing Society Management & Civic Grievance Redressal Ecosystem

## SLIDE 1: TITLE & EXECUTIVE OVERVIEW
- Project: Aapli Society
- Mission: Modernize residential apartment living and gated community governance through transparent, paperless, real-time civic grievance tracking, financial accounting, and emergency broadcast infrastructure.
- Target Users: Flat Owners, Tenants, Managing Committee, Hon. Secretary, Facility Managers, Estate Security Guards.

## SLIDE 2: PROBLEM STATEMENT
1. Fragmented Communication: Crucial society grievances get lost in chaotic WhatsApp groups and informal chats without tracking IDs or status accountability.
2. Zero Resolution Transparency: Residents have no visibility into who is fixing issues (e.g. lift failure, water shortage, seepage), estimated time to repair (ETA), or contractor work order progress.
3. Accounting Discrepancies: Manual dues collection through paper checks and unverified UPI screenshots leads to bookkeeping errors, missed dues, and untracked sinking funds.
4. Amenity Booking Friction: Double-booking of clubhouse, tennis courts, and swimming pool due to manual registers.
5. Delayed Emergency Notices: Paper noticeboards and missed group messages fail to alert residents during emergency water shutdowns, fire drills, or power cuts.

## SLIDE 3: CORE FEATURES & CAPABILITIES
A. Member Portal:
- 1-Click Grievance Reporting with Photo attachments, category tagging, and location details.
- Visual Status Pipeline: Tracking from Submitted -> Assigned -> In Progress -> Resolved.
- Digital Maintenance Dues Checkout: Instant dues breakdown ($180/quarter) + verifiable digital receipt generator with verification barcode.
- Live Facility Passes: Real-time status for Pool, Gym, Banquet Hall with single-tap booking passes.
- Community Issue Upvoting: Democratic elevation of pressing residential problems.

B. Secretary Command Center:
- Issue Triage Engine: Vendor assignment, priority reassignment, and timestamped closing notes.
- Broadcast Urgent Notices: Society-wide emergency alert dispatches with high-priority banners.
- Financial Audit Dashboard: Real-time collection analytics ($38.2k collected, recovery rate tracking).
- Facility Master Controls: 1-click facility status toggle (Open, Maintenance, Booked).
- Gate Security Sentry Log: Visitor logging, contractor verification, and gate surveillance audit.

## SLIDE 4: ENTITY RELATIONSHIP (ER) DIAGRAM
- USER_PROFILE (PK id, role, name, email, unit, phone, societyName)
- RESIDENTIAL_UNIT (PK unit_id, tower, flat_number, floor, owner_id FK)
- ISSUE_TICKET (PK id, title, category, status, priority, reporter_id FK, photo_url, upvotes, map_coords, created_at)
- TIMELINE_EVENT (PK event_id, issue_id FK, status, label, date, note)
- TICKET_COMMENT (PK comment_id, issue_id FK, author, text, is_staff, created_at)
- SOCIETY_NOTICE (PK notice_id, title, content, category, urgent, author, created_at)
- FACILITY_AMENITY (PK facility_id, name, status, hours, booking_fee)
- DUES_TRANSACTION (PK txn_id, resident_id FK, unit_id, amount, status, receipt_no, paid_at)
Cardinalities:
- USER_PROFILE (1) -> (N) ISSUE_TICKET
- ISSUE_TICKET (1) -> (N) TIMELINE_EVENT
- ISSUE_TICKET (1) -> (N) TICKET_COMMENT
- USER_PROFILE (1) -> (N) DUES_TRANSACTION
- SOCIETY_NOTICE (1) -> Broadcasted to all Residents

## SLIDE 5: SYSTEM ARCHITECTURE
- Presentation Tier: React 18+, Tailwind CSS 4, Lucide Icons, Framer Motion, Responsive Bento Layout & Mobile Device Frame.
- Application / Logic Tier: Role-Based Access Control (RBAC Guard), Issue Lifecycle State Machine, Payment Receipt Generator, Emergency Dispatcher.
- Data & Persistence Tier: LocalStorage Synchronizer with schema versioning, Normalized relational models, Cloud Firestore / SQL ready interface.
- Output & Gateways: Interactive Spatial Map, Canvas Confetti UX feedback, Print-to-PDF presentation engine.

## SLIDE 6: PROCESS DIAGRAM — GRIEVANCE WORKFLOW
1. Resident discovers issue -> 2. Fills quick report form with photo -> 3. Ticket posted to live board -> 4. Community upvotes -> 5. Secretary assigns vendor/technician -> 6. Status changes to "In Progress" with timestamp -> 7. Work completed & Secretary verifies -> 8. Status set to "Resolved" with closing note -> 9. Satisfaction audit logged.

## SLIDE 7: PROCESS DIAGRAM — DUES & EMERGENCY BROADCAST
- Dues: Quarterly bill calculated -> Member reviews breakdown -> 1-Click Pay Simulation -> Confetti & Status update -> Verifiable digital receipt generated with download option.
- Notices: Secretary drafts urgent alert -> Emergency flag toggled -> Dispatched to resident feed -> High-priority banner displayed on Member Dashboard.

## SLIDE 8: TECH STACK & ROADMAP
- Technologies: React 18, TypeScript, Tailwind CSS, Vite, Canvas-Confetti, Recharts.
- Roadmap: IoT water meter automated telemetry, AI-assisted civic damage classification, WhatsApp notification bot, and gated community ANPR number-plate scanner integration.
`.trim();

    navigator.clipboard.writeText(deckText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Deck Control Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200">
            <Presentation className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Aapli Society Official Deck
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-500">8 High-Fidelity Slides</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0f172a] leading-tight">
              Project Architecture & System Presentation
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Toggle View Mode */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setViewMode('slide')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'slide' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Slide Mode</span>
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Slides</span>
            </button>
          </div>

          {/* Copy Markdown Text for PPT */}
          <button
            onClick={handleCopyDeck}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            title="Copy slide text formatted for PowerPoint / Google Slides"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied PPT Text!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy PPT Text</span>
              </>
            )}
          </button>

          {/* Print / Save as PDF */}
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            title="Print or Save all slides as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-xs"
            title="Toggle Fullscreen Presentation Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Slide Navigation Dots / Quick Jump bar (in Slide Mode) */}
      {viewMode === 'slide' && (
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  currentSlide === idx
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{idx + 1}.</span>
                <span className="hidden md:inline">{slide.title.split('&')[0].trim()}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-slate-200">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Previous Slide (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>
            <span className="text-xs font-bold text-slate-700 px-2 min-w-16 text-center">
              {currentSlide + 1} / {totalSlides}
            </span>
            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs"
              title="Next Slide (Right Arrow or Space)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDE RENDER AREA (Single Slide Mode OR All Slides Stacked Mode) */}
      {/* ========================================================================= */}
      <div className="space-y-8">
        {slides.map((slide, idx) => {
          if (viewMode === 'slide' && idx !== currentSlide) return null;

          return (
            <div
              key={slide.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all print:break-after-page print:border-none print:shadow-none"
            >
              {/* Slide Card Header */}
              <div className="bg-slate-900 text-white px-6 sm:px-8 py-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    0{idx + 1}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
                      {slide.tag}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {slide.title}
                    </h2>
                  </div>
                </div>
                <div className="text-xs text-slate-400 font-medium hidden sm:block">
                  {slide.subtitle}
                </div>
              </div>

              {/* Slide Main Body Content */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* ------------------------------------------------------------- */}
                {/* SLIDE 1: TITLE & EXECUTIVE OVERVIEW */}
                {/* ------------------------------------------------------------- */}
                {slide.id === 'title' && (
                  <div className="space-y-6">
                    <div className="bg-linear-to-br from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl">
                      <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                      <div className="relative z-10 max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide">
                          <Building2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>Smart Residential Operating System</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                          Aapli Society
                        </h1>
                        <p className="text-base sm:text-xl text-slate-300 font-medium leading-relaxed">
                          A full-spectrum, dual-role housing society management and civic grievance resolution
                          platform designed to bring transparency, accountability, and effortless financial
                          governance to modern residential communities.
                        </p>
                      </div>
                    </div>

                    {/* Executive Pillars Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">Dual-Role Persona Design</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Tailored interfaces for <strong>Society Members</strong> (complaint filing, dues payment, facility passes) and the <strong>Managing Secretary</strong> (triage, vendor AMC dispatch, sentry gate audits).
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Clock className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">Zero-Delay Audit Trail</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Every civic issue progresses through transparent lifecycle stages with timestamped administrative remarks, technician work logs, and democratic community upvoting.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">Integrated Dues & Ledger</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Eliminates manual bookkeeping through instant online dues settlement, automatic maintenance calculation, and digitally verifiable PDF receipt vouchers.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SLIDE 2: PROBLEM STATEMENT */}
                {/* ------------------------------------------------------------- */}
                {slide.id === 'problem' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-bold text-amber-950">Core Operational Bottlenecks in Gated Housing Societies</h3>
                        <p className="text-xs text-amber-800 mt-0.5">
                          Modern apartment complexes house hundreds of families, yet their daily governance still relies on chaotic messaging apps, paper circulars, and manual registers.
                        </p>
                      </div>
                    </div>

                    {/* Problem vs. Aapli Solution Comparison Table */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Before / Traditional State */}
                      <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
                        <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          <span>Traditional Manual System (Failure Points)</span>
                        </div>
                        <ul className="space-y-2.5 text-xs text-slate-700">
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-rose-600">❌</span>
                            <span><strong>Buried Complaints:</strong> Urgent water leaks or lift halts posted in 500-member WhatsApp chats get swamped by casual messages.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-rose-600">❌</span>
                            <span><strong>Zero Accountability:</strong> No tracking ID or assigned technician. Residents repeatedly call committee members for status updates.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-rose-600">❌</span>
                            <span><strong>Haphazard Dues Accounting:</strong> Residents pay via fragmented bank transfers with unconfirmed screenshots, causing disputes.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-rose-600">❌</span>
                            <span><strong>Facility Clashes:</strong> Paper registers lead to double-booking of clubhouse, pool maintenance negligence, and overcrowding.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-rose-600">❌</span>
                            <span><strong>Ignored Emergency Notices:</strong> Paper notice boards and missed chat notifications lead to water tank cleaning disruptions.</span>
                          </li>
                        </ul>
                      </div>

                      {/* After / Aapli Society Solution */}
                      <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>The Aapli Society Modern Approach</span>
                        </div>
                        <ul className="space-y-2.5 text-xs text-slate-700">
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-emerald-600">✓</span>
                            <span><strong>Dedicated Ticket Pipeline:</strong> Structured categorization (Water, Elevator, Electrical) with photo evidence and map pins.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-emerald-600">✓</span>
                            <span><strong>Live Timeline Audit:</strong> Full transparency from submission to AMC vendor dispatch to final resolution with notes.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-emerald-600">✓</span>
                            <span><strong>1-Click Dues & Verifiable Receipts:</strong> Instant bill calculation, simulated checkout, and downloadable barcode receipts.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-emerald-600">✓</span>
                            <span><strong>Dynamic Facility Status:</strong> Live state toggle (Open / Maintenance / Booked) with transparent usage rules.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-emerald-600">✓</span>
                            <span><strong>Urgent Emergency Broadcast:</strong> Direct high-priority banner propagation to all resident screens within seconds.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SLIDE 3: FEATURES & ROLE-BASED ACCESS CONTROL */}
                {/* ------------------------------------------------------------- */}
                {slide.id === 'features' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Column 1: Member Features */}
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                              M
                            </div>
                            <h3 className="text-sm font-bold text-slate-900">Resident Member Portal</h3>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            Flat Owners & Tenants
                          </span>
                        </div>
                        <div className="space-y-2 text-xs text-slate-600">
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                            <strong className="text-slate-900 block">1. 30-Second Issue Reporting</strong>
                            Photo capture, category selector, urgency tagging, and auto-populated flat details.
                          </div>
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                            <strong className="text-slate-900 block">2. Personal Complaint Tracker</strong>
                            Track personal tickets, timeline updates, vendor remarks, and community upvotes.
                          </div>
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                            <strong className="text-slate-900 block">3. Digital Maintenance Dues Checkout</strong>
                            Review $180 quarterly dues, pay dues online, and download verifiable tax receipts.
                          </div>
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                            <strong className="text-slate-900 block">4. Amenity Passes & Society Noticeboard</strong>
                            Check live hours and status for Swimming Pool, Gym, and Tennis Courts.
                          </div>
                        </div>
                      </div>

                      {/* Column 2: Secretary Features */}
                      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                              S
                            </div>
                            <h3 className="text-sm font-bold text-white">Secretary Command Center</h3>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                            Managing Committee
                          </span>
                        </div>
                        <div className="space-y-2 text-xs text-slate-300">
                          <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700/80">
                            <strong className="text-white block">1. Grievance Triage & AMC Work Orders</strong>
                            Assign technicians, update ticket status, record cost notes, and resolve complaints.
                          </div>
                          <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700/80">
                            <strong className="text-white block">2. Broadcast Urgent Society Circulars</strong>
                            Deploy instant emergency banners for water shutoffs, lift maintenance, or AGM notices.
                          </div>
                          <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700/80">
                            <strong className="text-white block">3. Dues Recovery & Reserve Analytics</strong>
                            Live metrics on society fund collections ($38.2k), outstanding arrears, and reserve balance.
                          </div>
                          <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700/80">
                            <strong className="text-white block">4. Sentry Security Gate Logs & Facilities</strong>
                            Audit visitor vehicular logs, delivery entry records, and toggle amenity availability.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SLIDE 4: ENTITY RELATIONSHIP (ER) DIAGRAM */}
                {/* ------------------------------------------------------------- */}
                {slide.id === 'er_diagram' && (
                  <div className="space-y-6">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-blue-900 font-bold">
                        <Database className="w-4 h-4 text-blue-600" />
                        <span>Relational Schema & Entity Relationships (3NF Normalized)</span>
                      </div>
                      <span className="text-blue-700 font-medium">8 Entities • Normalized Foreign Keys</span>
                    </div>

                    {/* Visual ER Diagram Canvas */}
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-white overflow-x-auto">
                      <div className="min-w-[700px] grid grid-cols-3 gap-6 relative">
                        {/* Entity 1: USER_PROFILE */}
                        <div className="bg-slate-900 border-2 border-blue-500 rounded-xl p-3 shadow-lg">
                          <div className="bg-blue-600 text-white text-[11px] font-bold px-2 py-1 rounded-md mb-2 flex items-center justify-between">
                            <span>USER_PROFILE</span>
                            <span className="text-[9px] opacity-80">Parent Entity</span>
                          </div>
                          <div className="text-[10px] font-mono space-y-1 text-slate-300">
                            <div className="text-amber-400 font-bold">🔑 PK: id (UUID)</div>
                            <div>• role: ENUM ('member', 'secretary')</div>
                            <div>• name: VARCHAR(100)</div>
                            <div>• email: VARCHAR(120)</div>
                            <div>• phone: VARCHAR(20)</div>
                            <div>• unit: VARCHAR(40)</div>
                            <div>• designation: VARCHAR(80)</div>
                            <div>• societyName: VARCHAR(120)</div>
                          </div>
                        </div>

                        {/* Entity 2: ISSUE_TICKET */}
                        <div className="bg-slate-900 border-2 border-emerald-500 rounded-xl p-3 shadow-lg">
                          <div className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-1 rounded-md mb-2 flex items-center justify-between">
                            <span>ISSUE_TICKET</span>
                            <span className="text-[9px] opacity-80">Core Grievance</span>
                          </div>
                          <div className="text-[10px] font-mono space-y-1 text-slate-300">
                            <div className="text-amber-400 font-bold">🔑 PK: id (VARCHAR)</div>
                            <div className="text-blue-400">🔗 FK: reporter_id -&gt; USER</div>
                            <div>• title: VARCHAR(150)</div>
                            <div>• category: ENUM(10 civic types)</div>
                            <div>• status: ENUM ('Pending','In Progress','Resolved')</div>
                            <div>• priority: ENUM ('Low','Med','High','Urgent')</div>
                            <div>• address: TEXT</div>
                            <div>• photoUrl: VARCHAR(255)</div>
                            <div>• upvotes: INTEGER</div>
                            <div>• mapCoords: JSON (x, y)</div>
                          </div>
                        </div>

                        {/* Entity 3: TIMELINE_EVENT */}
                        <div className="bg-slate-900 border-2 border-purple-500 rounded-xl p-3 shadow-lg">
                          <div className="bg-purple-600 text-white text-[11px] font-bold px-2 py-1 rounded-md mb-2 flex items-center justify-between">
                            <span>TIMELINE_EVENT</span>
                            <span className="text-[9px] opacity-80">Audit Trail</span>
                          </div>
                          <div className="text-[10px] font-mono space-y-1 text-slate-300">
                            <div className="text-amber-400 font-bold">🔑 PK: event_id (UUID)</div>
                            <div className="text-emerald-400">🔗 FK: issue_id -&gt; ISSUE</div>
                            <div>• status: VARCHAR(30)</div>
                            <div>• label: VARCHAR(100)</div>
                            <div>• date: VARCHAR(40)</div>
                            <div>• note: TEXT (Admin remark)</div>
                          </div>
                        </div>

                        {/* Row 2: Secondary Entities */}
                        {/* Entity 4: DUES_TRANSACTION */}
                        <div className="bg-slate-900 border-2 border-amber-500 rounded-xl p-3 shadow-lg">
                          <div className="bg-amber-600 text-white text-[11px] font-bold px-2 py-1 rounded-md mb-2 flex items-center justify-between">
                            <span>DUES_TRANSACTION</span>
                            <span className="text-[9px] opacity-80">Billing Ledger</span>
                          </div>
                          <div className="text-[10px] font-mono space-y-1 text-slate-300">
                            <div className="text-amber-400 font-bold">🔑 PK: txn_id (UUID)</div>
                            <div className="text-blue-400">🔗 FK: resident_id -&gt; USER</div>
                            <div>• unit: VARCHAR(30)</div>
                            <div>• amount: DECIMAL(10,2)</div>
                            <div>• period: VARCHAR(30)</div>
                            <div>• status: 'PAID' | 'PENDING'</div>
                            <div>• receipt_no: VARCHAR(50)</div>
                            <div>• paid_at: TIMESTAMP</div>
                          </div>
                        </div>

                        {/* Entity 5: SOCIETY_NOTICE */}
                        <div className="bg-slate-900 border-2 border-rose-500 rounded-xl p-3 shadow-lg">
                          <div className="bg-rose-600 text-white text-[11px] font-bold px-2 py-1 rounded-md mb-2 flex items-center justify-between">
                            <span>SOCIETY_NOTICE</span>
                            <span className="text-[9px] opacity-80">Broadcast Circulars</span>
                          </div>
                          <div className="text-[10px] font-mono space-y-1 text-slate-300">
                            <div className="text-amber-400 font-bold">🔑 PK: notice_id (UUID)</div>
                            <div className="text-blue-400">🔗 FK: author_id -&gt; USER</div>
                            <div>• title: VARCHAR(150)</div>
                            <div>• content: TEXT</div>
                            <div>• category: ENUM</div>
                            <div>• urgent: BOOLEAN</div>
                            <div>• date: VARCHAR(30)</div>
                          </div>
                        </div>

                        {/* Entity 6: FACILITY_ITEM */}
                        <div className="bg-slate-900 border-2 border-teal-500 rounded-xl p-3 shadow-lg">
                          <div className="bg-teal-600 text-white text-[11px] font-bold px-2 py-1 rounded-md mb-2 flex items-center justify-between">
                            <span>FACILITY_ITEM</span>
                            <span className="text-[9px] opacity-80">Amenities</span>
                          </div>
                          <div className="text-[10px] font-mono space-y-1 text-slate-300">
                            <div className="text-amber-400 font-bold">🔑 PK: id (VARCHAR)</div>
                            <div>• name: VARCHAR(80)</div>
                            <div>• status: 'Open' | 'Maintenance' | 'Booked'</div>
                            <div>• hours: VARCHAR(40)</div>
                            <div>• bookingFee: VARCHAR(30)</div>
                          </div>
                        </div>
                      </div>

                      {/* Cardinality Connectors Explanation */}
                      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                        <span><strong>1 : N</strong> Relationship: USER_PROFILE ➔ ISSUE_TICKET (One resident can log multiple issues)</span>
                        <span><strong>1 : N</strong> Relationship: ISSUE_TICKET ➔ TIMELINE_EVENT (One ticket contains complete event history)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SLIDE 5: SYSTEM ARCHITECTURE DIAGRAM */}
                {/* ------------------------------------------------------------- */}
                {slide.id === 'system_architecture' && (
                  <div className="space-y-6">
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-indigo-900 font-bold">
                        <Cpu className="w-4 h-4 text-indigo-600" />
                        <span>Multi-Tiered Client-Centric Application Architecture</span>
                      </div>
                      <span className="text-indigo-700 font-medium">Modular Separation of Concerns</span>
                    </div>

                    {/* Architecture Layers Graphic */}
                    <div className="space-y-3">
                      {/* Layer 1: Presentation Tier */}
                      <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                            L1
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Client Presentation Tier</span>
                            <h4 className="text-sm font-bold text-slate-900">React 18 + Tailwind 4 Responsive Bento GUI</h4>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[11px]">
                          <span className="px-2 py-0.5 bg-white rounded-md border border-blue-200 text-blue-800 font-medium">Member Dashboard</span>
                          <span className="px-2 py-0.5 bg-white rounded-md border border-blue-200 text-blue-800 font-medium">Secretary Command Center</span>
                          <span className="px-2 py-0.5 bg-white rounded-md border border-blue-200 text-blue-800 font-medium">Spatial Coordinates Map</span>
                          <span className="px-2 py-0.5 bg-white rounded-md border border-blue-200 text-blue-800 font-medium">Mobile Device Simulator</span>
                        </div>
                      </div>

                      <div className="flex justify-center -my-1 text-slate-400">
                        <ArrowRight className="w-4 h-4 rotate-90" />
                      </div>

                      {/* Layer 2: Application / Business Logic Tier */}
                      <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                            L2
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Application Logic Tier</span>
                            <h4 className="text-sm font-bold text-slate-900">RBAC Security, State Machine & Triage Engine</h4>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[11px]">
                          <span className="px-2 py-0.5 bg-white rounded-md border border-indigo-200 text-indigo-800 font-medium">RBAC Gateway Guard</span>
                          <span className="px-2 py-0.5 bg-white rounded-md border border-indigo-200 text-indigo-800 font-medium">Ticket Lifecycle State Engine</span>
                          <span className="px-2 py-0.5 bg-white rounded-md border border-indigo-200 text-indigo-800 font-medium">Maintenance Dues Calculator</span>
                          <span className="px-2 py-0.5 bg-white rounded-md border border-indigo-200 text-indigo-800 font-medium">Notice Dispatcher</span>
                        </div>
                      </div>

                      <div className="flex justify-center -my-1 text-slate-400">
                        <ArrowRight className="w-4 h-4 rotate-90" />
                      </div>

                      {/* Layer 3: Persistence & Storage Tier */}
                      <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                            L3
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Data & Persistence Tier</span>
                            <h4 className="text-sm font-bold text-slate-900">Reactive Store with Cloud-Database Normalization</h4>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[11px]">
                          <span className="px-2 py-0.5 bg-white rounded-md border border-emerald-200 text-emerald-800 font-medium">Reactive LocalStorage Sync</span>
                          <span className="px-2 py-0.5 bg-white rounded-md border border-emerald-200 text-emerald-800 font-medium">Versioned Key Migration</span>
                          <span className="px-2 py-0.5 bg-white rounded-md border border-emerald-200 text-emerald-800 font-medium">Audit Append Log</span>
                          <span className="px-2 py-0.5 bg-white rounded-md border border-emerald-200 text-emerald-800 font-medium">Cloud Firestore Ready Adapter</span>
                        </div>
                      </div>

                      <div className="flex justify-center -my-1 text-slate-400">
                        <ArrowRight className="w-4 h-4 rotate-90" />
                      </div>

                      {/* Layer 4: Micro-engines & External Services */}
                      <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                            L4
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Integration & Output Services</span>
                            <h4 className="text-sm font-bold text-slate-900">Export Engines, Confetti UX & Spatial Plotters</h4>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[11px]">
                          <span className="px-2 py-0.5 bg-white rounded-md border border-purple-200 text-purple-800 font-medium">Canvas Confetti Engine</span>
                          <span className="px-2 py-0.5 bg-white rounded-md border border-purple-200 text-purple-800 font-medium">Print-to-PDF Receipt Generator</span>
                          <span className="px-2 py-0.5 bg-white rounded-md border border-purple-200 text-purple-800 font-medium">Interactive Spatial SVG Plotter</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SLIDE 6: PROCESS DIAGRAM — GRIEVANCE WORKFLOW */}
                {/* ------------------------------------------------------------- */}
                {slide.id === 'process_grievance' && (
                  <div className="space-y-6">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold">
                        <GitBranch className="w-4 h-4 text-emerald-600" />
                        <span>End-to-End Civic Grievance Resolution Lifecycle</span>
                      </div>
                      <span className="text-emerald-700 font-medium">5 Sequential Milestone Gates</span>
                    </div>

                    {/* Step-by-Step Interactive Flowchart */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
                      {/* Step 1 */}
                      <div className="p-4 rounded-2xl bg-white border-2 border-blue-200 space-y-2 shadow-xs relative">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                          1
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide block">Discovery</span>
                        <h4 className="text-xs font-bold text-slate-900">Resident Submits Issue</h4>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          Uploads picture, selects category (e.g. Elevator halt), tags priority & flat number.
                        </p>
                      </div>

                      {/* Step 2 */}
                      <div className="p-4 rounded-2xl bg-white border-2 border-indigo-200 space-y-2 shadow-xs relative">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                          2
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide block">Broadcast</span>
                        <h4 className="text-xs font-bold text-slate-900">Live Ticket Generated</h4>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          Published to society live track board; neighbors can upvote pressing issues.
                        </p>
                      </div>

                      {/* Step 3 */}
                      <div className="p-4 rounded-2xl bg-white border-2 border-amber-200 space-y-2 shadow-xs relative">
                        <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                          3
                        </div>
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide block">Triage</span>
                        <h4 className="text-xs font-bold text-slate-900">Secretary Review & AMC</h4>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          Secretary inspects report, contacts vendor AMC, and flags status to "In Progress".
                        </p>
                      </div>

                      {/* Step 4 */}
                      <div className="p-4 rounded-2xl bg-white border-2 border-purple-200 space-y-2 shadow-xs relative">
                        <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                          4
                        </div>
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wide block">Execution</span>
                        <h4 className="text-xs font-bold text-slate-900">Technician Dispatched</h4>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          Physical repairs conducted on site; work notes and parts cost recorded.
                        </p>
                      </div>

                      {/* Step 5 */}
                      <div className="p-4 rounded-2xl bg-white border-2 border-emerald-300 space-y-2 shadow-xs relative bg-emerald-50/40">
                        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                          5
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide block">Closure</span>
                        <h4 className="text-xs font-bold text-slate-900">Inspection & Resolution</h4>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          Secretary verifies work, closes ticket to "Resolved", resident notified with resolution notes.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                      <strong className="text-slate-900 block font-semibold">Audit Guarantee:</strong>
                      <span>Every ticket maintains an immutable timeline with exact timestamps, administrative remarks, and user IDs, ensuring complete historical accountability for society General Body meetings (AGMs).</span>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SLIDE 7: PROCESS DIAGRAM — DUES & EMERGENCY BROADCAST */}
                {/* ------------------------------------------------------------- */}
                {slide.id === 'process_dues_notices' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Flow 1: Maintenance Dues Flow */}
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-blue-900 font-bold text-xs uppercase tracking-wider">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                          <span>Maintenance Payment & Receipting Pipeline</span>
                        </div>
                        <div className="space-y-2.5 text-xs text-slate-700">
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                            <div>
                              <strong>Quarterly Dues Assessment:</strong> System calculates maintenance fee, sinking fund reserve, and amenity service charges ($180 total).
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                            <div>
                              <strong>1-Click Payment Checkout:</strong> Resident clicks "Pay Dues", reviews itemized breakdown, and simulates card/UPI settlement.
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                            <div>
                              <strong>Ledger Reconciliation:</strong> Database marks dues as 'PAID' and increments society's reserve fund treasury ($38.2k).
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
                            <div>
                              <strong>Official PDF Receipt:</strong> Generates formatted tax receipt complete with invoice number, payment timestamp, and barcode.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Flow 2: Emergency Notice Broadcast Flow */}
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-rose-900 font-bold text-xs uppercase tracking-wider">
                          <Radio className="w-4 h-4 text-rose-600" />
                          <span>Emergency Circular Propagation Pipeline</span>
                        </div>
                        <div className="space-y-2.5 text-xs text-slate-700">
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                            <div>
                              <strong>Secretary Alert Composition:</strong> Drafts urgent notice (e.g., "Overhead Water Tank Cleaning & Supply Halt").
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                            <div>
                              <strong>Urgency Tagging:</strong> Marked as 'Urgent' or 'Emergency', bypassing standard notification queues.
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                            <div>
                              <strong>Synchronous State Distribution:</strong> Dispatched to society-wide datastore, immediately popping up on Member dashboards.
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
                            <div>
                              <strong>Archived into Official Circulars:</strong> Persisted in society noticeboard repository for future resident reference.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SLIDE 8: TECH STACK & ROADMAP */}
                {/* ------------------------------------------------------------- */}
                {slide.id === 'tech_stack' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Tech Stack Pillars */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-600" />
                          <span>Production Technology Stack</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <strong className="text-slate-900 block font-semibold">Frontend Core</strong>
                            <span className="text-slate-600">React 18, TypeScript, Vite</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <strong className="text-slate-900 block font-semibold">Styling Engine</strong>
                            <span className="text-slate-600">Tailwind CSS 4, Bento Layout</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <strong className="text-slate-900 block font-semibold">Icons & Animations</strong>
                            <span className="text-slate-600">Lucide-React, Canvas Confetti</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <strong className="text-slate-900 block font-semibold">Cloud Ready Adapter</strong>
                            <span className="text-slate-600">Firestore / Cloud SQL Schemas</span>
                          </div>
                        </div>
                      </div>

                      {/* Future Enhancements Roadmap */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <span>Next-Phase Production Roadmap</span>
                        </h3>
                        <div className="space-y-2 text-xs text-slate-600">
                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span><strong>AI Civic Damage Classifier:</strong> Automated Gemini vision analysis to detect pothole severity or water seepage from photo uploads.</span>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span><strong>IoT Water Tank & Meter Telemetry:</strong> Live sensor dashboards showing overhead water tank capacity and daily unit consumption.</span>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span><strong>Automated WhatsApp Bot Gateway:</strong> Instant push notifications to residents when their ticket status advances or dues are paid.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Wrap-Up Banner */}
                    <div className="p-4 bg-linear-to-r from-blue-900 to-indigo-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold">Ready to experience Aapli Society?</h4>
                        <p className="text-xs text-slate-300">Navigate between Resident Member and Secretary portals live in the app.</p>
                      </div>
                      {onNavigate && (
                        <button
                          onClick={() => onNavigate('home')}
                          className="px-4 py-2 bg-white text-blue-950 hover:bg-blue-50 font-bold rounded-xl text-xs transition-colors shrink-0 shadow-sm"
                        >
                          Launch App Dashboard &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Slide Footer */}
              <div className="bg-slate-50 px-6 sm:px-8 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Aapli Society</span>
                  <span>•</span>
                  <span>Housing Society ERP & Civic Redressal</span>
                </div>
                <div>
                  Slide {idx + 1} of {totalSlides}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Presenter Navigation in Slide Mode (Bottom Center) */}
      {viewMode === 'slide' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-4 border border-slate-700/80">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-1.5 rounded-full hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-xs font-bold tracking-wide">
            <span className="text-blue-400 font-extrabold">{currentSlide + 1}</span>
            <span className="text-slate-500"> / </span>
            <span className="text-slate-300">{totalSlides}</span>
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="p-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Next (Right Arrow or Space)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
