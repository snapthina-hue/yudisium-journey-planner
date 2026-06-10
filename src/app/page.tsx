"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { SummaryCards } from "@/components/SummaryCards";
import { FilterBar, type FilterType } from "@/components/FilterBar";
import { Checklist } from "@/components/Checklist";
import { Timeline } from "@/components/Timeline";
import { NodeGraph } from "@/components/NodeGraph";
import { DetailModal } from "@/components/DetailModal";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import type { YudisiumNode } from "@/data/nodes";

export default function Page() {
  const { progress, getNodeStatus, toggleNode, resetProgress, hydrated } =
    useProgress();
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedNode, setSelectedNode] = useState<YudisiumNode | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header progress={progress} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 space-y-8">
        {/* Summary Cards */}
        <SummaryCards getNodeStatus={getNodeStatus} />

        {/* Filter + Reset */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FilterBar activeFilter={filter} onFilterChange={setFilter} />
          <div>
            {!showResetConfirm ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowResetConfirm(true)}
              >
                Reset Progress
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-destructive font-medium">Yakin reset?</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    resetProgress();
                    setShowResetConfirm(false);
                  }}
                >
                  Ya, Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Batal
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main content: Checklist + Timeline side by side on desktop */}
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <Checklist
            getNodeStatus={getNodeStatus}
            onToggle={toggleNode}
            onSelect={setSelectedNode}
            filter={filter}
          />
          <aside className="space-y-6">
            <Timeline getNodeStatus={getNodeStatus} />
          </aside>
        </div>

        {/* Node Graph */}
        <NodeGraph getNodeStatus={getNodeStatus} onSelect={setSelectedNode} />
      </main>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        <p>
          Yudisium Journey Planner — Sesuaikan dengan ketentuan prodi dan fakultas masing-masing.
        </p>
        <p className="mt-1">Progress tersimpan otomatis di browser (LocalStorage).</p>
      </footer>

      {/* Detail Modal */}
      <DetailModal
        node={selectedNode}
        status={selectedNode ? getNodeStatus(selectedNode.id) : "locked"}
        open={selectedNode !== null}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
