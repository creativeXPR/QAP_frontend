import StudentSidebar from "../../components/student/StudentSidebar";
import StudentTopBar from "../../components/student/StudentTopBar";
import { FileSearch } from "lucide-react";

// Placeholder — no design was provided for this screen yet.
// Swap this out once you have the "My Reports" list screen designed.
export default function StudentReportsList() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <StudentSidebar />
      <div className="flex-1">
        <StudentTopBar sessionLabel="This Semester" />
        <main className="px-4 md:px-8 py-16 flex flex-col items-center justify-center text-center">
          <FileSearch size={32} className="text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-700">
            Your reports will show up here
          </p>
          <p className="text-xs text-gray-400 mt-1">
            This screen hasn't been designed yet — placeholder for now.
          </p>
        </main>
      </div>
    </div>
  );
}