"use client";

// ──────────────────────────────────────────────────────────────────────────
// Planet Chroma — a lightweight, lazy-loaded 3D planet for the story setting.
//
// Performance is the whole point of this file:
//   • three.js is dynamically imported ONLY when the planet scrolls into view,
//     so it never touches the initial page bundle or first paint.
//   • The texture is generated procedurally on a <canvas> at mount — zero
//     extra network requests, no image asset to download.
//   • The render loop pauses when the planet is off-screen or the tab is
//     hidden, and the device pixel ratio is capped, so it sips battery.
//   • If WebGL is unavailable (or the user prefers reduced motion), we fall
//     back to a pure-CSS gradient sphere — no canvas, no three.js at all.
//
// Drop it anywhere: <Planet className="w-40 h-40" />
// ──────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";

type PlanetProps = {
  /** Sizing/positioning classes for the wrapper (must give it width + height). */
  className?: string;
  /** Seconds per full rotation. Higher = slower. Default 40. */
  spinSeconds?: number;
};

// Paint a stylised "Chroma" planet texture onto a canvas: turquoise oceans,
// deep-blue swirling clouds, soft kid-friendly sci-fi look. Returns the canvas.
function paintPlanetTexture(size = 512): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size / 2; // 2:1 equirectangular wrap
  const ctx = c.getContext("2d")!;
  const w = c.width;
  const h = c.height;

  // Ocean base — a vertical bright turquoise gradient.
  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, "#8ff7e8");
  base.addColorStop(0.5, "#4fd6c8");
  base.addColorStop(1, "#36b3ac");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  // Soft landmasses — a few translucent turquoise blobs.
  const blob = (x: number, y: number, r: number, color: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  for (let i = 0; i < 14; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 24 + Math.random() * 70;
    blob(x, y, r, "rgba(170, 255, 240, 0.7)");
  }
  // Whisper of cloud streaks in a lighter tone.
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 30 + Math.random() * 90;
    blob(x, y, r, "rgba(255, 255, 255, 0.30)");
  }

  return c;
}

export default function Planet({ className = "", spinSeconds = 40 }: PlanetProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  // Start as the CSS fallback; flip to false only once WebGL actually renders.
  const [useCssFallback, setUseCssFallback] = useState(true);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // Respect reduced-motion + bail early if WebGL clearly isn't available.
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return; // keep the static CSS sphere

    let disposed = false;
    let cleanup: (() => void) | null = null;
    let started = false;

    // Only spin up three.js when the planet is actually on screen.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible && !started) {
          started = true;
          io.disconnect();
          void start();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);

    async function start() {
      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch {
        return; // dynamic import failed — keep CSS fallback
      }
      if (disposed || !mountRef.current) return;

      const host = mountRef.current;
      const width = host.clientWidth || 200;
      const height = host.clientHeight || 200;

      // Renderer — transparent so it blends into any background.
      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        return; // no WebGL — keep CSS fallback
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 3.9;

      // Procedural texture → no asset download.
      const texCanvas = paintPlanetTexture();
      const texture = new THREE.CanvasTexture(texCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;

      const geometry = new THREE.SphereGeometry(1, 48, 48);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
        metalness: 0.0,
        emissive: new THREE.Color(0x2fb8ac),
        emissiveIntensity: 0.55,
      });
      const planet = new THREE.Mesh(geometry, material);
      planet.rotation.z = 0.35; // gentle axial tilt
      scene.add(planet);

      // Thin glowing atmosphere ring via a slightly larger back-side sphere.
      const atmGeo = new THREE.SphereGeometry(1.06, 48, 48);
      const atmMat = new THREE.MeshBasicMaterial({
        color: 0x8ff7e8,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide,
      });
      scene.add(new THREE.Mesh(atmGeo, atmMat));

      // Soft outer glow halo — a larger, very faint back-side shell that makes
      // the planet read as luminous against the black sky.
      const glowGeo = new THREE.SphereGeometry(1.22, 48, 48);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0x7ff5e8,
        transparent: true,
        opacity: 0.18,
        side: THREE.BackSide,
        depthWrite: false,
      });
      scene.add(new THREE.Mesh(glowGeo, glowMat));

      // ── A real little 3D spaceship that orbits the planet ────────────────
      const ship = new THREE.Group();

      const bodyGeo = new THREE.ConeGeometry(0.05, 0.2, 16);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xeaf6ff,
        metalness: 0.6,
        roughness: 0.3,
        emissive: new THREE.Color(0x88e0ff),
        emissiveIntensity: 0.2,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.rotation.x = Math.PI / 2; // point the nose along +Z (travel dir)
      ship.add(body);

      const finGeo = new THREE.BoxGeometry(0.14, 0.02, 0.06);
      const finMat = new THREE.MeshStandardMaterial({
        color: 0x2C7A7B,
        metalness: 0.4,
        roughness: 0.5,
      });
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.z = -0.07;
      ship.add(fin);

      const glassGeo = new THREE.SphereGeometry(0.03, 12, 12);
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x5ff0e0,
        emissive: new THREE.Color(0x5ff0e0),
        emissiveIntensity: 0.6,
        metalness: 0.2,
        roughness: 0.2,
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.z = 0.04;
      ship.add(glass);

      // A glowing engine flame behind the ship.
      const flameGeo = new THREE.ConeGeometry(0.03, 0.12, 12);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xffd27f,
        transparent: true,
        opacity: 0.8,
      });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.rotation.x = -Math.PI / 2;
      flame.position.z = -0.16;
      ship.add(flame);

      // Pivot the ship around the planet centre on a tilted orbit.
      const shipOrbit = new THREE.Group();
      shipOrbit.rotation.x = 0.5; // tilt the orbital plane for a 3D feel
      shipOrbit.add(ship);
      scene.add(shipOrbit);
      const orbitRadius = 1.55;

      // Lighting — bright, even fill so the planet reads luminous.
      scene.add(new THREE.AmbientLight(0xffffff, 1.6));
      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(-2, 1.5, 3);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xb6fff6, 1.1);
      rim.position.set(2.5, -1, 1.5);
      scene.add(rim);
      // A turquoise point light at the planet centre adds an inner glow.
      const glowLight = new THREE.PointLight(0x8ff7e8, 2.0, 8);
      glowLight.position.set(0, 0, 0);
      scene.add(glowLight);

      // WebGL is live — drop the CSS fallback.
      if (!disposed) setUseCssFallback(false);

      // Render loop, paused when off-screen or tab hidden.
      let raf = 0;
      let onScreen = true;
      const speed = (Math.PI * 2) / Math.max(spinSeconds, 1); // rad/sec
      const shipSpeed = (Math.PI * 2) / 12; // ship laps the planet every 12s
      let shipAngle = 0;
      let last = performance.now();

      const renderLoop = () => {
        raf = requestAnimationFrame(renderLoop);
        const now = performance.now();
        const dt = (now - last) / 1000;
        last = now;
        planet.rotation.y += speed * dt;

        // Move the ship around its orbit and point its nose along travel.
        shipAngle += shipSpeed * dt;
        ship.position.set(
          Math.cos(shipAngle) * orbitRadius,
          0,
          Math.sin(shipAngle) * orbitRadius,
        );
        ship.rotation.y = -shipAngle; // face the direction of motion

        renderer.render(scene, camera);
      };
      const play = () => {
        if (!raf && onScreen && !document.hidden) {
          last = performance.now();
          raf = requestAnimationFrame(renderLoop);
        }
      };
      const pause = () => {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };

      // Pause when the planet scrolls out of view.
      const visIO = new IntersectionObserver(
        (entries) => {
          onScreen = entries.some((e) => e.isIntersecting);
          onScreen ? play() : pause();
        },
        { threshold: 0 },
      );
      visIO.observe(host);

      const onVisibility = () => (document.hidden ? pause() : play());
      document.addEventListener("visibilitychange", onVisibility);

      // Keep the canvas crisp on resize.
      const ro = new ResizeObserver(() => {
        const wNew = host.clientWidth || width;
        const hNew = host.clientHeight || height;
        renderer.setSize(wNew, hNew);
        camera.aspect = wNew / hNew;
        camera.updateProjectionMatrix();
      });
      ro.observe(host);

      play();

      cleanup = () => {
        pause();
        visIO.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        geometry.dispose();
        material.dispose();
        atmGeo.dispose();
        atmMat.dispose();
        glowGeo.dispose();
        glowMat.dispose();
        bodyGeo.dispose();
        bodyMat.dispose();
        finGeo.dispose();
        finMat.dispose();
        glassGeo.dispose();
        glassMat.dispose();
        flameGeo.dispose();
        flameMat.dispose();
        texture.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === host) {
          host.removeChild(renderer.domElement);
        }
      };
    }

    return () => {
      disposed = true;
      io.disconnect();
      cleanup?.();
    };
  }, [spinSeconds]);

  return (
    <div ref={mountRef} className={`relative ${className}`} aria-hidden>
      {/* CSS fallback sphere — shown until (or unless) WebGL takes over. */}
      {useCssFallback && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 32% 30%, #aefff2 0%, #5ff0e0 28%, #3fe0d0 55%, #2C7A7B 100%)",
            boxShadow: "inset -8px -8px 24px rgba(31,111,139,0.5), 0 0 50px rgba(95,240,224,0.45)",
          }}
        />
      )}
    </div>
  );
}
