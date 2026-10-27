import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { IssueCategory, PriorityLevel, CivicReport } from '../../types/civic';
import { InteractiveMap } from '../common/InteractiveMap';
import { civicStore } from '../../services/store';

interface ReportIssueWizardProps {
  categories: IssueCategory[];
  preselectedCategoryId?: string;
  onCancel: () => void;
  onSuccess: (report: CivicReport) => void;
}

const SAMPLE_INCIDENT_PHOTOS = [
  { label: 'Deep Pothole / Street Crack', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80' },
  { label: 'Flooded Drain Grate', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Flickering Streetlight Fixture', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80' },
  { label: 'Overflowing Public Waste Bin', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80' },
  { label: 'Broken Sidewalk / Pavement Slab', url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80' }
];

export const ReportIssueWizard: React.FC<ReportIssueWizardProps> = ({
  categories,
  preselectedCategoryId,
  onCancel,
  onSuccess
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedCatId, setSelectedCatId] = useState<string>(preselectedCategoryId || categories[0]?.id || 'cat_roads');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  
  // Location
  const [address, setAddress] = useState('742 Lincoln Blvd & 8th Street');
  const [landmark, setLandmark] = useState('');
  const [district, setDistrict] = useState('Central Metro District');
  const [lat, setLat] = useState<number>(37.7749);
  const [lng, setLng] = useState<number>(-122.4194);
  
  // Evidence
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_INCIDENT_PHOTOS[0].url);
  const [photoCaption, setPhotoCaption] = useState('Citizen field submission');
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  // Duplicate Check
  const [duplicates, setDuplicates] = useState<CivicReport[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  const handleNextToLocation = () => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill out the issue title and detailed description.');
      return;
    }
    setStep(3);
  };

  const handleNextToEvidence = () => {
    if (!address.trim()) {
      alert('Please specify a street address or click on the map.');
      return;
    }
    // Perform deterministic duplicate check
    const matched = civicStore.checkPossibleDuplicates(selectedCatId, lat, lng, title);
    setDuplicates(matched);
    setStep(4);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    try {
      const finalPhoto = customPhotoInput.trim() || photoUrl;
      const newReport = civicStore.createReport({
        title,
        description,
        categoryId: selectedCatId,
        address,
        landmark: landmark.trim() || undefined,
        district,
        lat,
        lng,
        priority,
        evidencePhotoUrl: finalPhoto,
        caption: photoCaption
      });
      setIsSubmitting(false);
      onSuccess(newReport);
    } catch (e: any) {
      setIsSubmitting(false);
      alert(e.message || 'Submission error');
    }
  };

  return (
    <div className="bg-[#F5F7EF] min-h-screen text-[#25332D] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Wizard Header (Forest Green theme) */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-xs font-bold text-[#176B52] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel & Return to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#176B52]">
            <span>Step {step} of 4</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#176B52]/15 h-2 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-[#176B52] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Main Step Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#176B52]/10">
          {/* STEP 1: CATEGORY SELECTION */}
          {step === 1 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-mono uppercase text-[#176B52] font-bold tracking-wider">
                  Phase 1: Domain Classification
                </span>
                <h2 className="font-heading text-2xl font-bold text-[#176B52] mt-1">
                  What type of civic problem are you reporting?
                </h2>
                <p className="text-stone-500 text-xs mt-1">
                  Categorizing ensures your ticket routes directly to the specialized municipal department.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {categories.map((cat) => {
                  const isSelected = cat.id === selectedCatId;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCatId(cat.id)}
                      className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#176B52] bg-[#176B52]/5 shadow-md'
                          : 'border-stone-200 hover:border-[#176B52]/40 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-heading font-bold text-sm text-stone-900">{cat.name}</h3>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-[#176B52]" />}
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed mb-3">{cat.description}</p>
                      </div>
                      <div className="text-[11px] font-mono text-[#176B52] font-semibold">
                        Routed to: {cat.defaultDepartmentName} &bull; SLA {cat.slaHours}h
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-[#176B52] hover:bg-[#125541] text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Continue to Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS & PRIORITY */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-mono uppercase text-[#176B52] font-bold tracking-wider">
                  Phase 2: Issue Particulars
                </span>
                <h2 className="font-heading text-2xl font-bold text-[#176B52] mt-1">
                  Describe the Issue & Hazard Level
                </h2>
                <p className="text-stone-500 text-xs mt-1">
                  Category: <span className="font-bold text-stone-800">{selectedCategory.name}</span>
                </p>
              </div>

              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Issue Title / Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deep pothole causing rim damage at elementary school crossing"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Detailed Observations & Impact *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe specific dimensions, visible damage, duration of occurrence, and immediate safety hazards for pedestrians or vehicles..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#176B52] leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Initial Priority Context
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { val: 'low', label: 'Low', desc: 'Cosmetic / Minor' },
                      { val: 'medium', label: 'Medium', desc: 'Standard Triage' },
                      { val: 'high', label: 'High', desc: 'Disrupts Traffic/Flow' },
                      { val: 'urgent', label: 'Urgent', desc: 'Immediate Hazard' }
                    ].map((p) => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => setPriority(p.val as PriorityLevel)}
                        className={`p-3 rounded-xl border text-left transition ${
                          priority === p.val
                            ? 'border-[#176B52] bg-[#176B52]/10 text-[#176B52] font-bold shadow-sm'
                            : 'border-stone-200 hover:border-stone-400 text-stone-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{p.label}</div>
                        <div className="text-[10px] text-stone-500">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  onClick={handleNextToLocation}
                  className="px-6 py-3 rounded-xl bg-[#176B52] hover:bg-[#125541] text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Continue to Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION & MAP PIN */}
          {step === 3 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-mono uppercase text-[#176B52] font-bold tracking-wider">
                  Phase 3: Geographic Pin
                </span>
                <h2 className="font-heading text-2xl font-bold text-[#176B52] mt-1">
                  Specify Exact Location
                </h2>
                <p className="text-stone-500 text-xs mt-1">
                  Click anywhere on the interactive map below or enter the nearest intersection/landmark.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Street Address / Intersection *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 742 Lincoln Blvd & 8th Street"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Landmark / Cross Street (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. In front of Elementary School crosswalk"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                    />
                  </div>
                </div>

                {/* Interactive Map Picker */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 text-xs">
                    <span className="font-bold text-stone-700 uppercase">Pinpoint Location on Map</span>
                    <span className="font-mono text-[#176B52] text-[11px]">
                      GPS: {lat.toFixed(4)}° N, {Math.abs(lng).toFixed(4)}° W
                    </span>
                  </div>
                  <InteractiveMap
                    pickerMode={true}
                    selectedLocation={{ lat, lng }}
                    onLocationSelect={(loc) => {
                      setLat(loc.lat);
                      setLng(loc.lng);
                      if (loc.addressSuggestion && !landmark) {
                        setLandmark(loc.addressSuggestion);
                      }
                    }}
                    height="320px"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  onClick={handleNextToEvidence}
                  className="px-6 py-3 rounded-xl bg-[#176B52] hover:bg-[#125541] text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Continue to Evidence</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: EVIDENCE, DUPLICATE CHECK & SUBMISSION */}
          {step === 4 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-mono uppercase text-[#176B52] font-bold tracking-wider">
                  Phase 4: Supporting Evidence & Review
                </span>
                <h2 className="font-heading text-2xl font-bold text-[#176B52] mt-1">
                  Upload Visual Evidence & Submit
                </h2>
                <p className="text-stone-500 text-xs mt-1">
                  Photographic proof accelerates verification and ensures rapid crew dispatch.
                </p>
              </div>

              {/* DUPLICATE WARNING CALLOUT (Deterministic) */}
              {duplicates.length > 0 && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs">
                  <div className="flex items-center gap-2 font-bold text-sm mb-1 text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Possible Nearby Duplicate Report Detected</span>
                  </div>
                  <p className="mb-3 text-[11px] leading-relaxed">
                    Our GIS engine detected {duplicates.length} existing active report(s) within ~1 km in the same category. If this is the same incident, municipal crews are already scheduled!
                  </p>
                  <div className="space-y-2">
                    {duplicates.map((dup) => (
                      <div key={dup.id} className="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-stone-900">{dup.title}</div>
                          <div className="text-[10px] text-stone-500 font-mono">
                            {dup.reportNumber} &bull; Status: {dup.status.toUpperCase()} &bull; {dup.location.address}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          In Progress
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo Selection / Attachment */}
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Attach Incident Photo
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {SAMPLE_INCIDENT_PHOTOS.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => { setPhotoUrl(p.url); setCustomPhotoInput(''); }}
                        className={`rounded-xl overflow-hidden border-2 cursor-pointer transition relative group ${
                          photoUrl === p.url && !customPhotoInput
                            ? 'border-[#176B52] ring-2 ring-[#176B52]/30'
                            : 'border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <img src={p.url} alt={p.label} className="w-full h-24 object-cover" />
                        <div className="p-1.5 bg-white text-[10px] font-semibold text-stone-700 truncate">
                          {p.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Or Custom URL */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Or paste direct image URL / device capture:
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={customPhotoInput}
                      onChange={(e) => setCustomPhotoInput(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                    />
                  </div>
                </div>

                {/* Submission Summary Pill */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                  <div className="font-bold text-stone-800 uppercase tracking-wider text-[11px] mb-1">
                    Submission Snapshot
                  </div>
                  <div><span className="text-stone-500">Title:</span> <strong className="text-stone-900">{title}</strong></div>
                  <div><span className="text-stone-500">Category:</span> {selectedCategory.name} &bull; <span className="text-stone-500">Priority:</span> {priority.toUpperCase()}</div>
                  <div><span className="text-stone-500">Location:</span> {address} ({district})</div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl bg-[#176B52] hover:bg-[#125541] text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-[#176B52]/20 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Registering Report...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#C8F169]" />
                      <span>Confirm & Register Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
