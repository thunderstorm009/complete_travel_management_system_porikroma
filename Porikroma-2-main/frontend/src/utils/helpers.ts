export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCurrency = (
  amount: number,
  currency: string = "BDT"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else {
    return formatDate(dateString);
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const generateGradient = (text: string): string => {
  // Generate a consistent gradient based on text hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    "from-blue-400 to-purple-600",
    "from-green-400 to-blue-600",
    "from-purple-400 to-pink-600",
    "from-yellow-400 to-red-600",
    "from-indigo-400 to-purple-600",
    "from-pink-400 to-red-600",
  ];

  return colors[Math.abs(hash) % colors.length];
};

export const getInitials = (firstName: string, lastName: string): string => {
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
};

/**
 * Converts Unsplash photo page URLs to direct image URLs
 * @param url - The URL which can be an Unsplash page URL or direct image URL
 * @param width - Optional width parameter (default: 800)
 * @returns Direct image URL from Unsplash CDN or the original URL
 */
export const getImageUrl = (url?: string, width: number = 800): string => {
  // Default placeholder image - only used when url is truly empty/undefined
  const placeholderImage = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=${width}&q=80&fit=crop`;

  if (!url || url.trim() === "") {
    return placeholderImage;
  }

  // Handle Unsplash CDN URLs - add parameters if missing
  if (url.includes("images.unsplash.com")) {
    // If it already has query parameters, return as is
    if (url.includes("?")) {
      return url;
    }
    // Add query parameters for optimization
    return `${url}?w=${width}&q=80&fit=crop&auto=format`;
  }

  // If it's already a direct image URL from other supported sources, return as is
  if (
    url.includes("i.ibb.co") ||
    url.includes("imgbb.com") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  // Convert Unsplash page URL to direct image URL
  // Example: https://unsplash.com/photos/horse-and-man-on-the-beach-at-sunset-08V3R69RrVQ
  // The photo ID is the last 11 characters: 08V3R69RrVQ

  // Match Unsplash URLs with various formats
  if (url.includes("unsplash.com/photos/")) {
    // Extract everything after /photos/
    const parts = url.split("/photos/")[1];
    if (parts) {
      // Remove trailing slash and query params
      const cleanParts = parts.split("?")[0].replace(/\/$/, "");

      // The photo ID is always the last 11 characters (can include hyphens, letters, numbers)
      // Format: [optional-slug-]XXXXXXXXXXX where X is 11 chars
      const match = cleanParts.match(/([a-zA-Z0-9_-]{11})$/);
      if (match) {
        const photoId = match[1];
        return `https://images.unsplash.com/photo-${photoId}?w=${width}&q=80&fit=crop&auto=format`;
      }
    }
  }

  // Try to match simple photo ID format (just the ID)
  const simplePhotoMatch = url.match(/^([a-zA-Z0-9_-]{11})$/);
  if (simplePhotoMatch) {
    const photoId = simplePhotoMatch[1];
    return `https://images.unsplash.com/photo-${photoId}?w=${width}&q=80&fit=crop&auto=format`;
  }

  // If it's some other valid URL format, return it as is (don't use placeholder!)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Last resort - return the original URL (might work, might not)
  return url;
};
