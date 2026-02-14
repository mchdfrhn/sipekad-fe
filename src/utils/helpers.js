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
    if (index > 0 && segments[index - 1] === "pengajuan") {
      label = "Pengajuan - Detail";
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
