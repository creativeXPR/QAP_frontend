import { useState, useEffect } from "react";
import { X, Loader2, Plus, Trash2 } from "../../lib/icons";
import { useToast } from "../common/ToastContext";

const MAX_EXTRA_METRICS = 7;

export default function KpiModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    embedlink: "",
  });
  const [addMetrics, setAddMetrics] = useState(false);
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          title: initialData.title || "",
          description: initialData.description || "",
          embedlink: initialData.embedlink || "",
        });
        const entries = Object.entries(initialData.metrics || {});
        setAddMetrics(entries.length > 0);
        setMetrics(entries.map(([key, value]) => ({ key, value: String(value) })));
      } else {
        setForm({ title: "", description: "", embedlink: "" });
        setAddMetrics(false);
        setMetrics([]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMetricChange = (index, field, value) => {
    setMetrics((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    );
  };

  const addMetricRow = () => {
    setMetrics((prev) =>
      prev.length >= MAX_EXTRA_METRICS ? prev : [...prev, { key: "", value: "" }],
    );
  };

  const removeMetricRow = (index) => {
    setMetrics((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.title.trim()) {
      addToast("warning", "Title is required.");
      setLoading(false);
      return;
    }

    let metricsPayload = {};
    if (addMetrics) {
      for (const { key, value } of metrics) {
        if (!key.trim()) continue;
        const numericValue = Number(value);
        metricsPayload[key.trim()] = Number.isNaN(numericValue) ? value : numericValue;
      }
    }

    const payload = {
      title: form.title,
      description: form.description,
      embedlink: form.embedlink,
      metrics: metricsPayload,
    };

    try {
      await onSave(payload, initialData?.id);
      addToast("success", initialData ? "KPI saved successfully." : "KPI created successfully.");
      onClose();
    } catch (err) {
      addToast("error", err.message || "Failed to save the KPI.");
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
            {initialData ? "Edit KPI" : "Add New KPI"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form id="kpi-form" onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="KPI Title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none resize-none"
                placeholder="Detailed description of the KPI..."
              />
            </div>

            {/* Embed Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Embed Link</label>
              <input
                type="url"
                name="embedlink"
                value={form.embedlink}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                placeholder="https://example.com/kpi-embed"
              />
            </div>

            {/* Add Metrics toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="add-metrics-checkbox"
                type="checkbox"
                checked={addMetrics}
                onChange={(e) => setAddMetrics(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <label htmlFor="add-metrics-checkbox" className="text-sm font-medium text-gray-700">
                Add Metrics
              </label>
            </div>

            {addMetrics && (
              <div className="space-y-3 rounded-md border border-gray-200 bg-gray-50/50 p-3">
                {metrics.map((metric, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={metric.key}
                      onChange={(e) => handleMetricChange(index, "key", e.target.value)}
                      placeholder="Metric name (e.g. rating)"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                    />
                    <input
                      type="number"
                      value={metric.value}
                      onChange={(e) => handleMetricChange(index, "value", e.target.value)}
                      placeholder="Value"
                      className="w-28 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeMetricRow(index)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Remove metric"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addMetricRow}
                  disabled={metrics.length >= MAX_EXTRA_METRICS}
                  className="flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={14} />
                  Add Metric{metrics.length > 0 ? ` (${metrics.length}/${MAX_EXTRA_METRICS})` : ""}
                </button>
              </div>
            )}
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
            form="kpi-form"
            disabled={loading}
            className="flex items-center gap-2 text-sm font-medium text-white bg-brand hover:bg-brand-dark px-5 py-2 rounded-lg transition-colors disabled:opacity-70"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {initialData ? "Save Changes" : "Add KPI"}
          </button>
        </div>
      </div>
    </div>
  );
}
