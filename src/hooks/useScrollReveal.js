import { useEffect, useRef } from 'react';

const useScrollReveal = (options = {}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
      ...options,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          // Optional: unobserve if we only want to reveal once
          // observer.unobserve(entry.target);
        } else {
          // Optional: remove class to repeat animation on scroll up
          entry.target.classList.remove('reveal-visible');
        }
      });
    }, observerOptions);

    const currentContainer = containerRef.current;
    let elements = [];

    if (currentContainer) {
      elements = currentContainer.querySelectorAll('.reveal-item');
      elements.forEach((el) => observer.observe(el));
    }

    return () => {
      if (currentContainer) {
        elements.forEach((el) => observer.unobserve(el));
      }
    };
  }, [options]);

  return containerRef;
};

export default useScrollReveal;
