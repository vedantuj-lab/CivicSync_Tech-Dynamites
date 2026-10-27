import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  Building2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Star,
  Send,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { CivicReport, UserProfile } from '../../types/civic';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { civicStore } from '../../services/store';

interface ReportDetailViewProps {
  report: CivicReport;
  currentUser: UserProfile;
  onBack: () => void;
}

export const ReportDetailView: React.FC<ReportDetailViewProps> = ({
  report,
  currentUser,
  onBack
}) => {
  const [moreInfoInput, setMoreInfoInput] = useState('');
  const [confirmFeedback, setConfirmFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [disputeReason, setDisputeReason] = useState('');

  const isOwner = report.submittedBy.id === currentUser.id;
  const isResolved = report.status === 'resolved';
  const isAwaitingInfo = report.status === 'more_info_required';

  const handleSendMoreInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moreInfoInput.trim()) return;
    civicStore.submitCitizenMoreInfo(report.id, moreInfoInput.trim());
    setMoreInfoInput('');
    alert('Clarification successfully submitted to municipal operations!');
  };

  const handleCitizenConfirm = () => {
    civicStore.citizenConfirmOrReopen(report.id, true, confirmFeedback, rating);
    alert('Resolution confirmed. Thank you for making your community safer!');
  };

  const handleCitizenDispute = () => {
    if (!disputeReason.trim()) {
      alert('Please specify why the resolution appears incomplete or unsatisfactory.');
      return;
    }
    civicStore.citizenConfirmOrReopen(report.id, false, disputeReason.trim());
    setDisputeReason('');
    alert('Report has been reopened and escalated back to municipal operations.');
  };

  return (
    <div className="bg-[#F5F7EF] min-h-screen text-[#25332D] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-[#176B52] hover:underline mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reports List</span>
        </button>

        {/* Header Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#176B52]/15 shadow-xl mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#176B52]">{report.reportNumber}</span>
              <StatusBadge status={report.status} />
              <PriorityBadge priority={report.priority} />
            </div>
            <span className="text-xs text-stone-500 font-mono">
              Submitted: {new Date(report.createdAt).toLocaleString()}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
            {report.title}
          </h1>

          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-6 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            {report.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600 border-t border-stone-200 pt-4">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#176B52] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-stone-900">{report.location.address}</div>
                <div className="text-[11px] text-stone-500">{report.location.district}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-[#176B52] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-stone-900">{report.organizationName}</div>
                <div className="text-[11px] text-stone-500">{report.departmentName || 'Triage Queue'}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-[#176B52] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-stone-900">
                  {report.assignedStaff ? report.assignedStaff.name : 'Awaiting Crew Assignment'}
                </div>
                <div className="text-[11px] text-stone-500">
                  {report.assignedStaff ? report.assignedStaff.role : 'Operations Desk'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CITIZEN RESPONSE TO MORE INFO REQUIRED */}
        {isAwaitingInfo && (
          <div className="bg-cyan-50 border-2 border-cyan-300 rounded-3xl p-6 mb-6 shadow-md">
            <div className="flex items-center gap-2 text-cyan-900 font-bold text-sm mb-2">
              <AlertTriangle className="w-5 h-5 text-cyan-600" />
              <span>Municipal Operations Requested Additional Clarification</span>
            </div>
            <p className="text-xs text-cyan-800 mb-4 bg-white p-3 rounded-xl border border-cyan-200">
              "{report.moreInfoRequestedNotes || 'Please provide more details regarding access to the site or specific damage severity.'}"
            </p>
            <form onSubmit={handleSendMoreInfo} className="space-y-3">
              <textarea
                rows={3}
                required
                value={moreInfoInput}
                onChange={(e) => setMoreInfoInput(e.target.value)}
                placeholder="Type your response to the municipal supervisor here..."
                className="w-full p-3 rounded-xl border border-cyan-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Clarification</span>
              </button>
            </form>
          </div>
        )}

        {/* CITIZEN RESOLUTION CONFIRMATION / DISPUTE */}
        {isResolved && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 mb-6 shadow-md">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-base mb-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span>Field Work Verified & Marked Resolved</span>
            </div>
            <p className="text-xs text-emerald-800 mb-4">
              The municipal supervisor has certified the repairs. As the reporting resident, please inspect the work below and confirm closure, or reopen the ticket if the problem persists.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Option A: Confirm */}
              <div className="bg-white p-4 rounded-2xl border border-emerald-200">
                <h4 className="font-bold text-xs text-emerald-900 uppercase tracking-wider mb-2">
                  Confirm Satisfaction & Close
                </h4>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-600 ml-2">{rating}/5 Stars</span>
                </div>
                <input
                  type="text"
                  placeholder="Optional note for the repair crew..."
                  value={confirmFeedback}
                  onChange={(e) => setConfirmFeedback(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 mb-3"
                />
                <button
                  onClick={handleCitizenConfirm}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Confirm Issue Resolved
                </button>
              </div>

              {/* Option B: Dispute */}
              <div className="bg-white p-4 rounded-2xl border border-rose-200">
                <h4 className="font-bold text-xs text-rose-900 uppercase tracking-wider mb-2">
                  Dispute Resolution / Reopen
                </h4>
                <p className="text-[11px] text-stone-500 mb-2">
                  If the hazard was not fixed or re-emerged immediately, state the defect:
                </p>
                <textarea
                  rows={2}
                  placeholder="Explain why problem is not solved..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs text-stone-900 mb-3"
                />
                <button
                  onClick={handleCitizenDispute}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Dispute & Reopen Ticket
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Supporting Evidence Photos */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#176B52]/15 shadow-xl mb-6">
          <h3 className="font-heading font-bold text-lg text-stone-900 mb-4">
            Photographic Verification Evidence
          </h3>

          {report.evidence.length === 0 ? (
            <p className="text-xs text-stone-400 italic">No attached photographic evidence.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {report.evidence.map((ev) => (
                <div key={ev.id} className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-stone-50">
                  <img src={ev.url} alt={ev.caption} className="w-full h-44 object-cover" />
                  <div className="p-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-stone-200 font-bold text-stone-700">
                      {ev.type.replace('_', ' ')}
                    </span>
                    <p className="text-xs text-stone-700 font-medium mt-1.5 leading-snug">{ev.caption}</p>
                    <span className="text-[10px] text-stone-400 block mt-1 font-mono">
                      By {ev.uploadedBy} &bull; {new Date(ev.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transparent Workflow Timeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#176B52]/15 shadow-xl">
          <h3 className="font-heading font-bold text-lg text-stone-900 mb-6">
            Immutable Status & Audit Lifecycle
          </h3>

          <div className="relative border-l-2 border-[#176B52]/20 ml-4 space-y-6">
            {report.timeline.map((event, idx) => (
              <div key={event.id} className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#176B52] border-2 border-white" />
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h4 className="font-bold text-sm text-stone-900">{event.title}</h4>
                  <span className="text-[10px] font-mono text-stone-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
                {event.note && (
                  <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-200 mb-1.5">
                    {event.note}
                  </p>
                )}
                <div className="text-[11px] text-stone-400 font-mono">
                  Actor: <span className="font-semibold text-stone-700">{event.actorName}</span> ({event.actorRole.replace('_', ' ')})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
