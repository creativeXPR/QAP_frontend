import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/student/StudentLayout";
import AsyncState from "../../components/common/AsyncState";
import LogoutModal from "../../components/common/LogoutModal";
import { getListItems } from "../../api/client";
import { students } from "../../api/services";
import { useApiQuery } from "../../hooks/useApiResource";
import { getStoredUser, logout } from "../../lib/auth";
import { formatLabel } from "../../lib/submissionMapper";
import {
  BookOpen,
  Briefcase,
  Building2,
  FileText,
  LogOut,
  Mail,
  ShieldCheck,
  UserCircle,
} from "../../lib/icons";

function initialsFor(name = "") {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return initials || "ST";
}

function fieldValue(value, fallback = "Not provided") {
  return value || fallback;
}

function buildProfile(studentRecord, storedUser) {
  const fullName =
    studentRecord?.full_name ||
    [studentRecord?.first_name, studentRecord?.last_name].filter(Boolean).join(" ") ||
    storedUser?.full_name ||
    storedUser?.username ||
    "Student";

  return {
    fullName,
    role: formatLabel(storedUser?.status || "student"),
    initials: initialsFor(fullName),
    email: fieldValue(studentRecord?.email || storedUser?.email),
    matricNumber: fieldValue(studentRecord?.matric_number),
    faculty: fieldValue(studentRecord?.faculty_name),
    department: fieldValue(studentRecord?.department_name),
    programme: fieldValue(studentRecord?.programme),
    level: fieldValue(studentRecord?.level ? `${studentRecord.level} Level` : ""),
    status: formatLabel(studentRecord?.status || "active"),
    courses: studentRecord?.course_codes || [],
    hasStudentRecord: Boolean(studentRecord),
  };
}

export default function StudentProfile() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { data, loading, error, refetch } = useApiQuery(
    useCallback(() => students.records.list(), []),
  );

  const studentRecord = getListItems(data)[0] || null;
  const profile = useMemo(
    () => buildProfile(studentRecord, storedUser),
    [studentRecord, storedUser],
  );

  const fields = [
    { icon: Briefcase, label: "Role", value: profile.role },
    { icon: FileText, label: "Matric Number", value: profile.matricNumber },
    { icon: Mail, label: "Email Address", value: profile.email },
    { icon: Building2, label: "Faculty", value: profile.faculty },
    { icon: Building2, label: "Department", value: profile.department },
    { icon: BookOpen, label: "Programme", value: profile.programme },
    { icon: ShieldCheck, label: "Level", value: profile.level },
    { icon: ShieldCheck, label: "Student Status", value: profile.status },
  ];

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/sign-in", { replace: true });
  };

  return (
    <StudentLayout sessionLabel="2025/2026 Session">
      <div className="space-y-6">
        <AsyncState
          loading={loading}
          error={error}
          onRetry={refetch}
          loadingLabel="Loading profile..."
          empty={false}
        >
          {!profile.hasStudentRecord && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Your account is active, but no student record has been linked yet.
              Some academic details will appear after an administrator creates
              your student profile.
            </div>
          )}

          <section className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 md:p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4 min-w-0">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-brand text-white text-lg font-semibold shrink-0">
                  {profile.initials}
                </span>

                <div className="min-w-0">
                  <h1 className="text-lg font-semibold text-gray-900 mb-1 break-words">
                    {profile.fullName}
                  </h1>
                  <p className="text-sm font-medium text-brand">{profile.role}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 mt-5">
                    {fields.map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-2 min-w-0">
                        <Icon size={15} className="text-gray-400 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400">{label}</p>
                          <p className="text-sm text-gray-800 break-words">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-2 text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-md shrink-0"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </section>

          <section className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserCircle size={17} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">
                Registered Courses
              </h2>
            </div>

            {profile.courses.length ? (
              <div className="flex flex-wrap gap-2">
                {profile.courses.map((courseCode) => (
                  <span
                    key={courseCode}
                    className="text-sm text-emerald-700 border border-emerald-200 bg-emerald-50 px-3 py-1 rounded-full"
                  >
                    {courseCode}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No registered courses are linked to this profile yet.
              </p>
            )}
          </section>
        </AsyncState>
      </div>

      <LogoutModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </StudentLayout>
  );
}
