import { api, createResource } from "./client";

const core = {
  faculties: createResource("/api/core/faculties/"),
  departments: createResource("/api/core/departments/"),
};

const auth = {
  users: {
    // GET /api/auth/google/cred/all/ ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â admin-only list of all registered
    // users: { id, username, email, status, first_name, last_name, is_active }.
    all: (params, options) =>
      api.get("/api/auth/google/cred/all/", params, options),
  },
};

const students = {
  records: createResource("/api/students/"),
  feedback: createResource("/api/students/feedback/"),
  feedbackTracking: {
    list: (params, options) =>
      api.get("/api/students/feedback-tracking/", params, options),
    create: (payload, options) =>
      api.post("/api/students/feedback-tracking/", payload, options),
  },
  notifications: {
    ...createResource("/api/students/notifications/"),
    markRead: (id, options) =>
      api.post(
        `/api/students/notifications/${id}/mark-read/`,
        undefined,
        options,
      ),
  },
};

const staffs = {
  records: createResource("/api/staffs/"),
  feedback: createResource("/api/staffs/feedback/"),
  feedbackTracking: {
    list: (params, options) =>
      api.get("/api/staffs/feedback-tracking/", params, options),
    create: (payload, options) =>
      api.post("/api/staffs/feedback-tracking/", payload, options),
  },
  notifications: {
    ...createResource("/api/staffs/notifications/"),
    markRead: (id, options) =>
      api.post(
        `/api/staffs/notifications/${id}/mark-read/`,
        undefined,
        options,
      ),
  },
};
const courses = {
  courses: createResource("/api/courses/courses/"),
  lectureSessions: createResource("/api/courses/lecture-sessions/"),
};

const examinations = {
  examSessions: createResource("/api/examinations/exam-sessions/"),
  qualityReports: createResource("/api/examinations/quality-reports/"),
};

const lecturers = {
  profiles: {
    ...createResource("/api/lecturers/lecturer-profiles/"),
    summary: (id, params, options) =>
      api.get(
        `/api/lecturers/lecturer-profiles/${id}/assessment_summary/`,
        params,
        options,
      ),
  },
  assessmentReports: createResource("/api/lecturers/assessment-reports/"),
};

const accreditation = {
  cycles: {
    ...createResource("/api/accreditation/cycles/"),
    close: (id, payload, options) =>
      api.patch(`/api/accreditation/cycles/${id}/close/`, payload, options),
  },
  components: createResource("/api/accreditation/components/"),
  metrics: createResource("/api/accreditation/metrics/"),
  submissions: {
    ...createResource("/api/accreditation/submissions/"),
    bulk: (payload, options) =>
      api.post("/api/accreditation/submissions/bulk/", payload, options),
  },
  evidence: {
    ...createResource("/api/accreditation/evidence/"),
    verify: (id, payload, options) =>
      api.patch(`/api/accreditation/evidence/${id}/verify/`, payload, options),
    reject: (id, payload, options) =>
      api.patch(`/api/accreditation/evidence/${id}/reject/`, payload, options),
  },
  alerts: {
    ...createResource("/api/accreditation/alerts/"),
    acknowledge: (id, payload, options) =>
      api.patch(
        `/api/accreditation/alerts/${id}/acknowledge/`,
        payload,
        options,
      ),
    resolve: (id, payload, options) =>
      api.patch(`/api/accreditation/alerts/${id}/resolve/`, payload, options),
    escalate: (id, payload, options) =>
      api.patch(`/api/accreditation/alerts/${id}/escalate/`, payload, options),
  },
  actions: {
    ...createResource("/api/accreditation/actions/"),
    progress: (id, payload, options) =>
      api.patch(`/api/accreditation/actions/${id}/progress/`, payload, options),
    submit: (id, payload, options) =>
      api.patch(`/api/accreditation/actions/${id}/submit/`, payload, options),
    verify: (id, payload, options) =>
      api.patch(`/api/accreditation/actions/${id}/verify/`, payload, options),
    reject: (id, payload, options) =>
      api.patch(`/api/accreditation/actions/${id}/reject/`, payload, options),
    close: (id, payload, options) =>
      api.patch(`/api/accreditation/actions/${id}/close/`, payload, options),
  },
  calculateComponentScores: (cycleId, programmeId, payload, options) =>
    api.post(
      `/api/accreditation/cycles/${cycleId}/programmes/${programmeId}/calculate-component-scores/`,
      payload,
      options,
    ),
  calculatePari: (cycleId, programmeId, payload, options) =>
    api.post(
      `/api/accreditation/cycles/${cycleId}/programmes/${programmeId}/calculate-pari/`,
      payload,
      options,
    ),
};

const analytics = {
  accreditationOverview: (params, options) =>
    api.get("/api/analytics/accreditation/overview/", params, options),
  programmesByRisk: (params, options) =>
    api.get(
      "/api/analytics/accreditation/programmes-by-risk/",
      params,
      options,
    ),
  componentPerformance: (params, options) =>
    api.get(
      "/api/analytics/accreditation/component-performance/",
      params,
      options,
    ),
  earlyWarning: (params, options) =>
    api.get("/api/analytics/accreditation/early-warning/", params, options),
  facultySummary: (params, options) =>
    api.get("/api/analytics/accreditation/faculty-summary/", params, options),
  departmentSummary: (params, options) =>
    api.get(
      "/api/analytics/accreditation/department-summary/",
      params,
      options,
    ),
  timeline: (params, options) =>
    api.get("/api/analytics/accreditation/timeline/", params, options),
  // /api/analytics/kpis/ items: { id, title, description, embedlink, metrics }.
  kpis: {
    ...createResource("/api/analytics/kpis/"),
    list: (params, options) => api.get("/api/analytics/kpis/", params, options),
  },
  // /api/updates/endpoints/ items: { id, category, title, description,
  // classification, forUser, button }.
  updates: {
    ...createResource("/api/updates/endpoints/"),
    list: (params, options) =>
      api.get("/api/updates/endpoints/", params, options),
  },
};

const dashboards = {
  summary: (params, options) =>
    api.get("/api/dashboards/summary/", params, options),
  universityOverview: (params, options) =>
    api.get("/api/dashboards/university-overview/", params, options),
  accreditation: (params, options) =>
    api.get("/api/dashboards/accreditation/", params, options),
  qaCommittee: (params, options) =>
    api.get("/api/dashboards/qa-committee/", params, options),
  teachingLearning: (params, options) =>
    api.get("/api/dashboards/teaching-learning/", params, options),
  examinations: (params, options) =>
    api.get("/api/dashboards/examinations/", params, options),
  documents: (params, options) =>
    api.get("/api/dashboards/documents/", params, options),
  studentExperience: (params, options) =>
    api.get("/api/dashboards/student-experience/", params, options),
  infrastructureLabs: (params, options) =>
    api.get("/api/dashboards/infrastructure-labs/", params, options),
  research: (params, options) =>
    api.get("/api/dashboards/research/", params, options),
  earlyWarning: (params, options) =>
    api.get("/api/dashboards/early-warning/", params, options),
  activityFeed: (params, options) =>
    api.get("/api/dashboards/activity-feed/", params, options),
};

const qaCommittee = {
  committees: {
    ...createResource("/api/qa-committee/committees/"),
    members: (id, params, options) =>
      api.get(`/api/qa-committee/committees/${id}/members/`, params, options),
    addMember: (id, payload, options) =>
      api.post(`/api/qa-committee/committees/${id}/members/`, payload, options),
    dashboard: (id, params, options) =>
      api.get(`/api/qa-committee/committees/${id}/dashboard/`, params, options),
  },
  members: createResource("/api/qa-committee/members/"),
  meetings: {
    ...createResource("/api/qa-committee/meetings/"),
    markHeld: (id, payload, options) =>
      api.post(`/api/qa-committee/meetings/${id}/mark-held/`, payload, options),
    attendance: (id, payload, options) =>
      api.post(
        `/api/qa-committee/meetings/${id}/attendance/`,
        payload,
        options,
      ),
  },
  attendance: createResource("/api/qa-committee/attendance/"),
  auditCycles: {
    ...createResource("/api/qa-committee/audit-cycles/"),
    submit: (id, payload, options) =>
      api.post(
        `/api/qa-committee/audit-cycles/${id}/submit/`,
        payload,
        options,
      ),
    close: (id, payload, options) =>
      api.post(`/api/qa-committee/audit-cycles/${id}/close/`, payload, options),
  },
  findings: {
    ...createResource("/api/qa-committee/findings/"),
    resolve: (id, payload, options) =>
      api.post(`/api/qa-committee/findings/${id}/resolve/`, payload, options),
    dismiss: (id, payload, options) =>
      api.post(`/api/qa-committee/findings/${id}/dismiss/`, payload, options),
  },
  recommendations: {
    ...createResource("/api/qa-committee/recommendations/"),
    accept: (id, payload, options) =>
      api.post(
        `/api/qa-committee/recommendations/${id}/accept/`,
        payload,
        options,
      ),
    markInProgress: (id, payload, options) =>
      api.post(
        `/api/qa-committee/recommendations/${id}/mark-in-progress/`,
        payload,
        options,
      ),
    markImplemented: (id, payload, options) =>
      api.post(
        `/api/qa-committee/recommendations/${id}/mark-implemented/`,
        payload,
        options,
      ),
    verify: (id, payload, options) =>
      api.post(
        `/api/qa-committee/recommendations/${id}/verify/`,
        payload,
        options,
      ),
  },
  actionPlans: {
    ...createResource("/api/qa-committee/action-plans/"),
    submitEvidence: (id, payload, options) =>
      api.post(
        `/api/qa-committee/action-plans/${id}/submit-evidence/`,
        payload,
        options,
      ),
  },
  evidence: {
    ...createResource("/api/qa-committee/evidence/"),
    verify: (id, payload, options) =>
      api.post(`/api/qa-committee/evidence/${id}/verify/`, payload, options),
    reject: (id, payload, options) =>
      api.post(`/api/qa-committee/evidence/${id}/reject/`, payload, options),
  },
  reports: {
    ...createResource("/api/qa-committee/reports/"),
    submit: (id, payload, options) =>
      api.post(`/api/qa-committee/reports/${id}/submit/`, payload, options),
    approve: (id, payload, options) =>
      api.post(`/api/qa-committee/reports/${id}/approve/`, payload, options),
  },
  dataReviews: {
    ...createResource("/api/qa-committee/data-reviews/"),
    validate: (id, payload, options) =>
      api.post(
        `/api/qa-committee/data-reviews/${id}/validate/`,
        payload,
        options,
      ),
    flag: (id, payload, options) =>
      api.post(`/api/qa-committee/data-reviews/${id}/flag/`, payload, options),
  },
  summary: (params, options) =>
    api.get("/api/qa-committee/summary/", params, options),
  effectiveness: (params, options) =>
    api.get("/api/qa-committee/effectiveness/", params, options),
  overdueActions: (params, options) =>
    api.get("/api/qa-committee/overdue-actions/", params, options),
  riskSummary: (params, options) =>
    api.get("/api/qa-committee/risk-summary/", params, options),
  activityFeed: (params, options) =>
    api.get("/api/qa-committee/activity-feed/", params, options),
};

const documents = {
  categories: createResource("/api/institutional-documents/categories/"),
  documents: {
    ...createResource("/api/institutional-documents/documents/"),
    submitForReview: (id, payload, options) =>
      api.post(
        `/api/institutional-documents/documents/${id}/submit-for-review/`,
        payload,
        options,
      ),
    approve: (id, payload, options) =>
      api.post(
        `/api/institutional-documents/documents/${id}/approve/`,
        payload,
        options,
      ),
    reject: (id, payload, options) =>
      api.post(
        `/api/institutional-documents/documents/${id}/reject/`,
        payload,
        options,
      ),
    publish: (id, payload, options) =>
      api.post(
        `/api/institutional-documents/documents/${id}/publish/`,
        payload,
        options,
      ),
    archive: (id, payload, options) =>
      api.post(
        `/api/institutional-documents/documents/${id}/archive/`,
        payload,
        options,
      ),
    newVersion: (id, payload, options) =>
      api.post(
        `/api/institutional-documents/documents/${id}/new-version/`,
        payload,
        options,
      ),
    preview: (id, options) =>
      api.get(
        `/api/institutional-documents/documents/${id}/preview/`,
        undefined,
        {
          ...options,
          responseType: "blob",
        },
      ),
    download: (id, options) =>
      api.get(
        `/api/institutional-documents/documents/${id}/download/`,
        undefined,
        {
          ...options,
          responseType: "blob",
        },
      ),
    versions: (id, params, options) =>
      api.get(
        `/api/institutional-documents/documents/${id}/versions/`,
        params,
        options,
      ),
  },
  versions: createResource("/api/institutional-documents/versions/"),
  accessLogs: createResource("/api/institutional-documents/access-logs/"),
};

export const qapApi = {
  core,
  auth,
  students,
  staffs,
  courses,
  examinations,
  lecturers,
  accreditation,
  analytics,
  dashboards,
  qaCommittee,
  documents,
};

export {
  accreditation,
  analytics,
  auth,
  core,
  courses,
  dashboards,
  documents,
  examinations,
  lecturers,
  qaCommittee,
  students,
  staffs,
};
