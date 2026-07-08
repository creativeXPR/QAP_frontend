import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/student/StudentLayout";
import StepDots from "../../components/student/wizard/StepDots";
import SubmissionTypeStep from "../../components/student/wizard/SubmissionTypeStep";
import ComplaintDetailsStep from "../../components/student/wizard/ComplaintDetailsStep";
import PrivacyModeStep from "../../components/student/wizard/PrivacyModeStep";
import AttachmentsStep from "../../components/student/wizard/AttachmentsStep";
import ReviewSubmitStep from "../../components/student/wizard/ReviewSubmitStep";
import { ALL_EXTRA_FIELD_KEYS } from "../../lib/classifications";
import { buildSubmissionRequestBody } from "../../lib/feedback";
import { students } from "../../api/services";
import { getStoredAccessToken } from "../../lib/auth";

// Lives at /student/reports — the "New Submission" tab.
// Steps: 0 = type, 1 = details, 2 = privacy mode, 3 = attachments,
// 4 = review & submit. The dot indicator groups details+privacy+
// attachments+review under the same last dot per the design.
const dotForStep = (step) => (step === 0 ? 0 : step === 1 ? 1 : 2);

const emptyExtraFields = Object.fromEntries(
  ALL_EXTRA_FIELD_KEYS.map((key) => [key, ""]),
);

const initialForm = {
  submissionType: "Complaint",
  category: "Academics", // this is the "classification" (Academics/Hostel-Welfare/etc)
  title: "",
  description: "",
  dateOccurred: "",
  urgency: "Medium",
  faculty: "",
  department: "",
  courseCode: "",
  personInvolved: "",
  privacyMode: "Anonymous",
  ...emptyExtraFields,
};

export default function StudentReportWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const update = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  // Changing classification clears any extra fields from the
  // previously-selected classification so stale data isn't submitted.
  const handleCategoryChange = (value) => {
    setForm({ ...form, category: value, ...emptyExtraFields });
  };

  // Changing faculty clears department, since the department list
  // depends on which faculty is selected.
  const handleFacultyChange = (value) => {
    setForm({ ...form, faculty: value, department: "" });
  };

  const handleSubmit = async () => {
    setSubmitError("");

    if (!getStoredAccessToken()) {
      setSubmitError("Your session has expired. Please sign in again to submit this report.");
      return;
    }

    const payload = buildSubmissionRequestBody(form, files);

    setSubmitting(true);
    try {
      await students.feedbackTracking.create(payload);
      navigate("/student/dashboard");
    } catch (err) {
      console.error("Failed to submit report:", err);
      setSubmitError(
        err?.message || "Something went wrong submitting your report. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentLayout sessionLabel="2025/2026 Session">
      <div className="max-w-xl mx-auto bg-white rounded-lg border border-gray-100 shadow-sm p-5 sm:p-6 md:p-8">
        <StepDots activeDot={dotForStep(step)} />

        {submitError && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-600">
            {submitError}
          </div>
        )}

        {step === 0 && (
          <SubmissionTypeStep
            value={form.submissionType}
            onChange={(v) => setForm({ ...form, submissionType: v })}
            onContinue={() => setStep(1)}
          />
        )}

        {step === 1 && (
          <ComplaintDetailsStep
            form={form}
            update={update}
            onCategoryChange={handleCategoryChange}
            onFacultyChange={handleFacultyChange}
            onBack={() => setStep(0)}
            onContinue={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <PrivacyModeStep
            value={form.privacyMode}
            onChange={(v) => setForm({ ...form, privacyMode: v })}
            onBack={() => setStep(1)}
            onContinue={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <AttachmentsStep
            files={files}
            onFilesChange={setFiles}
            onBack={() => setStep(2)}
            onContinue={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <ReviewSubmitStep
            form={form}
            files={files}
            onBack={() => setStep(3)}
            onSubmit={() => {
              if (!submitting) handleSubmit();
            }}
          />
        )}
      </div>
    </StudentLayout>
  );
}