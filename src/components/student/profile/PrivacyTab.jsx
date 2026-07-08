import { ShieldAlert, EyeOff, ShieldCheck } from "../../../lib/icons";

export default function PrivacyTab() {
  return (
    <div>
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-lg px-4 py-4 mb-6">
        <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-700 mb-1">
            Your Privacy is our Priority
          </p>
          <p className="text-xs text-amber-700/80 leading-relaxed">
            The UI Quality Assurance Portal is governed by the University of
            Ibadan Student Data Protection Policy, in alignment with Nigerian
            Data Protection Regulations (NDPR).
          </p>
        </div>
      </div>

      <div className="border border-gray-100 rounded-lg p-4 mb-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <EyeOff size={16} className="text-gray-500" />
          Privacy Modes
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600">
          <li>Anonymous submissions contain no identifying metadata whatsoever.</li>
          <li>Confidential submissions are accessible only to your assigned QA Super Admin.</li>
          <li>
            You may submit from any device without logging via the main
            website —{" "}
            <a
              href="https://qa.ui.edu.ng/ww/qaunibadan.com"
              className="text-brand hover:underline break-all"
            >
              https://qa.ui.edu.ng/ww/qaunibadan.com
            </a>
          </li>
        </ul>
      </div>

      <div className="border border-gray-100 rounded-lg p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <ShieldCheck size={16} className="text-gray-500" />
          Data Storage &amp; Retention
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600">
          <li>All submissions are encrypted at rest and in transit (AES-256).</li>
          <li>Resolved submissions are archived after 2 years and permanently deleted after 5.</li>
          <li>Supporting files are stored in isolated, access-controlled University storage.</li>
        </ul>
      </div>
    </div>
  );
}