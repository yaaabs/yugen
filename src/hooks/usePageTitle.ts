import { useEffect } from "react";

/**
 * Custom hook to dynamically update page titles with Drink PH branding
 * @param title - The specific page title (e.g., "Submit Project", "Track Project")
 * @param subtitle - Optional subtitle for additional context
 */
export const usePageTitle = (title: string, subtitle?: string) => {
  useEffect(() => {
    const baseTitle = "Drink PH";
    const fullTitle = subtitle
      ? `${baseTitle} - ${title} | ${subtitle}`
      : `${baseTitle} - ${title}`;

    document.title = fullTitle;

    // Cleanup: reset to default title on unmount
    return () => {
      document.title = "Drink PH - Sustainability Communications";
    };
  }, [title, subtitle]);
};

export default usePageTitle;
