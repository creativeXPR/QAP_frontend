const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    message,
    { status = 0, statusText = "", data = null, url = "" } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.url = url;
    this.errors = data?.errors || data;
  }

  get isAuthError() {
    return this.status === 401;
  }

  get isPermissionError() {
    return this.status === 403;
  }

  get fieldErrors() {
    if (this.data?.errors && typeof this.data.errors === "object") {
      return this.data.errors;
    }
    if (
      this.data &&
      typeof this.data === "object" &&
      !Array.isArray(this.data)
    ) {
      return this.data;
    }
    return {};
  }
}

function getStoredAccessToken() {
  return (
    localStorage.getItem("access_token") || // <-- ADD THIS LINE
    localStorage.getItem("data_access") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("accessToken") ||
    ""
  );
}

function buildQuery(params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") {
          search.append(key, item);
        }
      });
      return;
    }
    search.append(key, value);
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

export function apiUrl(path, params) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}${buildQuery(params)}`;
}

function getErrorMessage(data, fallback) {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (data.message) return data.message;
  if (data.detail) return data.detail;
  if (data.error) {
    return Array.isArray(data.error) ? data.error.join(" ") : data.error;
  }

  if (typeof data === "object") {
    const firstError = Object.entries(data)[0];
    if (firstError) {
      const [field, value] = firstError;
      const text = Array.isArray(value) ? value.join(" ") : String(value);
      return `${field}: ${text}`;
    }
  }

  return fallback;
}

async function parseResponse(response, responseType) {
  if (response.status === 204) return null;
  if (responseType === "response") return response;
  if (responseType === "blob") return response.blob();
  if (responseType === "text") return response.text();

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function getAuthHeaders(includeJson = true) {
  const headers = includeJson ? { "Content-Type": "application/json" } : {};
  const token = getStoredAccessToken();

  if (token) {
    headers.Authorization = `${localStorage.getItem("auth_type") || "Bearer"} ${token}`;
    console.log("[Auth] Authorization header set:", {
      hasToken: !!token,
      tokenLength: token.length,
      tokenPreview: token.substring(0, 20) + "...",
      authType: localStorage.getItem("auth_type") || "Bearer",
    });
  } else {
    console.warn("[Auth] NO TOKEN FOUND - checking all storage keys:", {
      access_token_length: (localStorage.getItem("access") || "").length,
      token_length: (localStorage.getItem("token") || "").length,
      jwt_length: (localStorage.getItem("jwt") || "").length,
      accessToken_length: (localStorage.getItem("accessToken") || "").length,
      allLocalStorageKeys: Object.keys(localStorage),
    });
  }

  return headers;
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    params,
    body,
    headers = {},
    auth = true,
    responseType = "json",
    signal,
  } = options;

  const isFormData = body instanceof FormData;
  const requestHeaders = {
    Accept: "application/json",
    ...(auth
      ? getAuthHeaders(!isFormData)
      : isFormData
        ? {}
        : { "Content-Type": "application/json" }),
    ...headers,
  };

  if (isFormData) {
    delete requestHeaders["Content-Type"];
  }

  console.log("[API Request]", {
    method,
    url: apiUrl(path, params),
    hasAuth: auth,
    authorizationHeader: requestHeaders.Authorization
      ? `${requestHeaders.Authorization.split(" ")[0]} ${requestHeaders.Authorization.split(" ")[1]?.substring(0, 20)}...`
      : "MISSING ❌",
    contentType: requestHeaders["Content-Type"],
    credentials: "include",
  });

  const response = await fetch(apiUrl(path, params), {
    method,
    headers: requestHeaders,
    body:
      body === undefined || body === null
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
    credentials: "include",
    signal,
  });

  const data = await parseResponse(response, responseType);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, response.statusText || "Request failed"),
      {
        status: response.status,
        statusText: response.statusText,
        data,
        url: response.url,
      },
    );
  }

  return data;
}

function withTrailingSlash(path) {
  return path.endsWith("/") ? path : `${path}/`;
}

export function createResource(basePath) {
  const path = withTrailingSlash(basePath);

  return {
    list: (params, options) => apiRequest(path, { ...options, params }),
    retrieve: (id, options) => apiRequest(`${path}${id}/`, options),
    create: (payload, options) =>
      apiRequest(path, { ...options, method: "POST", body: payload }),
    update: (id, payload, options) =>
      apiRequest(`${path}${id}/`, { ...options, method: "PUT", body: payload }),
    partialUpdate: (id, payload, options) =>
      apiRequest(`${path}${id}/`, {
        ...options,
        method: "PATCH",
        body: payload,
      }),
    remove: (id, options) =>
      apiRequest(`${path}${id}/`, { ...options, method: "DELETE" }),
    action: (
      id,
      action,
      { method = "POST", payload, params, responseType, ...options } = {},
    ) =>
      apiRequest(`${path}${id}/${action}/`, {
        ...options,
        method,
        body: payload,
        params,
        responseType,
      }),
  };
}

export function unwrapEnvelope(response) {
  if (
    response &&
    typeof response === "object" &&
    "success" in response &&
    "data" in response
  ) {
    return response.data;
  }
  return response;
}

export function getListItems(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.results)) return response.results;
  return [];
}

// Replace/remove a single record inside a list response, preserving
// whichever of the three shapes above the response came in — for
// optimistic UI updates after a create/update/delete on one item.
export function replaceListItem(response, id, updatedItem) {
  const replace = (items) =>
    items.map((item) => (item.id === id ? updatedItem : item));
  if (Array.isArray(response)) return replace(response);
  if (Array.isArray(response?.data))
    return { ...response, data: replace(response.data) };
  if (Array.isArray(response?.results))
    return { ...response, results: replace(response.results) };
  return response;
}

export function removeListItem(response, id) {
  const remove = (items) => items.filter((item) => item.id !== id);
  if (Array.isArray(response)) return remove(response);
  if (Array.isArray(response?.data))
    return { ...response, data: remove(response.data) };
  if (Array.isArray(response?.results))
    return { ...response, results: remove(response.results) };
  return response;
}

export const api = {
  get: (path, params, options) =>
    apiRequest(path, { ...options, method: "GET", params }),
  post: (path, payload, options) =>
    apiRequest(path, { ...options, method: "POST", body: payload }),
  put: (path, payload, options) =>
    apiRequest(path, { ...options, method: "PUT", body: payload }),
  patch: (path, payload, options) =>
    apiRequest(path, { ...options, method: "PATCH", body: payload }),
  delete: (path, options) => apiRequest(path, { ...options, method: "DELETE" }),
};
