export function formatEventDate(isoDate: string | null): string {
  if (!isoDate) return "";

  // Check if the ISO string contains time information
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(isoDate);

  let date: Date;

  if (isDateOnly) {
    // For date-only strings, parse as local date to avoid timezone issues
    const [year, month, day] = isoDate.split("-").map(Number);
    date = new Date(year, month - 1, day);
  } else {
    // For full ISO strings with time, parse normally
    date = new Date(isoDate);
  }

  // Format day and date
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();

  // Base format: "Fri Feb 6"
  let formatted = `${dayOfWeek} ${month} ${day}`;

  // Add time only if the original string had time information
  if (!isDateOnly) {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Convert to 12-hour format
    const period = hours >= 12 ? "pm" : "am";
    const hour12 = hours % 12 || 12;

    // Format time (e.g., "8pm" or "8:30pm")
    const timeStr =
      minutes === 0
        ? `${hour12}${period}`
        : `${hour12}:${minutes.toString().padStart(2, "0")}${period}`;

    // Assuming 2-hour event duration for the end time
    const endDate = new Date(date);
    endDate.setHours(date.getHours() + 2);
    const endHours = endDate.getHours();
    const endMinutes = endDate.getMinutes();
    const endPeriod = endHours >= 12 ? "pm" : "am";
    const endHour12 = endHours % 12 || 12;
    const endTimeStr =
      endMinutes === 0
        ? `${endHour12}${endPeriod}`
        : `${endHour12}:${endMinutes.toString().padStart(2, "0")}${endPeriod}`;

    formatted += `, ${timeStr}-${endTimeStr}`;
  }

  return formatted;
}
