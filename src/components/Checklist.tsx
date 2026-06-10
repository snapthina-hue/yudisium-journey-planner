"use client";

import { yudisiumNodes, type YudisiumNode, type NodeStatus } from "@/data/nodes";
import { NodeCard } from "./NodeCard";
import type { FilterType } from "./FilterBar";

interface ChecklistProps {
  getNodeStatus: (id: string) => NodeStatus;
  onToggle: (id: string) => void;
  onSelect: (node: YudisiumNode) => void;
  filter: FilterType;
}

export function Checklist({ getNodeStatus, onToggle, onSelect, filter }: ChecklistProps) {
  const filteredNodes = yudisiumNodes.filter((node) => {
    if (filter === "all") return true;
    if (filter === "online") return node.mode === "online";
    if (filter === "campus") return node.mode === "campus";
    if (filter === "hybrid") return node.mode === "hybrid";
    if (filter === "parallel") return node.type === "parallel";
    if (filter === "sequential") return node.type === "sequential";
    return true;
  });

  const parallelNodes = filteredNodes.filter((n) => n.type === "parallel");
  const sequentialNodes = filteredNodes.filter((n) => n.type === "sequential" || n.type === "final");

  return (
    <div className="space-y-6">
      {parallelNodes.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-teal-500" />
            Tugas Paralel
            <span className="text-xs font-normal text-muted-foreground">(bisa dikerjakan bersamaan)</span>
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {parallelNodes.map((node) => (
              <NodeCard
                key={node.id}
                node={node}
                status={getNodeStatus(node.id)}
                onToggle={onToggle}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}

      {sequentialNodes.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-indigo-500" />
            Tugas Berurutan
            <span className="text-xs font-normal text-muted-foreground">(harus mengikuti urutan)</span>
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {sequentialNodes.map((node) => (
              <NodeCard
                key={node.id}
                node={node}
                status={getNodeStatus(node.id)}
                onToggle={onToggle}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}

      {filteredNodes.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Tidak ada tugas yang sesuai filter.
        </p>
      )}
    </div>
  );
}
