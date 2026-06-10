"use client";

import { phases, yudisiumNodes, type NodeStatus } from "@/data/nodes";

interface TimelineProps {
  getNodeStatus: (id: string) => NodeStatus;
}

function getPhaseStatus(phaseId: number, getNodeStatus: (id: string) => NodeStatus) {
  const phaseNodes = yudisiumNodes.filter((n) => n.phase === phaseId);
  const doneCount = phaseNodes.filter((n) => getNodeStatus(n.id) === "done").length;
  if (doneCount === phaseNodes.length) return "done";
  if (doneCount > 0) return "partial";
  const hasAvailable = phaseNodes.some((n) => getNodeStatus(n.id) === "available");
  if (hasAvailable) return "active";
  return "locked";
}

export function Timeline({ getNodeStatus }: TimelineProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Timeline Fase Yudisium</h2>
      <div className="relative">
        {phases.map((phase, idx) => {
          const status = getPhaseStatus(phase.id, getNodeStatus);
          const phaseNodes = yudisiumNodes.filter((n) => n.phase === phase.id);
          const doneCount = phaseNodes.filter((n) => getNodeStatus(n.id) === "done").length;

          return (
            <div key={phase.id} className="flex items-start gap-4 pb-6 last:pb-0">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold
                    ${status === "done" ? "border-green-500 bg-green-100 text-green-700" : ""}
                    ${status === "partial" ? "border-blue-500 bg-blue-100 text-blue-700" : ""}
                    ${status === "active" ? "border-blue-400 bg-blue-50 text-blue-600" : ""}
                    ${status === "locked" ? "border-gray-300 bg-gray-100 text-gray-400" : ""}
                  `}
                >
                  {status === "done" ? "✓" : idx + 1}
                </div>
                {idx < phases.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 min-h-6 ${
                      status === "done" ? "bg-green-300" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>

              {/* Phase content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-medium ${status === "locked" ? "text-muted-foreground" : ""}`}>
                    {phase.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {doneCount}/{phaseNodes.length}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full max-w-[200px] rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full transition-all ${
                      status === "done" ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{
                      width: `${phaseNodes.length > 0 ? (doneCount / phaseNodes.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
