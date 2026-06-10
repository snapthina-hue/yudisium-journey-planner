"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { yudisiumNodes } from "@/data/nodes";

const STORAGE_KEY = "yudisiumProgress";

function getStoredProgress(): string[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

export function useProgress() {
  const [completedNodes, setCompletedNodes] = useState<string[]>(getStoredProgress);
  const hydrated = useRef(false);

  useEffect(() => {
    hydrated.current = true;
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedNodes));
  }, [completedNodes]);

  const isNodeAvailable = useCallback(
    (nodeId: string): boolean => {
      const node = yudisiumNodes.find((n) => n.id === nodeId);
      if (!node) return false;
      if (completedNodes.includes(nodeId)) return false;
      return node.dependencies.every((dep) => completedNodes.includes(dep));
    },
    [completedNodes]
  );

  const getNodeStatus = useCallback(
    (nodeId: string): "locked" | "available" | "done" => {
      if (completedNodes.includes(nodeId)) return "done";
      if (isNodeAvailable(nodeId)) return "available";
      return "locked";
    },
    [completedNodes, isNodeAvailable]
  );

  const toggleNode = useCallback(
    (nodeId: string) => {
      if (completedNodes.includes(nodeId)) {
        const toRemove = new Set<string>();
        const queue = [nodeId];
        while (queue.length > 0) {
          const current = queue.shift()!;
          toRemove.add(current);
          for (const n of yudisiumNodes) {
            if (n.dependencies.includes(current) && completedNodes.includes(n.id) && !toRemove.has(n.id)) {
              queue.push(n.id);
            }
          }
        }
        setCompletedNodes((prev) => prev.filter((id) => !toRemove.has(id)));
      } else if (isNodeAvailable(nodeId)) {
        setCompletedNodes((prev) => [...prev, nodeId]);
      }
    },
    [completedNodes, isNodeAvailable]
  );

  const resetProgress = useCallback(() => {
    setCompletedNodes([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const progress = Math.round(
    (completedNodes.length / yudisiumNodes.length) * 100
  );

  return {
    completedNodes,
    progress,
    getNodeStatus,
    toggleNode,
    resetProgress,
    isNodeAvailable,
    hydrated: true,
  };
}
