import { useState } from "react";
import StaffLayout from "../../components/staff/StaffLayout";
import ProfileTab from "../../components/staff/profile/ProfileTab";
import GuidelinesTab from "../../components/staff/profile/GuidelinesTab";
import PrivacyTab from "../../components/staff/profile/PrivacyTab";
import SupportTab from "../../components/staff/profile/SupportTab";

const TABS = [
  { key: "profile", label: "Profile", Component: ProfileTab },
  { key: "guidelines", label: "Guidelines", Component: GuidelinesTab },
  { key: "privacy", label: "Privacy & Security", Component: PrivacyTab },
  { key: "support", label: "Support", Component: SupportTab },
];

export default function StaffProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const ActiveComponent = TABS.find((t) => t.key === activeTab)?.Component;

  return (
    <StaffLayout sessionLabel="2025/2026 Session">
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 md:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Profile &amp; Help
        </h2>

        <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 mb-6 overflow-x-auto">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`shrink-0 whitespace-nowrap text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                activeTab === key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {ActiveComponent && <ActiveComponent />}
      </div>
    </StaffLayout>
  );
}