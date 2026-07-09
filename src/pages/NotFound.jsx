import { Link } from "react-router-dom";
import { ArrowLeft } from "../lib/icons";
import errorImg from "/error404img.png";

// NOTE: no actual illustration asset was provided for this design, so
// the character/gear/leaf artwork is approximated with simple shapes
// rather than pixel-matched to the source image. Swap in a real SVG/
// image asset here if one becomes available.
//
// "Back to homepage" links to /sign-in since there's no single
// unrestricted "home" route in this app (every dashboard is role-
// locked) — same ambiguity flagged earlier for the admin nav's "Home"
// link. Update the destination if there's a better default.
export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Crest"
            className="h-9 w-auto object-contain"
          />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-brand">
              DIRECTORATE OF QUALITY ASSURANCE
            </p>
            <p className="text-[11px] italic text-red-500">
              Quality Assurance...doing the right things right every time
            </p>
          </div>
        </div>
        <Link
          to="/sign-in"
          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2 rounded-[10px] hover:bg-gray-50"
        >
          <ArrowLeft size={15} />
          Back to homepage
        </Link>
      </header>

      <main className="flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="relative flex items-center justify-center mb-6">
          {/* <span className="text-[7rem] sm:text-[9rem] font-extrabold text-brand leading-none">
            4
          </span>

          <span className="relative mx-2 sm:mx-4 flex items-center justify-center">
            <span className="flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-brand/10">
              <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand/20 text-4xl">
                🤷
              </span>
            </span>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border border-brand/20 text-brand text-xs font-semibold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
              OOPS!
            </span>
          </span>

          <span className="text-[7rem] sm:text-[9rem] font-extrabold text-brand leading-none">
            4
          </span> */}
          <img
            src={errorImg}
            alt="404 Illustration"
            className="w-64 sm:w-100"
          />
        </div>

        {/* <p className="text-xl sm:text-2xl font-bold tracking-widest text-brand mb-3">
          PAGE NOT FOUND
        </p> */}
        <p className="text-sm text-gray-500 max-w-sm">
          The page you're looking for doesn't exist or may have been moved.
        </p>
      </main>
    </div>
  );
}
