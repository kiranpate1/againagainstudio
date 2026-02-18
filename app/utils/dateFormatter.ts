export function formatEventDate(isoDate: string | null): string {
  if (!isoDate) return "";

  // Parse the date
  const date = new Date(isoDate);

  // Convert to EST timezone and format as "Mon Feb 18"
  const formatted = date.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return formatted;
}
