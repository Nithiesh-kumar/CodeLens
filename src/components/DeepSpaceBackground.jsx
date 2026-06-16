import React, { useEffect, useRef } from 'react';

const DeepSpaceBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];
    let shootingStar = null;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Initialize Stars
    for (let i = 0; i < 300; i++) {
      const typeRand = Math.random();
      let radius, color, minOpacity, maxOpacity;
      
      if (typeRand < 0.6) {
        // 60% tiny
        radius = 0.4;
        color = '255, 255, 255';
        minOpacity = 0.4;
        maxOpacity = 0.8;
      } else if (typeRand < 0.9) {
        // 30% small, slightly blue-white
        radius = 0.8;
        color = '200, 220, 255';
        minOpacity = 0.5;
        maxOpacity = 0.9;
      } else {
        // 10% medium, pure white
        radius = 1.2;
        color = '255, 255, 255';
        minOpacity = 0.8;
        maxOpacity = 1.0;
      }

      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius,
        color,
        minOpacity,
        maxOpacity,
        // Random period between 2s and 5s (in ms)
        period: 2000 + Math.random() * 3000,
        // Random phase offset
        phase: Math.random() * Math.PI * 2
      });
    }

    const createShootingStar = () => {
      // Start at top or left edge
      const startX = Math.random() < 0.5 ? Math.random() * (canvas.width / 2) : 0;
      const startY = startX === 0 ? Math.random() * (canvas.height / 2) : 0;
      
      shootingStar = {
        x: startX,
        y: startY,
        length: 120,
        speedX: 15,
        speedY: 15,
        opacity: 1,
        startTime: Date.now(),
        duration: 600
      };
    };

    let nextShootingStarTime = Date.now() + 8000 + Math.random() * 7000;

    const render = () => {
      const now = Date.now();
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach(star => {
        // Calculate twinkle using sine wave
        const timeOffset = (now % star.period) / star.period;
        const sineValue = Math.sin(timeOffset * Math.PI * 2 + star.phase);
        
        // Map sine from [-1, 1] to [minOpacity, maxOpacity]
        const opacity = star.minOpacity + ((sineValue + 1) / 2) * (star.maxOpacity - star.minOpacity);
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${opacity})`;
        ctx.fill();
      });

      // Handle shooting star
      if (now >= nextShootingStarTime) {
        createShootingStar();
        nextShootingStarTime = now + 8000 + Math.random() * 7000;
      }

      if (shootingStar) {
        const elapsed = now - shootingStar.startTime;
        if (elapsed < shootingStar.duration) {
          shootingStar.x += shootingStar.speedX;
          shootingStar.y += shootingStar.speedY;
          
          // Fade out towards the end
          const fadeProgress = elapsed / shootingStar.duration;
          const opacity = fadeProgress > 0.8 ? 1 - ((fadeProgress - 0.8) * 5) : 1;

          const grad = ctx.createLinearGradient(
            shootingStar.x, shootingStar.y, 
            shootingStar.x - shootingStar.length * 0.7, shootingStar.y - shootingStar.length * 0.7
          );
          grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(shootingStar.x - shootingStar.length * 0.7, shootingStar.y - shootingStar.length * 0.7);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          shootingStar = null;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -10 }}>
        <div className="nebula-cloud nebula-1" />
        <div className="nebula-cloud nebula-2" />
        <div className="nebula-cloud nebula-3" />
        <div className="nebula-cloud nebula-4" />
      </div>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none" 
        style={{ zIndex: -9 }}
      />
      <div 
        className="fixed inset-0 pointer-events-none" 
        style={{
          zIndex: -8,
          background: 'linear-gradient(rgba(157,78,221,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(157,78,221,0.015) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />
    </>
  );
};

export default DeepSpaceBackground;
