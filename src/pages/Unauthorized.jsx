import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 text-red-500 mb-4">
        <ShieldAlert size={24} />
      </span>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">
        You don't have access to this page
      </h1>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">
        Your account role doesn't permit viewing this section. If you think
        this is a mistake, contact your administrator.
      </p>
      <Link
        to="/sign-in"
        className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-5 py-2.5 rounded-md"
      >
        Back to Sign In
      </Link>
    </div>
  );
}