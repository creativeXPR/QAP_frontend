import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../../components/student/StudentSidebar";
import StudentTopBar from "../../components/student/StudentTopBar";
import {
  FileText,
  Home,
  Wrench,
  UserCog,
  Clock3,
  ShieldAlert,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";

const CATEGORIES = [
  { label: "Academics", icon: FileText },
  { label: "Hostel/Welfare", icon: Home },
  { label: "Facilities", icon: Wrench },
  { label: "Staff Conduct", icon: UserCog },
  { label: "Admin Delays", icon: Clock3 },
  { label: "Safety/Security", icon: ShieldAlert },
  { label: "Results", icon: ClipboardList },
];

const FACULTIES = [
  "Faculty of Sciences",
  "Faculty of Arts",
  "Faculty of Engineering",
  "Faculty of Clinical Sciences",
  "Faculty of Law",
];

const STEP_COUNT = 3;

function StepDots({ step }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: STEP_COUNT }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === step ? "w-8 bg-brand" : "w-1.5 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function SubmitReport() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    category: "Academics",
    title: "",
    description: "",
    dateOccurred: "",
    urgency: "Medium",
    faculty: "",
    department: "",
    courseCode: "",
    personInvolved: "",
  });

  const update = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = () => {
    // TODO: wire up to backend
    console.log(form);
    navigate("/student/dashboard");
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <StudentSidebar />

      <div className="flex-1">
        <StudentTopBar sessionLabel="2025/2026 Session" />

        <main className="px-4 md:px-8 py-8">
          <div className="max-w-xl mx-auto bg-white rounded-lg border border-gray-100 shadow-sm p-6 md:p-8">
            <StepDots step={step} />

            {step === 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">
                  What is your report about?
                </h2>
                <p className="text-sm text-gray-400 text-center mb-6">
                  Select the category that best fits your complaint.
                </p>

                <div className="space-y-3">
                  {CATEGORIES.map(({ label, icon: Icon }) => (
                    <label
                      key={label}
                      className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer ${
                        form.category === label
                          ? "border-brand bg-brand/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="flex items-center gap-3 text-sm text-gray-700">
                        <Icon size={16} className="text-gray-400" />
                        {label}
                      </span>
                      <input
                        type="radio"
                        name="category"
                        checked={form.category === label}
                        onChange={() => setForm({ ...form, category: label })}
                        className="text-brand focus:ring-brand"
                      />
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="w-full mt-6 bg-brand hover:bg-brand-dark text-white text-sm font-medium py-2.5 rounded-md"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">
                  Describe your complaint
                </h2>
                <p className="text-sm text-gray-400 text-center mb-6">
                  Provide as much detail as possible to help us process your
                  report.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Report Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={update("title")}
                      placeholder="Unnanounced Change of Exam Venue for Phy 101"
                      className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.description}
                      onChange={update("description")}
                      placeholder="Describe what happened, how & when"
                      className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Date Occured *
                      </label>
                      <input
                        type="date"
                        required
                        value={form.dateOccurred}
                        onChange={update("dateOccurred")}
                        className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Urgency *
                      </label>
                      <select
                        required
                        value={form.urgency}
                        onChange={update("urgency")}
                        className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Faculty *
                    </label>
                    <select
                      required
                      value={form.faculty}
                      onChange={update("faculty")}
                      className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    >
                      <option value="">Select your faculty</option>
                      {FACULTIES.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Department *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.department}
                      onChange={update("department")}
                      placeholder="e.g Physics, Computer Science"
                      className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Course Code (optional)
                      </label>
                      <input
                        type="text"
                        value={form.courseCode}
                        onChange={update("courseCode")}
                        placeholder="e.g PHY 101"
                        className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Person Involved *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.personInvolved}
                        onChange={update("personInvolved")}
                        placeholder="e.g Dr Adebayo"
                        className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 text-sm font-medium text-gray-600 border border-gray-300 rounded-md py-2.5 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-brand hover:bg-brand-dark text-white text-sm font-medium py-2.5 rounded-md"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">
                  Review & Submit
                </h2>
                <p className="text-sm text-gray-400 text-center mb-6">
                  Confirm the details below before submitting your report.
                </p>

                <dl className="space-y-3 text-sm mb-6">
                  {[
                    ["Category", form.category],
                    ["Title", form.title || "—"],
                    ["Description", form.description || "—"],
                    ["Date Occurred", form.dateOccurred || "—"],
                    ["Urgency", form.urgency],
                    ["Faculty", form.faculty || "—"],
                    ["Department", form.department || "—"],
                    ["Course Code", form.courseCode || "—"],
                    ["Person Involved", form.personInvolved || "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                      <dt className="text-gray-400">{label}</dt>
                      <dd className="text-gray-800 text-right">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 text-sm font-medium text-gray-600 border border-gray-300 rounded-md py-2.5 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-medium py-2.5 rounded-md"
                  >
                    <CheckCircle2 size={16} />
                    Submit Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}