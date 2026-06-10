"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { YudisiumNode, NodeStatus } from "@/data/nodes";

interface NodeCardProps {
  node: YudisiumNode;
  status: NodeStatus;
  onToggle: (id: string) => void;
  onSelect: (node: YudisiumNode) => void;
}

function getModeBadgeVariant(mode: string) {
  switch (mode) {
    case "online":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "campus":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "hybrid":
      return "bg-teal-100 text-teal-800 border-teal-200";
    case "offline":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "waiting":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getModeLabel(mode: string) {
  switch (mode) {
    case "online":
      return "Online";
    case "campus":
      return "Kampus";
    case "hybrid":
      return "Hybrid";
    case "offline":
      return "Mandiri";
    case "waiting":
      return "Menunggu";
    default:
      return mode;
  }
}

function getStatusStyles(status: NodeStatus) {
  switch (status) {
    case "done":
      return "border-green-300 bg-green-50";
    case "available":
      return "border-blue-300 bg-blue-50 hover:bg-blue-100 cursor-pointer";
    case "locked":
      return "border-gray-200 bg-gray-50 opacity-60";
    default:
      return "";
  }
}

function getTypeBadge(type: string) {
  switch (type) {
    case "parallel":
      return "bg-teal-100 text-teal-800 border-teal-200";
    case "sequential":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "final":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "";
  }
}

export function NodeCard({ node, status, onToggle, onSelect }: NodeCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 transition-all ${getStatusStyles(status)}`}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <Checkbox
            checked={status === "done"}
            disabled={status === "locked"}
            onCheckedChange={() => onToggle(node.id)}
            aria-label={`Mark ${node.title} as complete`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-medium text-sm ${status === "done" ? "line-through text-muted-foreground" : ""}`}
            >
              {node.title}
            </h3>
            <Badge variant="outline" className={`text-xs ${getModeBadgeVariant(node.mode)}`}>
              {getModeLabel(node.mode)}
            </Badge>
            <Badge variant="outline" className={`text-xs ${getTypeBadge(node.type)}`}>
              {node.type === "parallel" ? "Paralel" : node.type === "sequential" ? "Berurutan" : "Final"}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {node.description}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              ⏱ {node.estimatedDuration}
            </span>
            <button
              onClick={() => onSelect(node)}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Lihat Detail →
            </button>
          </div>
        </div>
        {status === "locked" && (
          <span className="text-lg" title="Terkunci">🔒</span>
        )}
        {status === "done" && (
          <span className="text-lg" title="Selesai">✅</span>
        )}
      </div>
    </div>
  );
}
