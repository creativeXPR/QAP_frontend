import { MapPin, Phone, Mail } from "lucide-react";

const COLUMNS = [
  {
    title: "Quality Assurance",
    isBrand: true,
    items: [],
  },
  {
    title: "Quality Assurance",
    items: [
      "About QA Directorate",
      "Guidelines & Policies",
      "Annual Reports",
      "Terms of Service",
      "FAQs",
    ],
  },
  {
    title: "Support",
    items: [
      "Help Center",
      "User Guide",
      "Technical Support",
      "Contact IT Services",
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
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

        {COLUMNS.slice(1).map((col) => (
          <div key={col.title}>
            <p className="font-semibold text-gray-900 text-sm mb-2">
              {col.title}
            </p>
            <ul className="space-y-1.5 text-gray-500 text-sm">
              {col.items.map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-brand">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="font-semibold text-gray-900 text-sm mb-2">Contact</p>
          <ul className="space-y-1.5 text-gray-500 text-sm">
            <li className="flex items-start gap-1.5">
              <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
              <span>
                Quality Assurance Directorate, University of Ibadan, Nigeria
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <Phone size={14} className="shrink-0 text-gray-400" />
              <span>+234 (0) 2 810 1100</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Mail size={14} className="shrink-0 text-gray-400" />
              <span>qa@ui.edu.ng</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 py-3 text-center text-xs text-gray-400">
        © 2026 University of Ibadan. All rights reserved. | Quality Assurance
        Directorate
      </div>
    </footer>
  );
}