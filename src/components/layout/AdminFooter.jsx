import { CheckCircle2 } from "lucide-react";

const SUPPORT_LINKS = [
  "Help Center",
  "User Guide",
  "Technical Support",
  "Contact IT Services",
];

const DEV_RESOURCE_LINKS = [
  "Github Repository",
  "Google Cloud Console",
  "Firebase Console",
  "API Documentation",
];

export default function AdminFooter() {
  return (
    <footer className="border-t border-gray-100 mt-8 pt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img src="/logo.png" alt="Crest" className="h-6 w-auto object-contain" />
            <span className="font-semibold text-gray-900 text-sm">
              Quality Assurance
            </span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed max-w-[220px]">
            University of Ibadan Quality Assurance Platform — Supporting
            excellence in academic standards and institutional effectiveness.
          </p>
        </div>

        <div>
          <p className="font-semibold text-gray-900 text-sm mb-2">Support</p>
          <ul className="space-y-1.5 text-gray-500">
            {SUPPORT_LINKS.map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-brand">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-gray-900 text-sm mb-2">
            Development Resources
          </p>
          <ul className="space-y-1.5 text-gray-500">
            {DEV_RESOURCE_LINKS.map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-brand">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-gray-900 text-sm">System Status</p>
          </div>
          <p className="flex items-center gap-1.5 text-emerald-600 text-sm mb-2">
            <CheckCircle2 size={15} />
            All Systems Operational
          </p>
          <p className="text-gray-400 text-xs mb-1">
            Last Updated:
            <br />
            Jan 13, 2026 10:24 AM
          </p>
          <a href="#" className="text-brand text-sm font-medium hover:underline">
            View Status Page
          </a>
        </div>
      </div>

      <div className="border-t border-gray-100 py-3 text-center text-xs text-gray-400">
        © 2026 University of Ibadan. All rights reserved. | Quality Assurance
        Directorate
      </div>
    </footer>
  );
}