"use client";

import { Button } from "@/components/ui/button";

export type FilterType =
  | "all"
  | "online"
  | "campus"
  | "hybrid"
  | "waiting"
  | "parallel"
  | "sequential"
  | "critical";

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "online", label: "Online" },
  { key: "campus", label: "Ke Kampus" },
  { key: "hybrid", label: "Hybrid" },
  { key: "parallel", label: "Paralel" },
  { key: "sequential", label: "Berurutan" },
];

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <Button
          key={f.key}
          variant={activeFilter === f.key ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(f.key)}
        >
          {f.label}
        </Button>
      ))}
    </div>
  );
}
