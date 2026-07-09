import { useState } from "react";
import { Mail, Phone, Building2, Clock3, Plus, Minus } from "../../../lib/icons";

const CONTACT_ROWS = [
  { icon: Mail, label: "Email", value: "qa.office@ui.edu.ng" },
  { icon: Phone, label: "Phone", value: "+234 (0)2 810 1100" },
  { icon: Building2, label: "Office", value: "Senate Building, Room 2.14, University of Ibadan" },
  { icon: Clock3, label: "Hours", value: "Mon–Fri, 8:00 AM – 4:00 PM WAT" },
];

// NOTE: the source design showed "What if I am unhappy about the
// outcome" listed twice — that looked like a placeholder duplicate
// rather than intentional, so it's included once here with a 4th
// distinct question filled in instead of the literal duplicate.
const FAQS = [
  {
    question: "Can I submit a suggestion or compliment, not just a complaint?",
    answer:
      "Absolutely. This platform is for all student voice submissions, complaints, suggestions, feedback, service requests, compliments, improvement ideas, and more.",
  },
  {
    question: "How long does it take to get a response",
    answer:
      "Most submissions receive an initial response from a QA Officer within 3–5 working days, though this can vary depending on the complexity of the issue.",
  },
  {
    question: "What if I am unhappy about the outcome",
    answer:
      "You can follow up directly on the submission thread or appeal the resolution through the Support contact details above, and a QA Officer will review it further.",
  },
  {
    question: "Can I edit or withdraw a submission after sending it?",
    answer:
      "Once submitted, a report cannot be edited, but you can add follow-up context by contacting the QA Office directly and referencing your submission ID.",
  },
];

export default function SupportTab() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div>
      <div className="border border-gray-100 rounded-lg p-4 mb-6">
        <p className="text-sm font-semibold text-gray-900 mb-4">
          Contact Quality Assurance Office
        </p>
        <div className="divide-y divide-gray-100">
          {CONTACT_ROWS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <Icon size={16} className="text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm text-gray-900">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-100 rounded-lg p-4">
        <p className="text-sm font-semibold text-gray-900 mb-3">
          Frequently Asked Questions
        </p>
        <div className="divide-y divide-gray-100">
          {FAQS.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div key={faq.question} className="py-3 first:pt-0 last:pb-0">
                <button
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  className="w-full flex items-center justify-between gap-3 text-left"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {faq.question}
                  </span>
                  {open ? (
                    <Minus size={16} className="text-gray-400 shrink-0" />
                  ) : (
                    <Plus size={16} className="text-gray-400 shrink-0" />
                  )}
                </button>
                {open && (
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}