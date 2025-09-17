import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-[#046BD2] hover:bg-[#1A66FF] text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 group"
          aria-label="Back to top"
        >
          <ChevronUp 
            className="w-6 h-6 transition-transform duration-200 group-hover:-translate-y-0.5" 
          />
        </button>
      )}
    </>
  );
};

export default BackToTop;