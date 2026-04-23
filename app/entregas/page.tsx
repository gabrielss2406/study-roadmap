"use client";
// app/entregas/page.tsx
import { useState, useEffect } from "react";
import { QUARTERS, getQuarterByMonth, ALL_MONTHS } from "@/lib/data";

type Status = "PENDING" | "IN_PROGRESS" | "DONE";

type Deliverable = {
  id: string;
  monthId: string;
  title: string;
  status: Status;
  notes: string | null;
  link: string | null;
  createdAt: string;
  updatedAt: string;
};

const STATUS_LABELS: Record<Status, string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em progresso",
  DONE: "Concluído",
};

const STATUS_COLORS: Record<Status, string> = {
  PENDING: "#475569",
  IN_PROGRESS: "#F59E0B",
  DONE: "#10B981",
};

const STATUS_BG: Record<Status, string> = {
  PENDING: "#47556920",
  IN_PROGRESS: "#F59E0B20",
  DONE: "#10B98120",
};

function getMonthColor(monthId: string) {
  return getQuarterByMonth(monthId)?.color ?? "#4F6EF7";
}

function getMonthLabel(monthId: string) {
  return ALL_MONTHS.find((m) => m.id === monthId)?.label ?? monthId;
}

function getMonthTitle(monthId: string) {
  return ALL_MONTHS.find((m) => m.id === monthId)?.title ?? "";
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function Modal({
  item,
  onClose,
  onSave,
  onDelete,
}: {
  item: Deliverable;
  onClose: () => void;
  onSave: (id: string, patch: Partial<Deliverable>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(item.title);
  const [notes, setNotes] = useState(item.notes ?? "");
  const [link, setLink] = useState(item.link ?? "");
  const [status, setStatus] = useState<Status>(item.status);
  const [saving, setSaving] = useState(false);

  const color = getMonthColor(item.monthId);

  const handleSave = async () => {
    setSaving(true);
    await onSave(item.id, { title, notes: notes || null, link: link || null, status });
    setSaving(false);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "#000000cc",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: "#0d1420", border: `1px solid ${color}40`,
        borderRadius: 12, width: "100%", maxWidth: 500, padding: 24,
        boxShadow: `0 0 40px ${color}20`,
      }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, color, fontFamily: "monospace", letterSpacing: 1, marginBottom: 4 }}>
              {getMonthLabel(item.monthId).toUpperCase()} · {getMonthTitle(item.monthId)}
            </div>
            <div style={{ fontSize: 16, color: "#f1f5f9" }}>Editar Entregável</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", fontSize: 20, lineHeight: 1 }}>×</button>
        </div>

        {/* Title */}
        <label style={{ display: "block", marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "#475569", letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>Título</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%", padding: "9px 12px", borderRadius: 6,
              background: "#0a0f1a", border: "1px solid #1a2234",
              color: "#e2e8f0", fontSize: 13, outline: "none",
              fontFamily: "Georgia, serif",
            }} />
        </label>

        {/* Status */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "#475569", letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>Status</div>
          <div style={{ display: "flex", gap: 8 }}>
            {(["PENDING", "IN_PROGRESS", "DONE"] as Status[]).map((s) => (
              <button key={s} onClick={() => setStatus(s)} style={{
                flex: 1, padding: "7px 0", borderRadius: 6, fontSize: 11,
                background: status === s ? STATUS_BG[s] : "#0a0f1a",
                border: `1px solid ${status === s ? STATUS_COLORS[s] : "#1a2234"}`,
                color: status === s ? STATUS_COLORS[s] : "#64748b",
                transition: "all 0.15s",
              }}>
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <label style={{ display: "block", marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "#475569", letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>Notas</div>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            placeholder="O que você produziu, aprendeu, dificuldades..."
            style={{
              width: "100%", padding: "9px 12px", borderRadius: 6,
              background: "#0a0f1a", border: "1px solid #1a2234",
              color: "#e2e8f0", fontSize: 13, outline: "none", resize: "vertical",
              fontFamily: "Georgia, serif",
            }} />
        </label>

        {/* Link */}
        <label style={{ display: "block", marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "#475569", letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>Link (GitHub, doc, artigo...)</div>
          <input value={link} onChange={(e) => setLink(e.target.value)}
            placeholder="https://"
            style={{
              width: "100%", padding: "9px 12px", borderRadius: 6,
              background: "#0a0f1a", border: "1px solid #1a2234",
              color: "#e2e8f0", fontSize: 13, outline: "none",
              fontFamily: "monospace",
            }} />
        </label>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 1, padding: "10px 0", borderRadius: 6, fontSize: 13,
            background: color, border: "none", color: "#fff",
            opacity: saving ? 0.6 : 1, transition: "opacity 0.15s",
          }}>
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button onClick={async () => { await onDelete(item.id); onClose(); }} style={{
            padding: "10px 16px", borderRadius: 6, fontSize: 13,
            background: "#0a0f1a", border: "1px solid #2d3748", color: "#ef4444",
          }}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ── New deliverable form ───────────────────────────────────────────────────────
function AddForm({ onAdd }: { onAdd: (d: Deliverable) => void }) {
  const [monthId, setMonthId] = useState("m1");
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const color = getMonthColor(monthId);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSaving(true);
    const res = await fetch("/api/deliverables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthId, title: title.trim() }),
    });
    const d = await res.json();
    onAdd(d);
    setTitle("");
    setOpen(false);
    setSaving(false);
  };

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "9px 16px", borderRadius: 8,
      background: "#0d1420", border: "1px dashed #2d3748",
      color: "#64748b", fontSize: 13, transition: "all 0.15s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4F6EF7"; e.currentTarget.style.color = "#4F6EF7"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2d3748"; e.currentTarget.style.color = "#64748b"; }}>
      <span style={{ fontSize: 16 }}>+</span> Novo entregável
    </button>
  );

  return (
    <div style={{
      padding: 16, background: "#0d1420",
      border: `1px solid ${color}50`, borderRadius: 10,
      display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end",
    }}>
      <div style={{ flex: "0 0 auto" }}>
        <div style={{ fontSize: 9, color: "#475569", letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 5 }}>Mês</div>
        <select value={monthId} onChange={(e) => setMonthId(e.target.value)}
          style={{
            padding: "7px 10px", borderRadius: 6,
            background: "#0a0f1a", border: "1px solid #1a2234",
            color: "#e2e8f0", fontSize: 12, outline: "none", fontFamily: "monospace",
          }}>
          {ALL_MONTHS.map((m) => (
            <option key={m.id} value={m.id}>{m.label} — {m.title}</option>
          ))}
        </select>
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 9, color: "#475569", letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 5 }}>Título</div>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="Descreva o entregável..."
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{
            width: "100%", padding: "7px 10px", borderRadius: 6,
            background: "#0a0f1a", border: "1px solid #1a2234",
            color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "Georgia, serif",
          }} />
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={handleSubmit} disabled={saving || !title.trim()} style={{
          padding: "7px 16px", borderRadius: 6, fontSize: 12,
          background: color, border: "none", color: "#fff",
          opacity: saving || !title.trim() ? 0.5 : 1,
        }}>{saving ? "..." : "Adicionar"}</button>
        <button onClick={() => setOpen(false)} style={{
          padding: "7px 12px", borderRadius: 6, fontSize: 12,
          background: "#0a0f1a", border: "1px solid #1a2234", color: "#64748b",
        }}>Cancelar</button>
      </div>
    </div>
  );
}

// ── Kanban column ──────────────────────────────────────────────────────────────
function KanbanCol({
  status, items, onOpen,
}: {
  status: Status;
  items: Deliverable[];
  onOpen: (d: Deliverable) => void;
}) {
  const color = STATUS_COLORS[status];
  return (
    <div style={{ flex: 1, minWidth: 220 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        <span style={{ fontSize: 12, color, fontFamily: "monospace" }}>{STATUS_LABELS[status]}</span>
        <span style={{
          marginLeft: "auto", fontSize: 10, padding: "1px 7px", borderRadius: 8,
          background: color + "20", color, fontFamily: "monospace",
        }}>{items.length}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((d) => {
          const mc = getMonthColor(d.monthId);
          return (
            <div key={d.id} onClick={() => onOpen(d)}
              style={{
                padding: 14, background: "#0d1420",
                border: "1px solid #1a2234", borderRadius: 8,
                cursor: "pointer", transition: "border-color 0.15s",
                borderLeft: `3px solid ${mc}`,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = mc; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1a2234"; (e.currentTarget as HTMLDivElement).style.borderLeftColor = mc; }}>
              <div style={{ fontSize: 9, color: mc, fontFamily: "monospace", letterSpacing: 1, marginBottom: 5 }}>
                {getMonthLabel(d.monthId).toUpperCase()}
              </div>
              <div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.4, marginBottom: d.notes ? 8 : 0 }}>{d.title}</div>
              {d.notes && (
                <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4, marginTop: 6,
                  overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                  {d.notes}
                </div>
              )}
              {d.link && (
                <div style={{ marginTop: 8 }}>
                  <a href={d.link} target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: 10, color: mc, fontFamily: "monospace", textDecoration: "none" }}>
                    → link
                  </a>
                </div>
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <div style={{
            padding: "20px 0", textAlign: "center",
            color: "#2d3748", fontSize: 12, fontStyle: "italic",
            border: "1px dashed #1a2234", borderRadius: 8,
          }}>vazio</div>
        )}
      </div>
    </div>
  );
}

// ── List row ───────────────────────────────────────────────────────────────────
function ListRow({ d, onOpen }: { d: Deliverable; onOpen: (d: Deliverable) => void }) {
  const mc = getMonthColor(d.monthId);
  const sc = STATUS_COLORS[d.status];
  return (
    <div onClick={() => onOpen(d)}
      style={{
        display: "grid",
        gridTemplateColumns: "90px 1fr 110px 80px",
        gap: 16, padding: "12px 16px",
        background: "#0d1420", border: "1px solid #1a2234",
        borderRadius: 8, cursor: "pointer", alignItems: "center",
        transition: "border-color 0.15s",
        borderLeft: `3px solid ${mc}`,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = mc; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1a2234"; (e.currentTarget as HTMLDivElement).style.borderLeftColor = mc; }}>
      <div style={{ fontSize: 10, color: mc, fontFamily: "monospace" }}>
        {getMonthLabel(d.monthId)}
      </div>
      <div>
        <div style={{ fontSize: 13, color: "#e2e8f0" }}>{d.title}</div>
        {d.notes && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{d.notes.slice(0, 60)}{d.notes.length > 60 ? "..." : ""}</div>}
      </div>
      <div style={{
        fontSize: 10, padding: "3px 10px", borderRadius: 20,
        background: sc + "20", color: sc, fontFamily: "monospace",
        textAlign: "center",
      }}>{STATUS_LABELS[d.status]}</div>
      <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", textAlign: "right" }}>
        {new Date(d.updatedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function EntregasPage() {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [editing, setEditing] = useState<Deliverable | null>(null);
  const [filterQ, setFilterQ] = useState<string>("all");

  useEffect(() => {
    fetch("/api/deliverables")
      .then((r) => r.json())
      .then(setDeliverables)
      .catch(console.error);
  }, []);

  const handleAdd = (d: Deliverable) => setDeliverables((prev) => [...prev, d]);

  const handleSave = async (id: string, patch: Partial<Deliverable>) => {
    const res = await fetch(`/api/deliverables/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const updated = await res.json();
    setDeliverables((prev) => prev.map((d) => (d.id === id ? updated : d)));
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/deliverables/${id}`, { method: "DELETE" });
    setDeliverables((prev) => prev.filter((d) => d.id !== id));
  };

  // Filter by quarter
  const filtered = filterQ === "all"
    ? deliverables
    : deliverables.filter((d) => {
        const q = getQuarterByMonth(d.monthId);
        return q?.id === filterQ;
      });

  const byStatus = (s: Status) => filtered.filter((d) => d.status === s);

  const stats = {
    total: deliverables.length,
    done: deliverables.filter((d) => d.status === "DONE").length,
    inProgress: deliverables.filter((d) => d.status === "IN_PROGRESS").length,
  };

  return (
    <div style={{ minHeight: "calc(100vh - 52px)", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{
        padding: "20px 28px 16px", borderBottom: "1px solid #1a2234",
        background: "#0a0f1a",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#10B981", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>
            Gestão · 2025–2026
          </div>
          <h1 style={{ fontSize: 20, fontWeight: "normal", color: "#f1f5f9" }}>Entregáveis</h1>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { label: "Total", val: stats.total, color: "#64748b" },
            { label: "Em progresso", val: stats.inProgress, color: "#F59E0B" },
            { label: "Concluídos", val: stats.done, color: "#10B981" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: "bold", color, fontFamily: "monospace" }}>{val}</div>
              <div style={{ fontSize: 9, color: "#475569", fontFamily: "monospace" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        padding: "12px 28px", borderBottom: "1px solid #1a2234",
        background: "#0a0f1a",
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
      }}>
        {/* Quarter filter */}
        <div style={{ display: "flex", gap: 4 }}>
          {[{ id: "all", label: "Todos" }, ...QUARTERS.map((q) => ({ id: q.id, label: q.label }))].map(({ id, label }) => {
            const q = QUARTERS.find((q) => q.id === id);
            const active = filterQ === id;
            return (
              <button key={id} onClick={() => setFilterQ(id)} style={{
                padding: "5px 12px", borderRadius: 6, fontSize: 11,
                background: active ? (q?.color ?? "#4F6EF7") + "20" : "transparent",
                border: `1px solid ${active ? (q?.color ?? "#4F6EF7") : "#1a2234"}`,
                color: active ? (q?.color ?? "#4F6EF7") : "#64748b",
                fontFamily: "monospace", transition: "all 0.15s",
              }}>{label}</button>
            );
          })}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {(["kanban", "list"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "5px 12px", borderRadius: 6, fontSize: 11,
              background: view === v ? "#4F6EF720" : "transparent",
              border: `1px solid ${view === v ? "#4F6EF7" : "#1a2234"}`,
              color: view === v ? "#4F6EF7" : "#64748b",
              fontFamily: "monospace", transition: "all 0.15s",
            }}>{v === "kanban" ? "Kanban" : "Lista"}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "24px 28px", overflowX: "auto" }}>
        <div style={{ marginBottom: 20 }}>
          <AddForm onAdd={handleAdd} />
        </div>

        {view === "kanban" ? (
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", minWidth: 680 }}>
            {(["PENDING", "IN_PROGRESS", "DONE"] as Status[]).map((s) => (
              <KanbanCol key={s} status={s} items={byStatus(s)} onOpen={setEditing} />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 860 }}>
            {/* List header */}
            <div style={{
              display: "grid", gridTemplateColumns: "90px 1fr 110px 80px",
              gap: 16, padding: "6px 16px",
              fontSize: 9, color: "#475569", fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase",
            }}>
              <span>Mês</span><span>Entregável</span><span>Status</span><span style={{ textAlign: "right" }}>Atualizado</span>
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#2d3748", fontStyle: "italic" }}>
                Nenhum entregável ainda
              </div>
            )}
            {filtered.map((d) => (
              <ListRow key={d.id} d={d} onOpen={setEditing} />
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <Modal item={editing} onClose={() => setEditing(null)} onSave={handleSave} onDelete={handleDelete} />
      )}
    </div>
  );
}
