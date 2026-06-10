"use client";

import { Card, CardContent } from "@/components/ui/card";
import { yudisiumNodes } from "@/data/nodes";

interface SummaryCardsProps {
  getNodeStatus: (id: string) => "locked" | "available" | "done";
}

export function SummaryCards({ getNodeStatus }: SummaryCardsProps) {
  const total = yudisiumNodes.length;
  const done = yudisiumNodes.filter((n) => getNodeStatus(n.id) === "done").length;
  const locked = yudisiumNodes.filter((n) => getNodeStatus(n.id) === "locked").length;
  const available = yudisiumNodes.filter((n) => getNodeStatus(n.id) === "available").length;
  const campus = yudisiumNodes.filter((n) => n.mode === "campus").length;
  const online = yudisiumNodes.filter((n) => n.mode === "online").length;

  const cards = [
    { label: "Total Tugas", value: total, color: "text-foreground" },
    { label: "Selesai", value: done, color: "text-green-600" },
    { label: "Tersedia", value: available, color: "text-blue-600" },
    { label: "Terkunci", value: locked, color: "text-gray-500" },
    { label: "Ke Kampus", value: campus, color: "text-orange-600" },
    { label: "Online", value: online, color: "text-purple-600" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-4 text-center">
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
