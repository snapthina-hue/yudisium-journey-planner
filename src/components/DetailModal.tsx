"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { YudisiumNode, NodeStatus } from "@/data/nodes";
import { yudisiumNodes } from "@/data/nodes";

interface DetailModalProps {
  node: YudisiumNode | null;
  status: NodeStatus;
  open: boolean;
  onClose: () => void;
}

export function DetailModal({ node, status, open, onClose }: DetailModalProps) {
  if (!node) return null;

  const dependencyNames = node.dependencies.map((depId) => {
    const dep = yudisiumNodes.find((n) => n.id === depId);
    return dep ? dep.title : depId;
  });

  const unlocksNames = node.unlocks.map((uid) => {
    const u = yudisiumNodes.find((n) => n.id === uid);
    return u ? u.title : uid;
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{node.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant={status === "done" ? "default" : status === "available" ? "secondary" : "outline"}>
              {status === "done" ? "Selesai" : status === "available" ? "Tersedia" : "Terkunci"}
            </Badge>
            <Badge variant="outline">{node.locationLabel}</Badge>
            <Badge variant="outline">
              {node.type === "parallel" ? "Paralel" : node.type === "sequential" ? "Berurutan" : "Final"}
            </Badge>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold mb-1">Deskripsi</h4>
            <p className="text-sm text-muted-foreground">{node.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-1">Estimasi Waktu</h4>
            <p className="text-sm text-muted-foreground">{node.estimatedDuration}</p>
          </div>

          {node.documents.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Dokumen Diperlukan</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                {node.documents.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold mb-1">Output</h4>
            <p className="text-sm text-muted-foreground">{node.output}</p>
          </div>

          {dependencyNames.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Prasyarat</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                {dependencyNames.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          )}

          {unlocksNames.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Membuka Tahap Berikutnya</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                {unlocksNames.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold mb-1 text-red-600">Risiko</h4>
            <p className="text-sm text-red-600/80">{node.risk}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
