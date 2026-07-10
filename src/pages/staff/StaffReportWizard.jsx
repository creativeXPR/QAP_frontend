import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffLayout from "../../components/staff/StaffLayout";
import StepDots from "../../components/staff/wizard/StepDots";
import SubmissionTypeStep from "../../components/staff/wizard/SubmissionTypeStep";
import ComplaintDetailsStep from "../../components/staff/wizard/ComplaintDetailsStep";
import PrivacyModeStep from "../../components/staff/wizard/PrivacyModeStep";
import AttachmentsStep from "../../components/staff/wizard/AttachmentsStep";
import ReviewSubmitStep from "../../components/staff/wizard/ReviewSubmitStep";
import { ALL_EXTRA_FIELD_KEYS } from "../../lib/classifications";
import { buildSubmissionRequestBody } from "../../lib/feedback";
import { staffs } from "../../api/services";
import { getStoredAccessToken } from "../../lib/auth";
import { useToast } from "../../components/common/ToastContext";

// Lives at /staff/reports — the "New Submission" tab.
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

export default function StaffReportWizard() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

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
    if (!getStoredAccessToken()) {
      addToast(
        "error",
        "Your session has expired. Please sign in again to submit this report.",
      );
      return;
    }

    const payload = buildSubmissionRequestBody(form, files, "staff");

    setSubmitting(true);
    try {
      await staffs.feedbackTracking.create(payload);
      addToast("success", "Report submitted successfully.");
      navigate("/staff/dashboard");
    } catch (err) {
      console.error("Failed to submit report:", err);
      addToast(
        "error",
        err?.message ||
          "Something went wrong submitting your report. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StaffLayout sessionLabel="2025/2026 Session">
      <div className="max-w-xl mx-auto bg-white rounded-lg border border-gray-100 shadow-sm p-5 sm:p-6 md:p-8">
        <StepDots activeDot={dotForStep(step)} />

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
            submitting={submitting}
            onBack={() => setStep(3)}
            onSubmit={() => {
              if (!submitting) handleSubmit();
            }}
          />
        )}
      </div>
    </StaffLayout>
  );
}
