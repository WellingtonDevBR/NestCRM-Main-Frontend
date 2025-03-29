
// Helper function to get badge color classes based on color name
export const getBadgeColorClass = (color: string): string => {
  switch (color.toLowerCase()) {
    case "green":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "red":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "yellow":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case "blue":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "indigo":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
    case "purple":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "pink":
      return "bg-pink-100 text-pink-800 hover:bg-pink-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

// Helper function to get pill color classes
export const getPillColorClass = (color: string): string => {
  switch (color.toLowerCase()) {
    case "green":
      return "bg-green-100 text-green-800";
    case "red":
      return "bg-red-100 text-red-800";
    case "yellow":
      return "bg-amber-100 text-amber-800";
    case "blue":
      return "bg-blue-100 text-blue-800";
    case "indigo":
      return "bg-indigo-100 text-indigo-800";
    case "purple":
      return "bg-purple-100 text-purple-800";
    case "pink":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get chip color classes
export const getChipColorClass = (color: string): string => {
  switch (color.toLowerCase()) {
    case "green":
      return "bg-green-500 text-white";
    case "red":
      return "bg-red-500 text-white";
    case "yellow":
      return "bg-amber-500 text-white";
    case "blue":
      return "bg-blue-500 text-white";
    case "indigo":
      return "bg-indigo-500 text-white";
    case "purple":
      return "bg-purple-500 text-white";
    case "pink":
      return "bg-pink-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

// Helper function to get text color class
export const getTextColorClass = (color: string): string => {
  switch (color.toLowerCase()) {
    case "green":
      return "text-green-600";
    case "red":
      return "text-red-600";
    case "yellow":
      return "text-amber-600";
    case "blue":
      return "text-blue-600";
    case "indigo":
      return "text-indigo-600";
    case "purple":
      return "text-purple-600";
    case "pink":
      return "text-pink-600";
    default:
      return "text-gray-600";
  }
};

// Helper function to get highlight color class
export const getHighlightClass = (color: string): string => {
  switch (color.toLowerCase()) {
    case "green":
      return "bg-green-100";
    case "red":
      return "bg-red-100";
    case "yellow":
      return "bg-amber-100";
    case "blue":
      return "bg-blue-100";
    case "indigo":
      return "bg-indigo-100";
    case "purple":
      return "bg-purple-100";
    case "pink":
      return "bg-pink-100";
    default:
      return "bg-yellow-100";
  }
};

// Helper function to get dot color class
export const getDotColorClass = (color: string): string => {
  switch (color.toLowerCase()) {
    case "green":
      return "bg-green-500";
    case "red":
      return "bg-red-500";
    case "yellow":
      return "bg-amber-500";
    case "blue":
      return "bg-blue-500";
    case "indigo":
      return "bg-indigo-500";
    case "purple":
      return "bg-purple-500";
    case "pink":
      return "bg-pink-500";
    default:
      return "bg-gray-500";
  }
};
