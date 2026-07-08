import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import FormCard from "../components/dashboard/FormCard";

const AVAILABLE_FORMS = [
  {
    category: "Academic",
    title: "Evaluation of Examination Processes",
    status: "New",
    dueDate: "January 15, 2026",
    action: "Start",
  },
  {
    category: "Administrative",
    title: "Staff Performance Evaluation",
    status: "Pending",
    dueDate: "January 15, 2026",
    action: "Continue",
  },
  {
    category: "Academic",
    title: "Infrastructure Assessment",
    status: "New",
    dueDate: "January 15, 2026",
    action: "Start",
  },
  {
    category: "Academic",
    title: "Course Content Review",
    status: "Pending",
    dueDate: "January 15, 2026",
    action: "Continue",
  },
  {
    category: "Administrative",
    title: "Service Quality Feedback",
    status: "Completed",
    action: "View",
  },
  {
    category: "Academic",
    title: "Teaching Methods Assessment",
    status: "New",
    dueDate: "January 15, 2026",
    action: "Start",
  },
  {
    category: "Academic",
    title: "Laboratory Safety Compliance",
    status: "Pending",
    dueDate: "January 15, 2026",
    action: "Continue",
  },
  {
    category: "Administrative",
    title: "Administrative Services Survey",
    status: "Completed",
    action: "View",
  },
];

export default function FPLanding() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center px-4 pt-14 pb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Welcome to the Quality Assurance Platform
        </h1>
        <p className="text-gray-500 mb-6 max-w-xl mx-auto">
          Access all assigned quality assurance evaluations, track submission
          status, and meet deadlines with ease.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button className="bg-brand hover:bg-brand-dark text-white text-base font-medium px-5 py-2.5 rounded-[10px]">
            Start Submission
          </button>
          <button className="border border-gray-300 text-gray-700 text-base font-medium px-5 py-2.5 rounded-[10px] hover:bg-gray-50">
            View My Profile
          </button>
        </div>
      </section>

      {/* Hero dashboard preview */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <img
          src="/dashboard-preview.png"
          alt="Quality Assurance dashboard preview"
          className="w-full rounded-xl shadow-lg border border-gray-100"
        />
      </section>

      {/* Available forms */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Available Forms
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Select a form to begin or continue a submission.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AVAILABLE_FORMS.map((form) => (
            <FormCard key={form.title} {...form} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}