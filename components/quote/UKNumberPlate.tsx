"use client";

export default function UKNumberPlate({
  value,
  front = false,
}: {
  value: string;
  front?: boolean;
}) {
  const display = value.trim().toUpperCase() || "AB12 CDE";
  const isEmpty = !value.trim();

  return (
    <div
      className={`inline-flex items-center rounded-md overflow-hidden select-none transition-all duration-200 ${
        isEmpty ? "opacity-40" : "opacity-100"
      }`}
      style={{
        background: front ? "#fff" : "#FFDA00",
        border: "3px solid #1a1a1a",
        borderRadius: "6px",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.3)",
        minWidth: "220px",
        height: "52px",
        position: "relative",
      }}
    >
      {/* GB badge */}
      <div
        style={{
          width: "36px",
          background: "#003399",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2px",
          flexShrink: 0,
        }}
      >
        {/* EU stars circle */}
        <div style={{ display: "flex", flexWrap: "wrap", width: "18px", justifyContent: "center", gap: "1px" }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            return (
              <div
                key={i}
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  background: "#FFDA00",
                  position: "absolute",
                  left: `${18 + 8 * Math.cos(angle - Math.PI / 2)}px`,
                  top: `${8 + 7 * Math.sin(angle - Math.PI / 2)}px`,
                }}
              />
            );
          })}
        </div>
        <span
          style={{
            color: "#FFDA00",
            fontSize: "11px",
            fontWeight: "900",
            letterSpacing: "0.5px",
            fontFamily: "Arial Black, sans-serif",
            marginTop: "12px",
          }}
        >
          GB
        </span>
      </div>

      {/* Plate text */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingRight: "8px",
        }}
      >
        <span
          style={{
            fontFamily: '"UKNumberPlate", "Arial Black", "Impact", sans-serif',
            fontSize: "28px",
            fontWeight: "900",
            letterSpacing: "4px",
            color: "#1a1a1a",
            textShadow: "none",
            lineHeight: 1,
          }}
        >
          {display}
        </span>
      </div>
    </div>
  );
}
