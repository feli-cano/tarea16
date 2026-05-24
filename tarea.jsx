import { useState } from "react";

const solutions = [
  {
    id: "a",
    problem: "−4x ≥ 2",
    steps: [
      "−4x ≥ 2",
      "x ≤ 2 ÷ (−4)   [÷ número negativo → se invierte la desigualdad]",
      "x ≤ −½",
    ],
    inequality: "≤",
    point: -0.5,
    direction: "left",
    interval: "(−∞, −½]",
    closed: true,
    label: "−½",
  },
  {
    id: "b",
    problem: "3 < 2y + 3",
    steps: ["3 < 2y + 3", "3 − 3 < 2y", "0 < 2y", "y > 0"],
    inequality: ">",
    point: 0,
    direction: "right",
    interval: "(0, +∞)",
    closed: false,
    label: "0",
  },
  {
    id: "c",
    problem: "3(2 − 3x) > 4(1 − 4x)",
    steps: [
      "6 − 9x > 4 − 16x",
      "−9x + 16x > 4 − 6",
      "7x > −2",
      "x > −2/7",
    ],
    inequality: ">",
    point: -2 / 7,
    direction: "right",
    interval: "(−2/7, +∞)",
    closed: false,
    label: "−2/7",
  },
  {
    id: "d",
    problem: "2(4x − 2) > 4(2x + 1)",
    steps: [
      "8x − 4 > 8x + 4",
      "8x − 8x > 4 + 4",
      "0 > 8   [Contradicción: FALSO]",
    ],
    inequality: null,
    point: null,
    direction: null,
    interval: "∅  (conjunto vacío — sin solución)",
    closed: false,
    label: null,
    noSolution: true,
  },
  {
    id: "e",
    problem: "5 − 7s > 3",
    steps: ["−7s > 3 − 5", "−7s > −2", "s < 2/7   [÷ negativo → invierte]"],
    inequality: "<",
    point: 2 / 7,
    direction: "left",
    interval: "(−∞, 2/7)",
    closed: false,
    label: "2/7",
  },
  {
    id: "f",
    problem: "t + 6 ≤ 2 + 3t",
    steps: ["6 − 2 ≤ 3t − t", "4 ≤ 2t", "t ≥ 2"],
    inequality: "≥",
    point: 2,
    direction: "right",
    interval: "[2, +∞)",
    closed: true,
    label: "2",
  },
  {
    id: "g",
    problem: "(5y + 2) / 4 ≤ 2y − 1",
    steps: [
      "5y + 2 ≤ 4(2y − 1)   [× 4]",
      "5y + 2 ≤ 8y − 4",
      "2 + 4 ≤ 8y − 5y",
      "6 ≤ 3y",
      "y ≥ 2",
    ],
    inequality: "≥",
    point: 2,
    direction: "right",
    interval: "[2, +∞)",
    closed: true,
    label: "2",
  },
  {
    id: "h",
    problem: "−3x + 1 ≤ −3(x − 2) + 1",
    steps: [
      "−3x + 1 ≤ −3x + 6 + 1",
      "−3x + 1 ≤ −3x + 7",
      "1 ≤ 7   [Tautología: SIEMPRE VERDADERO]",
    ],
    inequality: null,
    point: null,
    direction: null,
    interval: "(−∞, +∞) = ℝ",
    closed: false,
    label: null,
    allReals: true,
  },
  {
    id: "i",
    problem: "y + y/2 < y/3 + y/5",
    steps: [
      "× 30 (m.c.m. de 1, 2, 3, 5):",
      "30y + 15y < 10y + 6y",
      "45y < 16y",
      "29y < 0",
      "y < 0",
    ],
    inequality: "<",
    point: 0,
    direction: "left",
    interval: "(−∞, 0)",
    closed: false,
    label: "0",
  },
];

const appProblems = [
  {
    id: "2a",
    title: "Problema de Utilidad — Vendedor",
    data: [
      "Ingreso: I = 200 + 0,8S",
      "Meta: I ≥ 4.500",
    ],
    steps: [
      "200 + 0,8S ≥ 4.500",
      "0,8S ≥ 4.500 − 200",
      "0,8S ≥ 4.300",
      "S ≥ 4.300 / 0,8",
      "S ≥ 5.375",
    ],
    answer: "El vendedor debe vender al menos 5.375 productos al mes.",
    interval: "[5.375, +∞)",
  },
  {
    id: "2b",
    title: "Punto de Equilibrio — Empresa ABC",
    data: [
      "Precio unitario: $20.000",
      "Costo unitario: $15.000",
      "Costos fijos: $6.000.000",
    ],
    steps: [
      "Utilidad = Ingreso total − Costo total > 0",
      "Ingreso total = 20.000q",
      "Costo total = 15.000q + 6.000.000",
      "20.000q − (15.000q + 6.000.000) > 0",
      "5.000q − 6.000.000 > 0",
      "5.000q > 6.000.000",
      "q > 6.000.000 / 5.000",
      "q > 1.200",
    ],
    answer: "La empresa debe vender más de 1.200 unidades (mínimo 1.201) para obtener utilidades.",
    interval: "(1.200, +∞)",
  },
];

function NumberLine({ sol }) {
  const W = 280, H = 48, mid = W / 2, scale = 60;
  const px = (v) => mid + v * scale;
  const dotX = sol.point !== null ? px(sol.point) : null;

  if (sol.noSolution) {
    return (
      <div className="nl-wrap">
        <svg width={W} height={H}>
          <line x1={10} y1={H/2} x2={W-10} y2={H/2} stroke="#475569" strokeWidth={2}/>
          <text x={mid} y={H/2+4} textAnchor="middle" fill="#ef4444" fontSize={13} fontFamily="monospace">∅</text>
        </svg>
      </div>
    );
  }

  if (sol.allReals) {
    return (
      <div className="nl-wrap">
        <svg width={W} height={H}>
          <defs>
            <marker id="arr-l" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M6,0 L0,3 L6,6" fill="none" stroke="#10b981" strokeWidth={1.5}/>
            </marker>
            <marker id="arr-r" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="none" stroke="#10b981" strokeWidth={1.5}/>
            </marker>
          </defs>
          <line x1={10} y1={H/2} x2={W-10} y2={H/2} stroke="#475569" strokeWidth={2}/>
          <line x1={20} y1={H/2} x2={W-20} y2={H/2} stroke="#10b981" strokeWidth={3}
            markerStart="url(#arr-l)" markerEnd="url(#arr-r)"/>
          <text x={mid} y={H-6} textAnchor="middle" fill="#10b981" fontSize={11} fontFamily="monospace">ℝ</text>
        </svg>
      </div>
    );
  }

  const color = "#38bdf8";
  const arrowRight = sol.direction === "right";

  return (
    <div className="nl-wrap">
      <svg width={W} height={H}>
        <defs>
          <marker id={`ah-${sol.id}`} markerWidth="8" markerHeight="8" refX="4" refY="4" orient={arrowRight ? "auto" : "auto-start-reverse"}>
            <path d="M0,0 L8,4 L0,8" fill="none" stroke={color} strokeWidth={1.5}/>
          </marker>
        </defs>
        {/* Axis */}
        <line x1={10} y1={H/2} x2={W-10} y2={H/2} stroke="#475569" strokeWidth={2}/>
        {/* Ticks */}
        {[-2,-1,0,1,2].map(v => (
          <g key={v}>
            <line x1={px(v)} y1={H/2-5} x2={px(v)} y2={H/2+5} stroke="#64748b" strokeWidth={1}/>
            <text x={px(v)} y={H-4} textAnchor="middle" fill="#94a3b8" fontSize={9} fontFamily="monospace">{v}</text>
          </g>
        ))}
        {/* Colored line */}
        {arrowRight ? (
          <line
            x1={dotX} y1={H/2} x2={W-10} y2={H/2}
            stroke={color} strokeWidth={3.5}
            markerEnd={`url(#ah-${sol.id})`}
          />
        ) : (
          <line
            x1={10} y1={H/2} x2={dotX} y2={H/2}
            stroke={color} strokeWidth={3.5}
            markerStart={`url(#ah-${sol.id})`}
          />
        )}
        {/* Dot */}
        {sol.closed ? (
          <circle cx={dotX} cy={H/2} r={6} fill={color} stroke="#0f172a" strokeWidth={2}/>
        ) : (
          <circle cx={dotX} cy={H/2} r={6} fill="#0f172a" stroke={color} strokeWidth={2.5}/>
        )}
        {/* Label */}
        <text x={dotX} y={13} textAnchor="middle" fill={color} fontSize={10} fontFamily="monospace">{sol.label}</text>
      </svg>
    </div>
  );
}

export default function App() {
  const [open, setOpen] = useState({});
  const toggle = (id) => setOpen(o => ({ ...o, [id]: !o[id] }));

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b1120",
      color: "#e2e8f0",
      fontFamily: "'Georgia', serif",
      padding: "2rem 1rem",
    }}>
      <style>{`
        .card { background: #131e2e; border: 1px solid #1e3a5f; border-radius: 12px; margin-bottom: 1.2rem; overflow: hidden; }
        .card-header { display: flex; align-items: center; gap: 12px; padding: 14px 18px; cursor: pointer; user-select: none; transition: background .15s; }
        .card-header:hover { background: #1a2d45; }
        .badge { background: #1e40af; color: #93c5fd; font-family: monospace; font-size: 12px; border-radius: 6px; padding: 2px 9px; font-weight: bold; min-width: 28px; text-align: center; }
        .problem-text { font-family: monospace; font-size: 1.05rem; color: #f1f5f9; flex: 1; }
        .interval-badge { font-family: monospace; font-size: 11px; background: #0f2744; color: #38bdf8; border: 1px solid #1e3a5f; border-radius: 20px; padding: 2px 10px; }
        .body { padding: 0 18px 16px; }
        .steps { background: #0d1929; border-radius: 8px; padding: 10px 14px; margin: 10px 0; }
        .step { font-family: monospace; font-size: 13px; color: #94a3b8; line-height: 1.8; }
        .step:last-child { color: #38bdf8; font-weight: bold; }
        .nl-wrap { display: flex; justify-content: center; margin: 8px 0 4px; }
        .row-labels { display: flex; justify-content: space-between; font-size: 11px; color: #64748b; font-family: monospace; margin-top: 2px; }
        .interval-big { text-align: center; font-family: monospace; font-size: 13px; color: #10b981; margin-top: 6px; }
        .section-title { font-size: 1.1rem; color: #93c5fd; font-family: monospace; letter-spacing: 1px; margin: 2rem 0 1rem; border-left: 3px solid #1e40af; padding-left: 12px; }
        .app-card { background: #131e2e; border: 1px solid #1e3a5f; border-radius: 12px; padding: 18px; margin-bottom: 1.2rem; }
        .app-title { font-size: 1rem; color: #f1f5f9; margin-bottom: 10px; }
        .data-row { font-family: monospace; font-size: 12px; color: #64748b; margin: 2px 0; }
        .answer-box { background: #0d2d1a; border: 1px solid #166534; border-radius: 8px; padding: 10px 14px; margin-top: 10px; color: #4ade80; font-size: 13px; }
        .chevron { color: #475569; font-size: 16px; transition: transform .2s; }
        .chevron.open { transform: rotate(90deg); }
        .header-main { text-align: center; margin-bottom: 2rem; }
        .header-main h1 { font-size: 1.5rem; color: #f8fafc; letter-spacing: 2px; margin: 0; }
        .header-main p { color: #64748b; font-size: 13px; margin: 4px 0 0; font-family: monospace; }
        .nosol { color: #ef4444; font-family: monospace; font-size: 12px; text-align: center; margin: 6px 0; }
        .allreal { color: #10b981; font-family: monospace; font-size: 12px; text-align: center; margin: 6px 0; }
      `}</style>

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
                ? <div className="nosol">Sin solución — la desigualdad es una contradicción.</div>
                : sol.allReals
                ? <div className="allreal">Solución: todos los números reales (tautología).</div>
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
          <div className="steps" style={{ marginTop: 12 }}>
            {p.steps.map((s, i) => (
              <div className="step" key={i} style={i === p.steps.length - 1 ? { color: "#38bdf8", fontWeight: "bold" } : {}}>{s}</div>
            ))}
          </div>
          <div className="interval-big" style={{ marginBottom: 4 }}>Notación de intervalo: {p.interval}</div>
          <div className="answer-box">✔ {p.answer}</div>
        </div>
      ))}
    </div>
  );
}