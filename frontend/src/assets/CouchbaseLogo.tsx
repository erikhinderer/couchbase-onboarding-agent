export function CouchbaseWordmark() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 30, height: 30, borderRadius: 8,
          background: "linear-gradient(135deg, var(--cb-red), var(--cb-red-bright))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, fontSize: 15, color: "white",
        }}
      >
        C
      </div>
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: "var(--text-primary)" }}>Couchbase</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, letterSpacing: 0.02, whiteSpace: "nowrap" }}>
          Onboarding Agent
        </div>
      </div>
    </div>
  );
}
