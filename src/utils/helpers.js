/**
 * Formats a URL path into a breadcrumb-friendly array of objects.
 * Example: /admin/user -> [{ label: "Alert", path: "/admin" }, { label: "User", path: "/admin/user" }]
 * @param {string} path - The current URL path (e.g., "/admin/user/detail")
 * @returns {Array<{label: string, path: string}>}
 */
export const formatPathToBreadcrumb = (path) => {
  // Remove trailing slash if exists (unless it's root)
  const cleanPath = path === "/" ? path : path.replace(/\/$/, "");

  // Split path into segments
  const segments = cleanPath.split("/").filter(Boolean);

  // Generate breadcrumb items
  const breadcrumbs = segments.map((segment, index) => {
    // Construct the path for this segment
    const segmentPath = `/${segments.slice(0, index + 1).join("/")}`;

    // Format the label (capitalize, remove hyphens)
    let label = segment
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    // Customize specific path names (optional - commented out to keep Admin as Admin in breadcrumbs)
    // if (label === "Admin") {
    //   label = "Dashboard";
    // }

    // Custom label for Request Detail
    if (
      (index > 0 && segments[index - 1] === "pengajuan") ||
      (index === 1 &&
        segments[0] === "dashboard" &&
        segment.startsWith("pengajuan-"))
    ) {
      label = "Pengajuan - Detail";
    }

    // Custom label for User Detail
    if (segment.startsWith("users-")) {
      label = "User Detail";
    }

    return {
      label,
      path: segmentPath,
    };
  });

  return breadcrumbs;
};

/**
 * Formats a date into a relative string (e.g., "Just now", "5m ago", "2h ago", "Dec 12")
 * @param {string|Date} date - The date to format
 * @returns {string}
 */
export const formatDateRelative = (date) => {
  if (!date) return "";
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;

  return past.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: past.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

/**
 * Generates an array of page numbers and ellipsis for pagination.
 * @param {number} currentPage - The current active page
 * @param {number} totalPages - The total number of pages
 * @returns {Array<number|string>}
 */
export const generatePaginationPages = (currentPage, totalPages) => {
  const delta = 1; // Number of pages to show around current page
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("..");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
};
