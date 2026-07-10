import { useState, useEffect } from "react";
import { X, Loader2 } from "../../lib/icons";
import { useToast } from "../common/ToastContext";

const CATEGORY_OPTIONS = [
  "Complaint",
  "Suggestion",
  "Comment",
  "Feedback",
  "Concern",
  "other"
];

const CLASSIFICATION_OPTIONS = [
  "Academics",
  "Hostel/Welfare",
  "Facilities",
  "Staff Conduct",
  "Admin Delays",
  "Safety/Security",
  "Results",
  "other"
];

export default function UpdateModal({
  isOpen,
  onClose,
  onSave,
  forUser,
  initialData = null,
}) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category: "Complaint",
    otherCategory: "",
    title: "",
    description: "",
    classification: "Academics",
    otherClassification: "",
    buttonLabel: "",
    buttonUrl: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const catIsOther = !CATEGORY_OPTIONS.includes(initialData.category) && initialData.category;
        const classIsOther = !CLASSIFICATION_OPTIONS.includes(initialData.classification) && initialData.classification;

        setForm({
          category: catIsOther ? "other" : (initialData.category || "Complaint"),
          otherCategory: catIsOther ? initialData.category : "",
          title: initialData.title || "",
          description: initialData.description || "",
          classification: classIsOther ? "other" : (initialData.classification || "Academics"),
          otherClassification: classIsOther ? initialData.classification : "",
          buttonLabel: initialData.button?.label || "",
          buttonUrl: initialData.button?.url || "",
        });
      } else {
        setForm({
          category: "Complaint",
          otherCategory: "",
          title: "",
          description: "",
          classification: "Academics",
          otherClassification: "",
          buttonLabel: "",
          buttonUrl: "",
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const finalCategory = form.category === "other" ? form.otherCategory : form.category;
    const finalClassification = form.classification === "other" ? form.otherClassification : form.classification;

    if (!finalCategory.trim()) {
      addToast("warning", "Category is required.");
      setLoading(false);
      return;
    }
    if (!finalClassification.trim()) {
      addToast("warning", "Classification is required.");
      setLoading(false);
      return;
    }

    const payload = {
      category: finalCategory,
      title: form.title,
      description: form.description,
      classification: finalClassification,
      forUser: forUser,
    };

    if (form.buttonLabel.trim() || form.buttonUrl.trim()) {
      payload.button = {
        label: form.buttonLabel.trim(),
        url: form.buttonUrl.trim(),
      };
    }

    try {
      await onSave(payload, initialData?.id);
      addToast("success", initialData ? "Update saved successfully." : "Update created successfully.");
      onClose();
    } catch (err) {
      addToast("error", err.message || "Failed to save the update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900">
            {initialData ? "Edit Update" : "Upload New Update"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form id="update-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none"
              >
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt === "other" ? "Other..." : opt}</option>
                ))}
              </select>
            </div>
            
            {form.category === "other" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specify Other Category</label>
                <input
                  type="text"
                  name="otherCategory"
                  value={form.otherCategory}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                  placeholder="Enter custom category"
                />
              </div>
            )}

            {/* Classification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Classification</label>
              <select
                name="classification"
                value={form.classification}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none"
              >
                {CLASSIFICATION_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt === "other" ? "Other..." : opt}</option>
                ))}
              </select>
            </div>

            {form.classification === "other" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specify Other Classification</label>
                <input
                  type="text"
                  name="otherClassification"
                  value={form.otherClassification}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                  placeholder="Enter custom classification"
                />
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                placeholder="Update Title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none resize-none"
                placeholder="Detailed description of the update..."
              />
            </div>

            {/* Action Button (Optional) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Label (Optional)</label>
                <input
                  type="text"
                  name="buttonLabel"
                  value={form.buttonLabel}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                  placeholder="e.g. Click Here"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button URL (Optional)</label>
                <input
                  type="url"
                  name="buttonUrl"
                  value={form.buttonUrl}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-sm font-medium text-gray-600 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="update-form"
            disabled={loading}
            className="flex items-center gap-2 text-sm font-medium text-white bg-brand hover:bg-brand-dark px-5 py-2 rounded-lg transition-colors disabled:opacity-70"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {initialData ? "Save Changes" : "Upload Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
