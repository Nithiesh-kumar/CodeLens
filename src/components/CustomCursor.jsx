import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const CustomCursor = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ringPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const dotControls = useAnimation();

  useEffect(() => {
    // Check if touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }
    
    // Set global body cursor to none
    document.body.style.cursor = 'none';

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseDown = () => {
      dotControls.start({
        scale: [1, 1.5, 1],
        transition: { duration: 0.3 }
      });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = target.closest('button') || target.closest('a') || target.closest('input') || target.closest('.glass-card') || target.closest('select');
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseover', handleMouseOver);

    // Animation loop for ring lerp
    let animationFrameId;
    const render = () => {
      // Lerp logic: current = current + (target - current) * factor
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.1;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.1;
      
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = 'auto';
    };
  }, [dotControls]);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Lagging Ring */}
      <motion.div
        ref={cursorRingRef}
        className="absolute top-0 left-0 -ml-4 -mt-4 w-8 h-8 rounded-full border border-nebula-purple flex items-center justify-center transition-all duration-200 ease-out mix-blend-screen"
        animate={{
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(123, 92, 240, 0.1)' : 'transparent',
          borderColor: isHovering ? 'rgba(123, 92, 240, 0.8)' : 'rgba(123, 92, 240, 0.5)'
        }}
      />
      
      {/* Exact Dot */}
      <motion.div
        ref={cursorDotRef}
        animate={dotControls}
        className="absolute top-0 left-0 -ml-1 -mt-1 w-2 h-2 bg-white rounded-full mix-blend-screen"
      />
    </div>
  );
};

export default CustomCursor;
