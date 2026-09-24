"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { feed, type Tone } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// A loop of 35mm film wrapped around the hero title. Each frame is a real
// client, drawn to a canvas. The film runs like it is going through a
// projector, spins in on the title slam, and pushes toward the camera on scroll.

const FRAME_W = 460;
const CANVAS_H = 600;
const BAND = 68;
const RIBBON_W = 1.15;

const TONES: Record<Tone, [string, string]> = {
  accent: ["#e6a822", "#0e0d0b"],
  ink: ["#f1ece2", "#0e0d0b"],
  paper: ["#2a2620", "#f1ece2"],
};

const cssVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "sans-serif";

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxW && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

async function filmTexture() {
  const display = cssVar("--font-cabinet");
  const mono = cssVar("--font-plex-mono");
  const tamil = cssVar("--font-anek-tamil");
  await Promise.all([
    document.fonts.load(`900 80px ${display}`),
    document.fonts.load(`500 18px ${mono}`),
    document.fonts.load(`700 120px ${tamil}`, "பிரியாணி பாடல்"),
  ]).catch(() => {});

  const W = FRAME_W * feed.length;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = CANVAS_H;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#080706";
  ctx.fillRect(0, 0, W, CANVAS_H);

  // Sprocket holes
  ctx.fillStyle = "#3a352d";
  for (let x = 12; x < W; x += 46) {
    ctx.beginPath();
    ctx.roundRect(x, 20, 26, 30, 5);
    ctx.roundRect(x, CANVAS_H - 50, 26, 30, 5);
    ctx.fill();
  }

  feed.forEach((f, i) => {
    const x = i * FRAME_W + 16;
    const y = BAND;
    const w = FRAME_W - 32;
    const h = CANVAS_H - BAND * 2;
    const [bg, fg] = TONES[f.tone];
    ctx.fillStyle = bg;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = fg;

    if (f.tamil) {
      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.font = `700 150px ${tamil}`;
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillText(f.tamil, x + w - 18, y + 58, w - 36);
      ctx.restore();
    }

    ctx.font = `500 18px ${mono}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(f.tag.toUpperCase(), x + 26, y + 26);

    let size = 84;
    let lines: string[] = [];
    do {
      ctx.font = `900 ${size}px ${display}`;
      ctx.letterSpacing = `${-size * 0.03}px`;
      lines = wrapLines(ctx, f.title.toUpperCase(), w - 52);
      size -= 6;
    } while ((lines.length > 3 || lines.some((l) => ctx.measureText(l).width > w - 52)) && size > 36);
    size += 6;
    ctx.textBaseline = "alphabetic";
    lines.forEach((l, j) => ctx.fillText(l, x + 26, y + h - 30 - (lines.length - 1 - j) * size * 0.88));
    ctx.letterSpacing = "0px";
  });

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return { tex, canvasW: W };
}

// A flat strip swept along a closed curve, with one full twist.
function ribbonGeometry(curve: THREE.Curve<THREE.Vector3>, repeats: number, segs = 720) {
  const pos: number[] = [];
  const uv: number[] = [];
  const index: number[] = [];
  const Z = new THREE.Vector3(0, 0, 1);
  const p = new THREE.Vector3();
  const t = new THREE.Vector3();
  const n = new THREE.Vector3();
  const b = new THREE.Vector3();
  const across = new THREE.Vector3();

  for (let i = 0; i <= segs; i++) {
    const u = i / segs;
    curve.getPointAt(u, p);
    curve.getTangentAt(u, t);
    n.crossVectors(t, Z).normalize();
    b.crossVectors(n, t).normalize();
    const a = u * Math.PI * 2;
    across.copy(b).multiplyScalar(Math.cos(a)).addScaledVector(n, Math.sin(a)).multiplyScalar(RIBBON_W / 2);
    pos.push(p.x + across.x, p.y + across.y, p.z + across.z, p.x - across.x, p.y - across.y, p.z - across.z);
    uv.push(u * repeats, 1, u * repeats, 0);
    if (i < segs) {
      const k = i * 2;
      index.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(index);
  return g;
}

type Props = {
  trigger: React.RefObject<HTMLElement | null>;
  // The loop centres itself on this element (the title).
  anchor: React.RefObject<HTMLElement | null>;
};

export default function FilmReel({ trigger, anchor }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let raf = 0;
    let visible = true;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    const group = new THREE.Group();
    group.rotation.set(-0.24, 0, -0.1);
    scene.add(group);

    const pts: THREE.Vector3[] = [];
    for (let k = 0; k < 16; k++) {
      const th = (k / 16) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(th) * 5.6, Math.sin(th) * 1.95, Math.sin(th * 2) * 1.3));
    }
    const curve = new THREE.CatmullRomCurve3(pts, true, "centripetal");

    const uniforms = {
      map: { value: null as THREE.Texture | null },
      offset: { value: 0 },
      fogColor: { value: new THREE.Color("#0e0d0b") },
      fogNear: { value: 8 },
      fogFar: { value: 17 },
      opacity: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      side: THREE.DoubleSide,
      transparent: true,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying float vDepth;
        void main() {
          vUv = uv;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vDepth = -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D map;
        uniform float offset;
        uniform vec3 fogColor;
        uniform float fogNear;
        uniform float fogFar;
        uniform float opacity;
        varying vec2 vUv;
        varying float vDepth;
        void main() {
          vec4 c = texture2D(map, vec2(vUv.x + offset, vUv.y));
          if (!gl_FrontFacing) c.rgb *= 0.38;
          c.rgb = mix(c.rgb, fogColor, smoothstep(fogNear, fogFar, vDepth));
          gl_FragColor = vec4(c.rgb, opacity);
          #include <colorspace_fragment>
        }`,
    });

    let mesh: THREE.Mesh | null = null;
    const state = { intro: reduce ? 1 : 0, scroll: 0, speed: 0.022 };
    let baseZ = 12;
    let centerY = 0;

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Pull back on narrow screens so the loop still frames the title.
      baseZ = camera.aspect < 0.8 ? 16 : camera.aspect < 1.25 ? 15 : 12;
      camera.updateProjectionMatrix();
      // Fog follows the camera so the far side of the loop always falls into shadow.
      uniforms.fogNear.value = baseZ - 4;
      uniforms.fogFar.value = baseZ + 5;
      // Put the loop's centre behind the title.
      const a = anchor.current?.getBoundingClientRect();
      const hostRect = el.getBoundingClientRect();
      if (a) {
        const cy = a.top + a.height / 2 - hostRect.top;
        const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * baseZ;
        centerY = (0.5 - cy / h) * 2 * halfH;
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const timer = new THREE.Timer();
    const render = () => {
      timer.update();
      const dt = Math.min(timer.getDelta(), 0.05);
      const time = timer.getElapsed();
      if (!reduce) uniforms.offset.value += dt * (state.speed + state.scroll * 0.12);
      group.rotation.y = Math.sin(time * 0.22) * 0.14 + (1 - state.intro) * -2.2;
      group.rotation.z = -0.1 + state.scroll * 0.35;
      group.scale.setScalar(0.35 + 0.65 * state.intro);
      uniforms.opacity.value = Math.min(1, state.intro * 1.6);
      group.position.y = centerY;
      camera.position.set(0, centerY * 0.35, baseZ - state.scroll * 5);
      camera.lookAt(0, centerY * 0.35, 0);
      renderer.render(scene, camera);
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (visible && !document.hidden) render();
    };

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    let st: ScrollTrigger | undefined;
    let introTween: gsap.core.Tween | undefined;
    const spinIn = () => {
      introTween = gsap.to(state, { intro: 1, duration: 1.8, ease: "expo.out" });
    };

    filmTexture().then(({ tex, canvasW }) => {
      if (disposed) return tex.dispose();
      uniforms.map.value = tex;
      const length = curve.getLength();
      const repeats = Math.max(1, Math.round((length * CANVAS_H) / (RIBBON_W * canvasW)));
      mesh = new THREE.Mesh(ribbonGeometry(curve, repeats), material);
      group.add(mesh);

      if (reduce) {
        render();
        return;
      }
      if (trigger.current) {
        st = ScrollTrigger.create({
          trigger: trigger.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          onUpdate: (self) => (state.scroll = self.progress),
        });
      }
      if (document.documentElement.dataset.slammed) spinIn();
      else window.addEventListener("jc:slam", spinIn, { once: true });
      loop();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("jc:slam", spinIn);
      introTween?.kill();
      st?.kill();
      io.disconnect();
      ro.disconnect();
      mesh?.geometry.dispose();
      uniforms.map.value?.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [trigger, anchor]);

  return <div ref={host} aria-hidden className="absolute inset-0" />;
}
