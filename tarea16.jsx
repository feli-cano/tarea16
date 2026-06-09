import { useState, useRef, useEffect } from "react";

const COLORS = {
  bg: "#0f0f1a",
  card: "#16162a",
  border: "#2a2a4a",
  accent: "#7c6ff7",
  accent2: "#f76f9a",
  accent3: "#6ff7c8",
  accent4: "#f7c86f",
  text: "#e8e8f5",
  muted: "#7070a0",
  grid: "#1e1e35",
  axis: "#3a3a6a",
};

// ─── Math helpers ───────────────────────────────────────────────────────────
const range = (a, b, step = 1) => {
  const arr = [];
  for (let i = a; i <= b; i += step) arr.push(parseFloat(i.toFixed(4)));
  return arr;
};

// ─── Canvas Graph Component ──────────────────────────────────────────────────
function Graph({ fn, xMin = -6, xMax = 6, yMin = -10, yMax = 10, points = [], color = "#7c6ff7", label = "", step = 0.05, extraFns = [], xLabel = "x", yLabel = "y" }) {
  const canvasRef = useRef(null);
  const W = 420, H = 320;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    const toX = (x) => ((x - xMin) / (xMax - xMin)) * W;
    const toY = (y) => H - ((y - yMin) / (yMax - yMin)) * H;

    // Background
    ctx.fillStyle = COLORS.card;
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      ctx.beginPath(); ctx.moveTo(toX(x), 0); ctx.lineTo(toX(x), H); ctx.stroke();
    }
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      ctx.beginPath(); ctx.moveTo(0, toY(y)); ctx.lineTo(W, toY(y)); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = COLORS.axis;
    ctx.lineWidth = 1.5;
    if (yMin <= 0 && yMax >= 0) { ctx.beginPath(); ctx.moveTo(0, toY(0)); ctx.lineTo(W, toY(0)); ctx.stroke(); }
    if (xMin <= 0 && xMax >= 0) { ctx.beginPath(); ctx.moveTo(toX(0), 0); ctx.lineTo(toX(0), H); ctx.stroke(); }

    // Axis labels
    ctx.fillStyle = COLORS.muted;
    ctx.font = "10px monospace";
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      if (x === 0) continue;
      ctx.fillText(x, toX(x) - 6, toY(0) + 14);
    }
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      if (y === 0) continue;
      ctx.fillText(y, toX(0) + 4, toY(y) + 4);
    }

    // Draw function curve
    const drawCurve = (f, clr, dashed = false) => {
      ctx.strokeStyle = clr;
      ctx.lineWidth = 2.5;
      if (dashed) ctx.setLineDash([6, 4]);
      else ctx.setLineDash([]);
      ctx.beginPath();
      let started = false;
      for (let x = xMin; x <= xMax; x += step) {
        try {
          const y = f(x);
          if (!isFinite(y) || isNaN(y) || y < yMin - 50 || y > yMax + 50) { started = false; continue; }
          if (!started) { ctx.moveTo(toX(x), toY(y)); started = true; }
          else ctx.lineTo(toX(x), toY(y));
        } catch { started = false; }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    if (fn) drawCurve(fn, color);
    extraFns.forEach(({ f, c }) => drawCurve(f, c, true));

    // Special points
    points.forEach(({ x, y, clr = "#f76f9a", lbl = "" }) => {
      ctx.fillStyle = clr;
      ctx.beginPath();
      ctx.arc(toX(x), toY(y), 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COLORS.text;
      ctx.font = "bold 10px monospace";
      ctx.fillText(lbl || `(${x},${y})`, toX(x) + 7, toY(y) - 5);
    });

    // Arrow heads on axes
    ctx.fillStyle = COLORS.axis;
    const ax0 = toX(0), ay0 = toY(0);
    if (yMin <= 0 && yMax >= 0) {
      ctx.beginPath(); ctx.moveTo(W - 2, ay0); ctx.lineTo(W - 10, ay0 - 4); ctx.lineTo(W - 10, ay0 + 4); ctx.fill();
    }
    if (xMin <= 0 && xMax >= 0) {
      ctx.beginPath(); ctx.moveTo(ax0, 2); ctx.lineTo(ax0 - 4, 10); ctx.lineTo(ax0 + 4, 10); ctx.fill();
    }

    // Axis name labels
    ctx.fillStyle = COLORS.muted;
    ctx.font = "italic 12px monospace";
    ctx.fillText(xLabel, W - 16, ay0 - 6);
    ctx.fillText(yLabel, ax0 + 6, 12);

  }, [fn, xMin, xMax, yMin, yMax, color, JSON.stringify(points)]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <canvas ref={canvasRef} width={W} height={H} style={{ borderRadius: 10, border: `1px solid ${COLORS.border}`, maxWidth: "100%" }} />
      {label && <div style={{ color: COLORS.accent, fontFamily: "monospace", fontSize: 12, marginTop: 6 }}>{label}</div>}
    </div>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ num, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "32px 0 18px" }}>
      <div style={{ background: COLORS.accent, color: "#fff", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, flexShrink: 0 }}>{num}</div>
      <h2 style={{ color: COLORS.text, fontFamily: "'Courier New', monospace", fontSize: 16, margin: 0, letterSpacing: 1 }}>{title}</h2>
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────
function Card({ title, color = COLORS.accent, children }) {
  return (
    <div style={{ background: COLORS.card, border: `1px solid ${color}33`, borderRadius: 14, padding: "20px 24px", marginBottom: 24 }}>
      <h3 style={{ color, fontFamily: "monospace", fontSize: 14, margin: "0 0 16px", letterSpacing: 2, textTransform: "uppercase" }}>{title}</h3>
      {children}
    </div>
  );
}

function Info({ label, value, color = COLORS.accent3 }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", margin: "6px 0" }}>
      <span style={{ color: COLORS.muted, fontFamily: "monospace", fontSize: 13, minWidth: 120 }}>{label}:</span>
      <span style={{ color, fontFamily: "monospace", fontSize: 13, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function Badge({ text, color }) {
  return <span style={{ background: color + "22", color, border: `1px solid ${color}55`, borderRadius: 6, padding: "2px 10px", fontFamily: "monospace", fontSize: 12, fontWeight: 700, marginRight: 8 }}>{text}</span>;
}

function MathText({ children }) {
  return <p style={{ color: COLORS.muted, fontFamily: "monospace", fontSize: 13, lineHeight: 1.7, margin: "8px 0" }}>{children}</p>;
}

// ─── Table of points ─────────────────────────────────────────────────────────
function PointsTable({ pts, xLabel = "x", yLabel = "y" }) {
  return (
    <div style={{ overflowX: "auto", margin: "12px 0" }}>
      <table style={{ borderCollapse: "collapse", fontFamily: "monospace", fontSize: 12, width: "100%" }}>
        <thead>
          <tr>
            <th style={{ color: COLORS.accent, padding: "6px 12px", borderBottom: `1px solid ${COLORS.border}`, textAlign: "center" }}>{xLabel}</th>
            {pts.map((p, i) => <th key={i} style={{ color: COLORS.muted, padding: "6px 10px", borderBottom: `1px solid ${COLORS.border}`, textAlign: "center" }}>{p[0]}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ color: COLORS.accent2, padding: "6px 12px", textAlign: "center", fontWeight: 700 }}>{yLabel}</td>
            {pts.map((p, i) => <td key={i} style={{ color: COLORS.text, padding: "6px 10px", textAlign: "center" }}>{typeof p[1] === "number" ? p[1].toFixed(2) : p[1]}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA PER EXERCISE
// ═══════════════════════════════════════════════════════════════════════════════

// 1a) y = x³ + x
const f1a = x => x ** 3 + x;
const pts1a = [[-3, -30], [-2, -10], [-1, -2], [0, 0], [1, 2], [2, 10], [3, 30]];

// 1b) 2x + y - 2 = 0  →  y = 2 - 2x
const f1b = x => 2 - 2 * x;
const pts1b = [[-3, 8], [-2, 6], [-1, 4], [0, 2], [1, 0], [2, -2], [3, -6]];

// 1c) 9x + 5x - 30 = 2x - 25 - 7 + y → 14x - 30 = 2x - 32 + y → y = 12x + 2
const f1c = x => 12 * x + 2;
const pts1c = [[-3, -34], [-2, -22], [-1, -10], [0, 2], [1, 14], [2, 26], [3, 38]];

// 2a) f(t) = √(t²-9)  domain: t≤-3 or t≥3
const f2a = t => { const v = t ** 2 - 9; return v >= 0 ? Math.sqrt(v) : NaN; };
const pts2a = [[-5, 4], [-4, Math.sqrt(7)], [-3, 0], [3, 0], [4, Math.sqrt(7)], [5, 4], [6, Math.sqrt(27)]];

// 2b) f(x) = x² + 2x - 24
const f2b = x => x ** 2 + 2 * x - 24;
const pts2b = [[-6, 0], [-5, -9], [-4, -16], [-1, -25], [0, -24], [4, 0], [3, -9]];

// 2c) f(x) = x² - 4x + 1
const f2c = x => x ** 2 - 4 * x + 1;
const pts2c = [[-1, 6], [0, 1], [1, -2], [2, -3], [3, -2], [4, 1], [5, 6]];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function Tarea16() {
  const [tab, setTab] = useState(0);
  const tabs = ["Punto 1 – Ecuaciones", "Punto 2 – Funciones", "Punto 3 – Prueba V/H"];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "monospace" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, #1a1a3e 0%, #0f0f1a 100%)`, borderBottom: `1px solid ${COLORS.border}`, padding: "28px 32px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 3, marginBottom: 6 }}>COTECNOVA · MATEMÁTICAS BÁSICAS</div>
          <h1 style={{ color: COLORS.text, fontSize: 22, fontWeight: 900, margin: "0 0 4px", letterSpacing: 1 }}>TAREA 16</h1>
          <div style={{ color: COLORS.accent, fontSize: 13, letterSpacing: 2 }}>GRÁFICA EN COORDENADAS RECTANGULARES</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "0 32px", display: "flex", gap: 4, maxWidth: 900, margin: "0 auto" }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{ background: "none", border: "none", borderBottom: tab === i ? `2px solid ${COLORS.accent}` : "2px solid transparent", color: tab === i ? COLORS.accent : COLORS.muted, padding: "14px 16px", cursor: "pointer", fontFamily: "monospace", fontSize: 12, letterSpacing: 1, transition: "all 0.2s" }}>{t}</button>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px 60px" }}>

        {/* ═══ TAB 0: Punto 1 ═══ */}
        {tab === 0 && <>
          <SectionHeader num="1a" title='y = x³ + x' />
          <Card title="Intersecciones" color={COLORS.accent}>
            <MathText>Intersección con eje x (y=0): x³ + x = 0 → x(x²+1) = 0 → x = 0 (único, ya que x²+1 > 0 siempre)</MathText>
            <MathText>Intersección con eje y (x=0): y = 0³ + 0 = 0</MathText>
            <MathText>→ Único punto de intersección: (0, 0)</MathText>
            <PointsTable pts={pts1a} />
          </Card>
          <Graph fn={f1a} yMin={-12} yMax={12} points={[{ x: 0, y: 0, clr: COLORS.accent2, lbl: "(0,0)" }]} color={COLORS.accent} label="y = x³ + x" />
          <Card title="Análisis" color={COLORS.accent3} >
            <Info label="Dominio" value="(-∞, +∞) → Todos los reales ℝ" />
            <Info label="Rango" value="(-∞, +∞) → Todos los reales ℝ" />
            <Info label="¿Es función?" value="SÍ" color={COLORS.accent3} />
            <Info label="¿Uno a uno?" value="SÍ" color={COLORS.accent3} />
            <MathText>Prueba vertical: cualquier recta vertical x = k corta la curva en exactamente un punto → ES función.</MathText>
            <MathText>Prueba horizontal: cualquier recta horizontal y = k corta la curva en exactamente un punto (ya que y = x³+x es estrictamente creciente, su derivada 3x²+1 &gt; 0 ∀x) → ES uno a uno.</MathText>
          </Card>

          <SectionHeader num="1b" title='2x + y − 2 = 0   →   y = 2 − 2x' />
          <Card title="Despeje e Intersecciones" color={COLORS.accent2}>
            <MathText>Despeje: y = 2 − 2x</MathText>
            <MathText>Intersección con eje x (y=0): 0 = 2−2x → x = 1 → punto (1, 0)</MathText>
            <MathText>Intersección con eje y (x=0): y = 2 → punto (0, 2)</MathText>
            <PointsTable pts={pts1b} />
          </Card>
          <Graph fn={f1b} yMin={-8} yMax={10} points={[{ x: 1, y: 0, clr: COLORS.accent2, lbl: "(1,0)" }, { x: 0, y: 2, clr: COLORS.accent4, lbl: "(0,2)" }]} color={COLORS.accent2} label="y = 2 − 2x" />
          <Card title="Análisis" color={COLORS.accent3}>
            <Info label="Dominio" value="(-∞, +∞) → ℝ" />
            <Info label="Rango" value="(-∞, +∞) → ℝ" />
            <Info label="¿Es función?" value="SÍ" color={COLORS.accent3} />
            <Info label="¿Uno a uno?" value="SÍ" color={COLORS.accent3} />
            <MathText>Prueba vertical: toda recta vertical toca la recta en un solo punto → ES función.</MathText>
            <MathText>Prueba horizontal: toda recta horizontal toca la recta en un solo punto (pendiente m=−2 ≠ 0) → ES uno a uno.</MathText>
          </Card>

          <SectionHeader num="1c" title='9x + 5x − 30 = 2x − 25 − 7 + y   →   y = 12x + 2' />
          <Card title="Despeje e Intersecciones" color={COLORS.accent4}>
            <MathText>9x + 5x − 30 = 2x − 32 + y</MathText>
            <MathText>14x − 30 − 2x + 32 = y</MathText>
            <MathText>y = 12x + 2</MathText>
            <MathText>Intersección con eje x (y=0): 12x+2=0 → x = −1/6 → punto (−0.167, 0)</MathText>
            <MathText>Intersección con eje y (x=0): y = 2 → punto (0, 2)</MathText>
            <PointsTable pts={[[-3, -34], [-2, -22], [-1, -10], [0, 2], [1, 14]].map(p => p)} />
            <MathText>(Nota: por la escala, se muestran puntos cercanos al origen en la tabla principal)</MathText>
            <PointsTable pts={[[-1, -10], [-0.5, -4], [0, 2], [0.5, 8], [1, 14], [1.5, 20], [2, 26]]} />
          </Card>
          <Graph fn={f1c} yMin={-15} yMax={30} points={[{ x: -1 / 6, y: 0, clr: COLORS.accent2, lbl: "(-1/6,0)" }, { x: 0, y: 2, clr: COLORS.accent4, lbl: "(0,2)" }]} color={COLORS.accent4} label="y = 12x + 2" />
          <Card title="Análisis" color={COLORS.accent3}>
            <Info label="Dominio" value="(-∞, +∞) → ℝ" />
            <Info label="Rango" value="(-∞, +∞) → ℝ" />
            <Info label="¿Es función?" value="SÍ" color={COLORS.accent3} />
            <Info label="¿Uno a uno?" value="SÍ" color={COLORS.accent3} />
            <MathText>Prueba vertical: recta con pendiente m=12 → cualquier vertical la toca exactamente una vez → ES función.</MathText>
            <MathText>Prueba horizontal: cualquier horizontal la toca exactamente una vez → ES uno a uno.</MathText>
          </Card>
        </>}

        {/* ═══ TAB 1: Punto 2 ═══ */}
        {tab === 1 && <>
          <SectionHeader num="2a" title='f(t) = √(t² − 9)' />
          <Card title="Intersecciones y Dominio" color={COLORS.accent}>
            <MathText>Dominio: necesitamos t²−9 ≥ 0 → t² ≥ 9 → |t| ≥ 3</MathText>
            <MathText>∴ t ∈ (−∞, −3] ∪ [3, +∞)</MathText>
            <MathText>Intersección con eje t (f=0): √(t²−9) = 0 → t²=9 → t = ±3 → puntos (−3, 0) y (3, 0)</MathText>
            <MathText>Intersección con eje y: t=0 → t²−9=−9 &lt; 0 → NO existe intersección con eje vertical.</MathText>
            <PointsTable xLabel="t" yLabel="f(t)" pts={[[-5, 4], [-4, Number(Math.sqrt(7).toFixed(2))], [-3, 0], [3, 0], [4, Number(Math.sqrt(7).toFixed(2))], [5, 4], [6, Number(Math.sqrt(27).toFixed(2))]]} />
          </Card>
          <Graph fn={f2a} xMin={-8} xMax={8} yMin={-1} yMax={8} points={[{ x: -3, y: 0, clr: COLORS.accent2, lbl: "(-3,0)" }, { x: 3, y: 0, clr: COLORS.accent2, lbl: "(3,0)" }]} color={COLORS.accent} label="f(t) = √(t²−9)" xLabel="t" yLabel="f(t)" step={0.02} />
          <Card title="Análisis" color={COLORS.accent3}>
            <Info label="Dominio" value="(−∞, −3] ∪ [3, +∞)" />
            <Info label="Rango" value="[0, +∞)" />
            <Info label="¿Es función?" value="SÍ" color={COLORS.accent3} />
            <Info label="¿Uno a uno?" value="NO" color={COLORS.accent2} />
            <MathText>Prueba vertical: cada valor de t en el dominio produce exactamente un valor f(t) (raíz cuadrada siempre positiva) → ES función.</MathText>
            <MathText>Prueba horizontal: una recta horizontal como f=4 corta la curva en dos puntos: t=−5 y t=5. Por lo tanto NO es uno a uno. La función es par: f(−t)=f(t).</MathText>
          </Card>

          <SectionHeader num="2b" title='f(x) = x² + 2x − 24' />
          <Card title="Intersecciones" color={COLORS.accent2}>
            <MathText>Factorizando: (x+6)(x−4) = 0 → x = −6 y x = 4</MathText>
            <MathText>Intersecciones con eje x: (−6, 0) y (4, 0)</MathText>
            <MathText>Intersección con eje y (x=0): f(0) = −24 → (0, −24)</MathText>
            <MathText>Vértice: x = −b/2a = −2/2 = −1 → f(−1) = 1−2−24 = −25 → vértice (−1, −25)</MathText>
            <PointsTable pts={[[-6, 0], [-4, -16], [-1, -25], [0, -24], [2, -16], [4, 0], [5, 11]]} />
          </Card>
          <Graph fn={f2b} xMin={-8} xMax={7} yMin={-30} yMax={15} points={[{ x: -6, y: 0, clr: COLORS.accent2, lbl: "(-6,0)" }, { x: 4, y: 0, clr: COLORS.accent2, lbl: "(4,0)" }, { x: 0, y: -24, clr: COLORS.accent4, lbl: "(0,-24)" }, { x: -1, y: -25, clr: COLORS.accent3, lbl: "V(-1,-25)" }]} color={COLORS.accent2} label="f(x) = x²+2x−24" step={0.05} />
          <Card title="Análisis" color={COLORS.accent3}>
            <Info label="Dominio" value="(-∞, +∞) → ℝ" />
            <Info label="Rango" value="[−25, +∞)" />
            <Info label="¿Es función?" value="SÍ" color={COLORS.accent3} />
            <Info label="¿Uno a uno?" value="NO" color={COLORS.accent2} />
            <MathText>Prueba vertical: parábola vertical → cualquier recta vertical la toca en un punto → ES función.</MathText>
            <MathText>Prueba horizontal: una recta horizontal y = 0 corta la parábola en x=−6 y x=4 (dos puntos) → NO es uno a uno. La parábola es simétrica respecto a x=−1.</MathText>
          </Card>

          <SectionHeader num="2c" title='f(x) = x² − 4x + 1' />
          <Card title="Intersecciones" color={COLORS.accent4}>
            <MathText>Intersección eje x: x²−4x+1=0 → x = (4±√12)/2 = 2±√3</MathText>
            <MathText>x₁ = 2−√3 ≈ 0.27 y x₂ = 2+√3 ≈ 3.73</MathText>
            <MathText>Intersección eje y (x=0): f(0) = 1 → (0, 1)</MathText>
            <MathText>Vértice: x = 4/2 = 2 → f(2) = 4−8+1 = −3 → vértice (2, −3)</MathText>
            <PointsTable pts={[[-1, 6], [0, 1], [0.27, 0], [2, -3], [3.73, 0], [4, 1], [5, 6]]} />
          </Card>
          <Graph fn={f2c} xMin={-2} xMax={7} yMin={-5} yMax={10} points={[{ x: 2 - Math.sqrt(3), y: 0, clr: COLORS.accent2, lbl: "(0.27,0)" }, { x: 2 + Math.sqrt(3), y: 0, clr: COLORS.accent2, lbl: "(3.73,0)" }, { x: 0, y: 1, clr: COLORS.accent4, lbl: "(0,1)" }, { x: 2, y: -3, clr: COLORS.accent3, lbl: "V(2,-3)" }]} color={COLORS.accent4} label="f(x) = x²−4x+1" step={0.05} />
          <Card title="Análisis" color={COLORS.accent3}>
            <Info label="Dominio" value="(-∞, +∞) → ℝ" />
            <Info label="Rango" value="[−3, +∞)" />
            <Info label="¿Es función?" value="SÍ" color={COLORS.accent3} />
            <Info label="¿Uno a uno?" value="NO" color={COLORS.accent2} />
            <MathText>Prueba vertical: parábola vertical → cada x da exactamente un y → ES función.</MathText>
            <MathText>Prueba horizontal: y = 0 corta la parábola en x≈0.27 y x≈3.73 → NO es uno a uno. Simétrica respecto a x=2.</MathText>
          </Card>
        </>}

        {/* ═══ TAB 2: Punto 3 ═══ */}
        {tab === 2 && <>
          <div style={{ padding: "18px 0 8px" }}>
            <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7 }}>
              Se aplican las pruebas de la recta vertical y horizontal a las cuatro gráficas del enunciado.
            </p>
          </div>

          {/* Gráfica (a) */}
          <Card title="Gráfica (a) — Curva con pico/asíntota (tipo racional)" color={COLORS.accent}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <Graph fn={x => { if (Math.abs(x) < 0.15) return NaN; return 1 / (x * x) + (x > 0 ? 0.5 : 0); }} xMin={-5} xMax={5} yMin={-1} yMax={8} color={COLORS.accent} label="Gráfica (a) — ilustración" step={0.01} />
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <Info label="¿Es función?" value="SÍ" color={COLORS.accent3} />
                <Info label="¿Uno a uno?" value="NO" color={COLORS.accent2} />
                <div style={{ marginTop: 14 }}>
                  <Badge text="Prueba Vertical ✓" color={COLORS.accent3} />
                  <MathText>Cualquier recta vertical x = k corta la curva en a lo sumo un punto. La gráfica pasa la prueba vertical: ES función de x.</MathText>
                  <Badge text="Prueba Horizontal ✗" color={COLORS.accent2} />
                  <MathText>Una recta horizontal y = c (con c pequeño y positivo) puede cortar la curva en más de un punto (en ambos lados del eje). NO es uno a uno.</MathText>
                </div>
              </div>
            </div>
          </Card>

          {/* Gráfica (b) */}
          <Card title="Gráfica (b) — Curva oscilatoria (tipo senoidal)" color={COLORS.accent2}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <Graph fn={x => Math.sin(x * 1.5)} xMin={-6} xMax={6} yMin={-2} yMax={2} color={COLORS.accent2} label="Gráfica (b) — ilustración" step={0.02} />
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <Info label="¿Es función?" value="SÍ" color={COLORS.accent3} />
                <Info label="¿Uno a uno?" value="NO" color={COLORS.accent2} />
                <div style={{ marginTop: 14 }}>
                  <Badge text="Prueba Vertical ✓" color={COLORS.accent3} />
                  <MathText>Cualquier recta vertical corta la curva oscilatoria exactamente en un punto → ES función de x.</MathText>
                  <Badge text="Prueba Horizontal ✗" color={COLORS.accent2} />
                  <MathText>Una recta horizontal y = 0.5 corta la curva en múltiples puntos (tantos como ciclos tiene la onda). NO es uno a uno.</MathText>
                </div>
              </div>
            </div>
          </Card>

          {/* Gráfica (c) */}
          <Card title="Gráfica (c) — Curva cerrada / espiral (tipo elipse o bucle)" color={COLORS.accent4}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                {/* Simulated as a sideways parabola x = y² */}
                <Graph
                  fn={null}
                  extraFns={[{ f: y => y * y - 3, c: COLORS.accent4 }, { f: y => -(y * y - 3), c: COLORS.accent4 }]}
                  xMin={-4} xMax={4} yMin={-4} yMax={4}
                  color={COLORS.accent4}
                  label="Gráfica (c) — ilustración (x = y²)"
                  step={0.05}
                />
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <Info label="¿Es función?" value="NO" color={COLORS.accent2} />
                <Info label="¿Uno a uno?" value="N/A" color={COLORS.muted} />
                <div style={{ marginTop: 14 }}>
                  <Badge text="Prueba Vertical ✗" color={COLORS.accent2} />
                  <MathText>La curva (que semeja una elipse o bucle cerrado) puede ser cortada por una recta vertical x = k en dos puntos: uno superior y uno inferior. FALLA la prueba vertical → NO es función de x.</MathText>
                  <MathText>Al no ser función, no tiene sentido aplicar la prueba horizontal.</MathText>
                </div>
              </div>
            </div>
          </Card>

          {/* Gráfica (d) */}
          <Card title="Gráfica (d) — Segmentos horizontales paralelos (función escalonada)" color={COLORS.accent3}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                {/* Two horizontal segments at y=2 and y=-2 */}
                <Graph
                  fn={null}
                  extraFns={[
                    { f: x => (x >= 1 && x <= 4) ? 2 : NaN, c: COLORS.accent3 },
                    { f: x => (x >= 1 && x <= 4) ? -2 : NaN, c: COLORS.accent3 },
                  ]}
                  xMin={-2} xMax={6} yMin={-4} yMax={4}
                  color={COLORS.accent3}
                  label="Gráfica (d) — ilustración (segmentos)"
                  step={0.02}
                />
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <Info label="¿Es función?" value="NO" color={COLORS.accent2} />
                <Info label="¿Uno a uno?" value="N/A" color={COLORS.muted} />
                <div style={{ marginTop: 14 }}>
                  <Badge text="Prueba Vertical ✗" color={COLORS.accent2} />
                  <MathText>Los dos segmentos horizontales están en el mismo rango de x. Una recta vertical x = k (dentro del rango) corta los dos segmentos simultáneamente en dos puntos distintos: (k, 2) y (k, −2). FALLA la prueba vertical → NO es función de x.</MathText>
                  <MathText>Al no ser función, no aplica la prueba horizontal.</MathText>
                </div>
              </div>
            </div>
          </Card>

          {/* Summary table */}
          <Card title="Resumen — Punto 3" color={COLORS.muted}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontFamily: "monospace", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  {["Gráfica", "¿Función?", "¿Uno a uno?", "Argumento"].map((h, i) => (
                    <th key={i} style={{ color: COLORS.accent, padding: "8px 12px", textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["(a)", "SÍ", "NO", "Pasa prueba vertical. Falla prueba horizontal (valores repetidos de y)."],
                  ["(b)", "SÍ", "NO", "Pasa prueba vertical. Falla prueba horizontal (curva oscilatoria)."],
                  ["(c)", "NO", "N/A", "Falla prueba vertical: una x tiene dos valores de y."],
                  ["(d)", "NO", "N/A", "Falla prueba vertical: dos segmentos comparten misma x."],
                ].map(([g, f, o, arg], i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}22` }}>
                    <td style={{ color: COLORS.accent4, padding: "8px 12px", fontWeight: 700 }}>{g}</td>
                    <td style={{ padding: "8px 12px", color: f === "SÍ" ? COLORS.accent3 : COLORS.accent2 }}>{f}</td>
                    <td style={{ padding: "8px 12px", color: o === "NO" ? COLORS.accent2 : COLORS.muted }}>{o}</td>
                    <td style={{ padding: "8px 12px", color: COLORS.muted, fontSize: 12 }}>{arg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>}
      </div>
    </div>
  );
}
