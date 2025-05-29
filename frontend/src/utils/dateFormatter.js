// Format dates consistently across the application
export const formatTimestamp = (timestamp, includeYear = true) => {
  if (!timestamp) return "Just now";

  const dateOptions = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  if (includeYear) {
    dateOptions.year = "numeric";
  }

  return new Date(timestamp).toLocaleString(undefined, dateOptions);
};

// Get a relative time string (e.g. "2 hours ago", "yesterday", "3 days ago")
export const getRelativeTimeString = (timestamp) => {
  if (!timestamp) return "Just now";

  try {
    const now = new Date();
    const date = new Date(timestamp);

    // Return "Just now" if the date is invalid
    if (isNaN(date.getTime())) return "Just now";

    const secondsAgo = Math.floor((now - date) / 1000);

    // Less than a minute
    if (secondsAgo < 60) {
      return "Just now";
    }

    // Less than an hour
    if (secondsAgo < 3600) {
      const minutes = Math.floor(secondsAgo / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    // Less than a day
    if (secondsAgo < 86400) {
      const hours = Math.floor(secondsAgo / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    // Less than a week
    if (secondsAgo < 604800) {
      const days = Math.floor(secondsAgo / 86400);
      if (days === 1) return "Yesterday";
      return `${days} days ago`;
    }
    // Default to formatted date
    return formatTimestamp(timestamp);
  } catch (error) {
    // If any error occurs during date processing, default to "Just now"
    return "Just now";
  }
};
