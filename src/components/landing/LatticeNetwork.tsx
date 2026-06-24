"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
}

export default function LatticeNetwork() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const nodes: Node[] = [];
    const labels = ["AI", "Semiconductor", "5G", "IoT", "R&D", "PMP", "VLSI", "Cloud", "Cybersecurity"];
    const nodeCount = 45;

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1.5,
        label: i < labels.length ? labels[i] : ""
      });
    }

    let mouse = { x: -1000, y: -1000, radius: 150 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background grid lines (very subtle)
      ctx.strokeStyle = "rgba(226, 232, 240, 0.4)";
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & Draw Nodes
      nodes.forEach((node) => {
        // Move nodes
        node.x += node.vx;
        node.y += node.vy;

        // Boundary bounce
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Attract to mouse
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          node.x -= (dx / dist) * force * 0.8;
          node.y -= (dy / dist) * force * 0.8;
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.label ? "#d7569f" : "#94a3b8";
        ctx.fill();

        // Draw labels for key technology nodes
        if (node.label && dist < 120) {
          ctx.font = "bold 9px sans-serif";
          ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
          ctx.fillText(node.label, node.x + 8, node.y + 3);
        }
      });

      // Draw connections
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            // Check if mouse is near
            const mdx1 = mouse.x - n1.x;
            const mdy1 = mouse.y - n1.y;
            const mdist1 = Math.sqrt(mdx1 * mdx1 + mdy1 * mdy1);

            const alpha = (110 - dist) / 110;
            if (mdist1 < mouse.radius) {
              // Glowing pink connection if near mouse
              ctx.strokeStyle = `rgba(215, 86, 159, ${alpha * 0.65})`;
              ctx.lineWidth = 1.0;
            } else {
              // Regular subtle gray connection
              ctx.strokeStyle = `rgba(203, 213, 225, ${alpha * 0.4})`;
              ctx.lineWidth = 0.6;
            }

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 h-full w-full opacity-60">
      <canvas ref={canvasRef} className="h-full w-full bg-slate-50" />
    </div>
  );
}
