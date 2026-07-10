import { useState, useMemo } from "react";
import { FileText } from "../../../lib/icons";
import {
  CLASSIFICATIONS,
  CLASSIFICATION_CONFIG,
} from "../../../lib/classifications";

const FACULTIES = [
  { id: 1, name: "Faculty of Agriculture" },
  { id: 2, name: "Faculty of Arts" },
  { id: 3, name: "Faculty of Basic Medical Sciences" },
  { id: 4, name: "Faculty of Clinical Sciences" },
  { id: 29, name: "Faculty of Computing" },
  { id: 7, name: "Faculty of Education" },
  { id: 8, name: "Faculty of Law" },
  { id: 9, name: "Faculty of Pharmacy" },
  { id: 10, name: "Faculty of Public Health" },
  { id: 12, name: "Faculty of Science" },
  { id: 13, name: "Faculty of Social Sciences" },
  { id: 14, name: "Faculty of Technology" },
  { id: 15, name: "Faculty of Veterinary Medicine" },
];

const DEPARTMENTS = [
  // Faculty of Agriculture
  {
    id: 1,
    faculty_name: "Faculty of Agriculture",
    name: "Agricultural Economics",
  },
  { id: 2, faculty_name: "Faculty of Agriculture", name: "Agronomy" },
  { id: 3, faculty_name: "Faculty of Agriculture", name: "Animal Science" },
  {
    id: 4,
    faculty_name: "Faculty of Agriculture",
    name: "Crop Protection and Environmental Biology",
  },

  // Faculty of Arts
  {
    id: 5,
    faculty_name: "Faculty of Arts",
    name: "Arabic and Islamic Studies",
  },
  {
    id: 6,
    faculty_name: "Faculty of Arts",
    name: "Archaeology and Anthropology",
  },
  { id: 7, faculty_name: "Faculty of Arts", name: "Classics" },
  {
    id: 8,
    faculty_name: "Faculty of Arts",
    name: "Communication and Language Arts",
  },
  { id: 9, faculty_name: "Faculty of Arts", name: "English" },
  {
    id: 10,
    faculty_name: "Faculty of Arts",
    name: "European Studies (French, German, Russian)",
  },
  { id: 11, faculty_name: "Faculty of Arts", name: "History" },
  {
    id: 12,
    faculty_name: "Faculty of Arts",
    name: "Linguistics and African Languages (including Igbo and Yoruba)",
  },
  { id: 13, faculty_name: "Faculty of Arts", name: "Music" },
  { id: 14, faculty_name: "Faculty of Arts", name: "Philosophy" },
  { id: 15, faculty_name: "Faculty of Arts", name: "Religious Studies" },
  { id: 16, faculty_name: "Faculty of Arts", name: "Theatre Arts" },

  // Faculty of Basic Medical Sciences
  {
    id: 17,
    faculty_name: "Faculty of Basic Medical Sciences",
    name: "Anatomy",
  },
  {
    id: 18,
    faculty_name: "Faculty of Basic Medical Sciences",
    name: "Biochemistry",
  },
  {
    id: 19,
    faculty_name: "Faculty of Basic Medical Sciences",
    name: "Physiology",
  },

  // Faculty of Clinical Sciences
  { id: 20, faculty_name: "Faculty of Clinical Sciences", name: "Medicine" },
  { id: 21, faculty_name: "Faculty of Clinical Sciences", name: "Surgery" },
  {
    id: 22,
    faculty_name: "Faculty of Clinical Sciences",
    name: "Obstetrics & Gynaecology",
  },
  { id: 23, faculty_name: "Faculty of Clinical Sciences", name: "Paediatrics" },
  {
    id: 24,
    faculty_name: "Faculty of Clinical Sciences",
    name: "Ophthalmology",
  },
  { id: 25, faculty_name: "Faculty of Clinical Sciences", name: "Psychiatry" },

  // Faculty of Computing
  {
    id: 71,
    faculty_name: "Faculty of Computing",
    name: "Data & Information Science",
  },

  // Faculty of Economics and Management Sciences
  {
    id: 26,
    faculty_name: "Faculty of Economics and Management Sciences",
    name: "Economics",
  },

  // Faculty of Education
  { id: 28, faculty_name: "Faculty of Education", name: "Adult Education" },
  {
    id: 29,
    faculty_name: "Faculty of Education",
    name: "Educational Management",
  },
  {
    id: 30,
    faculty_name: "Faculty of Education",
    name: "Guidance and Counselling",
  },
  {
    id: 31,
    faculty_name: "Faculty of Education",
    name: "Human Kinetics and Health Education",
  },
  {
    id: 32,
    faculty_name: "Faculty of Education",
    name: "Library and Information Studies",
  },
  { id: 33, faculty_name: "Faculty of Education", name: "Special Education" },
  {
    id: 34,
    faculty_name: "Faculty of Education",
    name: "Teacher Education (Arts, Science, Social Sciences, Pre-Primary)",
  },

  // Faculty of Law
  { id: 35, faculty_name: "Faculty of Law", name: "Law" },

  // Faculty of Pharmacy
  {
    id: 36,
    faculty_name: "Faculty of Pharmacy",
    name: "Pharmaceutics and Industrial Pharmacy (and other specialized Pharmacy departments)",
  },

  // Faculty of Public Health
  {
    id: 37,
    faculty_name: "Faculty of Public Health",
    name: "Epidemiology, Medical Statistics and Environmental Health (EMSEH)",
  },
  {
    id: 38,
    faculty_name: "Faculty of Public Health",
    name: "Health Policy and Management",
  },
  {
    id: 39,
    faculty_name: "Faculty of Public Health",
    name: "Health Promotion and Education",
  },
  {
    id: 40,
    faculty_name: "Faculty of Public Health",
    name: "Human Nutrition and Dietetics",
  },

  // Faculty of Renewable Natural Resources
  {
    id: 41,
    faculty_name: "Faculty of Renewable Natural Resources",
    name: "Aquaculture and Fisheries Management",
  },
  {
    id: 42,
    faculty_name: "Faculty of Renewable Natural Resources",
    name: "Agricultural Extension and Rural Development",
  },
  {
    id: 43,
    faculty_name: "Faculty of Renewable Natural Resources",
    name: "Forest Resources Management",
  },
  {
    id: 44,
    faculty_name: "Faculty of Renewable Natural Resources",
    name: "Wildlife and Ecotourism Management",
  },
  {
    id: 45,
    faculty_name: "Faculty of Renewable Natural Resources",
    name: "Wood Products Engineering",
  },

  // Faculty of Science
  { id: 46, faculty_name: "Faculty of Science", name: "Botany" },
  { id: 47, faculty_name: "Faculty of Science", name: "Chemistry" },
  { id: 48, faculty_name: "Faculty of Science", name: "Computer Science" },
  { id: 49, faculty_name: "Faculty of Science", name: "Geography" },
  { id: 50, faculty_name: "Faculty of Science", name: "Geology" },
  { id: 51, faculty_name: "Faculty of Science", name: "Mathematics" },
  { id: 52, faculty_name: "Faculty of Science", name: "Microbiology" },
  { id: 53, faculty_name: "Faculty of Science", name: "Physics" },
  { id: 54, faculty_name: "Faculty of Science", name: "Statistics" },
  { id: 55, faculty_name: "Faculty of Science", name: "Zoology" },

  // Faculty of Social Sciences
  {
    id: 56,
    faculty_name: "Faculty of Social Sciences",
    name: "Political Science",
  },
  { id: 57, faculty_name: "Faculty of Social Sciences", name: "Psychology" },
  { id: 58, faculty_name: "Faculty of Social Sciences", name: "Sociology" },

  // Faculty of Technology
  {
    id: 59,
    faculty_name: "Faculty of Technology",
    name: "Agricultural and Environmental Engineering",
  },
  { id: 60, faculty_name: "Faculty of Technology", name: "Civil Engineering" },
  {
    id: 61,
    faculty_name: "Faculty of Technology",
    name: "Electrical and Electronic Engineering",
  },
  { id: 62, faculty_name: "Faculty of Technology", name: "Food Technology" },
  {
    id: 63,
    faculty_name: "Faculty of Technology",
    name: "Industrial and Production Engineering",
  },
  {
    id: 64,
    faculty_name: "Faculty of Technology",
    name: "Mechanical Engineering",
  },
  {
    id: 65,
    faculty_name: "Faculty of Technology",
    name: "Petroleum Engineering",
  },

  // Faculty of Veterinary Medicine
  {
    id: 66,
    faculty_name: "Faculty of Veterinary Medicine",
    name: "Veterinary Anatomy",
  },
  {
    id: 67,
    faculty_name: "Faculty of Veterinary Medicine",
    name: "Veterinary Physiology, Biochemistry and Pharmacology (and other specialized Veterinary departments)",
  },
];
export default function ComplaintDetailsStep({
  form,
  update,
  onCategoryChange,
  onFacultyChange,
  onBack,
  onContinue,
}) {
  const [errors, setErrors] = useState({});

  const departmentsForFaculty = useMemo(() => {
    return DEPARTMENTS.filter(
      (department) => department.faculty_name === form.faculty,
    );
  }, [form.faculty]);

  const config =
    CLASSIFICATION_CONFIG[form.category] || CLASSIFICATION_CONFIG.Academics;

  const handleContinue = () => {
    const newErrors = {};

    const requiredFields = [
      ["category", "Category is required"],
      ["title", "Title is required"],
      ["description", "Description is required"],
      ["dateOccurred", "Date occurred is required"],
      ["urgency", "Urgency is required"],
      ["faculty", "Faculty is required"],
      ["department", "Department is required"],
      ["courseCode", "Course code is required"],
      ["personInvolved", "Person involved is required"],
    ];

    requiredFields.forEach(([field, message]) => {
      if (!form[field]?.trim()) {
        newErrors[field] = message;
      }
    });

    config.extraFields.forEach(({ key, label }) => {
      if (!form[key]?.trim()) {
        newErrors[key] = `${label} is required`;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onContinue();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">
        Describe your complaint
      </h2>

      <p className="text-sm text-gray-400 text-center mb-6">
        Provide as much detail as possible to help us process your report.
      </p>

      <div className="space-y-4">
        {/* CATEGORY */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Select Category *
          </label>

          <div className="relative">
            <FileText
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={form.category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 pl-9 py-2.5"
            >
              {CLASSIFICATIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TITLE */}
        <InputField
          label="Report Title *"
          value={form.title}
          onChange={update("title")}
          error={errors.title}
          placeholder="Unannounced Change of Exam Venue for PHY 101"
        />

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Description *
          </label>

          <textarea
            rows={3}
            value={form.description}
            onChange={update("description")}
            className="w-full rounded-md border border-gray-300 px-3 py-2.5"
            placeholder="Describe what happened, how and when"
          />

          {errors.description && <Error text={errors.description} />}
        </div>

        {/* DATE + URGENCY */}
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField
            label="Date Occurred *"
            type="date"
            value={form.dateOccurred}
            onChange={update("dateOccurred")}
            error={errors.dateOccurred}
          />

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Urgency *
            </label>

            <select
              value={form.urgency}
              onChange={update("urgency")}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            {errors.urgency && <Error text={errors.urgency} />}
          </div>
        </div>

        {/* FACULTY */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Faculty *</label>

          <select
            value={form.faculty}
            onChange={(e) => onFacultyChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2.5"
          >
            <option value="">Select your faculty</option>

            {FACULTIES.map((faculty) => (
              <option key={faculty.id} value={faculty.name}>
                {faculty.name}
              </option>
            ))}
          </select>

          {errors.faculty && <Error text={errors.faculty} />}
        </div>

        {/* DEPARTMENT */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Department *
          </label>

          <select
            value={form.department}
            disabled={!form.faculty}
            onChange={update("department")}
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 disabled:bg-gray-100"
          >
            <option value="">Select department</option>

            {departmentsForFaculty.map((department) => (
              <option key={department.id} value={department.name}>
                {department.name}
              </option>
            ))}
          </select>

          {errors.department && <Error text={errors.department} />}
        </div>

        {/* COURSE CODE */}
        <InputField
          label="Course Code *"
          value={form.courseCode}
          onChange={update("courseCode")}
          error={errors.courseCode}
          placeholder="e.g PHY 101"
        />

        {/* EXTRA FIELDS */}
        {config.extraFields.map(({ key, label, placeholder }) => (
          <InputField
            key={key}
            label={`${label} *`}
            value={form[key] || ""}
            onChange={update(key)}
            error={errors[key]}
            placeholder={placeholder}
          />
        ))}

        {/* PERSON INVOLVED */}
        <InputField
          label="Person Involved *"
          value={form.personInvolved}
          onChange={update("personInvolved")}
          error={errors.personInvolved}
          placeholder="e.g Dr Adebayo"
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-1 border rounded-[10px] py-2.5"
        >
          Back
        </button>

        <button
          onClick={handleContinue}
          className="flex-1 bg-brand text-white rounded-[10px] py-2.5"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function Error({ text }) {
  return <p className="text-xs text-red-500 mt-1">{text}</p>;
}

function InputField({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1">{label}</label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2.5"
      />

      {error && <Error text={error} />}
    </div>
  );
}
