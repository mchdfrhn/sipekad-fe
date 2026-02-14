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
    const label = segment
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return {
      label,
      path: segmentPath,
    };
  });

  return breadcrumbs;
};
