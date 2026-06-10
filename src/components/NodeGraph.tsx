"use client";

import { useRef, useEffect, useCallback } from "react";
import { yudisiumNodes, type YudisiumNode, type NodeStatus } from "@/data/nodes";

interface NodeGraphProps {
  getNodeStatus: (id: string) => NodeStatus;
  onSelect: (node: YudisiumNode) => void;
}

interface NodePosition {
  x: number;
  y: number;
  node: YudisiumNode;
}

function getNodeColor(status: NodeStatus) {
  if (status === "done") return { fill: "#dcfce7", stroke: "#16a34a" };
  if (status === "available") return { fill: "#dbeafe", stroke: "#2563eb" };
  // locked
  return { fill: "#f3f4f6", stroke: "#9ca3af" };
}

export function NodeGraph({ getNodeStatus, onSelect }: NodeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const positionsRef = useRef<NodePosition[]>([]);

  const calculatePositions = useCallback((): NodePosition[] => {
    const canvas = canvasRef.current;
    if (!canvas) return [];

    const width = canvas.width;
    const padding = 60;
    const nodeWidth = 140;
    const nodeHeight = 40;

    // Layout: parallel nodes on left columns, sequential on right in a chain
    const parallelNodes = yudisiumNodes.filter((n) => n.type === "parallel");
    const sequentialNodes = yudisiumNodes.filter(
      (n) => n.type === "sequential" || n.type === "final"
    );

    const positions: NodePosition[] = [];

    // Parallel nodes: 2 columns on the left
    const cols = 2;
    const startX = padding;
    const startY = padding + 20;
    parallelNodes.forEach((node, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      positions.push({
        x: startX + col * (nodeWidth + 20),
        y: startY + row * (nodeHeight + 20),
        node,
      });
    });

    // Sequential nodes: single column on the right
    const seqStartX = width - padding - nodeWidth;
    const seqStartY = startY;
    sequentialNodes.forEach((node, idx) => {
      positions.push({
        x: seqStartX,
        y: seqStartY + idx * (nodeHeight + 16),
        node,
      });
    });

    return positions;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = 680 * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = "680px";
    ctx.scale(dpr, dpr);

    const positions = calculatePositions();
    positionsRef.current = positions;

    const nodeWidth = 140;
    const nodeHeight = 40;

    // Draw edges
    ctx.lineWidth = 1.5;
    for (const pos of positions) {
      for (const depId of pos.node.dependencies) {
        const depPos = positions.find((p) => p.node.id === depId);
        if (depPos) {
          const fromX = depPos.x + nodeWidth / 2;
          const fromY = depPos.y + nodeHeight;
          const toX = pos.x + nodeWidth / 2;
          const toY = pos.y;

          const depStatus = getNodeStatus(depPos.node.id);
          ctx.strokeStyle = depStatus === "done" ? "#16a34a" : "#d1d5db";

          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          const midY = (fromY + toY) / 2;
          ctx.bezierCurveTo(fromX, midY, toX, midY, toX, toY);
          ctx.stroke();

          // Arrow head
          ctx.beginPath();
          ctx.moveTo(toX, toY);
          ctx.lineTo(toX - 5, toY - 8);
          ctx.lineTo(toX + 5, toY - 8);
          ctx.closePath();
          ctx.fillStyle = depStatus === "done" ? "#16a34a" : "#d1d5db";
          ctx.fill();
        }
      }
    }

    // Draw nodes
    for (const pos of positions) {
      const status = getNodeStatus(pos.node.id);
      const colors = getNodeColor(status);

      ctx.fillStyle = colors.fill;
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(pos.x, pos.y, nodeWidth, nodeHeight, 8);
      ctx.fill();
      ctx.stroke();

      // Text
      ctx.fillStyle = status === "locked" ? "#9ca3af" : "#1f2937";
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const label =
        pos.node.title.length > 18
          ? pos.node.title.substring(0, 16) + "…"
          : pos.node.title;
      ctx.fillText(label, pos.x + nodeWidth / 2, pos.y + nodeHeight / 2);
    }
  }, [calculatePositions, getNodeStatus]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const nodeWidth = 140;
    const nodeHeight = 40;

    for (const pos of positionsRef.current) {
      if (
        x >= pos.x &&
        x <= pos.x + nodeWidth &&
        y >= pos.y &&
        y <= pos.y + nodeHeight
      ) {
        onSelect(pos.node);
        break;
      }
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Node Graph Perjalanan Yudisium</h2>
      <div
        ref={containerRef}
        className="rounded-lg border bg-card overflow-x-auto"
      >
        <canvas
          ref={canvasRef}
          onClick={handleClick}
          className="cursor-pointer"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Klik node untuk melihat detail. Hijau = selesai, Biru = tersedia, Abu-abu = terkunci.
      </p>
    </div>
  );
}
