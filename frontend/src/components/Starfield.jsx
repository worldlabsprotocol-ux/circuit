import React, { useEffect, useRef } from "react";

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Generate stars with random positions and speeds
    const stars = Array.from({ length: 200 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: Math.random() * 0.5 + 0.2,
    }));

    function animate() {
      // Clear canvas with black background
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw cyan stars
      ctx.fillStyle = "#00ffff";

      stars.forEach((star) => {
        star.y += star.speed;

        // Reset star to top when it falls off bottom
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        ctx.fillRect(star.x, star.y, 2, 2);
      });

      requestAnimationFrame(animate);
    }

    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none", // allows clicks to pass through to other elements
      }}
    />
  );
}