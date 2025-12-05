import {
  FormData,
  FormErrors,
  ProjectSubmission,
  NotificationEvent,
} from "../types";

export const validateEmail = (email: string): boolean => {
  const trimmedEmail = email.trim().toLowerCase();

  // Basic format validation
  const basicRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!basicRegex.test(trimmedEmail)) {
    return false;
  }

  // Block common typos and invalid TLDs
  const invalidTLDs = [
    "cum",
    "con",
    "coom",
    "cmo",
    "cim",
    "cpm",
    "ocm",
    "vom",
    "cpm",
    "cm",
    "co",
    "c",
    "om",
    "comm",
    "coml",
    "nit",
    "nte",
    "ner",
    "ne",
    "orgm",
    "ogr",
    "or",
    "phm",
    "phl",
  ];

  const domain = trimmedEmail.split("@")[1];
  const tld = domain.split(".").pop();

  // Reject if TLD is in our blacklist
  if (tld && invalidTLDs.includes(tld)) {
    return false;
  }

  // Additional check for proper TLD format (must be valid)
  const validTLDs = [
    "com",
    "net",
    "org",
    "edu",
    "gov",
    "mil",
    "int",
    "ph",
    "co.uk",
    "co.ph",
    "gov.ph",
    "org.ph",
    "net.ph",
    "edu.ph",
    "io",
    "ly",
    "me",
    "tv",
    "cc",
    "ws",
    "biz",
    "info",
    "name",
    "tech",
    "app",
  ];

  return tld
    ? validTLDs.some((validTLD) => domain.endsWith("." + validTLD))
    : false;
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Remove all spaces and formatting
  const cleaned = phone.replace(/\s+/g, "");

  // Philippine mobile number validation
  // Supports: +63 976 125 1205, 0976 125 1205, 976 125 1205
  // And without spaces: +639761251205, 09761251205, 9761251205
  const phoneRegex = /^(?:\+63|0)?9\d{9}$/;
  return phoneRegex.test(cleaned);
};

export const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.companyName.trim()) {
    errors.companyName = "Company name is required";
  }

  if (!data.contactEmail.trim()) {
    errors.contactEmail = "Contact email is required";
  } else if (!validateEmail(data.contactEmail)) {
    errors.contactEmail = "Please enter a valid email address";
  }

  // Contact phone is optional - only validate if provided
  if (
    data.contactPhone &&
    data.contactPhone.trim() &&
    !validatePhoneNumber(data.contactPhone)
  ) {
    errors.contactPhone =
      "Please enter a valid Philippine mobile number (e.g., +63 976 125 1205, 0976 125 1205, or 976 125 1205)";
  }

  if (!data.projectType) {
    errors.projectType = "Please select a project type";
  }

  if (!data.description.trim()) {
    errors.description = "Project description is required";
  } else if (data.description.trim().length < 50) {
    errors.description =
      "Please provide at least 50 characters for the project description";
  }

  if (!data.timeline.trim()) {
    errors.timeline = "Timeline is required";
  }

  if (!data.budgetRange) {
    errors.budgetRange = "Please select a budget range";
  }

  return errors;
};

export const isValidFileType = (type: string): boolean => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];
  return allowedTypes.includes(type);
};

export const isValidFileSize = (size: number): boolean => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return size <= maxSize;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatDate = (date: Date | string): string => {
  // Convert string to Date if necessary
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getStatusColor = (status: ProjectSubmission["status"]): string => {
  switch (status) {
    case "Submitted":
      return "bg-blue-100 text-blue-800";
    case "Under Review":
      return "bg-yellow-100 text-yellow-800";
    case "In Progress":
      return "bg-primary-100 text-primary-800";
    case "Pending Client Feedback":
      return "bg-orange-100 text-orange-800";
    case "Completed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusProgress = (
  status: ProjectSubmission["status"],
): number => {
  switch (status) {
    case "Submitted":
      return 20;
    case "Under Review":
      return 40;
    case "In Progress":
      return 60;
    case "Pending Client Feedback":
      return 80;
    case "Completed":
      return 100;
    default:
      return 0;
  }
};

// Notification utility
export const createNotification = (
  type: NotificationEvent["type"],
  projectId: string,
  customMessage?: string,
): NotificationEvent => {
  let message = customMessage;

  if (!message) {
    switch (type) {
      case "submission":
        message = `New project submission received for project ${projectId}`;
        break;
      case "status_change":
        message = `Project ${projectId} status has been updated`;
        break;
      case "file_upload":
        message = `New file uploaded for project ${projectId}`;
        break;
      default:
        message = `Project ${projectId} has been updated`;
    }
  }

  return {
    type,
    projectId,
    message,
    timestamp: new Date(),
  };
};

// Local storage utilities
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const getFromLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
};

// Currency conversion utilities
export const EXCHANGE_RATE_PHP_TO_USD = 0.018; // Approximate rate: 1 PHP = 0.018 USD
export const EXCHANGE_RATE_USD_TO_PHP = 56; // Approximate rate: 1 USD = 56 PHP

export type Currency = "PHP" | "USD";

export const formatCurrency = (amount: number, currency: Currency): string => {
  if (currency === "PHP") {
    return `₱${amount.toLocaleString("en-PH")}`;
  } else {
    return `$${amount.toLocaleString("en-US")}`;
  }
};

export const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
): number => {
  if (fromCurrency === toCurrency) return amount;

  if (fromCurrency === "PHP" && toCurrency === "USD") {
    return Math.round(amount * EXCHANGE_RATE_PHP_TO_USD);
  } else if (fromCurrency === "USD" && toCurrency === "PHP") {
    return Math.round(amount * EXCHANGE_RATE_USD_TO_PHP);
  }

  return amount;
};

export const getBudgetRanges = (currency: Currency): string[] => {
  if (currency === "PHP") {
    return [
      "Under ₱50,000",
      "₱50,000 - ₱150,000",
      "₱150,000 - ₱300,000",
      "₱300,000 - ₱500,000",
      "Over ₱500,000",
    ];
  } else {
    return [
      "Under $900",
      "$900 - $2,700",
      "$2,700 - $5,400",
      "$5,400 - $9,000",
      "Over $9,000",
    ];
  }
};
