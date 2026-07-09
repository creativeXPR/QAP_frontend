// Config for how the "Select Category" (classification) dropdown on
// step 2 changes the rest of the Complaint Details form.
//
// showCourseCode / courseCodeRequired control the existing Course Code
// field. extraFields are additional inputs specific to that
// classification, each rendered as a plain text input.
export const CLASSIFICATIONS = [
  "Academics",
  "Hostel/Welfare",
  "Facilities",
  "Staff Conduct",
  "Admin Delays",
  "Safety/Security",
  "Results",
];

export const CLASSIFICATION_CONFIG = {
  Academics: {
    showCourseCode: true,
    courseCodeRequired: false,
    extraFields: [],
  },
  Results: {
    // Same as Academics, but Course Code becomes required.
    showCourseCode: true,
    courseCodeRequired: true,
    extraFields: [],
  },
  "Hostel/Welfare": {
    showCourseCode: false,
    extraFields: [
      { key: "hostelName", label: "Hostel Name", placeholder: "e.g Zik Hall" },
      { key: "roomNumber", label: "Room Number", placeholder: "e.g B204" },
    ],
  },
  Facilities: {
    showCourseCode: false,
    extraFields: [
      { key: "facilityName", label: "Facility Name", placeholder: "e.g Main Library" },
    ],
  },
  "Staff Conduct": {
    showCourseCode: false,
    extraFields: [
      { key: "staffUnit", label: "Staff Unit", placeholder: "e.g Bursary" },
    ],
  },
  "Admin Delays": {
    showCourseCode: false,
    extraFields: [
      { key: "adminUnit", label: "Admin Unit", placeholder: "e.g Registry" },
    ],
  },
  "Safety/Security": {
    showCourseCode: false,
    extraFields: [
      { key: "location", label: "Location", placeholder: "e.g Behind Zik Hall" },
    ],
  },
};

// Every possible extra-field key across all classifications, so the
// wizard's form state can initialize/reset them consistently.
export const ALL_EXTRA_FIELD_KEYS = Array.from(
  new Set(
    Object.values(CLASSIFICATION_CONFIG).flatMap((c) =>
      c.extraFields.map((f) => f.key)
    )
  )
);