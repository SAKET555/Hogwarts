import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';

extend({ ShaderMaterial: THREE.ShaderMaterial });

// Create ultra-realistic aged parchment with folds and creases
const createRealisticParchmentTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');
  
  // Base aged parchment with subtle gradient
  const baseGradient = ctx.createRadialGradient(1024, 1024, 200, 1024, 1024, 1400);
  baseGradient.addColorStop(0, '#f9f4e8');
  baseGradient.addColorStop(0.4, '#f0e6d2');
  baseGradient.addColorStop(0.7, '#e8dcc4');
  baseGradient.addColorStop(1, '#d9c9a8');
  ctx.fillStyle = baseGradient;
  ctx.fillRect(0, 0, 2048, 2048);
  
  // Add paper fiber texture - very fine grain
  for (let i = 0; i < 30000; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 2048;
    const size = Math.random() * 2 + 0.5;
    const opacity = Math.random() * 0.08;
    ctx.fillStyle = `rgba(${140 + Math.random() * 30}, ${110 + Math.random() * 30}, ${60 + Math.random() * 30}, ${opacity})`;
    ctx.fillRect(x, y, size, size);
  }
  
  // Add fold lines (like the actual map folds)
  const addFoldLine = (x1, y1, x2, y2, intensity = 0.3) => {
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, `rgba(120, 90, 50, 0)`);
    gradient.addColorStop(0.45, `rgba(120, 90, 50, ${intensity})`);
    gradient.addColorStop(0.5, `rgba(100, 70, 40, ${intensity * 1.5})`);
    gradient.addColorStop(0.55, `rgba(120, 90, 50, ${intensity})`);
    gradient.addColorStop(1, `rgba(120, 90, 50, 0)`);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };
  
  // Vertical folds (map sections)
  addFoldLine(512, 0, 512, 2048, 0.25);
  addFoldLine(1024, 0, 1024, 2048, 0.35);
  addFoldLine(1536, 0, 1536, 2048, 0.25);
  
  // Horizontal folds
  addFoldLine(0, 682, 2048, 682, 0.2);
  addFoldLine(0, 1366, 2048, 1366, 0.2);
  
  // Add crease shadows along folds
  const addCreaseShadow = (x, y, width, height, horizontal = true) => {
    const shadowGradient = horizontal 
      ? ctx.createLinearGradient(x, y, x, y + height)
      : ctx.createLinearGradient(x, y, x + width, y);
    shadowGradient.addColorStop(0, 'rgba(80, 60, 30, 0.15)');
    shadowGradient.addColorStop(0.5, 'rgba(80, 60, 30, 0)');
    shadowGradient.addColorStop(1, 'rgba(80, 60, 30, 0.15)');
    ctx.fillStyle = shadowGradient;
    ctx.fillRect(x, y, width, height);
  };
  
  addCreaseShadow(508, 0, 8, 2048, false);
  addCreaseShadow(1020, 0, 8, 2048, false);
  addCreaseShadow(1532, 0, 8, 2048, false);
  addCreaseShadow(0, 678, 2048, 8, true);
  addCreaseShadow(0, 1362, 2048, 8, true);
  
  // Age spots and stains
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 2048;
    const radius = Math.random() * 60 + 20;
    const ageGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    const brown = Math.floor(Math.random() * 40 + 100);
    ageGradient.addColorStop(0, `rgba(${brown}, ${brown - 20}, ${brown - 50}, 0.25)`);
    ageGradient.addColorStop(0.5, `rgba(${brown}, ${brown - 20}, ${brown - 50}, 0.12)`);
    ageGradient.addColorStop(1, `rgba(${brown}, ${brown - 20}, ${brown - 50}, 0)`);
    ctx.fillStyle = ageGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Water stains (irregular shapes)
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 2048;
    ctx.fillStyle = 'rgba(140, 110, 70, 0.08)';
    ctx.beginPath();
    for (let j = 0; j < 8; j++) {
      const angle = (j / 8) * Math.PI * 2;
      const radius = Math.random() * 50 + 30;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (j === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
  
  // Worn edges and corners
  const addWornEdge = (x, y, width, height) => {
    ctx.fillStyle = 'rgba(120, 90, 50, 0.2)';
    for (let i = 0; i < 100; i++) {
      const px = x + Math.random() * width;
      const py = y + Math.random() * height;
      ctx.beginPath();
      ctx.arc(px, py, Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  addWornEdge(0, 0, 100, 100); // Top-left
  addWornEdge(1948, 0, 100, 100); // Top-right
  addWornEdge(0, 1948, 100, 100); // Bottom-left
  addWornEdge(1948, 1948, 100, 100); // Bottom-right
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

// Create hyper-detailed Hogwarts castle map with hand-drawn aesthetic
const createDetailedHogwartsMap = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, 2048, 2048);
  
  const inkColor = '#2d1a0f';
  const lightInk = 'rgba(45, 26, 15, 0.6)';
  const veryLightInk = 'rgba(45, 26, 15, 0.3)';
  
  // Helper functions for hand-drawn effect
  const jitter = () => (Math.random() - 0.5) * 2;
  
  const drawHandDrawnLine = (x1, y1, x2, y2, thickness = 3) => {
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw multiple slightly offset lines for hand-drawn effect
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const segments = 20;
      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const x = x1 + (x2 - x1) * t + jitter();
        const y = y1 + (y2 - y1) * t + jitter();
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };
  
  const drawHandDrawnRect = (x, y, w, h, label, sublabel = '') => {
    // Walls with hand-drawn effect
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 5;
    
    // Multiple passes for thickness
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.moveTo(x + jitter(), y + jitter());
      ctx.lineTo(x + w + jitter(), y + jitter());
      ctx.lineTo(x + w + jitter(), y + h + jitter());
      ctx.lineTo(x + jitter(), y + h + jitter());
      ctx.closePath();
      ctx.stroke();
    }
    
    // Interior shading with cross-hatching
    ctx.strokeStyle = veryLightInk;
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 15) {
      ctx.beginPath();
      ctx.moveTo(x + i, y);
      ctx.lineTo(x + i, y + h);
      ctx.stroke();
    }
    
    // Decorative corners
    const drawCornerDetail = (cx, cy) => {
      ctx.fillStyle = inkColor;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Small decorative lines
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * 8, cy + Math.sin(angle) * 8);
        ctx.stroke();
      }
    };
    
    drawCornerDetail(x, y);
    drawCornerDetail(x + w, y);
    drawCornerDetail(x, y + h);
    drawCornerDetail(x + w, y + h);
    
    // Label with decorative underline
    ctx.fillStyle = inkColor;
    ctx.font = 'bold 24px "Crimson Text", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + w / 2, y + h / 2 - 12);
    
    if (sublabel) {
      ctx.font = 'italic 16px "Crimson Text", serif';
      ctx.fillStyle = lightInk;
      ctx.fillText(sublabel, x + w / 2, y + h / 2 + 12);
    }
    
    // Decorative underline for label
    ctx.strokeStyle = lightInk;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + w / 2 - 40, y + h / 2 - 25);
    ctx.lineTo(x + w / 2 + 40, y + h / 2 - 25);
    ctx.stroke();
  };
  
  const drawCorridor = (x1, y1, x2, y2, width = 14) => {
    drawHandDrawnLine(x1, y1, x2, y2, width);
    
    // Add stone texture to corridors
    ctx.strokeStyle = veryLightInk;
    ctx.lineWidth = 1;
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const steps = Math.floor(length / 20);
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      const angle = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
      
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * 5, y + Math.sin(angle) * 5);
      ctx.lineTo(x - Math.cos(angle) * 5, y - Math.sin(angle) * 5);
      ctx.stroke();
    }
  };
  
  const drawStaircase = (x, y, size = 40) => {
    // Spiral staircase with hand-drawn circles
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 4;
    
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      const radius = size * 0.3 + i * 6;
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
        const px = x + Math.cos(angle) * radius + jitter() * 0.5;
        const py = y + Math.sin(angle) * radius + jitter() * 0.5;
        if (angle === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    
    // Center decoration
    ctx.fillStyle = inkColor;
    ctx.font = 'bold 20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡', x, y);
    
    // Radiating lines
    ctx.strokeStyle = lightInk;
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * size * 0.8, y + Math.sin(angle) * size * 0.8);
      ctx.stroke();
    }
  };
  
  const drawTower = (x, y, radius, label) => {
    // Circular tower
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
      const px = x + Math.cos(angle) * radius + jitter();
      const py = y + Math.sin(angle) * radius + jitter();
      if (angle === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    
    // Battlements
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x1 = x + Math.cos(angle) * radius;
      const y1 = y + Math.sin(angle) * radius;
      const x2 = x + Math.cos(angle) * (radius + 15);
      const y2 = y + Math.sin(angle) * (radius + 15);
      
      ctx.fillStyle = inkColor;
      ctx.fillRect(x2 - 4, y2 - 4, 8, 8);
    }
    
    // Label
    ctx.fillStyle = inkColor;
    ctx.font = 'bold 20px "Crimson Text", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
  };
  
  // Draw the castle layout with extreme detail
  
  // Great Hall - center piece
  drawHandDrawnRect(700, 300, 500, 350, 'GREAT HALL', 'Enchanted Ceiling');
  
  // Add benches inside Great Hall
  ctx.strokeStyle = lightInk;
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    drawHandDrawnLine(750, 380 + i * 60, 1150, 380 + i * 60, 2);
  }
  
  // Main Entrance
  drawHandDrawnRect(900, 700, 200, 150, 'ENTRANCE', 'Hall');
  drawCorridor(1000, 850, 1000, 1100);
  
  // Gryffindor Tower
  drawTower(280, 280, 120, 'GRYFFINDOR');
  drawHandDrawnRect(220, 400, 120, 100, 'Common', 'Room');
  drawCorridor(340, 350, 700, 400);
  
  // Ravenclaw Tower  
  drawTower(1750, 600, 110, 'RAVENCLAW');
  drawHandDrawnRect(1640, 750, 120, 90, 'Common', 'Room');
  drawCorridor(1700, 840, 1700, 1200);
  
  // Slytherin Dungeons
  drawHandDrawnRect(300, 1650, 280, 200, 'SLYTHERIN', 'Common Room');
  drawHandDrawnRect(650, 1680, 250, 150, 'POTIONS', 'Classroom');
  drawCorridor(450, 1650, 450, 1400);
  
  // Hufflepuff
  drawHandDrawnRect(250, 1350, 220, 180, 'HUFFLEPUFF', 'Common Room');
  drawCorridor(360, 1350, 360, 1150);
  
  // Library with bookshelves
  drawHandDrawnRect(1350, 350, 350, 250, 'LIBRARY', 'Restricted Section');
  // Add bookshelf details
  ctx.strokeStyle = veryLightInk;
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    drawHandDrawnLine(1380, 380 + i * 40, 1680, 380 + i * 40, 1);
  }
  drawCorridor(1200, 475, 1350, 475);
  
  // Astronomy Tower
  drawTower(1700, 1700, 100, 'ASTRO');
  drawHandDrawnRect(1640, 1560, 120, 80, 'Tower', 'Access');
  
  // Hospital Wing
  drawHandDrawnRect(1200, 1050, 280, 180, 'HOSPITAL', 'Wing');
  // Add beds
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = veryLightInk;
    ctx.fillRect(1220 + i * 80, 1090, 60, 30);
  }
  
  // Transfiguration
  drawHandDrawnRect(600, 800, 250, 180, 'TRANS-', 'FIGURATION');
  
  // Defense Against Dark Arts
  drawHandDrawnRect(600, 1050, 250, 170, 'D.A.D.A.', 'Classroom');
  
  // Charms
  drawHandDrawnRect(250, 800, 220, 160, 'CHARMS', 'Classroom');
  drawCorridor(470, 880, 600, 880);
  
  // Divination Tower
  drawTower(250, 550, 80, 'DIV');
  
  // Prefects Bathroom
  drawHandDrawnRect(1300, 750, 150, 120, 'PREFECTS', 'Bath');
  
  // Trophy Room
  drawHandDrawnRect(1300, 920, 150, 100, 'TROPHY', 'Room');
  
  // Main corridors network
  drawCorridor(1000, 1100, 1000, 1550);
  drawCorridor(600, 1550, 1400, 1550);
  drawCorridor(360, 960, 360, 800);
  drawCorridor(360, 680, 900, 680);
  drawCorridor(1740, 710, 1740, 1560);
  drawCorridor(250, 1150, 600, 1150);
  drawCorridor(850, 1150, 1200, 1150);
  drawCorridor(1200, 650, 1700, 650);
  
  // Cross corridors and connecting passages
  drawCorridor(700, 1000, 850, 1000);
  drawCorridor(1200, 1000, 1480, 1000);
  
  // Secret passages (dashed lines)
  ctx.strokeStyle = lightInk;
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 10]);
  drawCorridor(400, 500, 650, 800);
  drawCorridor(1200, 350, 1500, 650);
  drawCorridor(850, 1220, 1150, 1550);
  ctx.setLineDash([]);
  
  // Staircases throughout
  drawStaircase(1000, 1000);
  drawStaircase(700, 1300);
  drawStaircase(360, 1050);
  drawStaircase(1000, 1400);
  drawStaircase(600, 900);
  
  // Ornate border - hand-drawn double border
  ctx.strokeStyle = inkColor;
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, 1968, 1968);
  
  ctx.strokeStyle = lightInk;
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 60, 1928, 1928);
  
  // Corner decorations
  const drawCornerOrnament = (x, y, flip = 1) => {
    ctx.fillStyle = inkColor;
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 3;
    
    // Fleur-de-lis style corner
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 20 * flip, y + 10 * flip, x + 15 * flip, y + 30 * flip);
    ctx.quadraticCurveTo(x + 10 * flip, y + 20 * flip, x, y + 25 * flip);
    ctx.quadraticCurveTo(x - 10 * flip, y + 20 * flip, x - 15 * flip, y + 30 * flip);
    ctx.quadraticCurveTo(x - 20 * flip, y + 10 * flip, x, y);
    ctx.fill();
  };
  
  drawCornerOrnament(80, 80, 1);
  drawCornerOrnament(1968, 80, -1);
  drawCornerOrnament(80, 1968, 1);
  drawCornerOrnament(1968, 1968, -1);
  
  // Central logo - "The Marauder's Map" diamond emblem
  const centerX = 1024;
  const centerY = 1024;
  
  // Diamond background
  ctx.fillStyle = 'rgba(139, 69, 19, 0.85)';
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 60);
  ctx.lineTo(centerX + 60, centerY);
  ctx.lineTo(centerX, centerY + 60);
  ctx.lineTo(centerX - 60, centerY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Inner diamond
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 50);
  ctx.lineTo(centerX + 50, centerY);
  ctx.lineTo(centerX, centerY + 50);
  ctx.lineTo(centerX - 50, centerY);
  ctx.closePath();
  ctx.stroke();
  
  // Text in center
  ctx.fillStyle = '#f4e8d0';
  ctx.font = 'bold 18px "Cinzel Decorative", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('THE', centerX, centerY - 20);
  ctx.font = 'bold 20px "Cinzel Decorative", serif';
  ctx.fillText("MARAUDER'S", centerX, centerY);
  ctx.font = 'bold 18px "Cinzel Decorative", serif';
  ctx.fillText('MAP', centerX, centerY + 20);
  
  // Title cartouche at bottom
  ctx.fillStyle = 'rgba(244, 232, 208, 0.95)';
  ctx.strokeStyle = inkColor;
  ctx.lineWidth = 5;
  
  // Ornate frame
  ctx.beginPath();
  ctx.moveTo(600, 1900);
  ctx.lineTo(1448, 1900);
  ctx.quadraticCurveTo(1468, 1900, 1468, 1920);
  ctx.lineTo(1468, 1990);
  ctx.quadraticCurveTo(1468, 2010, 1448, 2010);
  ctx.lineTo(600, 2010);
  ctx.quadraticCurveTo(580, 2010, 580, 1990);
  ctx.lineTo(580, 1920);
  ctx.quadraticCurveTo(580, 1900, 600, 1900);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = inkColor;
  ctx.font = 'bold 32px "Cinzel Decorative", serif';
  ctx.textAlign = 'center';
  ctx.fillText('HOGWARTS CASTLE', 1024, 1940);
  ctx.font = 'italic 20px "Crimson Text", serif';
  ctx.fillStyle = lightInk;
  ctx.fillText('School of Witchcraft and Wizardry', 1024, 1975);
  
  // Add compass rose
  const compassX = 1800;
  const compassY = 200;
  const compassRadius = 60;
  
  ctx.strokeStyle = inkColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(compassX, compassY, compassRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  // Cardinal directions
  const directions = ['N', 'E', 'S', 'W'];
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
    const x = compassX + Math.cos(angle) * (compassRadius + 25);
    const y = compassY + Math.sin(angle) * (compassRadius + 25);
    
    ctx.fillStyle = inkColor;
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(directions[i], x, y);
    
    // Arrow
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(compassX, compassY);
    ctx.lineTo(compassX + Math.cos(angle) * compassRadius * 0.8, compassY + Math.sin(angle) * compassRadius * 0.8);
    ctx.stroke();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

// Ultra-advanced shader with ink bleeding and reveal effects
const UltraRealisticMapShader = ({ playerPosition, time }) => {
  const materialRef = useRef();
  
  const parchmentTexture = useMemo(() => createRealisticParchmentTexture(), []);
  const inkTexture = useMemo(() => createDetailedHogwartsMap(), []);
  
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        parchmentMap: { value: parchmentTexture },
        inkMap: { value: inkTexture },
        playerPos: { value: new THREE.Vector2(0.5, 0.5) },
        revealRadius: { value: 0.22 },
        time: { value: 0 },
        fadeRadius: { value: 0.12 },
        inkBleed: { value: 0.015 },
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D parchmentMap;
        uniform sampler2D inkMap;
        uniform vec2 playerPos;
        uniform float revealRadius;
        uniform float time;
        uniform float fadeRadius;
        uniform float inkBleed;
        
        varying vec2 vUv;
        
        // Enhanced noise for magical effects
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          
          for (int i = 0; i < 4; i++) {
            value += amplitude * noise(p * frequency);
            frequency *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        
        void main() {
          // Sample textures
          vec4 parchment = texture2D(parchmentMap, vUv);
          
          // Ink bleeding effect - sample neighboring pixels
          vec4 ink = vec4(0.0);
          float bleedSamples = 9.0;
          for (float x = -1.0; x <= 1.0; x += 1.0) {
            for (float y = -1.0; y <= 1.0; y += 1.0) {
              vec2 offset = vec2(x, y) * inkBleed;
              ink += texture2D(inkMap, vUv + offset);
            }
          }
          ink /= bleedSamples;
          
          // Distance from player with noise distortion
          float noiseDistortion = fbm(vUv * 10.0 + time * 0.1) * 0.02;
          vec2 distortedPlayerPos = playerPos + vec2(noiseDistortion);
          float dist = distance(vUv, distortedPlayerPos);
          
          // Multi-layer reveal with smooth gradient
          float reveal1 = smoothstep(revealRadius + fadeRadius, revealRadius - fadeRadius * 0.3, dist);
          float reveal2 = smoothstep(revealRadius + fadeRadius * 0.5, revealRadius - fadeRadius * 0.6, dist);
          float reveal = mix(reveal1, reveal2, 0.5);
          
          // Magical shimmer on revealed edges
          float shimmer = fbm(vUv * 30.0 + time * 0.5) * 0.15;
          float edgeShimmer = (1.0 - abs(reveal - 0.5) * 2.0) * shimmer;
          reveal = clamp(reveal + edgeShimmer, 0.0, 1.0);
          
          // Golden edge glow around reveal area
          float edgeGlow = smoothstep(revealRadius + fadeRadius, revealRadius + fadeRadius * 0.5, dist) - 
                          smoothstep(revealRadius + fadeRadius * 0.5, revealRadius, dist);
          vec3 glowColor = vec3(0.83, 0.69, 0.22) * edgeGlow * 0.4;
          
          // Inner highlight for depth
          float innerGlow = smoothstep(revealRadius, revealRadius - fadeRadius * 0.2, dist) - 
                           smoothstep(revealRadius - fadeRadius * 0.2, revealRadius - fadeRadius * 0.5, dist);
          glowColor += vec3(0.95, 0.85, 0.6) * innerGlow * 0.2;
          
          // Mix parchment and ink with reveal
          vec4 finalColor = mix(parchment, ink, reveal * 0.85);
          
          // Add glow effects
          finalColor.rgb += glowColor;
          
          // Subtle vignette for depth
          float vignette = smoothstep(1.2, 0.2, length(vUv - 0.5) * 1.3);
          finalColor.rgb *= (0.65 + vignette * 0.35);
          
          // Add slight sepia tone to unrevealed areas
          float sepiaAmount = 1.0 - reveal;
          vec3 sepia = vec3(
            finalColor.r * 0.393 + finalColor.g * 0.769 + finalColor.b * 0.189,
            finalColor.r * 0.349 + finalColor.g * 0.686 + finalColor.b * 0.168,
            finalColor.r * 0.272 + finalColor.g * 0.534 + finalColor.b * 0.131
          );
          finalColor.rgb = mix(finalColor.rgb, sepia, sepiaAmount * 0.3);
          
          gl_FragColor = finalColor;
        }
      `,
      transparent: false,
    });
  }, [parchmentTexture, inkTexture]);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.playerPos.value.set(playerPosition.x, playerPosition.y);
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });
  
  return <primitive ref={materialRef} object={shaderMaterial} attach="material" />;
};

// Enhanced footprint with realistic shoe print
const RealisticFootprint = ({ position, rotation, opacity, isLeft }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(0.75 + Math.sin(Date.now() * 0.004) * 0.03);
    }
  });
  
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    
    // Heel
    s.moveTo(-0.06, -0.12);
    s.quadraticCurveTo(-0.08, -0.14, -0.06, -0.16);
    s.lineTo(0.06, -0.16);
    s.quadraticCurveTo(0.08, -0.14, 0.06, -0.12);
    
    // Arch
    s.quadraticCurveTo(0.05, -0.05, 0.04, 0.02);
    
    // Ball of foot
    s.quadraticCurveTo(0.06, 0.08, 0.08, 0.12);
    
    // Toes
    s.lineTo(0.085, 0.15);
    s.quadraticCurveTo(0.09, 0.17, 0.08, 0.18);
    
    // Big toe
    s.quadraticCurveTo(0.06, 0.185, 0.04, 0.18);
    s.quadraticCurveTo(0.02, 0.175, 0.01, 0.16);
    
    // Other toes
    s.lineTo(-0.01, 0.16);
    s.quadraticCurveTo(-0.03, 0.17, -0.04, 0.165);
    s.lineTo(-0.06, 0.15);
    s.quadraticCurveTo(-0.08, 0.14, -0.085, 0.12);
    
    // Back to heel
    s.quadraticCurveTo(-0.07, 0.05, -0.06, -0.02);
    s.quadraticCurveTo(-0.055, -0.08, -0.06, -0.12);
    
    return s;
  }, []);
  
  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <shapeGeometry args={[shape]} />
      <meshBasicMaterial 
        color="#4a2f1a" 
        transparent 
        opacity={opacity * 0.65}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Enhanced footprints with realistic tracking
const EnhancedFootprintsTrail = ({ playerPosition3D }) => {
  const [footprints, setFootprints] = useState([]);
  const lastPosition = useRef({ x: 0, z: 0 });
  const isLeft = useRef(true);
  const stepCount = useRef(0);
  
  useFrame(() => {
    const dx = playerPosition3D.x - lastPosition.current.x;
    const dz = playerPosition3D.z - lastPosition.current.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    if (distance > 0.22) {
      const angle = Math.atan2(dz, dx);
      const offset = isLeft.current ? 0.14 : -0.14;
      const forwardOffset = 0.05;
      
      const newFootprint = {
        id: Date.now() + Math.random(),
        position: [
          playerPosition3D.x + Math.sin(angle + Math.PI / 2) * offset + Math.cos(angle) * forwardOffset,
          0.008,
          playerPosition3D.z + Math.cos(angle + Math.PI / 2) * offset + Math.sin(angle) * forwardOffset
        ],
        rotation: [-Math.PI / 2, 0, -angle + (isLeft.current ? 0.15 : -0.15)],
        createdAt: Date.now(),
        isLeft: isLeft.current,
      };
      
      setFootprints(prev => [...prev, newFootprint].slice(-60));
      lastPosition.current = { x: playerPosition3D.x, z: playerPosition3D.z };
      isLeft.current = !isLeft.current;
      stepCount.current++;
    }
    
    setFootprints(prev => 
      prev
        .map(fp => ({ ...fp, age: Date.now() - fp.createdAt }))
        .filter(fp => fp.age < 10000)
    );
  });
  
  return (
    <group>
      {footprints.map(fp => (
        <RealisticFootprint
          key={fp.id}
          position={fp.position}
          rotation={fp.rotation}
          opacity={Math.max(0, 1 - (fp.age || 0) / 10000)}
          isLeft={fp.isLeft}
        />
      ))}
    </group>
  );
};

// Enhanced character dot with name label
const EnhancedCharacterDot = ({ position, name, color = '#ff0000', houseColor = '#740001' }) => {
  const meshRef = useRef();
  const labelRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = 0.06 + Math.sin(state.clock.elapsedTime * 2.5 + position[0]) * 0.015;
    }
    if (labelRef.current) {
      labelRef.current.lookAt(0, 100, 0);
    }
  });
  
  return (
    <group position={position}>
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Main dot */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial 
          color={houseColor}
          emissive={color}
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Name label background */}
      <mesh ref={labelRef} position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[name.length * 0.08 + 0.15, 0.18]} />
        <meshBasicMaterial 
          color="#2d1a0f"
          transparent
          opacity={0.85}
        />
      </mesh>
      
      {/* Pulse ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.09, 0.12, 16]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// Enhanced wandering characters with house colors
const EnhancedWanderingCharacters = () => {
  const characters = useMemo(() => [
    { name: 'Harry Potter', color: '#ffd700', houseColor: '#740001', path: 'circular', speed: 0.28, offset: 0 },
    { name: 'Hermione Granger', color: '#ff8c00', houseColor: '#ae0001', path: 'figure8', speed: 0.24, offset: 1 },
    { name: 'Ron Weasley', color: '#ff6347', houseColor: '#740001', path: 'linear', speed: 0.22, offset: 2 },
    { name: 'Albus Dumbledore', color: '#4169e1', houseColor: '#0e1a40', path: 'slow', speed: 0.12, offset: 3 },
    { name: 'Draco Malfoy', color: '#32cd32', houseColor: '#1a472a', path: 'serpentine', speed: 0.26, offset: 4 },
    { name: 'Luna Lovegood', color: '#00bfff', houseColor: '#0e1a40', path: 'dreamy', speed: 0.18, offset: 5 },
  ], []);
  
  const [positions, setPositions] = useState(
    characters.map(() => [
      (Math.random() - 0.5) * 7,
      0.05,
      (Math.random() - 0.5) * 7
    ])
  );
  
  useFrame((state) => {
    setPositions(prev => prev.map((pos, idx) => {
      const char = characters[idx];
      const t = state.clock.elapsedTime * char.speed + char.offset;
      
      switch (char.path) {
        case 'circular':
          return [Math.cos(t) * 2.8, 0.05, Math.sin(t) * 2.8];
        case 'figure8':
          return [Math.sin(t) * 2.5, 0.05, Math.sin(t * 2) * 1.8];
        case 'linear':
          return [(t % 7) - 3.5, 0.05, Math.sin(t * 0.7) * 1.5];
        case 'slow':
          return [Math.cos(t) * 3.5, 0.05, Math.sin(t * 0.7) * 2.2];
        case 'serpentine':
          return [Math.sin(t * 1.5) * 3, 0.05, (t % 6) - 3];
        case 'dreamy':
          return [
            Math.sin(t) * 2 + Math.cos(t * 0.5) * 1,
            0.05,
            Math.cos(t) * 2 + Math.sin(t * 0.3) * 1
          ];
        default:
          return pos;
      }
    }));
  });
  
  return (
    <group>
      {characters.map((char, idx) => (
        <EnhancedCharacterDot
          key={char.name}
          position={positions[idx]}
          name={char.name}
          color={char.color}
          houseColor={char.houseColor}
        />
      ))}
    </group>
  );
};

// Enhanced player marker with wand and lumos effect
const EnhancedPlayerMarker = ({ position }) => {
  const groupRef = useRef();
  const wandRef = useRef();
  const lumosRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.8) * 0.08;
    }
    if (wandRef.current) {
      wandRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2.5) * 0.15;
    }
    if (lumosRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      lumosRef.current.scale.setScalar(scale);
    }
  });
  
  return (
    <group ref={groupRef} position={[position.x, 0.05, position.y]}>
      {/* Outer glow ring */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.18, 32]} />
        <meshBasicMaterial 
          color="#00ff00"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Main player dot */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial 
          color="#003300"
          emissive="#00ff00"
          emissiveIntensity={0.9}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      
      {/* Wand with sparkles */}
      <group ref={wandRef} position={[0.18, 0.02, 0]} rotation={[0, 0, Math.PI / 4]}>
        <mesh>
          <cylinderGeometry args={[0.012, 0.018, 0.35, 8]} />
          <meshStandardMaterial 
            color="#5c4033"
            roughness={0.6}
          />
        </mesh>
        
        {/* Wand tip glow */}
        <mesh position={[0, 0.18, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial 
            color="#ffff00"
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
      
      {/* Lumos light effect */}
      <mesh ref={lumosRef} position={[0.18, 0.2, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial 
          color="#ffffaa"
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Magical sparkles orbiting */}
      {[0, 1, 2, 3, 4].map(i => (
        <mesh 
          key={i}
          position={[
            Math.cos(i * Math.PI * 2 / 5) * 0.22,
            0.08 + Math.sin(i * 0.5) * 0.03,
            Math.sin(i * Math.PI * 2 / 5) * 0.22
          ]}
        >
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial 
            color="#ffd700"
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
      
      {/* Your name label */}
      <mesh position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.15]} />
        <meshBasicMaterial 
          color="#2d1a0f"
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
};

// Enhanced magical particles with varied movement
const EnhancedMagicalParticles = () => {
  const particlesRef = useRef();
  const particleCount = 150;
  
  const { positions, velocities, phases } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = [];
    const ph = [];
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 0.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
      
      vel.push({
        x: (Math.random() - 0.5) * 0.02,
        y: Math.random() * 0.01 + 0.005,
        z: (Math.random() - 0.5) * 0.02,
      });
      
      ph.push(Math.random() * Math.PI * 2);
    }
    
    return { positions: pos, velocities: vel, phases: ph };
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        // Floating movement
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3] += Math.sin(state.clock.elapsedTime + phases[i]) * 0.01;
        pos[i * 3 + 2] += Math.cos(state.clock.elapsedTime + phases[i]) * 0.01;
        
        // Reset if too high
        if (pos[i * 3 + 1] > 1.5) {
          pos[i * 3 + 1] = 0.1;
        }
        
        // Keep within bounds
        if (Math.abs(pos[i * 3]) > 7) pos[i * 3] *= -0.8;
        if (Math.abs(pos[i * 3 + 2]) > 7) pos[i * 3 + 2] *= -0.8;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#d4af37"
        transparent
        opacity={0.7}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Folded map border mesh
const FoldedMapBorder = () => {
  return (
    <group>
      {/* Main border frame with depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[4.95, 5.15, 128]} />
        <meshStandardMaterial 
          color="#3d2817"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Inner decorative border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[4.85, 4.92, 128]} />
        <meshStandardMaterial 
          color="#5c4033"
          roughness={0.8}
        />
      </mesh>
      
      {/* Fold line indicators */}
      {[-2.5, -0.83, 0.83, 2.5].map((x, idx) => (
        <mesh 
          key={`v-${idx}`}
          position={[x, 0.013, 0]} 
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.03, 10]} />
          <meshBasicMaterial 
            color="#2d1a0f"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
      
      {[-2.5, -0.83, 0.83, 2.5].map((z, idx) => (
        <mesh 
          key={`h-${idx}`}
          position={[0, 0.013, z]} 
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[10, 0.03]} />
          <meshBasicMaterial 
            color="#2d1a0f"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

// Main scene with all enhancements
const UltraRealisticMapScene = () => {
  const [playerPos2D, setPlayerPos2D] = useState({ x: 0.5, y: 0.5 });
  const [isRevealed, setIsRevealed] = useState(false);
  
  const playerPos3D = useMemo(() => ({
    x: (playerPos2D.x - 0.5) * 10,
    z: (playerPos2D.y - 0.5) * 10
  }), [playerPos2D]);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 800);
    return () => clearTimeout(timer);
  }, []);
  
  const handlePointerMove = (event) => {
    event.stopPropagation();
    const x = (event.point.x / 5) + 0.5;
    const y = (-event.point.z / 5) + 0.5;
    setPlayerPos2D({
      x: Math.max(0.05, Math.min(0.95, x)),
      y: Math.max(0.05, Math.min(0.95, y))
    });
  };
  
  return (
    <group>
      {/* The main map plane */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        onPointerMove={handlePointerMove}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[10, 10, 1, 1]} />
        <UltraRealisticMapShader playerPosition={playerPos2D} />
      </mesh>
      
      {/* Folded border */}
      <FoldedMapBorder />
      
      {isRevealed && (
        <>
          <EnhancedPlayerMarker position={playerPos3D} />
          <EnhancedFootprintsTrail playerPosition3D={playerPos3D} />
          <EnhancedWanderingCharacters />
          <EnhancedMagicalParticles />
        </>
      )}
      
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.35} color="#fff5e6" />
      <pointLight 
        position={[0, 6, 0]} 
        intensity={0.9} 
        color="#ffe6cc"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[4, 4, 4]} intensity={0.3} color="#ffd700" />
      <pointLight position={[-4, 4, -4]} intensity={0.3} color="#ffd700" />
      <pointLight position={[4, 3, -4]} intensity={0.25} color="#d4af37" />
      <pointLight position={[-4, 3, 4]} intensity={0.25} color="#d4af37" />
      
      {/* Subtle spotlight on center */}
      <spotLight
        position={[0, 8, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={0.4}
        color="#fff5e6"
        castShadow
      />
    </group>
  );
};

// Main component with enhanced UI
const MaraudersMapUltra = () => {
  const [solemnSworn, setSolemnSworn] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  
  useEffect(() => {
    if (inputValue.toLowerCase().includes('i solemnly swear that i am up to no good')) {
      setTimeout(() => setSolemnSworn(true), 500);
    }
  }, [inputValue]);
  
  useEffect(() => {
    if (solemnSworn) {
      setTimeout(() => setFadeIn(true), 100);
    }
  }, [solemnSworn]);
  
  if (!solemnSworn) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        background: 'linear-gradient(135deg, #1a1510 0%, #2d1f1a 50%, #1a1510 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Crimson Text", serif',
        color: '#d4c3a3',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Magical particles in background */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.3,
          background: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)'
        }} />
        
        <div style={{
          textAlign: 'center',
          animation: 'fadeInUp 1.2s ease-out',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            marginBottom: '40px',
            padding: '30px',
            background: 'rgba(45, 26, 15, 0.3)',
            borderRadius: '15px',
            border: '2px solid rgba(212, 175, 55, 0.4)',
            backdropFilter: 'blur(10px)'
          }}>
            <h1 style={{ 
              fontSize: '56px', 
              marginBottom: '20px',
              fontFamily: '"Cinzel Decorative", serif',
              textShadow: '0 0 30px rgba(212, 175, 55, 0.5), 0 0 60px rgba(212, 175, 55, 0.3)',
              letterSpacing: '4px',
              background: 'linear-gradient(45deg, #d4af37, #f4e8d0, #d4af37)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              The Marauder's Map
            </h1>
            <div style={{
              width: '200px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
              margin: '0 auto 30px'
            }} />
            <p style={{ 
              fontSize: '22px', 
              fontStyle: 'italic',
              marginBottom: '50px',
              opacity: 0.9,
              lineHeight: '1.6',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
            }}>
              "Messrs. Moony, Wormtail, Padfoot, and Prongs<br />
              Purveyors of Aids to Magical Mischief-Makers<br />
              are proud to present..."
            </p>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tap to reveal..."
              style={{
                width: '550px',
                maxWidth: '90vw',
                padding: '18px 25px',
                fontSize: '20px',
                background: 'rgba(232, 218, 178, 0.08)',
                border: '2px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '12px',
                color: '#e8dab2',
                fontFamily: '"Crimson Text", serif',
                textAlign: 'center',
                outline: 'none',
                transition: 'all 0.4s ease',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(212, 175, 55, 0.1)'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(232, 218, 178, 0.15)';
                e.target.style.borderColor = '#d4af37';
                e.target.style.boxShadow = '0 4px 30px rgba(212, 175, 55, 0.4), inset 0 0 30px rgba(212, 175, 55, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(232, 218, 178, 0.08)';
                e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(212, 175, 55, 0.1)';
              }}
            />
            <p style={{
              marginTop: '25px',
              fontSize: '16px',
              fontStyle: 'italic',
              opacity: 0.6,
              color: '#d4af37'
            }}>
              Hint: "I solemnly swear that I am up to no good"
            </p>
          </div>
        </div>
        
        <style>{`
          @keyframes fadeInUp {
            from { 
              opacity: 0; 
              transform: translateY(30px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
        `}</style>
      </div>
    );
  }
  
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'linear-gradient(135deg, #1a1510 0%, #2d1f1a 50%, #1a1510 100%)',
      position: 'relative',
      fontFamily: '"Crimson Text", serif',
      opacity: fadeIn ? 1 : 0,
      transition: 'opacity 1s ease-in'
    }}>
      {/* Ornate header */}
      <div style={{ 
        position: 'absolute', 
        top: '0',
        left: '0',
        right: '0',
        padding: '35px',
        background: 'linear-gradient(180deg, rgba(26, 21, 16, 0.95) 0%, rgba(26, 21, 16, 0) 100%)',
        zIndex: 10,
        textAlign: 'center',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <h1 style={{ 
          margin: 0,
          color: '#d4c3a3',
          fontSize: '42px',
          fontFamily: '"Cinzel Decorative", serif',
          textShadow: '0 0 25px rgba(212, 175, 55, 0.4), 0 2px 4px rgba(0, 0, 0, 0.5)',
          letterSpacing: '3px',
          background: 'linear-gradient(45deg, #d4af37, #f4e8d0, #d4af37)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          The Marauder's Map
        </h1>
        <div style={{
          width: '150px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
          margin: '12px auto 0'
        }} />
      </div>
      
      {/* Instructions panel with ornate border */}
      <div style={{
        position: 'absolute',
        top: '130px',
        right: '35px',
        background: 'rgba(26, 21, 16, 0.85)',
        border: '3px solid rgba(212, 175, 55, 0.4)',
        borderRadius: '15px',
        padding: '25px',
        maxWidth: '320px',
        zIndex: 10,
        backdropFilter: 'blur(15px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(212, 175, 55, 0.1)'
      }}>
        <div style={{
          borderBottom: '2px solid rgba(212, 175, 55, 0.3)',
          paddingBottom: '15px',
          marginBottom: '18px'
        }}>
          <h3 style={{ 
            margin: 0,
            color: '#d4af37',
            fontSize: '22px',
            fontFamily: '"Cinzel Decorative", serif',
            textAlign: 'center',
            textShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
          }}>
            Instructions
          </h3>
        </div>
        <ul style={{ 
          margin: 0,
          padding: '0 0 0 22px',
          color: '#e8dab2',
          fontSize: '15px',
          lineHeight: '2',
          opacity: 0.95
        }}>
          <li>Move cursor to explore the castle</li>
          <li>Watch the fog of war reveal secrets</li>
          <li>Track wandering witches & wizards</li>
          <li>Follow your magical footprints</li>
          <li>Discover hidden passages & rooms</li>
        </ul>
        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: 'rgba(212, 175, 55, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          textAlign: 'center'
        }}>
          <p style={{
            margin: 0,
            fontSize: '13px',
            fontStyle: 'italic',
            color: '#d4af37',
            opacity: 0.9
          }}>
            "Solemnly swear to use responsibly"
          </p>
        </div>
      </div>
      
      {/* Legend panel */}
      <div style={{
        position: 'absolute',
        bottom: '35px',
        left: '35px',
        background: 'rgba(26, 21, 16, 0.85)',
        border: '3px solid rgba(212, 175, 55, 0.4)',
        borderRadius: '15px',
        padding: '20px 25px',
        zIndex: 10,
        backdropFilter: 'blur(15px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
      }}>
        <h4 style={{
          margin: '0 0 15px 0',
          color: '#d4af37',
          fontSize: '18px',
          fontFamily: '"Cinzel Decorative", serif',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
          paddingBottom: '10px'
        }}>
          Legend
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#00ff00', boxShadow: '0 0 10px #00ff00' }} />
            <span style={{ color: '#e8dab2', fontSize: '14px' }}>You (with Lumos)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#ffd700', boxShadow: '0 0 8px #ffd700' }} />
            <span style={{ color: '#e8dab2', fontSize: '14px' }}>Harry Potter</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#4169e1', boxShadow: '0 0 8px #4169e1' }} />
            <span style={{ color: '#e8dab2', fontSize: '14px' }}>Dumbledore</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '20px', height: '2px', background: '#4a2f1a' }} />
            <span style={{ color: '#e8dab2', fontSize: '14px' }}>Your Footprints</span>
          </div>
        </div>
      </div>
      
      {/* Canvas */}
      <div style={{ width: '100%', height: '100%' }}>
        <Canvas 
          camera={{ position: [0, 10, 0.1], fov: 50 }}
          shadows
          gl={{ 
            antialias: true, 
            alpha: false,
            powerPreference: 'high-performance'
          }}
        >
          <color attach="background" args={['#1a1510']} />
          <fog attach="fog" args={['#1a1510', 10, 18]} />
          <UltraRealisticMapScene />
        </Canvas>
      </div>
      
      {/* Footer quote with ornate styling */}
      <div style={{ 
        position: 'absolute', 
        bottom: '35px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#d4c3a3',
        fontSize: '18px',
        fontStyle: 'italic',
        textAlign: 'center',
        textShadow: '0 0 15px rgba(212, 175, 55, 0.6), 0 2px 10px rgba(0, 0, 0, 0.7)',
        zIndex: 10,
        padding: '15px 30px',
        background: 'rgba(26, 21, 16, 0.7)',
        borderRadius: '25px',
        border: '2px solid rgba(212, 175, 55, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <span style={{ 
          fontFamily: '"Cinzel Decorative", serif',
          color: '#d4af37'
        }}>
          "Mischief Managed"
        </span>
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
        body { 
          margin: 0; 
          overflow: hidden; 
          background: #1a1510;
        }
        * { 
          box-sizing: border-box; 
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(26, 21, 16, 0.5);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.5);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.7);
        }
      `}</style>
    </div>
  );
};

export default MaraudersMapUltra;