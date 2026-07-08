import StudentLayout from "../../components/student/StudentLayout";
import { FileSearch } from "lucide-react";

// Placeholder — no design was provided for this screen yet.
export default function StudentReportsList() {
  return (
    <StudentLayout sessionLabel="This Semester">
      <div className="flex flex-col items-center justify-center text-center py-16">
        <FileSearch size={32} className="text-gray-300 mb-3" />
        <p className="text-sm font-medium text-gray-700">
          Your reports will show up here
        </p>
        <p className="text-xs text-gray-400 mt-1">
          This screen hasn't been designed yet — placeholder for now.
        </p>
      </div>
    </StudentLayout>
  );
}