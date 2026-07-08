import { useState, useEffect, useMemo } from "react";
import { FileText } from "../../../lib/icons";
import { CLASSIFICATIONS, CLASSIFICATION_CONFIG } from "../../../lib/classifications";
import { getFaculties, getDepartments } from "../../../lib/university";

export default function ComplaintDetailsStep({
  form,
  update,
  onCategoryChange,
  onFacultyChange,
  onBack,
  onContinue,
}) {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingFaculties, setLoadingFaculties] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [facultyList, departmentList] = await Promise.all([
          getFaculties(),
          getDepartments(),
        ]);
        if (!cancelled) {
          setFaculties(facultyList);
          setDepartments(departmentList);
        }
      } catch {
        if (!cancelled) {
          setLoadError("Couldn't load faculties/departments. Check your connection.");
        }
      } finally {
        if (!cancelled) setLoadingFaculties(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const departmentsForFaculty = useMemo(
    () => departments.filter((d) => d.faculty_name === form.faculty),
    [departments, form.faculty]
  );

  const config = CLASSIFICATION_CONFIG[form.category] || CLASSIFICATION_CONFIG.Academics;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">
        Describe your complaint
      </h2>
      <p className="text-sm text-gray-400 text-center mb-6">
        Provide as much detail as possible to help us process your report.
      </p>

      {loadError && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-600">
          {loadError}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Select Category*
          </label>
          <div className="relative">
            <FileText
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              required
              value={form.category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            >
              {CLASSIFICATIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Report Title *
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={update("title")}
            placeholder="Unnanounced Change of Exam Venue for Phy 101"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={update("description")}
            placeholder="Describe what happened, how & when"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Date Occured *
            </label>
            <input
              type="date"
              required
              value={form.dateOccurred}
              onChange={update("dateOccurred")}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Urgency *
            </label>
            <select
              required
              value={form.urgency}
              onChange={update("urgency")}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Faculty *</label>
          <select
            required
            value={form.faculty}
            onChange={(e) => onFacultyChange(e.target.value)}
            disabled={loadingFaculties}
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">
              {loadingFaculties ? "Loading faculties..." : "Select your faculty"}
            </option>
            {faculties.map((f) => (
              <option key={f.id} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Department *
          </label>
          <select
            required
            value={form.department}
            onChange={update("department")}
            disabled={!form.faculty}
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">
              {form.faculty ? "Select your department" : "Select your faculty first"}
            </option>
            {departmentsForFaculty.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Course Code — shown only for classifications that keep it
            (Academics, Results). Required only for Results. */}
        {config.showCourseCode && (
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Course Code {config.courseCodeRequired ? "*" : "(optional)"}
            </label>
            <input
              type="text"
              required={config.courseCodeRequired}
              value={form.courseCode}
              onChange={update("courseCode")}
              placeholder="e.g PHY 101"
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>
        )}

        {/* Dynamic fields specific to the selected classification */}
        {config.extraFields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm text-gray-700 mb-1">
              {label} *
            </label>
            <input
              type="text"
              required
              value={form[key] || ""}
              onChange={update(key)}
              placeholder={placeholder}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Person Involved *
          </label>
          <input
            type="text"
            required
            value={form.personInvolved}
            onChange={update("personInvolved")}
            placeholder="e.g Dr Adebayo"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-1 text-base font-medium text-gray-600 border border-gray-300 rounded-[10px] py-2.5 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          className="flex-1 bg-brand hover:bg-brand-dark text-white text-base font-medium py-2.5 rounded-[10px]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
