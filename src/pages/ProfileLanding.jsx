import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Users, CheckCircle2, Heart } from "lucide-react";

const FEATURES = [
  {
    icon: Users,
    title: "User Management",
    description:
      "Role-based access for Focal Persons and Principal Officers with comprehensive profile management",
  },
  {
    icon: CheckCircle2,
    title: "Form Submissions",
    description:
      "Streamlined form submission and tracking for quality assurance assessments and evaluations",
  },
  {
    icon: Heart,
    title: "Analytics & Reports",
    description:
      "We're dedicated to connecting people with unforgettable moments",
  },
];

export default function ProfileLanding() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar ctaLabel="View Profile" ctaTo="/profile/me" />

      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center px-4 pt-14 pb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Elevating Academic Excellence at University of Ibadan
        </h1>
        <p className="text-gray-500 mb-6 max-w-xl mx-auto">
          A comprehensive platform designed to streamline quality assurance
          processes, track key performance indicators, and maintain the
          highest standards of academic and administrative excellence.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/profile/me"
            className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-5 py-2.5 rounded-md"
          >
            Access your Profile
          </Link>
          <button className="text-sm font-medium text-gray-600 hover:text-brand">
            Learn More
          </button>
        </div>
      </section>

      {/* Platform features */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Platform Features
          </h2>
          <p className="text-sm text-gray-500">
            Tools designed for both Focal Persons and Principal Officers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-lg border border-gray-100 bg-white shadow-sm p-5"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 text-white mb-4">
                <Icon size={18} />
              </span>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}