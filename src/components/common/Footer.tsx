import React from 'react';
import { Shield, Radio, CheckSquare, HeartHandshake } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#121413] border-t border-stone-800 text-stone-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#C8F169] flex items-center justify-center text-[#171A19] font-black text-sm">
                CS
              </div>
              <span className="font-heading font-extrabold text-base text-white">CivicSync</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              One Alert. One Source. A Safer Community. Connecting residents, municipal departments, and field responders through verified public alerts and deterministic issue lifecycle tracking.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Platform Version 2.4.0-Production
            </div>
          </div>

          {/* Public Services */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm mb-3 uppercase tracking-wider text-[11px]">
              Civic Channels
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('public_alerts')} className="hover:text-[#C8F169] transition">
                  Public Emergency & Utility Alerts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('public_map')} className="hover:text-[#C8F169] transition">
                  Geographic Issue Explorer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-[#C8F169] transition">
                  Operational Response Protocol
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how_it_works')} className="hover:text-[#C8F169] transition">
                  How Issues Are Resolved
                </button>
              </li>
            </ul>
          </div>

          {/* Transparency & Governance */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm mb-3 uppercase tracking-wider text-[11px]">
              Transparency
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#C8F169]" />
                <span>Deterministic Audit Trail</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#C8F169]" />
                <span>Verified Department Dispatches</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-[#C8F169]" />
                <span>Before-and-After Evidence Protocol</span>
              </li>
              <li className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-[#C8F169]" />
                <span>Citizen Confirmation Closure</span>
              </li>
            </ul>
          </div>

          {/* Legal & Standards */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm mb-3 uppercase tracking-wider text-[11px]">
              Compliance & Ethics
            </h4>
            <p className="text-stone-500 leading-relaxed text-[11px] mb-3">
              CivicSync operates as open civic technology infrastructure. Official dispatches are authored strictly by authorized municipal personnel.
            </p>
            <div className="space-y-1 text-stone-500 text-[11px]">
              <div>Privacy Policy &bull; Terms of Use</div>
              <div>Data Sovereignty &bull; RLS Security Verified</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>&copy; {new Date().getFullYear()} CivicSync CivicTech Consortium. Software for responsive, accountable cities.</p>
          <div className="flex gap-4">
            <span className="text-[#C8F169]/80 font-mono">Sample Demonstration Data clearly segregated from production audit logs.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
