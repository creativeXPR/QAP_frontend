import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StudentLayout from "../../components/student/StudentLayout";
import StepDots from "../../components/student/wizard/StepDots";
import ReviewSubmitStep from "../../components/student/wizard/ReviewSubmitStep";
import { students } from "../../api/services";
import { buildSubmissionRequestBody } from "../../lib/feedback";

// Lives at /student/reports/new — the "Submit Report" tab.
// Only handles the final review & submit step. It expects to receive
// the collected form/files via route state from StudentReportWizard
// (/student/reports). If someone lands here directly without going
// through the wizard, bounce them back to start it properly.
export default function SubmitReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const { form, files } = location.state || {};
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!form) {
      navigate("/student/reports", { replace: true });
    }
  }, [form, navigate]);

  if (!form) return null;

  const handleSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      await students.feedbackTracking.create(buildSubmissionRequestBody(form, files || []));
      navigate("/student/dashboard");
    } catch (error) {
      console.error("Failed to submit report:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentLayout sessionLabel="2025/2026 Session">
      <div className="max-w-xl mx-auto bg-white rounded-lg border border-gray-100 shadow-sm p-5 sm:p-6 md:p-8">
        <StepDots activeDot={2} />

        <ReviewSubmitStep
          form={form}
          files={files || []}
          onBack={() => navigate("/student/reports")}
          onSubmit={handleSubmit}
        />
      </div>
    </StudentLayout>
  );
}
