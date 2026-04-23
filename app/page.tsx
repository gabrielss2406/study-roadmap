"use client";
// app/page.tsx
import { useState, useEffect, useCallback } from "react";
import { QUARTERS } from "@/lib/data";

type CheckMap = Record<string, boolean>;

function ring(pct: number, size: number, color: string, stroke = 3) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a2234" strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct / 100)}
        style={{ transition: "stroke-dashoffset 0.5s ease" }} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
        fill="#94a3b8" fontSize={size * 0.22} fontFamily="monospace"
        style={{ transform: `rotate(90deg)`, transformOrigin: `${cx}px ${cy}px` }}>
        {pct}%
      </text>
    </svg>
  );
}

export default function TimelinePage() {
  const [checked, setChecked] = useState<CheckMap>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ m1: true });
  const [activeQ, setActiveQ] = useState("q1");
  const [saving, setSaving] = useState<string | null>(null);

  // Load from API
  useEffect(() => {
    fetch("/api/topics")
      .then((r) => r.json())
      .then(setChecked)
      .catch(console.error);
  }, []);

  const toggleTopic = useCallback(async (monthId: string, idx: number) => {
    const key = `${monthId}-${idx}`;
    const newVal = !checked[key];
    setChecked((prev) => ({ ...prev, [key]: newVal }));
    setSaving(key);
    try {
      await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, done: newVal }),
      });
    } catch (e) {
      console.error(e);
      setChecked((prev) => ({ ...prev, [key]: !newVal })); // rollback
    } finally {
      setSaving(null);
    }
  }, [checked]);

  const monthPct = (monthId: string, count: number) => {
    const done = Array.from({ length: count }, (_, i) => checked[`${monthId}-${i}`]).filter(Boolean).length;
    return { done, total: count, pct: count === 0 ? 0 : Math.round((done / count) * 100) };
  };

  const qPct = (q: typeof QUARTERS[0]) => {
    const all = q.months_data.flatMap((m, _) => m.topics.map((_, i) => `${m.id}-${i}`));
    const done = all.filter((k) => checked[k]).length;
    return all.length === 0 ? 0 : Math.round((done / all.length) * 100);
  };

  const totalPct = () => {
    const all = QUARTERS.flatMap((q) => q.months_data.flatMap((m) => m.topics.map((_, i) => `${m.id}-${i}`)));
    const done = all.filter((k) => checked[k]).length;
    return all.length === 0 ? 0 : Math.round((done / all.length) * 100);
  };

  const aqData = QUARTERS.find((q) => q.id === activeQ)!;
  const total = totalPct();

  return (
    <div style={{ minHeight: "calc(100vh - 52px)", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{
        padding: "20px 28px 16px",
        borderBottom: "1px solid #1a2234",
        background: "#0a0f1a",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#4F6EF7", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>
            Arquitetura de Software · 2025–2026
          </div>
          <h1 style={{ fontSize: 20, fontWeight: "normal", color: "#f1f5f9" }}>
            Linha do Tempo
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>progresso geral</div>
            <div style={{ fontSize: 24, fontWeight: "bold", color: "#f1f5f9", fontFamily: "monospace" }}>{total}%</div>
          </div>
          {ring(total, 52, "#4F6EF7", 4)}
        </div>
      </div>

      {/* Quarter tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1a2234", background: "#0a0f1a", overflowX: "auto" }}>
        {QUARTERS.map((q) => {
          const pct = qPct(q);
          const active = activeQ === q.id;
          return (
            <button key={q.id} onClick={() => setActiveQ(q.id)} style={{
              flex: 1, minWidth: 110, padding: "12px 16px",
              background: active ? q.tint : "transparent",
              border: "none",
              borderBottom: active ? `2px solid ${q.color}` : "2px solid transparent",
              opacity: active ? 1 : 0.5,
              transition: "all 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                <span style={{ fontSize: 11, fontWeight: "bold", color: q.color, fontFamily: "monospace" }}>{q.label}</span>
                <span style={{ fontSize: 9, color: "#94a3b8", fontFamily: "monospace" }}>M{q.months}</span>
              </div>
              <div style={{ fontSize: 11, color: active ? "#e2e8f0" : "#64748b", marginTop: 2 }}>{q.title}</div>
              <div style={{ marginTop: 6, height: 2, background: "#1a2234", borderRadius: 1 }}>
                <div style={{ height: "100%", background: q.color, width: `${pct}%`, borderRadius: 1, transition: "width 0.4s" }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div style={{ flex: 1, maxWidth: 820, width: "100%", margin: "0 auto", padding: "28px 20px" }}>

        {/* Quarter title */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", background: aqData.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: "bold", color: "#fff", fontFamily: "monospace", flexShrink: 0,
          }}>{aqData.label}</div>
          <div>
            <div style={{ fontSize: 18, color: "#f1f5f9" }}>{aqData.title}</div>
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", marginTop: 2 }}>
              Meses {aqData.months} · {qPct(aqData)}% concluído
            </div>
          </div>
        </div>

        {/* Months */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 21, top: 0, bottom: 0, width: 2, background: "#1a2234" }} />

          {aqData.months_data.map((month, mi) => {
            const prog = monthPct(month.id, month.topics.length);
            const isOpen = expanded[month.id];
            const isDone = prog.pct === 100;
            const inProgress = prog.done > 0 && !isDone;

            return (
              <div key={month.id} style={{
                position: "relative", paddingLeft: 52, marginBottom: 16,
                animation: `fadeUp 0.3s ease ${mi * 0.06}s both`,
              }}>
                {/* Timeline dot */}
                <div style={{
                  position: "absolute", left: 10, top: 16,
                  width: 24, height: 24, borderRadius: "50%",
                  background: isDone ? aqData.color : "#0a0f1a",
                  border: `2px solid ${isDone ? aqData.color : inProgress ? aqData.color : "#2d3748"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: 1, transition: "all 0.3s",
                }}>
                  {isDone && (
                    <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {inProgress && (
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: aqData.color, animation: "pulse 2s infinite",
                    }} />
                  )}
                </div>

                {/* Card */}
                <div style={{
                  background: "#0d1420",
                  border: `1px solid ${isOpen ? aqData.color + "50" : "#1a2234"}`,
                  borderRadius: 10, overflow: "hidden", transition: "border-color 0.2s",
                }}>
                  {/* Card header */}
                  <button onClick={() => setExpanded((p) => ({ ...p, [month.id]: !isOpen }))}
                    style={{
                      width: "100%", padding: "14px 18px",
                      background: "none", border: "none",
                      display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                    }}>
                    {ring(prog.pct, 36, aqData.color, 3)}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 10, color: aqData.color, fontFamily: "monospace", letterSpacing: 1 }}>
                          {month.label.toUpperCase()}
                        </span>
                        <span style={{
                          fontSize: 9, padding: "1px 6px", borderRadius: 8,
                          background: aqData.color + "20", color: aqData.color, fontFamily: "monospace",
                        }}>{prog.done}/{prog.total}</span>
                      </div>
                      <div style={{ fontSize: 14, color: "#f1f5f9", marginTop: 2 }}>{month.title}</div>
                    </div>
                    <svg width={16} height={16} viewBox="0 0 16 16" fill="none"
                      style={{ flexShrink: 0, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>
                      <path d="M6 4l4 4-4 4" stroke="#64748b" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div style={{ borderTop: "1px solid #1a2234" }}>
                      {/* Topics */}
                      {month.topics.map((topic, ti) => {
                        const key = `${month.id}-${ti}`;
                        const done = !!checked[key];
                        const isSaving = saving === key;
                        return (
                          <div key={ti} onClick={() => toggleTopic(month.id, ti)}
                            style={{
                              display: "flex", alignItems: "center", gap: 12,
                              padding: "10px 18px", cursor: "pointer",
                              background: "transparent", transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#ffffff08")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <div style={{
                              width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                              border: `1.5px solid ${done ? aqData.color : "#2d3748"}`,
                              background: done ? aqData.color : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all 0.2s",
                              opacity: isSaving ? 0.5 : 1,
                            }}>
                              {done && (
                                <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
                                  <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span style={{
                              fontSize: 13, color: done ? "#475569" : "#cbd5e1",
                              textDecoration: done ? "line-through" : "none",
                              transition: "all 0.2s",
                            }}>{topic.label}</span>
                          </div>
                        );
                      })}

                      {/* Footer */}
                      <div style={{
                        borderTop: "1px solid #1a2234", padding: "12px 18px",
                        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
                      }}>
                        <div>
                          <div style={{ fontSize: 9, color: "#475569", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4, fontFamily: "monospace" }}>Recurso</div>
                          <div style={{ fontSize: 11, color: aqData.color, fontStyle: "italic" }}>{month.resource}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 9, color: "#475569", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4, fontFamily: "monospace" }}>Entregável</div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>{month.deliverable}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "10px 28px", borderTop: "1px solid #1a2234", background: "#0a0f1a",
        display: "flex", justifyContent: "space-between",
        fontSize: 11, color: "#475569", fontFamily: "monospace",
      }}>
        <span>2025 – 2026 · Roadmap Pessoal</span>
        <span style={{ color: "#4F6EF7" }}>
          {Object.values(checked).filter(Boolean).length} tópicos concluídos
        </span>
      </div>
    </div>
  );
}
