import { Workflow } from "lucide-react";
import { colors, SOURCE_TYPE_LABELS } from "@/theme/tokens";
import type { CouchbaseTopologySnapshot, MigrationPhase, SourceType } from "@/api/types";

const ACTIVE_PHASES: MigrationPhase[] = ["migrating", "replicating", "verifying"];

interface TopologyNode {
  hostname: string;
  services: string[];
}

export default function TopologyDiagram({
  sourceType,
  sourceLabel,
  destLabel,
  bucket,
  phase,
  throughputLabel,
  destTopology,
}: {
  sourceType: SourceType;
  sourceLabel: string;
  destLabel: string;
  bucket: string;
  phase: MigrationPhase;
  throughputLabel?: string;
  destTopology?: CouchbaseTopologySnapshot | null;
}) {
  const active = ACTIVE_PHASES.includes(phase);

  const destNodes: TopologyNode[] =
    destTopology?.nodes && destTopology.nodes.length > 0
      ? destTopology.nodes.map((n) => ({ hostname: n.hostname, services: n.services }))
      : [{ hostname: destLabel, services: [] }];

  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 0, overflowX: "auto", padding: "6px 2px" }}>
      <NodeCard
        title="Source Cluster"
        accent={colors.cbTeal}
        subtitle={SOURCE_TYPE_LABELS[sourceType] ?? sourceType}
        nodes={[{ hostname: sourceLabel, services: [] }]}
        footer="1 container"
      />
      <FlowArrow active={active} />
      <AgentNode active={active} throughputLabel={throughputLabel} />
      <FlowArrow active={active} />
      <NodeCard
        title="Destination (Capella)"
        accent={colors.cbRed}
        subtitle={destLabel}
        nodes={destNodes}
        footer={`1 bucket (${bucket}) · ${destNodes.length} node${destNodes.length === 1 ? "" : "s"}`}
      />
    </div>
  );
}

function NodeCard({
  title,
  subtitle,
  accent,
  nodes,
  footer,
}: {
  title: string;
  subtitle: string;
  accent: string;
  nodes: TopologyNode[];
  footer: string;
}) {
  return (
    <div style={{ flex: "0 0 210px", background: colors.bg2, border: `1px solid ${colors.borderSubtle}`, borderRadius: 10, overflow: "hidden", alignSelf: "center" }}>
      <div
        style={{
          padding: "8px 12px",
          background: `${accent}22`,
          borderBottom: `1px solid ${accent}55`,
          fontSize: 12.5,
          fontWeight: 700,
          color: colors.textPrimary,
        }}
      >
        {title}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 8 }}>{subtitle}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {nodes.map((n, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 11 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.cbGreen, marginTop: 4, flexShrink: 0 }} />
              <div>
                <div style={{ color: colors.textPrimary, fontWeight: 600 }}>{n.hostname}</div>
                {n.services.length > 0 && <div style={{ color: colors.textMuted, fontSize: 10 }}>{n.services.join(",")}</div>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 10.5, color: colors.textMuted }}>{footer}</div>
      </div>
    </div>
  );
}

function FlowArrow({ active }: { active: boolean }) {
  const color = active ? colors.cbGreen : colors.borderStrong;
  return (
    <div style={{ flex: "1 1 60px", minWidth: 48, display: "flex", alignItems: "center", padding: "0 6px", alignSelf: "center" }}>
      <div style={{ position: "relative", height: 2, width: "100%", background: color }}>
        <div
          style={{
            position: "absolute",
            right: -1,
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderTop: "5px solid transparent",
            borderBottom: "5px solid transparent",
            borderLeft: `7px solid ${color}`,
          }}
        />
        {active &&
          [0, 0.45, 0.9].map((delay) => (
            <span key={delay} className="cb-flow-dot" style={{ animationDelay: `${delay}s` }} />
          ))}
      </div>
    </div>
  );
}

function AgentNode({ active, throughputLabel }: { active: boolean; throughputLabel?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 16px", minWidth: 110, flexShrink: 0 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: colors.cbGreen, marginBottom: 8, height: 14 }}>
        {active ? throughputLabel ?? "" : ""}
      </div>
      <div
        style={{
          width: 62,
          height: 62,
          borderRadius: "50%",
          background: colors.bg2,
          border: `2px solid ${active ? colors.cbGreen : colors.cbRed}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: active ? `0 0 14px ${colors.cbGreen}66` : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <Workflow size={26} color={colors.cbRed} />
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: 0.04,
          textTransform: "uppercase",
          color: colors.textPrimary,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        Onboarding
        <br />
        Agent
      </div>
    </div>
  );
}
