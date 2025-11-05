import React, { useMemo, useState } from "react";

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function makeGrid(rows, cols, fill = null) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));
}

export default function App() {
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(8);
  const [size, setSize] = useState(42);
  const [gap, setGap] = useState(6);
  const [color, setColor] = useState("#3b82f6");
  const [grid, setGrid] = useState(() => makeGrid(8, 8));

  const colors = [
    "#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6",
    "#ec4899", "#14b8a6", "#f43f5e", "#eab308", "#64748b"
  ];

  React.useEffect(() => {
    setGrid((g) => {
      const R = clamp(rows, 1, 60);
      const C = clamp(cols, 1, 60);
      const next = makeGrid(R, C, null);
      for (let r = 0; r < Math.min(R, g.length); r++) {
        for (let c = 0; c < Math.min(C, g[0]?.length ?? 0); c++) next[r][c] = g[r][c];
      }
      return next;
    });
  }, [rows, cols]);

  const gridStyle = useMemo(() => ({
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${size}px)`,
    gridTemplateRows: `repeat(${rows}, ${size}px)`,
    gap: `${gap}px`,
  }), [rows, cols, size, gap]);

  function paint(r, c) {
    setGrid((g) => {
      const next = g.map((row) => row.slice());
      next[r][c] = next[r][c] === color ? null : color;
      return next;
    });
  }

  function clearAll() { setGrid(makeGrid(rows, cols, null)); }
  function fillAll() { setGrid(makeGrid(rows, cols, color)); }
  function checker() {
    setGrid(() => {
      const out = makeGrid(rows, cols, null);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if ((r + c) % 2 === 0) out[r][c] = color;
      return out;
    });
  }

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #f8fafc, #ffffff)",
      color: "#0f172a",
      padding: 24,
      boxSizing: "border-box",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    },
    container: { maxWidth: 1024, margin: "0 auto" },
    h1: { fontSize: 28, fontWeight: 600, margin: "0 0 4px" },
    sub: { fontSize: 12, color: "#64748b", margin: 0 },
    section: { marginTop: 16 },
    panel: {
      border: "1px solid #e2e8f0",
      borderRadius: 16,
      background: "#fff",
      padding: 16,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    },
    controlsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: 12,
      alignItems: "end",
    },
    label: { fontSize: 12, color: "#64748b", display: "block", marginBottom: 6 },
    input: {
      width: "100%",
      padding: "8px 10px",
      borderRadius: 10,
      border: "1px solid #cbd5e1",
      fontSize: 14,
      outline: "none",
    },
    range: { width: "100%" },
    btnRow: { display: "flex", gap: 8, flexWrap: "wrap" },
    btn: {
      padding: "8px 12px",
      borderRadius: 12,
      border: "1px solid #cbd5e1",
      background: "#f8fafc",
      cursor: "pointer",
      fontSize: 13,
    },
    paletteRow: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
    swatch: (active, c) => ({
      width: 24,
      height: 24,
      borderRadius: 999,
      border: "1px solid #cbd5e1",
      outline: active ? "2px solid #334155" : "none",
      outlineOffset: 2,
      background: c,
      cursor: "pointer",
    }),
    gridWrap: { padding: 16 },
    gridItem: (bg) => ({
      width: size,
      height: size,
      background: bg ?? "white",
      borderRadius: 8,
      outline: "1px solid #e2e8f0",
      transition: "outline-width 120ms ease",
      cursor: "pointer",
    }),
    footer: { textAlign: "center", fontSize: 12, color: "#64748b", marginTop: 12 },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header>
          <h1 style={styles.h1}>Simple Grid</h1>
          <p style={styles.sub}>A colorful, interactive grid built with React + CSS Grid.</p>
        </header>

        <section style={{ ...styles.section, ...styles.panel }}>
          <div style={styles.controlsGrid}>
            <div>
              <label style={styles.label}>Rows</label>
              <input type="number" min={1} max={60} value={rows}
                     onChange={(e) => setRows(clamp(parseInt(e.target.value || "0"), 1, 60))}
                     style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Columns</label>
              <input type="number" min={1} max={60} value={cols}
                     onChange={(e) => setCols(clamp(parseInt(e.target.value || "0"), 1, 60))}
                     style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Cell size ({size}px)</label>
              <input type="range" min={20} max={72} step={2} value={size}
                     onChange={(e) => setSize(parseInt(e.target.value))}
                     style={styles.range} />
            </div>
            <div>
              <label style={styles.label}>Gap ({gap}px)</label>
              <input type="range" min={0} max={24} step={1} value={gap}
                     onChange={(e) => setGap(parseInt(e.target.value))}
                     style={styles.range} />
            </div>
            <div style={styles.btnRow}>
              <button onClick={clearAll} style={styles.btn}>Clear</button>
              <button onClick={fillAll} style={styles.btn}>Fill</button>
              <button onClick={checker} style={styles.btn}>Checkerboard</button>
            </div>
          </div>
        </section>

        <section style={{ ...styles.section, ...styles.panel }}>
          <div style={styles.paletteRow}>
            {colors.map((c) => (
              <button key={c} onClick={() => setColor(c)} aria-label={`choose ${c}`}
                      style={styles.swatch(color === c, c)} />
            ))}
            <span style={{ fontSize: 12, color: "#64748b" }}>Active color: <span style={{ fontWeight: 600 }}>{color}</span></span>
          </div>
        </section>

        <section style={{ ...styles.section, ...styles.panel }}>
          <div style={{ overflow: "auto" }}>
            <div style={gridStyle}>
              {grid.map((row, r) =>
                row.map((cellColor, c) => (
                  <button key={`${r}-${c}`} title={`(${r}, ${c})`} onClick={() => paint(r, c)}
                          onMouseEnter={(e) => { if (e.buttons === 1) paint(r, c); }}
                          style={styles.gridItem(cellColor)} />
                ))
              )}
            </div>
          </div>
        </section>

        <footer style={styles.footer}>Built with React + CSS Grid.</footer>
      </div>
    </div>
  );
}
