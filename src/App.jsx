import { useState, useEffect, useRef } from "react";

const solutions = [
  {
    id: "a", problem: "−4x ≥ 2",
    steps: ["−4x ≥ 2", "x ≤ 2 ÷ (−4)   [÷ negativo → invierte]", "x ≤ −½"],
    point: -0.5, direction: "left", interval: "(−∞, −½]", closed: true, label: "−½",
  },
  {
    id: "b", problem: "3 < 2y + 3",
    steps: ["3 < 2y + 3", "3 − 3 < 2y", "0 < 2y", "y > 0"],
    point: 0, direction: "right", interval: "(0, +∞)", closed: false, label: "0",
  },
  {
    id: "c", problem: "3(2 − 3x) > 4(1 − 4x)",
    steps: ["6 − 9x > 4 − 16x", "−9x + 16x > 4 − 6", "7x > −2", "x > −2/7"],
    point: -2/7, direction: "right", interval: "(−2/7, +∞)", closed: false, label: "−2/7",
  },
  {
    id: "d", problem: "2(4x − 2) > 4(2x + 1)",
    steps: ["8x − 4 > 8x + 4", "8x − 8x > 4 + 4", "0 > 8   [Contradicción: FALSO]"],
    point: null, direction: null, interval: "∅  (sin solución)", closed: false, label: null, noSolution: true,
  },
  {
    id: "e", problem: "5 − 7s > 3",
    steps: ["−7s > 3 − 5", "−7s > −2", "s < 2/7   [÷ negativo → invierte]"],
    point: 2/7, direction: "left", interval: "(−∞, 2/7)", closed: false, label: "2/7",
  },
  {
    id: "f", problem: "t + 6 ≤ 2 + 3t",
    steps: ["6 − 2 ≤ 3t − t", "4 ≤ 2t", "t ≥ 2"],
    point: 2, direction: "right", interval: "[2, +∞)", closed: true, label: "2",
  },
  {
    id: "g", problem: "(5y + 2) / 4 ≤ 2y − 1",
    steps: ["5y + 2 ≤ 4(2y − 1)   [× 4]", "5y + 2 ≤ 8y − 4", "6 ≤ 3y", "y ≥ 2"],
    point: 2, direction: "right", interval: "[2, +∞)", closed: true, label: "2",
  },
  {
    id: "h", problem: "−3x + 1 ≤ −3(x − 2) + 1",
    steps: ["−3x + 1 ≤ −3x + 6 + 1", "−3x + 1 ≤ −3x + 7", "1 ≤ 7   [Tautología: SIEMPRE VERDADERO]"],
    point: null, direction: null, interval: "(−∞, +∞) = ℝ", closed: false, label: null, allReals: true,
  },
  {
    id: "i", problem: "y + y/2 < y/3 + y/5",
    steps: ["× 30 (m.c.m. de 1, 2, 3, 5):", "30y + 15y < 10y + 6y", "45y < 16y", "29y < 0", "y < 0"],
    point: 0, direction: "left", interval: "(−∞, 0)", closed: false, label: "0",
  },
];

const appProblems = [
  {
    id: "2a", title: "Vendedor — Ingreso mínimo",
    data: ["Ingreso: I = 200 + 0,8S", "Meta: I ≥ 4.500"],
    steps: ["200 + 0,8S ≥ 4.500", "0,8S ≥ 4.300", "S ≥ 4.300 / 0,8", "S ≥ 5.375"],
    answer: "Debe vender al menos 5.375 productos al mes.",
    interval: "[5.375, +∞)",
  },
  {
    id: "2b", title: "Empresa ABC — Punto de equilibrio",
    data: ["Precio unitario: $20.000", "Costo unitario: $15.000", "Costos fijos: $6.000.000"],
    steps: [
      "Utilidad = Ingreso − Costo total > 0",
      "20.000q − (15.000q + 6.000.000) > 0",
      "5.000q > 6.000.000",
      "q > 1.200",
    ],
    answer: "Debe vender más de 1.200 unidades (mínimo 1.201) para tener utilidades.",
    interval: "(1.200, +∞)",
  },
];

function NumberLine({ sol }) {
  const containerRef = useRef(null);
  const [W, setW] = useState(300);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (let e of entries) setW(Math.max(180, e.contentRect.width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = 52, mid = W / 2, scale = W / 6;
  const px = (v) => mid + v * scale;
  const dotX = sol.point !== null ? Math.max(14, Math.min(W - 14, px(sol.point))) : null;
  const color = "#38bdf8";

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        {sol.noSolution && <>
          <line x1={10} y1={H/2} x2={W-10} y2={H/2} stroke="#475569" strokeWidth={2}/>
          <text x={mid} y={H/2+5} textAnchor="middle" fill="#ef4444" fontSize={14} fontFamily="monospace">∅</text>
        </>}

        {sol.allReals && <>
          <defs>
            <marker id="al" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
              <path d="M7,0 L0,3.5 L7,7" fill="none" stroke="#10b981" strokeWidth={1.5}/>
            </marker>
            <marker id="ar" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7" fill="none" stroke="#10b981" strokeWidth={1.5}/>
            </marker>
          </defs>
          <line x1={10} y1={H/2} x2={W-10} y2={H/2} stroke="#475569" strokeWidth={2}/>
          <line x1={18} y1={H/2} x2={W-18} y2={H/2} stroke="#10b981" strokeWidth={3.5}
            markerStart="url(#al)" markerEnd="url(#ar)"/>
          <text x={mid} y={H-6} textAnchor="middle" fill="#10b981" fontSize={11} fontFamily="monospace">ℝ</text>
        </>}

        {!sol.noSolution && !sol.allReals && <>
          <defs>
            <marker id={`ah-${sol.id}`} markerWidth="8" markerHeight="8" refX="4" refY="4"
              orient={sol.direction === "right" ? "auto" : "auto-start-reverse"}>
              <path d="M0,0 L8,4 L0,8" fill="none" stroke={color} strokeWidth={1.5}/>
            </marker>
          </defs>
          <line x1={10} y1={H/2} x2={W-10} y2={H/2} stroke="#475569" strokeWidth={2}/>
          {[-2,-1,0,1,2].map(v => {
            const xv = px(v);
            if (xv < 10 || xv > W-10) return null;
            return (
              <g key={v}>
                <line x1={xv} y1={H/2-5} x2={xv} y2={H/2+5} stroke="#64748b" strokeWidth={1}/>
                <text x={xv} y={H-4} textAnchor="middle" fill="#94a3b8" fontSize={9} fontFamily="monospace">{v}</text>
              </g>
            );
          })}
          {sol.direction === "right"
            ? <line x1={dotX} y1={H/2} x2={W-12} y2={H/2} stroke={color} strokeWidth={3.5}
                markerEnd={`url(#ah-${sol.id})`}/>
            : <line x1={12} y1={H/2} x2={dotX} y2={H/2} stroke={color} strokeWidth={3.5}
                markerStart={`url(#ah-${sol.id})`}/>
          }
          {sol.closed
            ? <circle cx={dotX} cy={H/2} r={6} fill={color} stroke="#0f172a" strokeWidth={2}/>
            : <circle cx={dotX} cy={H/2} r={6} fill="#0f172a" stroke={color} strokeWidth={2.5}/>
          }
          <text x={dotX} y={13} textAnchor="middle" fill={color} fontSize={10} fontFamily="monospace">{sol.label}</text>
        </>}
      </svg>
    </div>
  );
}

export default function App() {
  const [open, setOpen] = useState({});
  const toggle = (id) => setOpen(o => ({ ...o, [id]: !o[id] }));

  return (
    <div style={{ minHeight: "100vh", background: "#0b1120", color: "#e2e8f0", fontFamily: "Georgia, serif" }}>
      <style>{`
        * { box-sizing: border-box; }

        .wrapper {
          max-width: 780px;
          margin: 0 auto;
          padding: 1.5rem 1rem 3rem;
        }

        /* ── Header ── */
        .header-main { text-align: center; margin-bottom: 1.8rem; padding: 0 0.5rem; }
        .header-main h1 {
          font-size: clamp(1rem, 4.5vw, 1.6rem);
          color: #f8fafc; letter-spacing: 2px; margin: 0; line-height: 1.3;
        }
        .header-main p { color: #64748b; font-size: clamp(11px, 3vw, 13px); margin: 5px 0 0; font-family: monospace; }

        /* ── Section title ── */
        .section-title {
          font-size: clamp(0.85rem, 3.5vw, 1.05rem);
          color: #93c5fd; font-family: monospace; letter-spacing: 1px;
          margin: 1.8rem 0 1rem; border-left: 3px solid #1e40af; padding-left: 10px;
        }

        /* ── Accordion card ── */
        .card { background: #131e2e; border: 1px solid #1e3a5f; border-radius: 12px; margin-bottom: 0.9rem; overflow: hidden; }
        .card-header {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 14px; cursor: pointer; user-select: none;
          transition: background .15s; -webkit-tap-highlight-color: transparent;
        }
        .card-header:hover, .card-header:active { background: #1a2d45; }

        .badge {
          background: #1e40af; color: #93c5fd; font-family: monospace;
          font-size: clamp(11px, 2.8vw, 13px); border-radius: 6px;
          padding: 3px 8px; font-weight: bold; min-width: 30px;
          text-align: center; flex-shrink: 0;
        }
        .problem-text {
          font-family: monospace; font-size: clamp(0.85rem, 3.5vw, 1rem);
          color: #f1f5f9; flex: 1; min-width: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .interval-badge {
          font-family: monospace; font-size: clamp(9px, 2.5vw, 11px);
          background: #0f2744; color: #38bdf8;
          border: 1px solid #1e3a5f; border-radius: 20px;
          padding: 2px 8px; flex-shrink: 0;
          display: none;
        }
        @media (min-width: 420px) { .interval-badge { display: inline; } }

        .chevron { color: #475569; font-size: 14px; transition: transform .2s; flex-shrink: 0; }
        .chevron.open { transform: rotate(90deg); }

        /* ── Card body ── */
        .body { padding: 0 14px 14px; }
        .steps { background: #0d1929; border-radius: 8px; padding: 10px 12px; margin: 10px 0; overflow-x: auto; }
        .step {
          font-family: monospace; font-size: clamp(11px, 3vw, 13px);
          color: #94a3b8; line-height: 1.9; white-space: nowrap;
        }
        .step:last-child { color: #38bdf8; font-weight: bold; }

        .interval-big {
          text-align: center; font-family: monospace;
          font-size: clamp(12px, 3.2vw, 14px); color: #10b981; margin-top: 8px;
        }
        .nosol { color: #ef4444; font-family: monospace; font-size: clamp(11px, 3vw, 13px); text-align: center; margin: 8px 0; }
        .allreal { color: #10b981; font-family: monospace; font-size: clamp(11px, 3vw, 13px); text-align: center; margin: 8px 0; }

        /* ── App problems ── */
        .app-card {
          background: #131e2e; border: 1px solid #1e3a5f; border-radius: 12px;
          padding: 16px; margin-bottom: 1rem;
        }
        .app-title { font-size: clamp(0.88rem, 3.5vw, 1rem); color: #f1f5f9; margin-bottom: 8px; }
        .data-row { font-family: monospace; font-size: clamp(11px, 3vw, 12px); color: #64748b; margin: 3px 0; }
        .answer-box {
          background: #0d2d1a; border: 1px solid #166534; border-radius: 8px;
          padding: 10px 12px; margin-top: 10px; color: #4ade80;
          font-size: clamp(11px, 3vw, 13px); line-height: 1.5;
        }

        /* ── Tablet tweaks ── */
        @media (min-width: 600px) {
          .wrapper { padding: 2rem 1.5rem 3rem; }
          .card-header { padding: 14px 18px; gap: 14px; }
          .body { padding: 0 18px 16px; }
          .app-card { padding: 18px; }
        }
      `}</style>

      <div className="wrapper">
        <div className="header-main">
          <h1>TAREA 15 — DESIGUALDADES LINEALES</h1>
          <p>Matemáticas Básicas · Cotecnova</p>
        </div>

        <div className="section-title">1. Resolución de Desigualdades</div>

        {solutions.map(sol => (
          <div className="card" key={sol.id}>
            <div className="card-header" onClick={() => toggle(sol.id)}>
              <span className="badge">{sol.id})</span>
              <span className="problem-text">{sol.problem}</span>
              <span className="interval-badge">{sol.interval}</span>
              <span className={`chevron ${open[sol.id] ? "open" : ""}`}>▶</span>
            </div>
            {open[sol.id] && (
              <div className="body">
                <div className="steps">
                  {sol.steps.map((s, i) => <div className="step" key={i}>{s}</div>)}
                </div>
                {sol.noSolution
                  ? <div className="nosol">Sin solución — contradicción.</div>
                  : sol.allReals
                  ? <div className="allreal">Todos los reales (tautología).</div>
                  : <NumberLine sol={sol} />
                }
                <div className="interval-big">Notación de intervalo: {sol.interval}</div>
              </div>
            )}
          </div>
        ))}

        <div className="section-title">2. Ejercicios de Aplicación</div>

        {appProblems.map(p => (
          <div className="app-card" key={p.id}>
            <div className="app-title"><strong>{p.id}) {p.title}</strong></div>
            {p.data.map((d, i) => <div className="data-row" key={i}>• {d}</div>)}
            <div className="steps" style={{ marginTop: 10 }}>
              {p.steps.map((s, i) => (
                <div className="step" key={i}
                  style={i === p.steps.length - 1 ? { color: "#38bdf8", fontWeight: "bold" } : {}}>
                  {s}
                </div>
              ))}
            </div>
            <div className="interval-big" style={{ marginBottom: 4 }}>
              Notación de intervalo: {p.interval}
            </div>
            <div className="answer-box">✔ {p.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}